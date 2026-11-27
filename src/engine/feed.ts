import type { BoardPost, ConcernId, FeedTopicId, FeedWeight } from '@/types';

export interface FeedTopic {
  id: FeedTopicId;
  label: string;
  icon: string;
  /** 짧은 설명 — 설정 화면에 보여준다 */
  desc: string;
  /** 이 주제로 보는 고민 카테고리 */
  concerns: ConcernId[];
  /** 제목·본문에서 찾는 낱말 */
  keywords: string[];
}

/**
 * 커뮤니티 피드의 관심 분야 (요청 7번).
 * 고민 카테고리보다 잘게 나눠서, 같은 "스킨케어" 안에서도 보습·진정·각질을 따로 고를 수 있게 했다.
 */
export const FEED_TOPICS: FeedTopic[] = [
  {
    id: 'hydration',
    label: '보습·건조',
    icon: '💧',
    desc: '수분 크림, 당김, 속건조 이야기',
    concerns: ['dryness'],
    keywords: ['보습', '수분', '건조', '당김', '속건조', '히알루론', '꾸덕', '촉촉'],
  },
  {
    id: 'soothing',
    label: '진정·민감',
    icon: '🌿',
    desc: '붉어짐, 따가움, 장벽 케어',
    concerns: ['barrier'],
    keywords: ['진정', '민감', '붉어', '홍조', '따가', '자극', '장벽', '병풀', '시카'],
  },
  {
    id: 'exfoliation',
    label: '각질·모공',
    icon: '🔍',
    desc: '토너패드, AHA·BHA, 모공 관리',
    concerns: ['pores', 'texture'],
    keywords: ['각질', '모공', '피부결', '토너패드', '패드', 'bha', 'aha', '블랙헤드', '필링'],
  },
  {
    id: 'trouble',
    label: '트러블',
    icon: '🌱',
    desc: '여드름, 좁쌀, 피지 조절',
    concerns: ['breakout', 'sebum'],
    keywords: ['트러블', '여드름', '좁쌀', '뾰루지', '피지', '번들', '유분'],
  },
  {
    id: 'tone',
    label: '톤·잡티',
    icon: '✨',
    desc: '잡티, 자국, 톤업',
    concerns: ['pigmentation', 'dullness'],
    keywords: ['잡티', '기미', '자국', '색소', '톤업', '미백', '비타민c', '브라이트'],
  },
  {
    id: 'aging',
    label: '탄력·주름',
    icon: '🌙',
    desc: '잔주름, 탄력, 레티놀',
    concerns: ['firming'],
    keywords: ['주름', '탄력', '리프팅', '레티놀', '안티에이징', '처짐'],
  },
  {
    id: 'eye-makeup',
    label: '아이 메이크업',
    icon: '👁️',
    desc: '아이섀도, 아이라인, 마스카라',
    concerns: [],
    keywords: ['아이섀도', '섀도', '아이라인', '라이너', '마스카라', '속눈썹', '눈화장', '아이메이크업', '언더', '애교살'],
  },
  {
    id: 'base-makeup',
    label: '베이스 메이크업',
    icon: '🎨',
    desc: '쿠션, 파운데이션, 프라이머',
    concerns: [],
    keywords: ['쿠션', '파운데이션', '파데', '프라이머', '베이스', '컨실러', '파우더', '커버'],
  },
  {
    id: 'cheek-makeup',
    label: '블러셔·컨투어',
    icon: '🌸',
    desc: '블러셔, 하이라이터, 쉐딩',
    concerns: [],
    keywords: ['블러셔', '치크', '하이라이터', '쉐딩', '컨투어', '코쉐딩'],
  },
  {
    id: 'ingredient',
    label: '성분 공부',
    icon: '🧪',
    desc: '전성분 분석, 성분 궁합 이야기',
    concerns: [],
    keywords: ['성분', '전성분', '궁합', '조합', '함량', 'inci', '성분표'],
  },
  {
    id: 'value',
    label: '가성비·추천',
    icon: '💰',
    desc: '가격, 세일, 대용량 추천',
    concerns: [],
    keywords: ['가성비', '저렴', '세일', '할인', '최저가', '대용량', '가격', '올리브영', '추천템'],
  },
];

export const FEED_TOPIC_MAP = Object.fromEntries(FEED_TOPICS.map((t) => [t.id, t])) as Record<FeedTopicId, FeedTopic>;

export const WEIGHT_LABEL: Record<FeedWeight, string> = { 0: '안 보기', 1: '보통', 2: '우선 보기' };

