// ---------------------------------------------------------------------------
//  도메인 타입 — 앱 전역에서 공유
// ---------------------------------------------------------------------------

export type SkinType = 'dry' | 'oily' | 'combo' | 'normal' | 'sensitive';

export type ConcernId =
  | 'pigmentation' // 잡티·흔적
  | 'dryness' // 건조함
  | 'sebum' // 피지
  | 'pores' // 모공
  | 'texture' // 피부결
  | 'barrier' // 장벽
  | 'dullness' // 칙칙함
  | 'breakout' // 트러블 경향
  | 'firming'; // 탄력·노화 징후

export type IngredientCategory =
  | 'tone' // 톤
  | 'hydration' // 보습
  | 'barrier' // 장벽
  | 'soothing' // 진정
  | 'sebum' // 피지
  | 'exfoliation' // 각질
  | 'antioxidant' // 항산화
  | 'firming' // 탄력
  | 'renewal' // 리뉴얼
  | 'sunscreen'; // 자외선차단

export type ColorTag = 'rose' | 'mint' | 'sky' | 'butter' | 'lilac' | 'gold' | 'plum';

export type EvidenceLevel = 'high' | 'moderate' | 'limited';

/** 근거 자료의 종류 — 화면에 아이콘·라벨로 구분해 보여준다 */
export type SourceKind = 'paper' | 'authority' | 'guideline' | 'db';

/** 성분·조합 판단의 근거 자료 한 건 */
export interface SourceRef {
  id: string;
  kind: SourceKind;
  /** 짧은 이름 (예: 식약처 화장품 안전기준) */
  label: string;
  /** 어떤 내용을 담고 있는지 한 줄 */
  detail: string;
  /** 발행 기관·저자 */
  publisher: string;
  /** 연도 (없으면 수시 개정 자료) */
  year?: number;
  url?: string;
}

/** 주의 조합을 나눠 쓰는 방법 */
export type SeparationKind =
  | 'time' // 아침/저녁으로 시간대를 나눈다
  | 'day' // 날짜를 번갈아 쓴다
  | 'order' // 같은 시간대라도 바르는 순서만 지키면 된다
  | 'swap' // 하나를 다른 제품으로 바꾸는 편이 낫다
  | 'none'; // 나눠 쓸 필요 없음

/** 성분을 주로 쓰는 시간대 */
export type TimeSlot = 'AM' | 'PM' | 'any';

/** 성분 부가 태그 — 엔진이 향료/에센셜오일 누적 노출 등을 계산할 때 사용 */
export type IngredientTag = 'fragrance' | 'essential-oil' | 'active' | 'filter';

export interface Ingredient {
  id: string;
  nameKo: string;
  nameInci: string;
  categories: IngredientCategory[];
  colorTag: ColorTag;
  /** 쉬운 한 줄 설명 (단정 표현 금지) */
  shortDesc: string;
  /** "자세히 보기"에서 펼쳐지는 과학적 설명 */
  longDesc: string;
  /** 함께 쓰기 좋은 성분 id 목록 */
  pairsWell: string[];
  /** 함께 쓸 때 주의할 성분 id 목록 */
  pairCaution: string[];
  relatedConcerns: ConcernId[];
  source: string;
  evidenceLevel: EvidenceLevel;
  /** YYYY-MM-DD */
  lastReviewed: string;
  tags?: IngredientTag[];
}

export type ProductCategory =
  | '토너'
  | '에센스'
  | '앰플'
  | '세럼'
  | '로션'
  | '크림'
  | '선크림'
  | '클렌징'
  | '마스크'
  | '아이크림'
  | '오일'
  | '미스트'
  | '필링'
  | '패드'
  | '베이스';

