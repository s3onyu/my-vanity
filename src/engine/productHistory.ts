import type { Product, RoutineItem, RoutineType, SkinLog } from '@/types';
import { daysBetween, todayISO } from '@/lib/date';
import type { Catalog } from './catalog';
import { METRIC_HIGHER_IS_BETTER, METRIC_LABEL, type Metric } from './insights';

const METRICS: Metric[] = ['comfort', 'dryness', 'oiliness', 'irritation'];

const avg = (xs: number[]): number | null => (xs.length ? Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 10) / 10 : null);

export interface ProductHistory {
  product: Product;
  /** 루틴에 담은 날 (여러 루틴에 있으면 가장 이른 날) */
  startedAt: string | null;
  /** 어느 루틴에 담겨 있는지 */
  routineTypes: RoutineType[];
  /** 담은 날부터 오늘까지 며칠째 */
  usageDays: number | null;
  /** 이 제품을 썼다고 체크한 기록 수 */
  logCount: number;
  /** 기록을 남긴 첫 날 / 마지막 날 */
  firstLogDate: string | null;
  lastLogDate: string | null;
  /** 지표별 평균 (기록이 없으면 null) */
  averages: Record<Metric, number | null>;
  /** 자극감 4점 이상이었던 기록 수 */
  irritatedCount: number;
  /** 이 제품을 쓴 기록 vs 쓰지 않은 기록의 편안함 차이 */
  comfortVsOthers: number | null;
  /** 루틴에 담기 전 / 담은 뒤 편안함 */
  beforeAfter: { before: number; after: number; delta: number; beforeCount: number; afterCount: number } | null;
}

export interface ProductHistoryResult {
  histories: ProductHistory[];
  /** 기록이 하나라도 있는 제품 수 */
  withLogs: number;
  totalLogs: number;
}

/**
 * 제품별 사용 기록 (요청 3번).
 * "언제부터 썼고, 쓴 날의 피부 반응은 어땠는지"를 제품 단위로 모아 여러 제품을 나란히 비교할 수 있게 만든다.
 * 상관관계일 뿐 인과관계가 아니므로 화면에서 반드시 안내 문구와 함께 보여준다.
 */
export function buildProductHistories(
  logs: SkinLog[],
  routines: RoutineItem[],
  catalog: Catalog,
  today = todayISO(),
): ProductHistoryResult {
  // 후보 제품 = 루틴에 담긴 제품 + 기록에 등장한 제품
  const ids = new Set<string>();
  routines.forEach((r) => ids.add(r.productId));
  logs.forEach((l) => l.products.forEach((p) => ids.add(p)));

  const histories: ProductHistory[] = [];
  ids.forEach((id) => {
    const product = catalog.products.get(id);
    if (!product) return;
    const items = routines.filter((r) => r.productId === id);
    const startedAt = items.length ? items.map((r) => r.startedAt).sort()[0] : null;
    const mine = logs.filter((l) => l.products.includes(id));
    const others = logs.filter((l) => !l.products.includes(id));
    const dates = mine.map((l) => l.date).sort();

    const averages = Object.fromEntries(METRICS.map((m) => [m, avg(mine.map((l) => l[m]))])) as Record<Metric, number | null>;
    const myComfort = avg(mine.map((l) => l.comfort));
    const otherComfort = avg(others.map((l) => l.comfort));

    let beforeAfter: ProductHistory['beforeAfter'] = null;
    if (startedAt) {
      const before = logs.filter((l) => l.date < startedAt);
      const after = logs.filter((l) => l.date >= startedAt && l.products.includes(id));
      const b = avg(before.map((l) => l.comfort));
      const a = avg(after.map((l) => l.comfort));
      if (b !== null && a !== null && before.length >= 2 && after.length >= 2) {
        beforeAfter = {
          before: b,
          after: a,
          delta: Math.round((a - b) * 10) / 10,
          beforeCount: before.length,
          afterCount: after.length,
        };
      }
    }

    histories.push({
      product,
      startedAt,
      routineTypes: [...new Set(items.map((r) => r.routineType))].sort(),
      usageDays: startedAt ? Math.max(1, daysBetween(startedAt, today) + 1) : null,
      logCount: mine.length,
      firstLogDate: dates[0] ?? null,
      lastLogDate: dates[dates.length - 1] ?? null,
      averages,
      irritatedCount: mine.filter((l) => l.irritation >= 4).length,
      comfortVsOthers:
        myComfort !== null && otherComfort !== null && others.length >= 2 ? Math.round((myComfort - otherComfort) * 10) / 10 : null,
      beforeAfter,
    });
  });

  // 기록이 많은 제품을 먼저, 그다음 최근에 담은 제품
  histories.sort(
    (a, b) => b.logCount - a.logCount || (b.startedAt ?? '').localeCompare(a.startedAt ?? '') || a.product.name.localeCompare(b.product.name, 'ko'),
  );

  return { histories, withLogs: histories.filter((h) => h.logCount > 0).length, totalLogs: logs.length };
}

export type SortKey = 'logs' | 'comfort' | 'irritation' | 'started';

export function sortHistories(list: ProductHistory[], key: SortKey): ProductHistory[] {
  const num = (v: number | null, fallback: number) => (v === null ? fallback : v);
  const copy = [...list];
  if (key === 'comfort') copy.sort((a, b) => num(b.averages.comfort, -1) - num(a.averages.comfort, -1));
  else if (key === 'irritation') copy.sort((a, b) => num(b.averages.irritation, -1) - num(a.averages.irritation, -1));
  else if (key === 'started') copy.sort((a, b) => (b.startedAt ?? '').localeCompare(a.startedAt ?? ''));
  else copy.sort((a, b) => b.logCount - a.logCount);
  return copy;
}

export interface ComparisonRow {
  metric: Metric;
  label: string;
  higherIsBetter: boolean;
  values: (number | null)[];
  /** 이 지표에서 가장 좋은 제품의 인덱스 (동점·자료 부족이면 null) */
  bestIndex: number | null;
}

/** 고른 제품들을 지표별로 나란히 비교 — 표로 바로 그릴 수 있는 형태 */
export function compareHistories(selected: ProductHistory[]): ComparisonRow[] {
  return METRICS.map((metric) => {
    const higherIsBetter = METRIC_HIGHER_IS_BETTER[metric];
    const values = selected.map((h) => h.averages[metric]);
    const usable = values.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v !== null);
    let bestIndex: number | null = null;
    if (usable.length >= 2) {
      const best = usable.reduce((acc, cur) => {
        if (higherIsBetter) return cur.v > acc.v ? cur : acc;
        return cur.v < acc.v ? cur : acc;
      });
      // 같은 값이 여러 개면 승자를 정하지 않는다
      if (usable.filter((x) => x.v === best.v).length === 1) bestIndex = best.i;
    }
    return { metric, label: METRIC_LABEL[metric], higherIsBetter, values, bestIndex };
  });
}
