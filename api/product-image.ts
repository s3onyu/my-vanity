import { handleProductImage } from './_lib/productImage';

/**
 * Vercel Edge Function — GET /api/product-image?q=브랜드 제품명
 * 검색 API 키는 Vercel 환경변수에만 둔다 (브라우저로 내려가지 않는다).
 *   KAKAO_REST_API_KEY                        — 카카오 Daum 이미지 검색 (지금 발급 가능)
 *   NAVER_CLIENT_ID / NAVER_CLIENT_SECRET     — 네이버 쇼핑 검색 (2026-07-31 신규 발급 종료)
 */
export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams.get('q');
  const { status, body } = await handleProductImage(q, {
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
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
