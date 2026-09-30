/**
 * 상품 대표 사진을 외부 검색으로 찾아 준다 (서버 전용 — 키가 브라우저에 노출되지 않게).
 *
 * 공급자는 두 가지고, 키가 들어 있는 것만 순서대로 시도한다.
 *   1) 네이버 쇼핑 검색 — 2026-07-31 자로 신규 발급이 끝났다. 그 전에 받아 둔 키가 있으면 계속 쓴다.
 *      https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md
 *   2) 카카오 Daum 이미지 검색 — 지금도 REST API 키만 있으면 바로 쓸 수 있다.
 *      https://developers.kakao.com/docs/ko/daum-search/dev-guide
 *
 * 두 API 모두 "검색 결과를 실시간으로 보여 주는 용도"라서 결과를 DB 에 저장하지 않고,
 * 출처 이름과 원본 링크를 화면에 함께 표시한다(기기 캐시 1일).
 */

export type ImageProvider = 'naver' | 'kakao';

export interface ProductImageHit {
  image: string;
  link: string;
  title: string;
  /** 판매처·출처 사이트 이름 */
  mall: string;
  source: ImageProvider;
}

export interface ProductImageEnv {
  NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
  KAKAO_REST_API_KEY?: string;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();

// ---------------------------------------------------------------------------
//  1) 네이버 쇼핑 검색
// ---------------------------------------------------------------------------

export async function lookupNaverImage(query: string, clientId: string, clientSecret: string): Promise<ProductImageHit | null> {
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=3&sort=sim`;
  const res = await fetch(url, {
    headers: { 'X-Naver-Client-Id': clientId, 'X-Naver-Client-Secret': clientSecret },
  });
  if (!res.ok) throw new Error(`naver ${res.status}`);
  const json = (await res.json()) as { items?: { title: string; link: string; image: string; mallName?: string }[] };
  const item = (json.items ?? []).find((it) => it.image);
  if (!item) return null;
  return { image: item.image, link: item.link, title: stripTags(item.title), mall: item.mallName ?? '', source: 'naver' };
}

// ---------------------------------------------------------------------------
//  2) 카카오 Daum 이미지 검색
// ---------------------------------------------------------------------------

interface KakaoDoc {
  collection?: string;
  thumbnail_url?: string;
  image_url?: string;
  width?: number;
  height?: number;
  display_sitename?: string;
  doc_url?: string;
}

/** 쇼핑몰 상품컷일수록 높은 점수. 웹 어디서나 긁혀 오는 이미지 검색이라 상품 사진처럼 생긴 것만 고른다. */
function scoreKakaoDoc(doc: KakaoDoc): number {
  const w = doc.width ?? 0;
  const h = doc.height ?? 0;
  if (!doc.image_url || !doc.image_url.startsWith('https://')) return -1; // 앱이 https 라 http 이미지는 막힌다
  if (w < 120 || h < 120 || w > 3000 || h > 3000) return -1;
  const ratio = w / h;
  if (ratio < 0.6 || ratio > 1.7) return -1; // 배너·상세페이지 긴 이미지 걸러내기
  let score = 0;
  if (doc.collection === 'shopping') score += 10; // 판매 페이지 상품컷
  score += Math.max(0, 3 - Math.abs(1 - ratio) * 6); // 정사각형에 가까울수록
  if (w >= 300 && h >= 300) score += 1;
  return score;
}

export async function lookupKakaoImage(query: string, restKey: string): Promise<ProductImageHit | null> {
  const url = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(query)}&size=30&sort=accuracy`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${restKey}` } });
  if (!res.ok) throw new Error(`kakao ${res.status}`);
  const json = (await res.json()) as { documents?: KakaoDoc[] };
  let best: KakaoDoc | null = null;
  let bestScore = 0;
  for (const doc of json.documents ?? []) {
    const score = scoreKakaoDoc(doc);
    if (score > bestScore) {
      best = doc;
      bestScore = score;
    }
  }
  if (!best) return null;
  return {
    image: best.thumbnail_url && best.thumbnail_url.startsWith('https://') ? best.thumbnail_url : best.image_url!,
    link: best.doc_url ?? best.image_url!,
    title: stripTags(best.display_sitename ?? query),
    mall: best.display_sitename ?? '',
    source: 'kakao',
  };
}

// ---------------------------------------------------------------------------
//  공통 응답 만들기 — Vercel 함수와 Vite 개발 미들웨어가 같이 쓴다
// ---------------------------------------------------------------------------

export async function handleProductImage(query: string | null, env: ProductImageEnv): Promise<{ status: number; body: unknown }> {
  const providers: { name: ImageProvider; run: (q: string) => Promise<ProductImageHit | null> }[] = [];
  if (env.NAVER_CLIENT_ID && env.NAVER_CLIENT_SECRET) {
    providers.push({ name: 'naver', run: (q) => lookupNaverImage(q, env.NAVER_CLIENT_ID!, env.NAVER_CLIENT_SECRET!) });
  }
  if (env.KAKAO_REST_API_KEY) {
    providers.push({ name: 'kakao', run: (q) => lookupKakaoImage(q, env.KAKAO_REST_API_KEY!) });
  }
  if (providers.length === 0) {
    return {
      status: 501,
      body: {
        error: '상품 사진 검색 키가 없어요. KAKAO_REST_API_KEY(권장) 또는 NAVER_CLIENT_ID/NAVER_CLIENT_SECRET 을 환경변수에 넣어 주세요.',
      },
    };
  }

  const q = (query ?? '').trim().slice(0, 80);
  if (q.length < 2) return { status: 400, body: { error: 'q 파라미터가 필요해요.' } };

  const errors: string[] = [];
  for (const provider of providers) {
    try {
      const hit = await provider.run(q);
      if (hit) return { status: 200, body: { hit } };
    } catch (err) {
      errors.push(`${provider.name}: ${(err as Error).message}`);
    }
  }
  // 전부 실패했으면 502, 그냥 결과가 없던 것뿐이면 200 + hit:null (그래야 다른 소스로 넘어간다)
  if (errors.length === providers.length) return { status: 502, body: { error: errors.join(' / ') } };
  return { status: 200, body: { hit: null } };
}
