import { useMemo, useState } from 'react';
import type { BoardPost, ConcernId, Verdict } from '@/types';
import { CONCERNS, CONCERN_MAP } from '@/data/concerns';
import { relativeTime } from '@/lib/date';
import { Overlay } from '@/components/layout/Overlay';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore, useVisiblePosts } from '@/store/useAppStore';

export const VERDICT_META: Record<Verdict, { label: string; color: 'mint' | 'butter' | 'rose'; icon: string }> = {
  good: { label: '좋았어요', color: 'mint', icon: '😊' },
  soso: { label: '그저 그랬어요', color: 'butter', icon: '😐' },
  bad: { label: '별로였어요', color: 'rose', icon: '😞' },
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
const tokens = (s: string) =>
  s
    .toLowerCase()
    .split(/[^0-9a-z가-힣]+/)
    .filter((t) => t.length >= 2);

/**
 * 게시글이 검색어와 맞는지 — 제품명은 낱말 단위로 느슨하게(60% 이상 일치), 제목·본문은 통째로 포함될 때.
 * "1025 독도 토너"로 검색해도 "독도 토너 후기"가 잡히도록.
 */
export function postMatchesQuery(post: BoardPost, query: string): boolean {
  const q = norm(query);
  if (!q) return true;
  const name = norm(post.productName ?? '');
  if (name.includes(q) || norm(post.title).includes(q) || norm(post.body).includes(q)) return true;
  const qs = tokens(query);
  if (!qs.length) return false;
  const hay = `${name} ${norm(post.title)}`;
  const hits = qs.filter((t) => hay.includes(t)).length;
  return hits >= Math.max(1, Math.ceil(qs.length * 0.6));
}

/** 제품 이름으로 후기 개수 세기 (제품 카드의 "후기 N" 버튼용) — 제품명 필드 기준 */
export function countPostsForProduct(posts: BoardPost[], productName: string): number {
  const qs = tokens(productName);
  if (!qs.length) return 0;
  return posts.filter((p) => {
    const name = norm(p.productName ?? '');
    if (!name) return false;
    if (name.includes(norm(productName))) return true;
    const hits = qs.filter((t) => name.includes(t)).length;
    return hits >= Math.max(1, Math.ceil(qs.length * 0.6));
  }).length;
}

export function PostCard({ post, onOpen }: { post: BoardPost; onOpen: () => void }) {
  const likePost = useAppStore((s) => s.likePost);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
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
          {post.isDemo && <Badge color="lilac">예시 글</Badge>}
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
        <div className="row" style={{ gap: 6 }}>
          <button
            type="button"
            className="report-btn"
            onClick={() => pushOverlay({ type: 'report', postId: post.id })}
            aria-label="이 글 신고하기"
            title="신고"
          >
            신고
          </button>
          <button type="button" className="like-btn" onClick={() => likePost(post.id)} aria-label="좋아요">
            <Icon name="heart" size={14} /> {post.likes}
          </button>
        </div>
      </div>
    </article>
  );
}

