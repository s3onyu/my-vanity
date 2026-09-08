import { useEffect, useMemo, useState } from 'react';
import { VIDEO_CATEGORIES, type MakeupVideo, type VideoCategory } from '@/data/videos';
import { embedUrl, isYoutubeConfigured, searchUrl, searchYoutube, thumbUrl, watchUrl } from '@/lib/youtube';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';

function VideoCard({ video, onPlay, playing }: { video: MakeupVideo; onPlay: () => void; playing: boolean }) {
  return (
    <article className={`video-card${playing ? ' is-playing' : ''}`}>
      <button type="button" className="video-card__thumb" onClick={onPlay} aria-label={`${video.title} 재생`}>
        <img src={thumbUrl(video.id)} alt="" loading="lazy" />
        <span className="video-card__play">▶</span>
      </button>
      <div className="video-card__body">
        <div className="video-card__title clamp-2">{video.title}</div>
        <div className="tiny muted">{video.channel}</div>
        <a className="link-btn tiny" href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer">
          YouTube에서 열기 ↗
        </a>
      </div>
    </article>
  );
}

interface Props {
  initialCategoryId?: string;
}

/**
 * 영상으로 배우기 — 메이크업 종류별 YouTube 영상.
 * API 키가 있으면 실시간 검색 결과를, 없으면 큐레이션 목록을 보여주고 앱 안에서 바로 재생한다.
 */
export function VideoSection({ initialCategoryId }: Props) {
  const [categoryId, setCategoryId] = useState(() => (VIDEO_CATEGORIES.some((c) => c.id === initialCategoryId) ? initialCategoryId! : VIDEO_CATEGORIES[0].id));
  const category = useMemo<VideoCategory>(() => VIDEO_CATEGORIES.find((c) => c.id === categoryId) ?? VIDEO_CATEGORIES[0], [categoryId]);
  const [live, setLive] = useState<MakeupVideo[] | null>(null);
  const [liveState, setLiveState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setPlayingId(null);
    setLive(null);
    if (!isYoutubeConfigured) return;
    let cancelled = false;
    setLiveState('loading');
    searchYoutube(category.query)
      .then((items) => {
        if (cancelled) return;
        setLive(items);
        setLiveState('idle');
      })
      .catch(() => {
        if (!cancelled) setLiveState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const videos = live && live.length ? live : category.videos;
  const playing = videos.find((v) => v.id === playingId) ?? null;

  return (
    <div className="stack">
      <div className="chip-scroll" role="tablist" aria-label="메이크업 종류">
        {VIDEO_CATEGORIES.map((c) => (
          <Chip key={c.id} active={c.id === category.id} onClick={() => setCategoryId(c.id)}>
            {c.icon} {c.title}
          </Chip>
        ))}
      </div>

      <div>
        <div className="row row--between">
          <h3 className="h2">
            {category.icon} {category.title}
          </h3>
          {isYoutubeConfigured ? (
            <Badge color={liveState === 'error' ? 'butter' : 'mint'}>{liveState === 'loading' ? '검색 중…' : liveState === 'error' ? '큐레이션 목록' : 'YouTube 실시간'}</Badge>
          ) : (
            <Badge>큐레이션 {category.videos.length}편</Badge>
          )}
        </div>
        <p className="small muted mt-1">{category.desc}</p>
      </div>

      {playing && (
        <div className="video-player">
          <div className="video-player__frame">
            <iframe
              src={embedUrl(playing.id)}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="row row--between mt-1">
            <div className="small ellipsis flex-1">{playing.title}</div>
            <button type="button" className="icon-btn" onClick={() => setPlayingId(null)} aria-label="재생 닫기">
              <Icon name="close" size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="stack stack--sm">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} playing={v.id === playingId} onPlay={() => setPlayingId(v.id)} />
        ))}
      </div>

      <a className="btn btn--ghost btn--block" href={searchUrl(category.query)} target="_blank" rel="noopener noreferrer">
        YouTube에서 "{category.query}" 더 찾기 ↗
      </a>
      <p className="fine-print">
        영상은 각 채널 크리에이터의 콘텐츠이며 앱은 링크와 재생만 제공해요. 재생이 막힌 영상은 "YouTube에서 열기"로 보세요.
        {isYoutubeConfigured ? ' 실시간 결과는 하루 동안 기기에 캐시돼요.' : ' YouTube API 키를 설정하면 종류별 최신 영상이 실시간으로 뜨게 할 수 있어요.'}
      </p>
    </div>
  );
}
