import type { IngredientInteraction, Product, RoutineType, SkinType } from '@/types';
import { SKIN_TYPE_LABEL } from '@/data/concerns';
import { type Catalog, findInteraction, ingredientName } from './catalog';
import {
  ACTIVE_WEIGHTS,
  BARRIER_SUPPORT,
  EXFOLIATION_FAMILY,
  FAMILY_LABEL,
  LAYERING_PENALTY,
  SCORE_BASE,
  SCORE_MAX,
  SCORE_MIN,
  SINGLE_STEP_PENALTY,
  SKIN_MULTIPLIER,
  type ExfoliationFamily,
} from './constants';

export type ReasonKey =
  | 'active-load'
  | 'skin-type'
  | 'barrier-relief'
  | 'mechanism-stacking'
  | 'active-repeat'
  | 'interaction'
  | 'structural-gap'
  | 'fragrance'
  | 'overexposure'
  | 'category-duplicate'
  | 'inactive-repeat'
  | 'positive-bonus';

export interface ScoreReason {
  key: ReasonKey;
  /** 명세의 1~12번 항목 번호 */
  rule: number;
  label: string;
  /** 양수 = 가점, 음수 = 감점 */
  delta: number;
  detail: string;
}

export interface InteractionHit {
  interaction: IngredientInteraction;
  productsA: string[];
  productsB: string[];
}

export interface CompatibilityResult {
  empty: boolean;
  score: number;
  summary: string;
  reasons: ScoreReason[];
  interactionHits: InteractionHit[];
  stats: {
    productCount: number;
    ingredientCount: number;
    activeIds: string[];
    activeLoad: number;
    barrierIds: string[];
    fragranceIds: string[];
    families: ExfoliationFamily[];
    hasSunscreen: boolean;
    hasMoisturizer: boolean;
  };
}