/** 커뮤니티 게시판 — 다른 사람들의 화장대. 제품명·제목·본문으로 검색해 궁금한 제품 후기를 찾는다. */
export function BoardOverlay({ initialQuery = '' }: { initialQuery?: string }) {
  const posts = useVisiblePosts();
  const popOverlay = useAppStore((s) => s.popOverlay);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const [filter, setFilter] = useState<ConcernId | 'all'>('all');
  const [query, setQuery] = useState(initialQuery);
  const list = useMemo(
    () => posts.filter((p) => (filter === 'all' || p.concernCategory === filter) && postMatchesQuery(p, query)),
    [posts, filter, query],
  );
  const trimmed = query.trim();

  return (
    <Overlay
      title="다른 사람들의 화장대"
      onClose={popOverlay}
      right={
        <button type="button" className="btn btn--sm" onClick={() => pushOverlay({ type: 'post-form', productName: trimmed || undefined })}>
          <Icon name="edit" size={14} /> 글쓰기
        </button>
      }
    >
      <p className="small muted mb-2">
        피부 고민별로 다른 사용자의 제품 후기를 나눠요. 개인 후기이며 효과를 보장하지 않아요. 규칙을 어긴 글은 신고해 주세요.
      </p>
      <div className="search mb-2">
        <span className="search__icon">
          <Icon name="search" size={16} />
        </span>
        <input
          className="input"
          type="search"
          placeholder="궁금한 제품 이름으로 후기 찾기 (예: 독도 토너)"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 60))}
          aria-label="후기 검색"
        />
      </div>
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
      {trimmed && (
        <div className="search-meta">
          <span>
            “{trimmed}” 후기 {list.length}건
          </span>
          <button type="button" className="link-btn" onClick={() => setQuery('')}>
            지우기
          </button>
        </div>
      )}
      {list.length === 0 ? (
        <div className="empty mt-2">
          <strong>{trimmed ? `“${trimmed}” 후기가 아직 없어요` : '아직 글이 없어요'}</strong>
          {trimmed ? '이 제품을 써보셨다면 첫 후기를 남겨주세요. 다른 사람에게 큰 도움이 돼요.' : '첫 후기를 남겨보세요.'}
          <div className="mt-2">
            <button type="button" className="btn btn--sm" onClick={() => pushOverlay({ type: 'post-form', productName: trimmed || undefined })}>
              {trimmed ? '이 제품 첫 후기 쓰기' : '글쓰기'}
            </button>
          </div>
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
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const likePost = useAppStore((s) => s.likePost);
  const blockAuthor = useAppStore((s) => s.blockAuthor);
  const deleteMyPost = useAppStore((s) => s.deleteMyPost);
  const showToast = useAppStore((s) => s.showToast);
  const myNickname = useAppStore((s) => s.profile?.nickname ?? null);
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
        {post.isDemo && <Badge color="lilac">예시 글</Badge>}
      </div>
      <h2 className="h1 mt-2" style={{ fontSize: 24 }}>
        {post.title}
      </h2>
      <div className="small muted mt-1">
        {post.authorNickname} · {relativeTime(post.createdAt)}
      </div>
      {post.productName && (
        <div className="notice mt-2 row row--between">
          <span>
            🧴 사용 제품: <strong>{post.productName}</strong>
          </span>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              popOverlay();
              pushOverlay({ type: 'board', query: post.productName ?? '' });
            }}
          >
            이 제품 후기 더 보기
          </button>
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
      <div className="row row--wrap" style={{ gap: 8 }}>
        {!post.isDemo && myNickname && post.authorNickname === myNickname ? (
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={async () => {
              if (window.confirm('내가 쓴 이 글을 지울까요? 되돌릴 수 없어요.')) {
                await deleteMyPost(post.id);
                showToast('글을 지웠어요');
                popOverlay();
              }
            }}
          >
            <Icon name="trash" size={14} /> 내 글 삭제
          </button>
        ) : (
          <>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => pushOverlay({ type: 'report', postId: post.id })}>
              🚩 신고
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={async () => {
                if (window.confirm(post.authorNickname + ' 님의 글을 앞으로 보지 않을까요? 설정에서 해제할 수 있어요.')) {
                  await blockAuthor(post.authorNickname);
                  popOverlay();
                }
              }}
            >
              🙈 이 사용자 차단
            </button>
          </>
        )}
      </div>

      <p className="fine-print">
        {post.isDemo
          ? '이 글은 앱에 기본 포함된 예시 글이에요. 실제 사용자의 후기가 아니며 제품의 효과를 보장하지 않아요. '
          : '이 글은 개인 후기이며 효과를 보장하지 않아요. 같은 제품이라도 반응은 사람마다 달라요. '}
        심한 자극이나 트러블이 지속되면 전문의와 상담해주세요.
      </p>
    </Overlay>
  );
}
