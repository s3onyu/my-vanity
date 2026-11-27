import { useMemo, useState } from 'react';
import type { FeedTopicId, FeedWeight } from '@/types';
import { FEED_TOPICS, WEIGHT_LABEL, rankPosts } from '@/engine/feed';
import { Overlay } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { useAppStore, useVisiblePosts } from '@/store/useAppStore';

const WEIGHTS: FeedWeight[] = [0, 1, 2];
const WEIGHT_ICON: Record<FeedWeight, string> = { 0: '🙈', 1: '•', 2: '⭐' };

/**
 * 커뮤니티 피드 개인화 (요청 7번).
 * 관심 분야별로 "우선 보기 / 보통 / 안 보기"를 정하면 게시판 순서와 홈 미리보기에 바로 반영된다.
 */
export function FeedSettingsOverlay() {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const saved = useAppStore((s) => s.profile?.feedTopics ?? null);
  const setFeedTopics = useAppStore((s) => s.setFeedTopics);
  const showToast = useAppStore((s) => s.showToast);
  const posts = useVisiblePosts();

  const [weights, setWeights] = useState<Partial<Record<FeedTopicId, FeedWeight>>>(saved ?? {});
  const [busy, setBusy] = useState(false);

  const weightOf = (id: FeedTopicId): FeedWeight => weights[id] ?? 1;
  const set = (id: FeedTopicId, w: FeedWeight) => setWeights((cur) => ({ ...cur, [id]: w }));

  // 지금 설정으로 글이 몇 개 보이고, 어떤 글이 맨 위로 오는지 미리 보여준다
  const preview = useMemo(() => rankPosts(posts, weights), [posts, weights]);
  const hidden = posts.length - preview.length;

  const save = async () => {
    setBusy(true);
    await setFeedTopics(weights);
    setBusy(false);
    showToast('피드 설정을 저장했어요');
    popOverlay();
  };

  return (
    <Overlay
      title="피드 설정"
      onClose={popOverlay}
      right={
        <button type="button" className="link-btn" onClick={() => setWeights({})}>
          초기화
        </button>
      }
    >
      <p className="small muted mb-2">
        관심 분야마다 노출 비중을 정할 수 있어요. <strong>⭐ 우선 보기</strong>로 고른 분야의 글이 게시판 위쪽으로 올라오고,{' '}
        <strong>🙈 안 보기</strong>로 고른 분야의 글은 목록에서 빠져요.
      </p>

      <div className="stack stack--sm">
        {FEED_TOPICS.map((t) => {
          const w = weightOf(t.id);
          return (
            <div key={t.id} className={`topic-row${w === 2 ? ' is-up' : w === 0 ? ' is-off' : ''}`}>
              <div className="flex-1">
                <div className="topic-row__label">
                  {t.icon} {t.label}
                </div>
                <div className="tiny muted">{t.desc}</div>
              </div>
              <div className="segment segment--sm" role="radiogroup" aria-label={`${t.label} 노출 비중`}>
                {WEIGHTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={w === v}
                    className={`segment__btn${w === v ? ' is-active' : ''}`}
                    onClick={() => set(t.id, v)}
                    title={WEIGHT_LABEL[v]}
                  >
                    {WEIGHT_ICON[v]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card card--soft mt-3">
        <div className="row row--between">
          <span className="h3">이 설정으로 보면</span>
          <Badge color={hidden > 0 ? 'butter' : 'mint'}>
            {preview.length}개 보임{hidden > 0 && ` · ${hidden}개 숨김`}
          </Badge>
        </div>
        {preview.length === 0 ? (
          <p className="small muted mt-1">모든 글이 숨겨졌어요. “안 보기”를 조금 풀어보세요.</p>
        ) : (
          <ol className="preview-list mt-2">
            {preview.slice(0, 4).map((r) => (
              <li key={r.post.id}>
                <span className="ellipsis">{r.post.title}</span>
                {r.reason && <span className="tiny tone-mint"> · {r.reason}</span>}
              </li>
            ))}
          </ol>
        )}
      </div>

      <button type="button" className="btn btn--block mt-3" onClick={save} disabled={busy}>
        {busy ? '저장 중…' : '설정 저장'}
      </button>
      <p className="fine-print">
        분야는 글의 고민 카테고리와 제목·본문의 낱말로 판단해요. 자동 분류라 가끔 어긋날 수 있고, 설정은 내 화면에만 적용돼요.
      </p>
    </Overlay>
  );
}
