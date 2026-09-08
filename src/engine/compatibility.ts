import type { IngredientInteraction, Product, RoutineType, SkinType } from '@/types';
import { SKIN_TYPE_LABEL } from '@/data/concerns';
import { josa } from '@/lib/korean';
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

export type ReasonImpact = 'big' | 'medium' | 'small';

export interface ScoreReason {
  key: ReasonKey;
  /** 명세의 1~12번 항목 번호 */
  rule: number;
  /** 기술적 항목명 (자세한 계산 보기용) */
  label: string;
  /** 양수 = 가점, 음수 = 감점 */
  delta: number;
  /** 기술적 설명 — 어떤 수치를 어떻게 합산했는지 */
  detail: string;
  /** 누구나 읽을 수 있는 제목 (예: "크림을 5개나 겹쳐 발라요") */
  title: string;
  /** 왜 점수가 움직였는지 한두 문장, 쉬운 말로 */
  why: string;
  /** 바로 해볼 수 있는 제안 */
  tip: string | null;
  /** 점수 영향 크기 */
  impact: ReasonImpact;
  /** 대표 이모지 */
  emoji: string;
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
  /** 한눈에 보기 — 가장 큰 감점·가점을 쉬운 말로 */
  headline: string[];
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
const impactOf = (delta: number): ReasonImpact => (Math.abs(delta) >= 15 ? 'big' : Math.abs(delta) >= 6 ? 'medium' : 'small');

export function summaryForScore(score: number): string {
  if (score >= 88) return '편안하게 쓸 수 있는 조합이에요. 자극 성분은 적고 진정 성분은 넉넉해요';
  if (score >= 75) return '균형이 좋은 편이에요. 한두 가지만 다듬으면 더 편안해질 수 있어요';
  if (score >= 60) return '무난하지만 겹치는 부분이 있어요. 아래에서 어떤 점인지 확인해보세요';
  if (score >= 40) return '조합을 조정해볼 만해요. 깎인 이유가 여러 개 겹쳐 있어요';
  return '우선순위를 정해보세요. 센 성분이나 같은 역할 제품이 너무 많이 겹쳐요';
}

export const EMPTY_RESULT: CompatibilityResult = {
  empty: true,
  score: 0,
  summary: '루틴에 제품을 담으면 궁합 점수를 계산해요',
  headline: [],
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

type ReasonInput = Omit<ScoreReason, 'impact'>;

/**
 * 성분 궁합 분석 엔진.
 * 명세 5-2 의 1~12번 규칙을 순서대로 적용하고, 실제로 적용된 규칙만 reasons 에 남긴다.
 * 각 근거는 기술적 설명(detail)과 함께 누구나 읽을 수 있는 제목·이유·팁(title/why/tip)을 가진다.
 */
export function analyzeRoutine(input: CompatibilityInput, catalog: Catalog): CompatibilityResult {
  const products = input.productIds
    .map((id) => catalog.products.get(id))
    .filter((p): p is Product => Boolean(p));
  if (products.length === 0) return EMPTY_RESULT;

  const reasons: ScoreReason[] = [];
  const push = (r: ReasonInput) => reasons.push({ ...r, impact: impactOf(r.delta) });
  const skinType = input.skinType;
  const isAM = input.routineType === 'AM';
  const routineLabel = isAM ? '아침' : '저녁';

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
    const strong = rawLoad >= 5;
    push({
      key: 'active-load',
      rule: 1,
      label: '활성 성분 누적 부담',
      delta: -Math.round(base),
      detail: `활성 성분 ${activeIds.length}종(${names(catalog, activeIds, 4)})의 자극 가중치를 합산했어요 (부담 지수 ${round1(rawLoad)}).`,
      emoji: '🔥',
      title: activeIds.length === 1 ? `효과가 센 성분이 하나 있어요 (${names(catalog, activeIds, 1)})` : `효과가 센 성분이 ${activeIds.length}개 있어요`,
      why: `${names(catalog, activeIds, 3)}처럼 효과가 센 성분은 피부를 예민하게 만들 수 있어서, ${
        strong ? '한 루틴에 이만큼 모이면 부담이 꽤 커요.' : '있는 만큼 조금 깎았어요.'
      }`,
      tip: strong ? '센 성분은 하루에 한 가지만, 나머지는 다른 날이나 다른 시간대에 써보세요.' : '처음엔 격일로 시작해 피부가 익숙해지면 늘려가세요.',
    });

    // ---- 2. 피부 타입 보정
    const mult = skinType ? SKIN_MULTIPLIER[skinType] : 1;
    if (mult > 1) {
      const extra = Math.round(base * (mult - 1));
      push({
        key: 'skin-type',
        rule: 2,
        label: '피부 타입 보정',
        delta: -extra,
        detail: `${SKIN_TYPE_LABEL[skinType!]} 피부는 활성 성분 부담에 ×${mult} 가중치를 적용해요.`,
        emoji: skinType === 'sensitive' ? '🌸' : '🍂',
        title: `${SKIN_TYPE_LABEL[skinType!]} 피부라 조금 더 조심해서 봤어요`,
        why:
          skinType === 'sensitive'
            ? '같은 성분이라도 민감한 피부에는 자극이 더 크게 느껴질 수 있어서 위 항목을 조금 더 깎았어요.'
            : '건조한 피부는 센 성분에 더 쉽게 당기고 각질이 일어나서 위 항목을 조금 더 깎았어요.',
        tip: '새 제품은 귀 뒤나 턱선에 먼저 조금 발라 하루 정도 반응을 확인해보세요.',
      });
    }

    // ---- 3. 장벽 지지 완화
    if (barrierIds.length > 0) {
      const perIngredient = skinType === 'sensitive' ? 1.2 : 1.8;
      const totalPenalty = base * mult;
      const relief = Math.round(Math.min(totalPenalty * 0.6, Math.min(barrierIds.length, 6) * perIngredient));
      if (relief > 0) {
        push({
          key: 'barrier-relief',
          rule: 3,
          label: '장벽 지지 완화',
          delta: relief,
          detail: `${names(catalog, barrierIds, 4)} 등 장벽 지지 성분 ${barrierIds.length}종이 활성 성분 부담을 일부 완화해요${
            skinType === 'sensitive' ? ' (민감성 피부는 완화 폭을 작게 반영)' : ''
          }.`,
          emoji: '🛡️',
          title: '달래주는 성분이 자극을 덜어줘요',
          why: `${names(catalog, barrierIds, 3)} 같은 성분은 피부를 보호하고 진정시켜서, 센 성분의 부담을 줄이는 데 도움이 돼요.${
            skinType === 'sensitive' ? ' 민감성 피부는 완화 효과를 조금만 반영했어요.' : ''
          }`,
          tip: '센 성분을 쓰는 날엔 이런 제품으로 마무리하면 더 편안해요.',
        });
      }
    }
  }

  // ---- 4. 각질 관리 계열 중복 (mechanism stacking)
  if (families.length >= 2) {
    const penalty = Math.round(7 * (families.length - 1) * (skinType === 'sensitive' ? 1.3 : 1));
    const familyText = families.map((f) => FAMILY_LABEL[f]).join(' + ');
    push({
      key: 'mechanism-stacking',
      rule: 4,
      label: '각질 관리 계열 중복',
      delta: -penalty,
      detail: `${familyText} 처럼 서로 다른 각질 관리 계열이 한 루틴에 겹쳐 있어요. 각질 용해·리뉴얼 작용이 중첩되면 자극이 누적될 수 있어요.`,
      emoji: '🧅',
      title: '각질을 벗겨내는 성분이 겹쳐요',
      why: `레티놀, AHA, BHA, PHA는 모두 각질을 정리하는 성분이라 두 종류 이상 함께 쓰면 따갑거나 붉어지기 쉬워요. 지금은 ${familyText}가 같이 있어요.`,
      tip: '한 가지만 남기고 나머지는 다른 날에 쓰거나, 아침/저녁으로 나눠보세요.',
    });
  }

  // ---- 5. 동일 활성 성분의 여러 제품 중복
  const repeatedActives = activeIds.filter((id) => count(id) >= 3);
  if (repeatedActives.length > 0) {
    const penalty = Math.min(
      15,
      repeatedActives.reduce((sum, id) => sum + 5 + Math.max(0, count(id) - 3) * 2, 0),
    );
    const first = repeatedActives[0];
    push({
      key: 'active-repeat',
      rule: 5,
      label: '같은 활성 성분 반복',
      delta: -penalty,
      detail: repeatedActives
        .map((id) => `${ingredientName(catalog, id)}이(가) ${count(id)}개 제품(${holders.get(id)!.slice(0, 3).join(', ')})에 반복돼요`)
        .join('. '),
      emoji: '🔁',
      title: `${josa(ingredientName(catalog, first), '이/가')} ${count(first)}개 제품에 들어 있어요`,
      why: '센 성분을 여러 제품으로 겹쳐 바르면 한 번에 닿는 양이 늘어 자극이 쌓여요.',
      tip: '그 성분이 든 제품은 하나만 남겨도 충분해요.',
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
  const pairText = (hits: InteractionHit[]) =>
    hits
      .slice(0, 2)
      .map((h) => `${ingredientName(catalog, h.interaction.ingredientA)}과 ${ingredientName(catalog, h.interaction.ingredientB)}`)
      .join(', ');
  const cautionHits = interactionHits.filter((h) => h.interaction.severity === 'caution');
  const highHits = interactionHits.filter((h) => h.interaction.severity === 'high_caution');
  const goodHits = interactionHits.filter((h) => h.interaction.severity === 'good');
  if (cautionHits.length || highHits.length) {
    const penalty = Math.min(30, highHits.length * 10 + cautionHits.length * 5);
    const all = [...highHits, ...cautionHits];
    push({
      key: 'interaction',
      rule: 6,
      label: '주의가 필요한 성분 조합',
      delta: -penalty,
      detail: `문헌에서 주의가 언급되는 조합 ${all.length}건(${all
        .slice(0, 3)
        .map((h) => `${ingredientName(catalog, h.interaction.ingredientA)}×${ingredientName(catalog, h.interaction.ingredientB)}`)
        .join(', ')}${all.length > 3 ? ' 등' : ''})이 루틴 안에 있어요.`,
      emoji: '⚠️',
      title: all.length === 1 ? '같이 쓰면 주의하라고 알려진 조합이 하나 있어요' : `같이 쓰면 주의하라고 알려진 조합이 ${all.length}개 있어요`,
      why: `${josa(`${pairText(all)}${all.length > 2 ? ' 등' : ''}`, '은/는')} 함께 쓰면 자극이 커지거나 효과가 줄 수 있다고 알려져 있어요.`,
      tip: '아래 "같이 쓸 때 주의할 조합" 카드에서 나눠 쓰는 방법을 확인해보세요.',
    });
  }
  if (goodHits.length) {
    const bonus = Math.min(6, goodHits.length * 2);
    push({
      key: 'interaction',
      rule: 6,
      label: '함께 쓰기 좋은 조합',
      delta: bonus,
      detail: `${goodHits
        .slice(0, 3)
        .map((h) => `${ingredientName(catalog, h.interaction.ingredientA)}×${ingredientName(catalog, h.interaction.ingredientB)}`)
        .join(', ')} 처럼 서로 보완한다고 알려진 조합이 ${goodHits.length}건 있어요.`,
      emoji: '🤝',
      title: goodHits.length === 1 ? '서로 도와주는 조합이 있어요' : `서로 도와주는 조합이 ${goodHits.length}개 있어요`,
      why: `${josa(`${pairText(goodHits)}${goodHits.length > 2 ? ' 등' : ''}`, '은/는')} 함께 쓰면 서로 안정시키거나 효과를 보완한다고 알려져 있어요.`,
      tip: null,
    });
  }

  // ---- 7. 구조적 공백
  if (rawLoad > 0 && barrierIds.length === 0) {
    push({
      key: 'structural-gap',
      rule: 7,
      label: '장벽 지지 성분 없음',
      delta: -8,
      detail: '활성 성분은 있는데 세라마이드·판테놀·센텔라 같은 장벽 지지 성분이 하나도 없어요.',
      emoji: '🕳️',
      title: '달래주는 성분이 하나도 없어요',
      why: '센 성분만 있고 피부를 보호·진정시키는 성분이 없으면 자극을 완충하기 어려워요.',
      tip: '세라마이드나 판테놀이 든 크림을 루틴 마지막에 더해보세요.',
    });
  }
  if (isAM && rawLoad > 0 && !hasSunscreen) {
    push({
      key: 'structural-gap',
      rule: 7,
      label: '아침 루틴에 선크림 없음',
      delta: -10,
      detail: '아침 루틴에 활성 성분이 있는데 자외선 차단 단계가 없어요. 레티노이드·산 계열은 광민감성을 높일 수 있어요.',
      emoji: '☀️',
      title: '아침인데 선크림이 없어요',
      why: '레티놀이나 산 성분을 쓴 날은 햇빛에 더 예민해져서 자외선 차단이 특히 중요해요.',
      tip: '아침 루틴 마지막 단계에 선크림을 넣어주세요.',
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
    push({
      key: 'fragrance',
      rule: 8,
      label: '향료·에센셜오일 누적 노출',
      delta: -penalty,
      detail: `${names(catalog, fragranceIds, 3)} 등 향료 계열 성분에 루틴 전체에서 ${fragranceExposure}번 노출돼요.${extra}`,
      emoji: '🌸',
      title: `향료·오일 성분이 ${fragranceExposure}번 겹쳐요`,
      why: `${names(catalog, fragranceIds, 2)} 같은 향 성분은 은근히 쌓이다가 어느 날 갑자기 따갑거나 붉어질 수 있어요.${
        skinType === 'sensitive' ? ' 민감성 피부라 조금 더 깎았어요.' : ''
      }`,
      tip: '향이 있는 제품은 하나만 남기고 무향 제품으로 바꿔보세요.',
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
    push({
      key: 'overexposure',
      rule: 9,
      label: '제품·성분 누적 노출 부담',
      delta: -penalty,
      detail: `${parts.join(', ')}로 한 번에 노출되는 성분 수가 많은 편이에요.`,
      emoji: '📚',
      title: productExcess > 0 ? `한 번에 바르는 제품이 ${products.length}개로 많아요` : `성분 종류가 ${ingredientIds.length}종으로 많아요`,
      why: '단계가 많을수록 피부에 닿는 성분도 많아지고, 문제가 생겼을 때 어떤 제품 때문인지 찾기 어려워져요.',
      tip: '3~5단계면 충분해요. 역할이 비슷한 제품은 하나로 줄여보세요.',
    });
  }

  // ---- 10. 같은 기능 제품(카테고리) 중복 사용
  const catCount = new Map<string, Product[]>();
  products.forEach((p) => catCount.set(p.category, [...(catCount.get(p.category) ?? []), p]));
  let catPenalty = 0;
  const catDetails: string[] = [];
  const singleDupes: { cat: string; n: number }[] = [];
  const layerDupes: { cat: string; n: number }[] = [];
  catCount.forEach((list, cat) => {
    if (list.length < 2) return;
    const single = SINGLE_STEP_PENALTY[cat as keyof typeof SINGLE_STEP_PENALTY];
    const layering = LAYERING_PENALTY[cat as keyof typeof LAYERING_PENALTY];
    if (single) {
      const p = single * (list.length - 1);
      catPenalty += p;
      singleDupes.push({ cat, n: list.length });
      catDetails.push(`${cat} ${list.length}개(${list.map((x) => x.name).slice(0, 3).join(', ')}${list.length > 3 ? ' 등' : ''}) -${p}`);
    } else if (layering) {
      const p = Math.min(6, layering * (list.length - 1));
      catPenalty += p;
      layerDupes.push({ cat, n: list.length });
      catDetails.push(`${cat} ${list.length}개 -${p} (레이어링이 흔한 카테고리라 약하게 반영)`);
    }
  });
  if (catPenalty > 0) {
    const penalty = Math.min(45, catPenalty);
    const main = singleDupes.sort((a, b) => b.n - a.n)[0];
    const layer = layerDupes.sort((a, b) => b.n - a.n)[0];
    push({
      key: 'category-duplicate',
      rule: 10,
      label: '같은 기능 제품 중복',
      delta: -penalty,
      detail: `${catDetails.join(' · ')}. 한 단계에 하나만 쓰는 것이 일반적인 카테고리가 겹치면 흡수 방해와 불필요한 노출이 늘어요.`,
      emoji: '🫙',
      title: main ? `${josa(main.cat, '을/를')} ${main.n}개나 겹쳐 발라요` : `${josa(layer!.cat, '을/를')} ${layer!.n}개 겹쳐 발라요`,
      why: main
        ? `${main.cat}처럼 마무리 역할을 하는 제품은 하나면 충분해요. 여러 개 겹치면 잘 스며들지 않고 답답해질 뿐 효과는 더해지지 않아요.${
            layer ? ` ${layer.cat}도 ${layer.n}개 겹치지만 여러 겹 바르는 게 흔해서 조금만 반영했어요.` : ''
          }`
        : `${josa(layer!.cat, '은/는')} 여러 겹 바르는 경우가 흔해서 조금만 깎았어요. 그래도 역할이 겹치는지 한 번 살펴보세요.`,
      tip: main ? `${josa(main.cat, '은/는')} 가장 마음에 드는 하나만 남기고, 나머지는 다른 날이나 다른 시간대에 써보세요.` : '역할이 같은 제품은 하나로 줄여도 충분해요.',
    });
  }

  // ---- 11. 같은 비활성 성분의 불필요한 반복
  const repeatedInactive = ingredientIds.filter((id) => !(ACTIVE_WEIGHTS[id] > 0) && count(id) >= 3);
  if (repeatedInactive.length > 0) {
    const penalty = Math.min(8, repeatedInactive.reduce((sum, id) => sum + (count(id) >= 5 ? 2 : 1), 0));
    const first = repeatedInactive[0];
    push({
      key: 'inactive-repeat',
      rule: 11,
      label: '같은 성분 반복',
      delta: -penalty,
      detail: `${repeatedInactive
        .slice(0, 3)
        .map((id) => `${ingredientName(catalog, id)} ${count(id)}개`)
        .join(', ')}${repeatedInactive.length > 3 ? ' 등' : ''} — 활성 성분은 아니지만 같은 성분이 여러 제품에 반복돼요.`,
      emoji: '🔂',
      title: `${josa(ingredientName(catalog, first), '이/가')} ${count(first)}개 제품에 반복돼요`,
      why: '순한 성분이라 크게 문제되진 않지만, 비슷한 역할의 제품이 겹쳐 있다는 신호예요.',
      tip: '역할이 같은 제품은 하나로 줄여도 돼요. 살짝만 깎았어요.',
    });
  }

  // ---- 12. 긍정 구조 보너스 (조건을 실제로 충족했을 때만)
  const bonuses: { delta: number; text: string; plain: string }[] = [];
  if (barrierIds.length >= 3) bonuses.push({ delta: 4, text: `장벽 지지 성분 ${barrierIds.length}종 충분`, plain: `달래주는 성분이 ${barrierIds.length}종으로 넉넉해요` });
  else if (barrierIds.length === 2) bonuses.push({ delta: 2, text: '장벽 지지 성분 2종', plain: '달래주는 성분이 2종 있어요' });
  if (isAM && hasSunscreen) bonuses.push({ delta: 4, text: '아침 루틴에 선크림 보유', plain: '아침에 선크림을 챙겼어요' });
  if (families.length <= 1 && rawLoad > 0) bonuses.push({ delta: 3, text: '각질 관리 계열이 겹치지 않음', plain: '각질을 벗겨내는 성분이 겹치지 않아요' });
  else if (families.length === 0 && rawLoad === 0) bonuses.push({ delta: 2, text: '각질 관리 계열 없음', plain: '각질을 벗겨내는 성분이 없어 순해요' });
  if (fragranceExposure <= 1) bonuses.push({ delta: 3, text: '향료 노출 적음', plain: '향료가 거의 없어요' });
  if (products.length <= 6) bonuses.push({ delta: 3, text: `제품 수 적정(${products.length}개)`, plain: `제품 수가 ${products.length}개로 적당해요` });
  if (bonuses.length > 0) {
    push({
      key: 'positive-bonus',
      rule: 12,
      label: '긍정 구조 보너스',
      delta: bonuses.reduce((s, b) => s + b.delta, 0),
      detail: bonuses.map((b) => `${b.text} +${b.delta}`).join(' · '),
      emoji: '👍',
      title: '루틴의 기본기가 잘 잡혀 있어요',
      why: bonuses.map((b) => b.plain).join(', ') + '.',
      tip: null,
    });
  }

  const raw = SCORE_BASE + reasons.reduce((sum, r) => sum + r.delta, 0);
  const score = Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));

  // ---- 한눈에 보기
  const headline: string[] = [];
  const worst = [...reasons].filter((r) => r.delta < 0).sort((a, b) => a.delta - b.delta)[0];
  const best = [...reasons].filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta)[0];
  if (worst) headline.push(`가장 크게 깎인 이유: ${worst.title}`);
  if (best) headline.push(`점수를 지켜준 것: ${best.title}`);
  if (!worst) headline.push(`${routineLabel} 루틴에서 깎을 만한 점을 찾지 못했어요`);

  return {
    empty: false,
    score,
    summary: summaryForScore(score),
    headline,
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
