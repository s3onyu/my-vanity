/**
 * 네이버 쇼핑 검색 API 로 상품 대표 이미지를 찾는다 (서버 전용 — 키가 브라우저에 노출되지 않게).
 * 이용약관상 검색 결과는 실시간 표시용이며 DB 에 저장하지 않는다. 출처(네이버 쇼핑)와 링크를 함께 표시한다.
 * https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md
 */

export interface ProductImageHit {
  image: string;
  link: string;
  title: string;
  mall: string;
  source: 'naver';
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();

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

/** 공통 응답 만들기 — Vercel 함수와 Vite 개발 미들웨어가 같이 쓴다 */
export async function handleProductImage(query: string | null, env: { NAVER_CLIENT_ID?: string; NAVER_CLIENT_SECRET?: string }): Promise<{ status: number; body: unknown }> {
  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) return { status: 501, body: { error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 없어요.' } };
  const q = (query ?? '').trim().slice(0, 80);
  if (q.length < 2) return { status: 400, body: { error: 'q 파라미터가 필요해요.' } };
  try {
    const hit = await lookupNaverImage(q, env.NAVER_CLIENT_ID, env.NAVER_CLIENT_SECRET);
    return { status: 200, body: { hit } };
  } catch (err) {
    return { status: 502, body: { error: (err as Error).message } };
  }
}
