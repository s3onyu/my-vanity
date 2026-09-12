import { handleProductImage } from './_lib/productImage';

/**
 * Vercel Edge Function — GET /api/product-image?q=브랜드 제품명
 * 네이버 쇼핑 검색 API 키는 Vercel 환경변수(NAVER_CLIENT_ID, NAVER_CLIENT_SECRET)에만 둔다.
 */
export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams.get('q');
  const { status, body } = await handleProductImage(q, {
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
  });
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 같은 검색어는 하루 동안 CDN 캐시 (저장이 아니라 캐시)
      'cache-control': status === 200 ? 'public, s-maxage=86400, stale-while-revalidate=3600' : 'no-store',
      'access-control-allow-origin': '*',
    },
  });
}
