// ---------------------------------------------------------------------------
//  도메인 타입 — 앱 전역에서 공유
// ---------------------------------------------------------------------------

export type SkinType = 'dry' | 'oily' | 'combo' | 'normal' | 'sensitive';

export type ConcernId =
  | 'pigmentation' // 잡티·흔적
  | 'dryness' // 건조함
  | 'sebum' // 피지
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
}

export type InteractionSeverity = 'good' | 'neutral' | 'caution' | 'high_caution';

export interface IngredientInteraction {
  id: string;
  ingredientA: string;
  ingredientB: string;
  severity: InteractionSeverity;
  reason: string;
  recommendation: string;
}

// ---------------------------------------------------------------------------
//  사용자 데이터
// ---------------------------------------------------------------------------

export interface Profile {
  skinType: SkinType | null;
  concerns: ConcernId[];
  nickname: string | null;
  createdAt: string;
}

export type RoutineType = 'AM' | 'PM';

export interface RoutineItem {
  id: string;
  routineType: RoutineType;
  productId: string;
  sortOrder: number;
  /** YYYY-MM-DD */
  startedAt: string;
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
}

export type MatchType = 'good' | 'avoided';

export interface ProductMatch {
  id: string;
  productId: string;
  matchType: MatchType;
  createdAt: string;
}

export type Verdict = 'good' | 'soso' | 'bad';

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
