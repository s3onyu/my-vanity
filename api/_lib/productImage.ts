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

/** 공급자가 돌려준 HTTP 상태를 들고 다니는 오류 — 401/403 이면 키가 틀린 것이라 재시도해도 같다 */
class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
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
  if (!res.ok) throw new ProviderError(`naver ${res.status}`, res.status);
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

/** 상품컷이 올라오는 쇼핑몰·가격비교 사이트 */
const SHOPPING_SITES = ['쇼핑하우', '11번가', 'G마켓', '지마켓', '옥션', '인터파크', '쿠팡', '올리브영', '네이버쇼핑', 'SSG', '롯데온', '위메프', '티몬', '무신사', '컬리'];

/**
 * 검색어 후보를 길이순으로 만든다.
 * 다음 이미지 검색은 단어를 모두 만족하는 문서만 주기 때문에 이름을 통째로 넣으면 결과가 0이 된다.
 * (실측: "아누아 어성초 77 토너" 1건 → "아누아 어성초 수딩" 30건, "구달 청귤 비타c" 0건 → "구달 청귤" 30건)
 * 그래서 숫자·용량 토큰을 떼고 3단어 → 2단어 → 1단어 순으로 좁혀 가며, 먼저 걸리는 쪽을 쓴다.
 */
export function buildKakaoQueries(query: string): string[] {
  const [brand, ...rest] = query.split(/\s+/).filter(Boolean);
  if (!brand) return [];
  const tokens = rest.filter((t) => !/^\d+(호|개입|ml|g|%)?$/i.test(t));
  const candidates = [3, 2, 1].map((n) => [brand, ...tokens.slice(0, n)].join(' '));
  return [...new Set(candidates)].filter((c) => c.length >= 2);
}

/**
 * 상품 사진처럼 생긴 것만 고른다. 웹 전체를 긁는 이미지 검색이라
 * 상세페이지 배너나 블로그 캡처가 섞여 들어온다.
 * 썸네일은 kakaocdn 이 130x130 으로 다시 내주므로, 원본 서버가 핫링크를 막아도 안전하고
 * 화면에 쓰는 크기(최대 64px)에도 충분하다.
 */
function scoreKakaoDoc(doc: KakaoDoc): number {
  const thumb = doc.thumbnail_url;
  if (!thumb || !thumb.startsWith('https://')) return -1; // 앱이 https 라 http 이미지는 막힌다
  const w = doc.width ?? 0;
  const h = doc.height ?? 0;
  if (w < 200 || h < 200) return -1; // 아이콘·버튼 조각
  const ratio = w / h;
  if (ratio < 0.7 || ratio > 1.45) return -1; // 배너·세로로 긴 상세페이지
  let score = 3 - Math.abs(1 - ratio) * 5; // 정사각형에 가까울수록
  const site = doc.display_sitename ?? '';
  if (doc.collection === 'shopping' || SHOPPING_SITES.some((s) => site.includes(s))) score += 10;
  return score;
}

function pickKakaoDoc(docs: KakaoDoc[]): KakaoDoc | null {
  let best: KakaoDoc | null = null;
  let bestScore = 0;
  for (const doc of docs) {
    const score = scoreKakaoDoc(doc);
    if (score > bestScore) {
      best = doc;
      bestScore = score;
    }
  }
  return best;
}

/** 에러 본문에 섞여 나오는 앱 키를 앞 6자만 남긴다 — 응답에 키가 그대로 실려 나가지 않게 */
const maskKeys = (text: string) => text.replace(/[0-9a-f]{24,}/gi, (k) => `${k.slice(0, 6)}…`);

export async function lookupKakaoImage(query: string, restKey: string): Promise<ProductImageHit | null> {
  for (const q of buildKakaoQueries(query)) {
    const url = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(q)}&size=30&sort=accuracy`;
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${restKey.trim()}` } });
    if (!res.ok) {
      // 키 문제면 더 시도해도 같다. 어떤 키를 썼는지 앞자리만 함께 알려 준다 (401 은 키가 틀렸을 때만 난다).
      const detail = await res.text().catch(() => '');
      throw new ProviderError(`kakao ${res.status} (보낸 키 ${restKey.trim().slice(0, 6)}…, 길이 ${restKey.trim().length}) ${maskKeys(detail).slice(0, 160)}`, res.status);
    }
    const json = (await res.json()) as { documents?: KakaoDoc[] };
    const best = pickKakaoDoc(json.documents ?? []);
    if (best) {
      return {
        image: best.thumbnail_url!,
        link: best.doc_url ?? best.image_url!,
        title: stripTags(best.display_sitename ?? q),
        mall: best.display_sitename ?? '',
        source: 'kakao',
      };
    }
  }
  return null;
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
  let authFailed = false;
  for (const provider of providers) {
    try {
      const hit = await provider.run(q);
      if (hit) return { status: 200, body: { hit } };
    } catch (err) {
      const message = (err as Error).message;
      // 401/403 은 키가 틀렸다는 뜻이라 다시 불러도 결과가 같다 (환경변수를 고치기 전까지).
      if (err instanceof ProviderError && (err.status === 401 || err.status === 403)) authFailed = true;
      errors.push(`${provider.name}: ${message}`);
    }
  }
  if (errors.length === providers.length) {
    // 키가 거부당한 거면 501 로 알려 준다. 앱이 이 소스를 꺼 두고 제품마다 헛걸음하지 않는다.
    return { status: authFailed ? 501 : 502, body: { error: errors.join(' / ') } };
  }
  return { status: 200, body: { hit: null } };
}