export interface Product {
  id: string;
  brand: string;
  name: string;
  /** 줄여 부르는 이름, 영문명 등 */
  aliases: string[];
  category: ProductCategory;
  /** Ingredient.id 목록 (INCI 문자열이 아니라 id) */
  keyIngredients: string[];
  relatedConcerns: ConcernId[];
  skinTypes: SkinType[];
  /** false = 데모/미검증 데이터 */
  verified: boolean;
  /** 사용자가 직접 등록한 제품 (사진 등록 등) */
  custom?: boolean;
  /** 사용자가 올린 제품 사진 (리사이즈된 data URL) */
  imageUrl?: string | null;
  /** 용량 (ml 또는 g) — 가격을 입력하면 1ml 당 가격을 계산한다 */
  volume?: number | null;
}

export type InteractionSeverity = 'good' | 'neutral' | 'caution' | 'high_caution';

export interface IngredientInteraction {
  id: string;
  ingredientA: string;
  ingredientB: string;
  severity: InteractionSeverity;
  reason: string;
  recommendation: string;
  /** 이 판단의 근거 자료 (SOURCES 의 id 목록) */
  sourceIds?: string[];
  /** 나눠 쓰는 방법 — 엔진이 시간대·순서 추천을 만들 때 쓴다 */
  separation?: SeparationKind;
}

// ---------------------------------------------------------------------------
//  사용자 데이터
// ---------------------------------------------------------------------------

export interface Profile {
  skinType: SkinType | null;
  concerns: ConcernId[];
  nickname: string | null;
  createdAt: string;
  /** 커뮤니티 이용약관·개인정보 처리에 동의한 시각 (없으면 아직 동의 전) */
  agreedAt?: string | null;
  /** 동의한 약관 버전 — 약관이 바뀌면 다시 받는다 */
  agreedVersion?: string | null;
  /** 피부 유형 검사(4축) 결과 코드 — 예: 'DSPW' */
  skinCode?: string | null;
  /** 검사를 마친 시각 */
  skinCodeAt?: string | null;
  /** 커뮤니티 피드의 관심 분야별 노출 비중 */
  feedTopics?: Partial<Record<FeedTopicId, FeedWeight>> | null;
}

// ---------------------------------------------------------------------------
//  커뮤니티 피드 개인화
// ---------------------------------------------------------------------------

export type FeedTopicId =
  | 'hydration' // 보습·건조
  | 'soothing' // 진정·민감
  | 'exfoliation' // 각질·모공
  | 'trouble' // 트러블
  | 'tone' // 톤·잡티
  | 'aging' // 탄력·주름
  | 'eye-makeup' // 아이 메이크업
  | 'base-makeup' // 베이스 메이크업
  | 'cheek-makeup' // 블러셔·컨투어
  | 'ingredient' // 성분 공부
  | 'value'; // 가성비·추천

/** 0 = 안 보기, 1 = 보통, 2 = 우선 보기 */
export type FeedWeight = 0 | 1 | 2;

export type RoutineType = 'AM' | 'PM';

/**
 * 제품을 얼마나 자주 쓰는지.
 * - daily    매일
 * - alt      격일 (사용 시작일 기준 하루 걸러)
 * - weekdays 고른 요일에만 (0 = 일요일 … 6 = 토요일)
 */
export type RoutineFrequency =
  | { kind: 'daily' }
  | { kind: 'alt' }
  | { kind: 'weekdays'; days: number[] };

export interface RoutineItem {
  id: string;
  routineType: RoutineType;
  productId: string;
  sortOrder: number;
  /** YYYY-MM-DD */
  startedAt: string;
  /** 사용 빈도 — 없으면 매일로 본다 */
  frequency?: RoutineFrequency | null;
}

/** 내가 적어 둔 제품 가격 */
export interface ProductPrice {
  productId: string;
  /** 원 */
  price: number;
  /** 용량 (ml 또는 g) — 있으면 1ml 당 가격을 계산한다 */
  volume?: number | null;
  /** 어디서 산 가격인지 (선택) */
  shop?: string | null;
  updatedAt: string;
}

