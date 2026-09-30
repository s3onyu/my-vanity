import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleProductImage, lookupKakaoImage } from './productImage';

const kakaoDoc = (over: Record<string, unknown>) => ({
  collection: 'blog',
  thumbnail_url: 'https://img.example/thumb.jpg',
  image_url: 'https://img.example/full.jpg',
  width: 400,
  height: 400,
  display_sitename: '예시몰',
  doc_url: 'https://example.com/item/1',
  ...over,
});

/** fetch 를 가로채 url → 응답으로 답한다 */
function mockFetch(reply: (url: string) => { ok?: boolean; status?: number; json?: unknown }) {
  vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
    const { ok = true, status = 200, json = {} } = reply(String(input));
    return { ok, status, json: async () => json } as unknown as Response;
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('lookupKakaoImage', () => {
  it('쇼핑몰 상품컷을 세로로 긴 배너보다 먼저 고른다', async () => {
    mockFetch(() => ({
      json: {
        documents: [
          kakaoDoc({ width: 500, height: 2000, thumbnail_url: 'https://img.example/banner.jpg' }), // 상세페이지 배너
          kakaoDoc({ collection: 'shopping', thumbnail_url: 'https://img.example/shop.jpg' }),
        ],
      },
    }));
    const hit = await lookupKakaoImage('아누아 세럼', 'key');
    expect(hit?.image).toBe('https://img.example/shop.jpg');
    expect(hit?.source).toBe('kakao');
  });

  it('http 이미지는 건너뛴다 (앱이 https 라 막힌다)', async () => {
    mockFetch(() => ({
      json: { documents: [kakaoDoc({ thumbnail_url: 'http://img.example/t.jpg', image_url: 'http://img.example/f.jpg' })] },
    }));
    expect(await lookupKakaoImage('아누아 세럼', 'key')).toBeNull();
  });

  it('쓸 만한 사진이 없으면 null', async () => {
    mockFetch(() => ({ json: { documents: [] } }));
    expect(await lookupKakaoImage('없는제품', 'key')).toBeNull();
  });
});

describe('handleProductImage', () => {
  it('키가 하나도 없으면 501 — 앱은 이 소스를 끄고 일러스트로 간다', async () => {
    const { status } = await handleProductImage('아누아 세럼', {});
    expect(status).toBe(501);
  });

  it('네이버가 실패해도 카카오로 넘어간다', async () => {
    mockFetch((url) =>
      url.includes('openapi.naver.com')
        ? { ok: false, status: 401 }
        : { json: { documents: [kakaoDoc({ collection: 'shopping' })] } },
    );
    const { status, body } = await handleProductImage('아누아 세럼', {
      NAVER_CLIENT_ID: 'old',
      NAVER_CLIENT_SECRET: 'old',
      KAKAO_REST_API_KEY: 'new',
    });
    expect(status).toBe(200);
    expect((body as { hit: { source: string } }).hit.source).toBe('kakao');
  });

  it('검색어가 너무 짧으면 400', async () => {
    const { status } = await handleProductImage('아', { KAKAO_REST_API_KEY: 'k' });
    expect(status).toBe(400);
  });
});
