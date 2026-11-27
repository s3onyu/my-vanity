import type { RoutineType, SeparationKind, SourceRef, TimeSlot } from '@/types';
import { resolveSources } from '@/data/sources';
import { josa } from '@/lib/korean';
import { type Catalog, ingredientName } from './catalog';
import { ACTIVE_WEIGHTS } from './constants';
import type { InteractionHit } from './compatibility';

/**
 * 성분을 주로 쓰는 시간대.
 * 비타민C 계열은 아침(자외선 차단제와 함께 쓰면 광보호가 더해진다고 알려져 있어요),
 * 레티노이드·산 계열은 저녁(광민감성을 높일 수 있어요)이 일반적인 배치예요.
 */
export const TIME_PREFERENCE: Record<string, TimeSlot> = {
  'ascorbic-acid': 'AM',
  'ethyl-ascorbic-acid': 'AM',
  'ascorbyl-glucoside': 'AM',
  'sodium-ascorbyl-phosphate': 'AM',
  'ferulic-acid': 'AM',
  tocopherol: 'AM',
  'zinc-oxide': 'AM',
  avobenzone: 'AM',
  retinol: 'PM',
  retinal: 'PM',
  hpr: 'PM',
  'retinyl-palmitate': 'PM',
  bakuchiol: 'PM',
  'glycolic-acid': 'PM',
  'lactic-acid': 'PM',
  'mandelic-acid': 'PM',
  'salicylic-acid': 'PM',
  lha: 'PM',
  gluconolactone: 'PM',
  'lactobionic-acid': 'PM',
  'benzoyl-peroxide': 'AM',
  sulfur: 'PM',
  'azelaic-acid': 'PM',
  urea: 'PM',
  'tea-tree': 'PM',
  'lavender-oil': 'PM',
};

export const timeSlotOf = (id: string): TimeSlot => TIME_PREFERENCE[id] ?? 'any';

export const SLOT_LABEL: Record<RoutineType, string> = { AM: '아침', PM: '저녁' };
export const SLOT_ICON: Record<RoutineType, string> = { AM: '☀️', PM: '🌙' };

export const SEPARATION_META: Record<SeparationKind, { label: string; icon: string }> = {
  time: { label: '시간대를 나눠요', icon: '🕑' },
  day: { label: '날짜를 번갈아요', icon: '📅' },
  order: { label: '순서만 지켜요', icon: '🔢' },
  swap: { label: '하나를 바꿔요', icon: '🔁' },
  none: { label: '그대로 괜찮아요', icon: '✅' },
};

export interface SeparationSlot {
  /** AM/PM 배치, 또는 격일의 A일/B일, 또는 같은 시간대 */
  slot: RoutineType | 'dayA' | 'dayB' | 'same';
  label: string;
  ingredientIds: string[];
  /** 그 성분이 들어 있는 제품명 */
  products: string[];
}

export interface SeparationAdvice {
  interactionId: string;
  kind: SeparationKind;
  severity: InteractionHit['interaction']['severity'];
  /** 한 줄 결론 — 예: "비타민C는 아침, 레티놀은 저녁" */
  headline: string;
  /** 왜 이렇게 나누는지 */
  why: string;
  /** 바로 따라 할 수 있는 순서 */
  steps: string[];
  slots: SeparationSlot[];
  sources: SourceRef[];
}

/**
 * 격일·교체를 안내할 때 "더 센 쪽"을 가린다.
 * 활성 성분 가중치를 그대로 쓰고, 활성이 아니면 향료·알코올 같은 자극 요인에 작은 값을 준다.
 */
const EXTRA_LOAD: Record<string, number> = { fragrance: 1.0, 'lavender-oil': 1.2, 'citrus-oil': 1.2, rose: 0.8 };
/** 피부에 더해 주는 것 없이 자극 요인만 되는 성분 — 조합을 정리할 때 먼저 빼는 쪽 */
const NO_BENEFIT = new Set(['fragrance', 'alcohol-denat', 'lavender-oil', 'citrus-oil', 'rose']);
const loadOf = (id: string) => ACTIVE_WEIGHTS[id] ?? EXTRA_LOAD[id] ?? 0;
/** a 가 b 보다 센가 (같으면 id 순으로 정해서 결과가 항상 같게) */
const isStronger = (a: string, b: string) => (loadOf(a) !== loadOf(b) ? loadOf(a) > loadOf(b) : a > b);

/**
 * 주의 조합 하나를 어떻게 나눠 쓰면 되는지 구체적인 계획으로 바꾼다.
 * 조합 데이터의 separation 값과 성분별 선호 시간대를 합쳐서 "아침에 무엇, 저녁에 무엇"까지 알려준다.
 */
