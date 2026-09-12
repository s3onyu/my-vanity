import type { ProductCategory, SkinType } from '@/types';

/**
 * 활성 성분별 자극 가중치 (0 = 활성 아님).
 * 값이 클수록 한 루틴 안에서 누적 부담으로 크게 반영된다.
 */
export const ACTIVE_WEIGHTS: Record<string, number> = {
  retinol: 3.0,
  retinal: 3.4,
  hpr: 1.8,
  'retinyl-palmitate': 1.0,
  'glycolic-acid': 2.6,
  'lactic-acid': 2.0,
  'mandelic-acid': 1.6,
  'salicylic-acid': 2.2,
  lha: 1.4,
  gluconolactone: 1.0,
  'lactobionic-acid': 0.9,
  'ascorbic-acid': 2.2,
  'ethyl-ascorbic-acid': 1.2,
  'ascorbyl-glucoside': 0.8,
  'sodium-ascorbyl-phosphate': 0.7,
  'azelaic-acid': 1.8,
  'tea-tree': 1.6,
  'benzoyl-peroxide': 3.0,
  sulfur: 2.0,
  'kojic-acid': 1.2,
  thiamidol: 0.8,
  urea: 0.6,
  'alcohol-denat': 0.8,
  papain: 0.6,
  cellulose: 0.8,
};

export const isActive = (id: string) => (ACTIVE_WEIGHTS[id] ?? 0) > 0;

/** 민감성 피부에서 특히 강하게 보는 활성 성분 (추천 감점용) */
export const STRONG_ACTIVES = new Set([
  'retinol',
  'retinal',
  'glycolic-acid',
  'lactic-acid',
  'mandelic-acid',
  'salicylic-acid',
  'ascorbic-acid',
  'tea-tree',
  'benzoyl-peroxide',
  'sulfur',
]);

export type ExfoliationFamily = 'retinoid' | 'aha' | 'bha' | 'pha';

/** 각질 관리 계열(mechanism) 분류 */
export const EXFOLIATION_FAMILY: Record<string, ExfoliationFamily> = {
  retinol: 'retinoid',
  retinal: 'retinoid',
  hpr: 'retinoid',
  'retinyl-palmitate': 'retinoid',
  'glycolic-acid': 'aha',
  'lactic-acid': 'aha',
  'mandelic-acid': 'aha',
  'salicylic-acid': 'bha',
  lha: 'bha',
  gluconolactone: 'pha',
  'lactobionic-acid': 'pha',
};

export const FAMILY_LABEL: Record<ExfoliationFamily, string> = {
  retinoid: '레티노이드',
  aha: 'AHA',
  bha: 'BHA',
  pha: 'PHA',
};

/** 장벽 지지 성분 */
export const BARRIER_SUPPORT = new Set([
  'ceramide',
  'panthenol',
  'centella',
  'madecassoside',
  'squalane',
  'hyaluronic-acid',
  'cholesterol',
  'fatty-acids',
  'beta-glucan',
  'allantoin',
  'ectoin',
  'colloidal-oatmeal',
  'pea',
  'shea-butter',
  'petrolatum',
  'bisabolol',
]);

/** 피부 타입별 활성 성분 부담 가중치 */
export const SKIN_MULTIPLIER: Record<SkinType, number> = {
  sensitive: 1.35,
  dry: 1.15,
  combo: 1.0,
  oily: 1.0,
  normal: 1.0,
};

/**
 * "한 단계에 하나만 쓰는 게 정상인" 카테고리와 겹칠 때 개당 감점.
 * 세럼/앰플/에센스/토너/패드는 레이어링이 흔해 훨씬 약하게 감점한다.
 */
export const SINGLE_STEP_PENALTY: Partial<Record<ProductCategory, number>> = {
  크림: 9,
  로션: 8,
  선크림: 10,
  클렌징: 7,
  베이스: 8,
  필링: 9,
  아이크림: 5,
  오일: 5,
  마스크: 4,
  미스트: 3,
};

export const LAYERING_PENALTY: Partial<Record<ProductCategory, number>> = {
  세럼: 2,
  앰플: 2,
  에센스: 2,
  토너: 2,
  패드: 3,
};

/** 보습 마무리로 인정하는 카테고리 */
export const MOISTURIZER_CATEGORIES: ProductCategory[] = ['크림', '로션'];

/** 궁합 점수 클램프 범위 */
export const SCORE_MIN = 8;
export const SCORE_MAX = 96;
/** 기본 점수 — 여기서 감점·가점이 더해진다 */
export const SCORE_BASE = 79;

/**
 * 바르는 순서 — 카테고리별 단계 번호 (작을수록 먼저).
 * 클렌징 → 토너·패드·미스트 → 에센스 → 앰플·세럼 → 로션 → 크림·아이크림·오일·마스크 → 선크림 → 베이스
 * 필링은 세안 직후·토너 전후에 쓰므로 토너와 같은 단계로 본다.
 */
export const CATEGORY_STEP: Record<ProductCategory, number> = {
  클렌징: 0,
  필링: 1,
  토너: 1,
  패드: 1,
  미스트: 1,
  에센스: 2,
  앰플: 3,
  세럼: 3,
  로션: 4,
  아이크림: 5,
  크림: 5,
  오일: 5,
  마스크: 5,
  선크림: 6,
  베이스: 7,
};

/** 순서가 뒤집힌 쌍 하나당 감점, 최대 감점 */
export const ORDER_PENALTY_PER_PAIR = 6;
export const ORDER_PENALTY_MAX = 18;

/** 아침 루틴에 선크림이 없을 때 — 활성 성분 유무에 따라 */
export const AM_NO_SUNSCREEN_PENALTY = 6;
export const AM_NO_SUNSCREEN_WITH_ACTIVES_PENALTY = 10;
