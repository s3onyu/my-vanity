import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildKakaoQueries, handleProductImage, lookupKakaoImage } from './productImage';

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

describe('buildKakaoQueries', () => {
  it('긴 이름부터 시도하되 점점 짧게 좁힌다', () => {
    expect(buildKakaoQueries('아누아 어성초 수딩 토너 대용량')).toEqual(['아누아 어성초 수딩 토너', '아누아 어성초 수딩', '아누아 어성초']);
  });

  it('숫자·용량 토큰을 뺀다 — 넣으면 검색 결과가 거의 안 나온다', () => {
    expect(buildKakaoQueries('아누아 어성초 77 토너')[0]).toBe('아누아 어성초 토너');
    expect(buildKakaoQueries('브랜드 크림 50ml')[0]).toBe('브랜드 크림');
  });

  it('이름이 짧으면 중복 없이 하나만', () => {
    expect(buildKakaoQueries('라운드랩 자작나무')).toEqual(['라운드랩 자작나무']);
  });
});

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

  it('첫 검색어가 0건이면 더 짧은 검색어로 다시 찾는다', async () => {
    const asked: string[] = [];
    vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
      const q = decodeURIComponent(new URL(String(input)).searchParams.get('query') ?? '');
      asked.push(q);
      const documents = q === '아누아 어성초' ? [kakaoDoc({ display_sitename: '쇼핑하우' })] : [];
      return { ok: true, status: 200, json: async () => ({ documents }) } as unknown as Response;
    });
    const hit = await lookupKakaoImage('아누아 어성초 77 수딩 토너', 'key');
    expect(asked).toEqual(['아누아 어성초 수딩 토너', '아누아 어성초 수딩', '아누아 어성초']);
    expect(hit?.mall).toBe('쇼핑하우');
  });

  it('쇼핑몰 사진을 블로그 캡처보다 먼저 고른다', async () => {
    mockFetch(() => ({
      json: {
        documents: [
          kakaoDoc({ display_sitename: '네이버블로그', thumbnail_url: 'https://img.example/blog.jpg' }),
          kakaoDoc({ display_sitename: '올리브영', thumbnail_url: 'https://img.example/oliveyoung.jpg' }),
        ],
      },
    }));
    const hit = await lookupKakaoImage('아누아 세럼', 'key');
    expect(hit?.image).toBe('https://img.example/oliveyoung.jpg');
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