/** 피부 기록 — 하루에 아침(AM)·저녁(PM) 각각 하나씩 남긴다 */
export interface SkinLog {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** 아침 기록인지 저녁 기록인지 */
  period: RoutineType;
  /** 이 시간대에 쓴 제품 id */
  products: string[];
  comfort: number; // 1~5
  dryness: number; // 1~5
  oiliness: number; // 1~5
  irritation: number; // 1~5
  memo: string;
  /** 피부 사진 (리사이즈된 data URL 또는 저장소 URL) */
  photoUrl?: string | null;
  /** 사진에서 기기 안에서 계산한 참고 지표 */
  skinMetrics?: SkinMetrics | null;
}

/** 피부 사진 참고 지표 — 상대 비교용, 진단 아님 */
export interface SkinMetrics {
  redness: number;
  shine: number;
  evenness: number;
  brightness: number;
  skinRatio: number;
}

export type MatchType = 'good' | 'avoided';

export interface ProductMatch {
  id: string;
  productId: string;
  matchType: MatchType;
  createdAt: string;
}

export type Verdict = 'good' | 'soso' | 'bad';

/** 게시글 신고 사유 */
export type ReportReason = 'spam' | 'abuse' | 'misinfo' | 'privacy' | 'sexual' | 'other';

export interface PostReport {
  id: string;
  postId: string;
  reason: ReportReason;
  detail: string;
  createdAt: string;
}

export interface BoardPost {
  id: string;
  authorNickname: string;
  concernCategory: ConcernId;
  title: string;
  body: string;
  productName: string | null;
  verdict: Verdict;
  imageUrl: string | null;
  likes: number;
  createdAt: string;
  /** 앱에 기본 포함된 예시 게시글 (실제 사용자 후기가 아님) */
  isDemo?: boolean;
}

// ---------------------------------------------------------------------------
//  메이크업 튜토리얼 — 일러스트 레이어 정의
// ---------------------------------------------------------------------------

export type TutorialCategory = 'eye' | 'blush' | 'nose';

/** 눈 일러스트 위에 누적되는 레이어 */
export type EyeLayer =
  | { kind: 'lid'; region: 'full' | 'inner' | 'mid' | 'outer'; color: string; opacity?: number }
  | { kind: 'crease'; color: string; opacity?: number }
  | { kind: 'outerV'; color: string; opacity?: number }
  | { kind: 'underline'; region: 'full' | 'outer' | 'inner'; color: string; opacity?: number }
  | { kind: 'innerCorner'; color: string }
  | { kind: 'aegyo'; color: string; opacity?: number }
  | { kind: 'liner'; style: 'thin' | 'medium' | 'thick' | 'wing' | 'downturn' | 'puppy'; color: string }
  | { kind: 'lashes'; style: 'natural' | 'volume' | 'curl' | 'doll'; color?: string }
  | { kind: 'glitter'; region: 'center' | 'inner' | 'full'; color: string };

/** 얼굴 일러스트 위에 누적되는 레이어 */
export type FaceLayer =
  | { kind: 'blush'; shape: 'diagonal' | 'apple' | 'horizontal' | 'uzone'; color: string; opacity?: number }
  | { kind: 'highlight'; region: 'cheekbone' | 'noseBridge' | 'noseTip' | 'browBone' | 'cupid'; color?: string }
  | { kind: 'noseShade'; style: 'bridgeSides' | 'nostril' | 'tipBreak' | 'tipUnder' | 'browStart'; color: string; opacity?: number }
  | { kind: 'blend' };

export type TutorialLayer = EyeLayer | FaceLayer;

export interface TutorialStep {
  title: string;
  /** 어떻게 바르는지 2~3문장 */
  tip: string;
  /** 이 단계에서 새로 추가되는 레이어 (이전 단계와 누적됨) */
  layers: TutorialLayer[];
}

export interface Tutorial {
  id: string;
  category: TutorialCategory;
  title: string;
  subtitle: string;
  tags: string[];
  illustration: 'eye' | 'face';
  steps: TutorialStep[];
}