export function separationAdvice(hit: InteractionHit, catalog: Catalog): SeparationAdvice | null {
  const ix = hit.interaction;
  const kind: SeparationKind = ix.separation ?? (ix.severity === 'good' || ix.severity === 'neutral' ? 'none' : 'day');
  if (kind === 'none') return null;

  const a = ix.ingredientA;
  const b = ix.ingredientB;
  const nameA = ingredientName(catalog, a);
  const nameB = ingredientName(catalog, b);
  const sources = resolveSources(ix.sourceIds);
  const base = { interactionId: ix.id, kind, severity: ix.severity, sources };

  if (kind === 'time') {
    // 선호 시간대가 다르면 그대로, 하나만 정해져 있으면 나머지를 반대쪽에 둔다
    let slotA = timeSlotOf(a);
    let slotB = timeSlotOf(b);
    if (slotA === slotB || slotA === 'any' || slotB === 'any') {
      if (slotA !== 'any' && slotA !== 'AM') slotB = 'AM';
      else if (slotA !== 'any') slotB = 'PM';
      else if (slotB !== 'any') slotA = slotB === 'AM' ? 'PM' : 'AM';
      else {
        slotA = 'AM';
        slotB = 'PM';
      }
      if (slotA === slotB) slotA = slotB === 'AM' ? 'PM' : 'AM';
    }
    const amIds = slotA === 'AM' ? [a] : [b];
    const pmIds = slotA === 'AM' ? [b] : [a];
    const amName = slotA === 'AM' ? nameA : nameB;
    const pmName = slotA === 'AM' ? nameB : nameA;
    return {
      ...base,
      headline: `${josa(amName, '은/는')} 아침, ${josa(pmName, '은/는')} 저녁에`,
      why: ix.reason,
      steps: [
        `☀️ 아침 루틴에 ${josa(amName, '이/가')} 든 제품을 두세요${amIds.some((id) => timeSlotOf(id) === 'AM') ? ' (아침에 쓰는 게 일반적인 성분이에요)' : ''}.`,
        `🌙 저녁 루틴에 ${josa(pmName, '이/가')} 든 제품을 두세요.`,
        '두 제품을 같은 시간대에 겹쳐 바르지 않으면 대부분 해결돼요.',
      ],
      slots: [
        { slot: 'AM', label: '☀️ 아침', ingredientIds: amIds, products: amIds[0] === a ? hit.productsA : hit.productsB },
        { slot: 'PM', label: '🌙 저녁', ingredientIds: pmIds, products: pmIds[0] === a ? hit.productsA : hit.productsB },
      ],
    };
  }

  if (kind === 'day') {
    const firstIsA = !isStronger(a, b);
    const firstName = firstIsA ? nameA : nameB;
    const laterName = firstIsA ? nameB : nameA;
    return {
      ...base,
      headline: `${josa(firstName, '과/와')} ${josa(laterName, '을/를')} 하루 걸러 번갈아`,
      why: ix.reason,
      steps: [
        `오늘은 ${josa(firstName, '이/가')} 든 제품만, 내일은 ${josa(laterName, '이/가')} 든 제품만 쓰세요.`,
        '둘 다 저녁 루틴이어도 괜찮아요. 같은 날 겹치지 않는 것이 중요해요.',
        '루틴 카드에서 각 제품의 사용 빈도를 “격일”로 바꿔 두면 오늘 쓸 제품을 자동으로 알려드려요.',
      ],
      slots: [
        { slot: 'dayA', label: '첫째 날', ingredientIds: [firstIsA ? a : b], products: firstIsA ? hit.productsA : hit.productsB },
        { slot: 'dayB', label: '둘째 날', ingredientIds: [firstIsA ? b : a], products: firstIsA ? hit.productsB : hit.productsA },
      ],
    };
  }

  if (kind === 'order') {
    return {
      ...base,
      headline: '같은 시간대에 써도 괜찮아요 — 순서만 지키면 돼요',
      why: ix.reason,
      steps: [
        '묽은 것부터 되직한 것 순서로 바르세요.',
        '아침이라면 자외선 차단제를 가장 마지막에 두세요.',
        '루틴 카드의 “순서 맞추기” 버튼을 누르면 권장 순서로 정렬해 드려요.',
      ],
      slots: [{ slot: 'same', label: '같은 시간대', ingredientIds: [a, b], products: [...hit.productsA, ...hit.productsB] }],
    };
  }

  // swap — 나눠 쓰는 것보다 하나를 바꾸는 편이 나은 조합
  // 향료·알코올처럼 효과 없이 자극만 더하는 쪽이 있으면 그걸 바꾸게 하고,
  // 둘 다 효과가 있는 성분(같은 계열 중복 등)이면 더 센 쪽을 바꾸게 안내한다.
  const dropIsA = NO_BENEFIT.has(a) || (!NO_BENEFIT.has(b) && isStronger(a, b));
  const dropName = dropIsA ? nameA : nameB;
  const keepName = dropIsA ? nameB : nameA;
  return {
    ...base,
    headline: `${josa(dropName, '이/가')} 든 제품을 다른 것으로 바꾸는 편이 나아요`,
    why: ix.reason,
    steps: [
      `${josa(keepName, '은/는')} 그대로 두고, ${josa(dropName, '이/가')} 든 제품을 비슷한 역할의 다른 제품으로 바꿔보세요.`,
      '나눠 쓴다고 해결되는 조합이 아니라, 둘 중 하나를 빼는 쪽이 확실해요.',
      ix.recommendation,
    ],
    slots: [
      { slot: 'same', label: '남길 성분', ingredientIds: [dropIsA ? b : a], products: dropIsA ? hit.productsB : hit.productsA },
      { slot: 'same', label: '바꿀 성분', ingredientIds: [dropIsA ? a : b], products: dropIsA ? hit.productsA : hit.productsB },
    ],
  };
}

/** 루틴 전체의 주의 조합을 한 번에 계획으로 바꾼다 (심한 것부터) */
export function separationPlan(hits: InteractionHit[], catalog: Catalog): SeparationAdvice[] {
  const rank = { high_caution: 0, caution: 1, neutral: 2, good: 3 } as const;
  return hits
    .filter((h) => h.interaction.severity === 'caution' || h.interaction.severity === 'high_caution')
    .sort((x, y) => rank[x.interaction.severity] - rank[y.interaction.severity])
    .map((h) => separationAdvice(h, catalog))
    .filter((a): a is SeparationAdvice => Boolean(a));
}
