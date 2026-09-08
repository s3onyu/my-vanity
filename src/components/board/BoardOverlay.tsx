import { useMemo, useState } from 'react';
import type { BoardPost, ConcernId, Verdict } from '@/types';
import { CONCERNS, CONCERN_MAP } from '@/data/concerns';
import { relativeTime } from '@/lib/date';
import { Overlay } from '@/components/layout/Overlay';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

export const VERDICT_META: Record<Verdict, { label: string; color: 'mint' | 'butter' | 'rose'; icon: string }> = {
  good: { label: '좋았어요', color: 'mint', icon: '😊' },
  soso: { label: '그저 그랬어요', color: 'butter', icon: '😐' },
  bad: { label: '별로였어요', color: 'rose', icon: '😞' },
};

export function PostCard({ post, onOpen }: { post: BoardPost; onOpen: () => void }) {
  const likePost = useAppStore((s) => s.likePost);
  const meta = CONCERN_MAP[post.concernCategory];
  const v = VERDICT_META[post.verdict];
  return (
    <article className="post-card">
      <button type="button" className="post-card__main" onClick={onOpen}>
        <div className="row" style={{ gap: 4 }}>
          <Badge color={meta.colorTag}>
            {meta.icon} {meta.title}
          </Badge>
          <Badge color={v.color}>
            {v.icon} {v.label}
          </Badge>
        </div>
        <div className="post-card__title">{post.title}</div>
        {post.productName && <div className="post-card__product">🧴 {post.productName}</div>}
        <p className="post-card__body clamp-2">{post.body}</p>
        {post.imageUrl && <img className="post-card__img" src={post.imageUrl} alt="" loading="lazy" />}
      </button>
      <div className="post-card__foot">
        <span className="tiny muted">
          {post.authorNickname} · {relativeTime(post.createdAt)}
        </span>
        <button type="button" className="like-btn" onClick={() => likePost(post.id)} aria-label="좋아요">
          <Icon name="heart" size={14} /> {post.likes}
        </button>
      </div>
    </article>
  );
}

/** 커뮤니티 게시판 — 다른 사람들의 화장대 */
export function BoardOverlay() {
  const posts = useAppStore((s) => s.posts);
  const popOverlay = useAppStore((s) => s.popOverlay);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const [filter, setFilter] = useState<ConcernId | 'all'>('all');
  const list = useMemo(() => (filter === 'all' ? posts : posts.filter((p) => p.concernCategory === filter)), [posts, filter]);

  return (
    <Overlay
      title="다른 사람들의 화장대"
      onClose={popOverlay}
      right={
        <button type="button" className="btn btn--sm" onClick={() => pushOverlay({ type: 'post-form' })}>
          <Icon name="edit" size={14} /> 글쓰기
        </button>
      }
    >
      <p className="small muted mb-2">피부 고민별로 다른 사용자의 제품 후기를 나눠요. 개인 후기이며 효과를 보장하지 않아요.</p>
      <div className="chip-scroll" role="tablist" aria-label="고민 카테고리">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          전체
        </Chip>
        {CONCERNS.map((c) => (
          <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.icon} {c.title}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty mt-2">
          <strong>아직 글이 없어요</strong>첫 후기를 남겨보세요.
        </div>
      ) : (
        <div className="stack mt-2">
          {list.map((post) => (
            <PostCard key={post.id} post={post} onOpen={() => pushOverlay({ type: 'post', id: post.id })} />
          ))}
        </div>
      )}
    </Overlay>
  );
}

/** 게시글 상세 */
export function PostDetailOverlay({ id }: { id: string }) {
  const post = useAppStore((s) => s.posts.find((p) => p.id === id));
  const popOverlay = useAppStore((s) => s.popOverlay);
  const likePost = useAppStore((s) => s.likePost);
  if (!post) {
    return (
      <Overlay title="게시글" onClose={popOverlay}>
        <div className="empty">글을 찾을 수 없어요.</div>
      </Overlay>
    );
  }
  const meta = CONCERN_MAP[post.concernCategory];
  const v = VERDICT_META[post.verdict];
  return (
    <Overlay title={meta.title} onClose={popOverlay}>
      <div className="row" style={{ gap: 4 }}>
        <Badge color={meta.colorTag}>
          {meta.icon} {meta.title}
        </Badge>
        <Badge color={v.color}>
          {v.icon} {v.label}
        </Badge>
      </div>
      <h2 className="h1 mt-2" style={{ fontSize: 24 }}>
        {post.title}
      </h2>
      <div className="small muted mt-1">
        {post.authorNickname} · {relativeTime(post.createdAt)}
      </div>
      {post.productName && (
        <div className="notice mt-2">
          🧴 사용 제품: <strong>{post.productName}</strong>
        </div>
      )}
      {post.imageUrl && <img className="post-detail__img mt-2" src={post.imageUrl} alt="첨부 사진" />}
      <p className="post-detail__body">{post.body}</p>
      <div className="row mt-3">
        <button type="button" className="like-btn like-btn--lg" onClick={() => likePost(post.id)}>
          <Icon name="heart" size={16} /> 좋아요 {post.likes}
        </button>
      </div>
      <div className="divider" />
      <p className="fine-print">
        이 글은 개인 후기이며 효과를 보장하지 않아요. 같은 제품이라도 반응은 사람마다 달라요. 심한 자극이나 트러블이 지속되면 전문의와
        상담해주세요.
      </p>
    </Overlay>
  );
}
