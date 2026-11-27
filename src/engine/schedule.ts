import type { Product, RoutineFrequency, RoutineItem, RoutineType } from '@/types';
import { DAY_NAMES, dayOfWeek, daysBetween, todayISO } from '@/lib/date';
import type { Catalog } from './catalog';
import { CATEGORY_STEP } from './constants';

export const DEFAULT_FREQUENCY: RoutineFrequency = { kind: 'daily' };

export const frequencyOf = (item: RoutineItem): RoutineFrequency => item.frequency ?? DEFAULT_FREQUENCY;

/** "매일", "격일", "월·수·금" 처럼 한 줄로 */
export function frequencyLabel(freq: RoutineFrequency): string {
  if (freq.kind === 'daily') return '매일';
  if (freq.kind === 'alt') return '격일';
  if (freq.days.length === 0) return '요일 미선택';
  if (freq.days.length === 7) return '매일';
  return [...freq.days].sort((a, b) => a - b).map((d) => DAY_NAMES[d]).join('·');
}

/** 짧은 설명 — 선택 UI 의 보조 문구 */
export function frequencyHint(freq: RoutineFrequency): string {
  if (freq.kind === 'daily') return '아침/저녁 루틴을 할 때마다 써요';
  if (freq.kind === 'alt') return '사용 시작일부터 하루 걸러 써요. 센 성분을 쉬어가며 쓸 때 좋아요';
  return '고른 요일에만 써요. 주 1~2회 쓰는 각질 관리 제품에 맞아요';
}

/**
 * 그 날짜에 이 제품을 쓰는 날인지.
 * 격일은 사용 시작일 기준이라 날짜만 알면 결과가 항상 같다 (기기·시간에 따라 달라지지 않는다).
 */
export function isScheduled(item: RoutineItem, dateISO: string): boolean {
  const freq = frequencyOf(item);
  if (freq.kind === 'daily') return true;
  if (freq.kind === 'alt') return daysBetween(item.startedAt, dateISO) % 2 === 0;
  return freq.days.includes(dayOfWeek(dateISO));
}

/** 다음으로 쓰는 날 — 오늘이 쓰는 날이면 오늘(0), 아니면 며칠 뒤인지 */
export function daysUntilNext(item: RoutineItem, dateISO: string): number | null {
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(dateISO);
    d.setDate(d.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (isScheduled(item, iso)) return i;
  }
  return null;
}

export interface PlanEntry {
  item: RoutineItem;
  product: Product;
  /** 바르는 순서 (1부터) */
  step: number;
  frequency: RoutineFrequency;
}

export interface SkippedEntry {
  item: RoutineItem;
  product: Product;
  frequency: RoutineFrequency;
  /** 며칠 뒤에 쓰는 날인지 (null = 2주 안에 없음) */
  inDays: number | null;
}

export interface DayPlan {
  date: string;
  /** 오늘 쓰는 제품 — 바르는 순서대로 */
  use: PlanEntry[];
  /** 오늘은 쉬는 제품 */
  skip: SkippedEntry[];
}

export interface TodayPlan {
  date: string;
  AM: DayPlan;
  PM: DayPlan;
}

function planFor(routineType: RoutineType, items: RoutineItem[], date: string, catalog: Catalog): DayPlan {
  const rows = items
    .filter((r) => r.routineType === routineType)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({ item, product: catalog.products.get(item.productId) }))
    .filter((r): r is { item: RoutineItem; product: Product } => Boolean(r.product));

  const use: PlanEntry[] = [];
  const skip: SkippedEntry[] = [];
  rows.forEach(({ item, product }) => {
    const frequency = frequencyOf(item);
    if (isScheduled(item, date)) use.push({ item, product, step: 0, frequency });
    else skip.push({ item, product, frequency, inDays: daysUntilNext(item, date) });
  });
  // 바르는 순서 — 루틴에 담은 순서를 유지하되 카테고리 단계가 어긋나면 그 번호를 그대로 보여준다
  use.forEach((e, i) => {
    e.step = i + 1;
  });
  return { date, use, skip };
}

/** 오늘(또는 지정한 날짜) 아침·저녁에 쓸 제품과 순서 */
export function todayPlan(routines: RoutineItem[], catalog: Catalog, date = todayISO()): TodayPlan {
  return {
    date,
    AM: planFor('AM', routines, date, catalog),
    PM: planFor('PM', routines, date, catalog),
  };
}

/** 순서가 권장 순서와 어긋나는지 (오늘 쓸 제품만 기준으로) */
export function planOutOfOrder(plan: DayPlan): boolean {
  const steps = plan.use.map((e) => CATEGORY_STEP[e.product.category]);
  return steps.some((s, i) => i > 0 && s < steps[i - 1]);
}
