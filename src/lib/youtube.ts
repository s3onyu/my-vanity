import type { MakeupVideo } from '@/data/videos';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

/** 환경변수에 YouTube Data API 키가 있으면 실시간 검색을, 없으면 큐레이션 목록을 쓴다 */
export const isYoutubeConfigured = Boolean(API_KEY);

export const thumbUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const searchUrl = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
/** 개인정보 보호 도메인 + 인라인 재생 */
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

const CACHE_TTL = 24 * 60 * 60 * 1000;
const cacheKey = (q: string) => `my-vanity:yt:${q}`;

function readCache(q: string): MakeupVideo[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(q));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; items: MakeupVideo[] };
    return Date.now() - parsed.at < CACHE_TTL ? parsed.items : null;
  } catch {
    return null;
  }
}

function writeCache(q: string, items: MakeupVideo[]) {
  try {
    localStorage.setItem(cacheKey(q), JSON.stringify({ at: Date.now(), items }));
  } catch {
    /* 무시 */
  }
}

interface SearchItem {
  id?: { videoId?: string };
  snippet?: { title?: string; channelTitle?: string };
}

/**
 * YouTube Data API v3 검색. 결과는 24시간 캐시해 일일 쿼터를 아낀다.
 * 키는 브라우저에 노출되므로 Google Cloud 콘솔에서 HTTP 리퍼러(배포 도메인)로 제한하는 것을 권장한다.
 */
export async function searchYoutube(query: string, max = 8): Promise<MakeupVideo[]> {
  if (!API_KEY) throw new Error('YouTube API 키가 설정되지 않았어요.');
  const cached = readCache(query);
  if (cached) return cached;
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    maxResults: String(max),
    q: query,
    regionCode: 'KR',
    relevanceLanguage: 'ko',
    safeSearch: 'moderate',
    key: API_KEY,
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!res.ok) throw new Error(`YouTube 검색 실패 (${res.status})`);
  const json = (await res.json()) as { items?: SearchItem[] };
  const items: MakeupVideo[] = (json.items ?? [])
    .filter((it) => it.id?.videoId)
    .map((it) => ({
      id: it.id!.videoId!,
      title: decodeEntities(it.snippet?.title ?? ''),
      channel: it.snippet?.channelTitle ?? '',
    }));
  writeCache(query, items);
  return items;
}

function decodeEntities(s: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}