export type FeedWeights = Partial<Record<FeedTopicId, FeedWeight>>;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export interface PostTopics {
  /** 이 글에 걸리는 모든 분야 */
  topics: FeedTopicId[];
  /**
   * 글이 실제로 그 내용을 다루고 있는 분야 (제목·본문·제품명에 낱말이 있는 경우).
   * 글쓴이가 고른 고민 카테고리만으로 걸린 분야보다 더 확실한 신호라, 숨기기 판단에 이걸 먼저 본다.
   */
  explicit: FeedTopicId[];
}

/** 글이 어떤 관심 분야에 걸리는지 — 고민 카테고리 + 제목·본문·제품명 낱말 */
export function classifyPost(post: BoardPost): PostTopics {
  const hay = norm(`${post.title} ${post.body} ${post.productName ?? ''}`);
  const topics = new Set<FeedTopicId>();
  const explicit = new Set<FeedTopicId>();
  FEED_TOPICS.forEach((t) => {
    if (t.concerns.includes(post.concernCategory)) topics.add(t.id);
    if (t.keywords.some((k) => hay.includes(norm(k)))) {
      topics.add(t.id);
      explicit.add(t.id);
    }
  });
  return { topics: [...topics], explicit: [...explicit] };
}

export const topicsOfPost = (post: BoardPost): FeedTopicId[] => classifyPost(post).topics;

export interface RankedPost {
  post: BoardPost;
  score: number;
  topics: FeedTopicId[];
  /** 우선 보기로 고른 분야 중 이 글에 걸린 것 */
  matchedPriority: FeedTopicId[];
  /** 왜 위로 올라왔는지 (없으면 null) */
  reason: string | null;
}

const DAY = 86_400_000;

/**
 * 관심 분야 가중치에 따라 게시글 노출 순서를 바꾼다.
 * 가중치 0 인 분야의 글은 목록에서 빼고(다른 분야에도 걸리면 남긴다), 2 인 분야의 글은 위로 올린다.
 * 가중치를 하나도 정하지 않았으면 원래 순서(최신순)를 그대로 돌려준다.
 */
export function rankPosts(posts: BoardPost[], weights: FeedWeights, now = Date.now()): RankedPost[] {
  const entries = Object.entries(weights) as [FeedTopicId, FeedWeight][];
  const hasPreference = entries.some(([, w]) => w !== 1);
  const priority = entries.filter(([, w]) => w === 2).map(([t]) => t);
  const muted = new Set(entries.filter(([, w]) => w === 0).map(([t]) => t));

  const ranked = posts.map((post) => {
    const { topics, explicit } = classifyPost(post);
    const matchedPriority = topics.filter((t) => priority.includes(t));
    const ageDays = Math.max(0, (now - new Date(post.createdAt).getTime()) / DAY);
    // 기본 점수: 최신성 + 좋아요 (관심 분야가 없어도 합리적인 순서가 되게)
    let score = Math.max(0, 40 - ageDays) + Math.min(20, post.likes * 2);
    score += matchedPriority.length * 60;
    // 글이 실제로 다루는 분야가 모두 "안 보기"면 숨긴다.
    // 내용 낱말이 전혀 없는 글은 글쓴이가 고른 고민 카테고리로 판단한다.
    const pool = explicit.length ? explicit : topics;
    const allMuted = pool.length > 0 && pool.every((t) => muted.has(t));
    if (allMuted) score -= 1000;
    const reason = matchedPriority.length
      ? `${matchedPriority.map((t) => FEED_TOPIC_MAP[t].label).join(' · ')} 관심 분야`
      : null;
    return { post, score, topics, matchedPriority, reason, allMuted };
  });

  const visible = ranked.filter((r) => !r.allMuted);
  if (!hasPreference) {
    // 선호를 정하지 않았으면 원래 순서(최신순)를 유지한다
    return visible.map(({ allMuted: _allMuted, ...r }) => r);
  }
  return visible
    .sort((a, b) => b.score - a.score || b.post.createdAt.localeCompare(a.post.createdAt))
    .map(({ allMuted: _allMuted, ...r }) => r);
}

/** 가중치를 하나라도 정했는지 */
export const hasFeedPreference = (weights: FeedWeights | null | undefined): boolean =>
  Boolean(weights && Object.values(weights).some((w) => w !== 1));

/** 설정한 분야 요약 — "우선 2개 · 숨김 1개" */
export function feedSummary(weights: FeedWeights | null | undefined): string {
  if (!weights) return '아직 설정하지 않았어요';
  const vals = Object.values(weights);
  const up = vals.filter((w) => w === 2).length;
  const off = vals.filter((w) => w === 0).length;
  if (!up && !off) return '모든 분야를 똑같이 보여줘요';
  const parts: string[] = [];
  if (up) parts.push(`우선 ${up}개`);
  if (off) parts.push(`숨김 ${off}개`);
  return parts.join(' · ');
}