export interface CompatibilityInput {
  productIds: string[];
  routineType: RoutineType;
  skinType: SkinType | null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const names = (catalog: Catalog, ids: string[], max = 3) => {
  const list = ids.map((id) => ingredientName(catalog, id));
  return list.length > max ? `${list.slice(0, max).join(', ')} 외 ${list.length - max}종` : list.join(', ');
};

export function summaryForScore(score: number): string {
  if (score >= 88) return '활성 성분 부담이 적고 장벽 지지가 탄탄해요';
  if (score >= 75) return '균형이 좋은 편이에요. 한두 가지만 다듬으면 더 편안해질 수 있어요';
  if (score >= 60) return '무난하지만 겹치는 부분이 있어요. 아래 근거를 확인해보세요';
  if (score >= 40) return '조합을 조정해볼 만해요. 감점 요인이 여러 개 겹쳐 있어요';
  return '우선순위를 정해보세요. 활성 성분이나 같은 기능 제품이 너무 많이 겹쳐요';
}

export const EMPTY_RESULT: CompatibilityResult = {
  empty: true,
  score: 0,
  summary: '루틴에 제품을 담으면 궁합 점수를 계산해요',
  reasons: [],
  interactionHits: [],
  stats: {
    productCount: 0,
    ingredientCount: 0,
    activeIds: [],
    activeLoad: 0,
    barrierIds: [],
    fragranceIds: [],
    families: [],
    hasSunscreen: false,
    hasMoisturizer: false,
  },
};

/**
 * 성분 궁합 분석 엔진.
 * 명세 5-2 의 1~12번 규칙을 순서대로 적용하고, 실제로 적용된 규칙만 reasons 에 남긴다.
 */
export function analyzeRoutine(input: CompatibilityInput, catalog: Catalog): CompatibilityResult {
  const products = input.productIds
    .map((id) => catalog.products.get(id))
    .filter((p): p is Product => Boolean(p));
  if (products.length === 0) return EMPTY_RESULT;

  const reasons: ScoreReason[] = [];
  const skinType = input.skinType;
  const isAM = input.routineType === 'AM';

  // ---- 성분 집계: 성분 id → 포함한 제품명 목록
  const holders = new Map<string, string[]>();
  products.forEach((p) => {
    new Set(p.keyIngredients).forEach((ing) => {
      holders.set(ing, [...(holders.get(ing) ?? []), p.name]);
    });
  });
  const ingredientIds = [...holders.keys()];
  const count = (id: string) => holders.get(id)?.length ?? 0;

  const activeIds = ingredientIds.filter((id) => (ACTIVE_WEIGHTS[id] ?? 0) > 0);
  const barrierIds = ingredientIds.filter((id) => BARRIER_SUPPORT.has(id));
  const fragranceIds = ingredientIds.filter((id) => {
    const tags = catalog.ingredients.get(id)?.tags ?? [];
    return tags.includes('fragrance') || tags.includes('essential-oil');
  });
  const families = [...new Set(activeIds.map((id) => EXFOLIATION_FAMILY[id]).filter(Boolean))] as ExfoliationFamily[];
  const categories = products.map((p) => p.category);
  const hasSunscreen = categories.includes('선크림');
  const hasMoisturizer = categories.includes('크림') || categories.includes('로션');

  // ---- 1. 활성 성분 누적 부담
  const rawLoad = activeIds.reduce((sum, id) => sum + ACTIVE_WEIGHTS[id], 0);
  const LOAD_FACTOR = 3.2;
  if (rawLoad > 0) {
    const base = Math.min(34, rawLoad * LOAD_FACTOR);
    reasons.push({
      key: 'active-load',
      rule: 1,
      label: '활성 성분 누적 부담',
      delta: -Math.round(base),
      detail: `활성 성분 ${activeIds.length}종(${names(catalog, activeIds, 4)})의 자극 가중치를 합산했어요 (부담 지수 ${round1(rawLoad)}).`,
    });

    // ---- 2. 피부 타입 보정
    const mult = skinType ? SKIN_MULTIPLIER[skinType] : 1;
    if (mult > 1) {
      const extra = Math.round(base * (mult - 1));
      reasons.push({
        key: 'skin-type',
        rule: 2,
        label: '피부 타입 보정',
        delta: -extra,
        detail: `${SKIN_TYPE_LABEL[skinType!]} 피부는 활성 성분 부담에 ×${mult} 가중치를 적용해요.`,
      });
    }

    // ---- 3. 장벽 지지 완화
    if (barrierIds.length > 0) {
      const perIngredient = skinType === 'sensitive' ? 1.2 : 1.8;
      const totalPenalty = base * mult;
      const relief = Math.round(Math.min(totalPenalty * 0.6, Math.min(barrierIds.length, 6) * perIngredient));
      if (relief > 0) {
        reasons.push({
          key: 'barrier-relief',
          rule: 3,
          label: '장벽 지지 완화',
          delta: relief,
          detail: `${names(catalog, barrierIds, 4)} 등 장벽 지지 성분 ${barrierIds.length}종이 활성 성분 부담을 일부 완화해요${
            skinType === 'sensitive' ? ' (민감성 피부는 완화 폭을 작게 반영)' : ''
          }.`,
        });
      }
    }
  }

  // ---- 4. 각질 관리 계열 중복 (mechanism stacking)
  if (families.length >= 2) {
    const penalty = Math.round(7 * (families.length - 1) * (skinType === 'sensitive' ? 1.3 : 1));
    reasons.push({
      key: 'mechanism-stacking',
      rule: 4,
      label: '각질 관리 계열 중복',
      delta: -penalty,
      detail: `${families.map((f) => FAMILY_LABEL[f]).join(' + ')} 처럼 서로 다른 각질 관리 계열이 한 루틴에 겹쳐 있어요. 각질 용해·리뉴얼 작용이 중첩되면 자극이 누적될 수 있어요.`,
    });
  }

  // ---- 5. 동일 활성 성분의 여러 제품 중복
  const repeatedActives = activeIds.filter((id) => count(id) >= 3);
  if (repeatedActives.length > 0) {
    const penalty = Math.min(
      15,
      repeatedActives.reduce((sum, id) => sum + 5 + Math.max(0, count(id) - 3) * 2, 0),
    );
    reasons.push({
      key: 'active-repeat',
      rule: 5,
      label: '같은 활성 성분 반복',
      delta: -penalty,
      detail: repeatedActives
        .map((id) => `${ingredientName(catalog, id)}이(가) ${count(id)}개 제품(${holders.get(id)!.slice(0, 3).join(', ')})에 반복돼요`)
        .join('. '),
    });
  }

  // ---- 6. 문헌 기반 성분 쌍 상호작용
  const interactionHits: InteractionHit[] = [];
  for (let i = 0; i < ingredientIds.length; i += 1) {
    for (let j = i + 1; j < ingredientIds.length; j += 1) {
      const ix = findInteraction(catalog, ingredientIds[i], ingredientIds[j]);
      if (ix) {
        interactionHits.push({
          interaction: ix,
          productsA: holders.get(ix.ingredientA) ?? [],
          productsB: holders.get(ix.ingredientB) ?? [],
        });
      }
    }
  }
  const cautionHits = interactionHits.filter((h) => h.interaction.severity === 'caution');
  const highHits = interactionHits.filter((h) => h.interaction.severity === 'high_caution');
  const goodHits = interactionHits.filter((h) => h.interaction.severity === 'good');
  if (cautionHits.length || highHits.length) {
    const penalty = Math.min(30, highHits.length * 10 + cautionHits.length * 5);
    const label = [...highHits, ...cautionHits]
      .slice(0, 3)
      .map((h) => `${ingredientName(catalog, h.interaction.ingredientA)}×${ingredientName(catalog, h.interaction.ingredientB)}`)
      .join(', ');
    reasons.push({
      key: 'interaction',
      rule: 6,
      label: '주의가 필요한 성분 조합',
      delta: -penalty,
      detail: `문헌에서 주의가 언급되는 조합 ${highHits.length + cautionHits.length}건(${label}${
        highHits.length + cautionHits.length > 3 ? ' 등' : ''
      })이 루틴 안에 있어요. 아래 상호작용 카드에서 이유와 권장 방식을 확인해보세요.`,
    });
  }
  if (goodHits.length) {
    const bonus = Math.min(6, goodHits.length * 2);
    reasons.push({
      key: 'interaction',
      rule: 6,
      label: '함께 쓰기 좋은 조합',
      delta: bonus,
      detail: `${goodHits
        .slice(0, 3)
        .map((h) => `${ingredientName(catalog, h.interaction.ingredientA)}×${ingredientName(catalog, h.interaction.ingredientB)}`)
        .join(', ')} 처럼 서로 보완한다고 알려진 조합이 ${goodHits.length}건 있어요.`,
    });
  }

  // ---- 7. 구조적 공백
  if (rawLoad > 0 && barrierIds.length === 0) {
    reasons.push({
      key: 'structural-gap',
      rule: 7,
      label: '장벽 지지 성분 없음',
      delta: -8,
      detail: '활성 성분은 있는데 세라마이드·판테놀·센텔라 같은 장벽 지지 성분이 하나도 없어요. 완충 역할을 할 단계를 더하는 편이 권장돼요.',
    });
  }
  if (isAM && rawLoad > 0 && !hasSunscreen) {
    reasons.push({
      key: 'structural-gap',
      rule: 7,
      label: '아침 루틴에 선크림 없음',
      delta: -10,
      detail: '아침 루틴에 활성 성분이 있는데 자외선 차단 단계가 없어요. 레티노이드·산 계열은 광민감성을 높일 수 있어 선크림이 함께 권장돼요.',
    });
  }

  // ---- 8. 향료·에센셜오일 누적 노출
  const fragranceExposure = fragranceIds.reduce((sum, id) => sum + count(id), 0);
  if (fragranceExposure >= 2) {
    let penalty = Math.min(12, 3 * (fragranceExposure - 1));
    let extra = '';
    if (skinType === 'sensitive') {
      penalty += 3;
      extra = ' 민감성 피부는 추가로 -3점을 반영했어요.';
    }
    reasons.push({
      key: 'fragrance',
      rule: 8,
      label: '향료·에센셜오일 누적 노출',
      delta: -penalty,
      detail: `${names(catalog, fragranceIds, 3)} 등 향료 계열 성분에 루틴 전체에서 ${fragranceExposure}번 노출돼요. 접촉 감작 가능성은 누적 노출과 함께 올라갈 수 있어요.${extra}`,
    });
  }

  // ---- 9. 제품/성분 누적 노출 부담
  const productExcess = Math.max(0, products.length - 5);
  const ingredientExcess = Math.max(0, ingredientIds.length - 12);
  if (productExcess > 0 || ingredientExcess > 0) {
    const penalty = Math.round(productExcess * 3 + ingredientExcess * 1.5);
    const parts: string[] = [];
    if (productExcess > 0) parts.push(`제품 ${products.length}개(5개 초과분 ${productExcess}개)`);
    if (ingredientExcess > 0) parts.push(`성분 ${ingredientIds.length}종(12종 초과분 ${ingredientExcess}종)`);
    reasons.push({
      key: 'overexposure',
      rule: 9,
      label: '제품·성분 누적 노출 부담',
      delta: -penalty,
      detail: `${parts.join(', ')}로 한 번에 노출되는 성분 수가 많은 편이에요. 단계가 늘수록 원인 추적도 어려워져요.`,
    });
  }

  // ---- 10. 같은 기능 제품(카테고리) 중복 사용
  const catCount = new Map<string, Product[]>();
  products.forEach((p) => catCount.set(p.category, [...(catCount.get(p.category) ?? []), p]));
  let catPenalty = 0;
  const catDetails: string[] = [];
  catCount.forEach((list, cat) => {
    if (list.length < 2) return;
    const single = SINGLE_STEP_PENALTY[cat as keyof typeof SINGLE_STEP_PENALTY];
    const layering = LAYERING_PENALTY[cat as keyof typeof LAYERING_PENALTY];
    if (single) {
      const p = single * (list.length - 1);
      catPenalty += p;
      catDetails.push(`${cat} ${list.length}개(${list.map((x) => x.name).slice(0, 3).join(', ')}${list.length > 3 ? ' 등' : ''}) -${p}`);
    } else if (layering) {
      const p = Math.min(6, layering * (list.length - 1));
      catPenalty += p;
      catDetails.push(`${cat} ${list.length}개 -${p} (레이어링이 흔한 카테고리라 약하게 반영)`);
    }
  });
  if (catPenalty > 0) {
    const penalty = Math.min(45, catPenalty);
    reasons.push({
      key: 'category-duplicate',
      rule: 10,
      label: '같은 기능 제품 중복',
      delta: -penalty,
      detail: `${catDetails.join(' · ')}. 한 단계에 하나만 쓰는 것이 일반적인 카테고리가 겹치면 흡수 방해와 불필요한 노출이 늘어요.`,
    });
  }

  // ---- 11. 같은 비활성 성분의 불필요한 반복
  const repeatedInactive = ingredientIds.filter((id) => !(ACTIVE_WEIGHTS[id] > 0) && count(id) >= 3);
  if (repeatedInactive.length > 0) {
    const penalty = Math.min(8, repeatedInactive.reduce((sum, id) => sum + (count(id) >= 5 ? 2 : 1), 0));
    reasons.push({
      key: 'inactive-repeat',
      rule: 11,
      label: '같은 성분 반복',
      delta: -penalty,
      detail: `${repeatedInactive
        .slice(0, 3)
        .map((id) => `${ingredientName(catalog, id)} ${count(id)}개`)
        .join(', ')}${repeatedInactive.length > 3 ? ' 등' : ''} — 활성 성분은 아니지만 같은 성분이 여러 제품에 반복돼 겹치는 단계가 있는지 살펴볼 만해요.`,
    });
  }

  // ---- 12. 긍정 구조 보너스 (조건을 실제로 충족했을 때만)
  const bonuses: { delta: number; text: string }[] = [];
  if (barrierIds.length >= 3) bonuses.push({ delta: 4, text: `장벽 지지 성분 ${barrierIds.length}종 충분` });
  else if (barrierIds.length === 2) bonuses.push({ delta: 2, text: '장벽 지지 성분 2종' });
  if (isAM && hasSunscreen) bonuses.push({ delta: 4, text: '아침 루틴에 선크림 보유' });
  if (families.length <= 1 && rawLoad > 0) bonuses.push({ delta: 3, text: '각질 관리 계열이 겹치지 않음' });
  else if (families.length === 0 && rawLoad === 0) bonuses.push({ delta: 2, text: '각질 관리 계열 없음' });
  if (fragranceExposure <= 1) bonuses.push({ delta: 3, text: '향료 노출 적음' });
  if (products.length <= 6) bonuses.push({ delta: 3, text: `제품 수 적정(${products.length}개)` });
  if (bonuses.length > 0) {
    reasons.push({
      key: 'positive-bonus',
      rule: 12,
      label: '긍정 구조 보너스',
      delta: bonuses.reduce((s, b) => s + b.delta, 0),
      detail: bonuses.map((b) => `${b.text} +${b.delta}`).join(' · '),
    });
  }

  const raw = SCORE_BASE + reasons.reduce((sum, r) => sum + r.delta, 0);
  const score = Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));

  return {
    empty: false,
    score,
    summary: summaryForScore(score),
    reasons,
    interactionHits,
    stats: {
      productCount: products.length,
      ingredientCount: ingredientIds.length,
      activeIds,
      activeLoad: round1(rawLoad),
      barrierIds,
      fragranceIds,
      families,
      hasSunscreen,
      hasMoisturizer,
    },
  };
}
