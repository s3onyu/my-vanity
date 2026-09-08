import type { Product, RoutineItem, SkinLog } from '@/types';
import { addDays, dayOfWeek, DAY_NAMES, todayISO } from '@/lib/date';
import type { Catalog } from './catalog';
import { EXFOLIATION_FAMILY, FAMILY_LABEL, type ExfoliationFamily } from './constants';

export type Metric = 'comfort' | 'dryness' | 'oiliness' | 'irritation';

export const METRIC_LABEL: Record<Metric, string> = {
  comfort: '편안함',
  dryness: '건조함',
  oiliness: '번들거림',
  irritation: '자극감',
};

/** 값이 높을수록 좋은 지표인지 (편안함만 true) */
export const METRIC_HIGHER_IS_BETTER: Record<Metric, boolean> = {
  comfort: true,
  dryness: false,
  oiliness: false,
  irritation: false,
};

export interface MetricComparison {
  metric: Metric;
  label: string;
  recent: number | null;
  previous: number | null;
  delta: number | null;
  recentCount: number;
  previousCount: number;
}

export interface SuspectProduct {
  product: Product;
  irritatedRate: number;
  calmRate: number;
  diff: number;
  irritatedDays: number;
  calmDays: number;
}

export interface ProductStartEffect {
  product: Product;
  startedAt: string;
  before: number;
  after: number;
  delta: number;
  beforeCount: number;
  afterCount: number;
}

export interface WeekdayPattern {
  best: { day: string; avg: number };
  worst: { day: string; avg: number };
}

export interface Insights {
  enabled: boolean;
  logCount: number;
  comparisons: MetricComparison[];
  comfortBars: { date: string; value: number | null }[];
  irritationNote: { avg: number; families: ExfoliationFamily[]; familyLabels: string[] } | null;
  drynessNote: { avg: number } | null;
  oilinessNote: { avg: number } | null;
  suspects: SuspectProduct[];
  suspectBasis: { irritatedDays: number; calmDays: number };
  startEffects: ProductStartEffect[];
  weekday: WeekdayPattern | null;
}

const avg = (nums: number[]): number | null =>
  nums.length ? Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10 : null;

const inRange = (date: string, from: string, to: string) => date >= from && date <= to;

/**
 * 피부 기록 인사이트 자동 분석 (명세 5-7).
 * 모든 결과는 상관관계일 뿐 인과관계가 아니다 — UI 에서 고정 문구와 함께 표시한다.
 */
export function analyzeLogs(
  logs: SkinLog[],
  routines: RoutineItem[],
  catalog: Catalog,
  today = todayISO(),
): Insights {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const enabled = sorted.length >= 3;

  // ---- 최근 7일 vs 이전 7일
  const recentFrom = addDays(today, -6);
  const prevFrom = addDays(today, -13);
  const prevTo = addDays(today, -7);
  const recentLogs = sorted.filter((l) => inRange(l.date, recentFrom, today));
  const prevLogs = sorted.filter((l) => inRange(l.date, prevFrom, prevTo));
  const comparisons: MetricComparison[] = (['comfort', 'dryness', 'oiliness', 'irritation'] as Metric[]).map((m) => {
    const recent = avg(recentLogs.map((l) => l[m]));
    const previous = avg(prevLogs.map((l) => l[m]));
    return {
      metric: m,
      label: METRIC_LABEL[m],
      recent,
      previous,
      delta: recent !== null && previous !== null ? Math.round((recent - previous) * 10) / 10 : null,
      recentCount: recentLogs.length,
      previousCount: prevLogs.length,
    };
  });

  // ---- 14일 편안함 막대
  const byDate = new Map(sorted.map((l) => [l.date, l]));
  const comfortBars = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i - 13);
    return { date, value: byDate.get(date)?.comfort ?? null };
  });

  // ---- 자극감 / 건조함 / 번들거림 평균 (최근 7일, 없으면 전체)
  const basis = recentLogs.length >= 2 ? recentLogs : sorted;
  const irritationAvg = avg(basis.map((l) => l.irritation));
  const drynessAvg = avg(basis.map((l) => l.dryness));
  const oilinessAvg = avg(basis.map((l) => l.oiliness));

  let irritationNote: Insights['irritationNote'] = null;
  if (irritationAvg !== null && irritationAvg >= 3) {
    const families = new Set<ExfoliationFamily>();
    routines.forEach((r) => {
      catalog.products.get(r.productId)?.keyIngredients.forEach((i) => {
        const f = EXFOLIATION_FAMILY[i];
        if (f) families.add(f);
      });
    });
    const list = [...families];
    irritationNote = { avg: irritationAvg, families: list, familyLabels: list.map((f) => FAMILY_LABEL[f]) };
  }
  const drynessNote = drynessAvg !== null && drynessAvg >= 3.5 ? { avg: drynessAvg } : null;
  const oilinessNote = oilinessAvg !== null && oilinessAvg >= 3.5 ? { avg: oilinessAvg } : null;

  // ---- 자극 있던 날 vs 편안했던 날의 제품 등장 비율 차이
  const irritated = sorted.filter((l) => l.irritation >= 4);
  const calm = sorted.filter((l) => l.irritation <= 2 && l.comfort >= 4);
  const suspects: SuspectProduct[] = [];
  if (irritated.length >= 2 && calm.length >= 2) {
    const ids = new Set<string>();
    sorted.forEach((l) => l.products.forEach((p) => ids.add(p)));
    ids.forEach((pid) => {
      const product = catalog.products.get(pid);
      if (!product) return;
      const irritatedDays = irritated.filter((l) => l.products.includes(pid)).length;
      const calmDays = calm.filter((l) => l.products.includes(pid)).length;
      const irritatedRate = irritatedDays / irritated.length;
      const calmRate = calmDays / calm.length;
      const diff = irritatedRate - calmRate;
      if (irritatedDays >= 2 && diff >= 0.4) {
        suspects.push({ product, irritatedRate, calmRate, diff, irritatedDays, calmDays });
      }
    });
    suspects.sort((a, b) => b.diff - a.diff);
  }

  // ---- 특정 제품 사용 시작 후 편안함 변화
  const startEffects: ProductStartEffect[] = [];
  const seen = new Set<string>();
  routines.forEach((r) => {
    if (seen.has(r.productId)) return;
    seen.add(r.productId);
    const product = catalog.products.get(r.productId);
    if (!product) return;
    const before = sorted.filter((l) => l.date < r.startedAt).map((l) => l.comfort);
    const after = sorted.filter((l) => l.date >= r.startedAt).map((l) => l.comfort);
    if (before.length >= 2 && after.length >= 2) {
      const b = avg(before)!;
      const a = avg(after)!;
      startEffects.push({
        product,
        startedAt: r.startedAt,
        before: b,
        after: a,
        delta: Math.round((a - b) * 10) / 10,
        beforeCount: before.length,
        afterCount: after.length,
      });
    }
  });
  startEffects.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  // ---- 요일별 편안함 패턴
  let weekday: WeekdayPattern | null = null;
  const groups = new Map<number, number[]>();
  sorted.forEach((l) => {
    const d = dayOfWeek(l.date);
    groups.set(d, [...(groups.get(d) ?? []), l.comfort]);
  });
  const eligible = [...groups.entries()].filter(([, v]) => v.length >= 2).map(([d, v]) => ({ day: DAY_NAMES[d], avg: avg(v)! }));
  if (eligible.length >= 3) {
    const best = eligible.reduce((m, x) => (x.avg > m.avg ? x : m));
    const worst = eligible.reduce((m, x) => (x.avg < m.avg ? x : m));
    if (best.avg - worst.avg >= 0.8) weekday = { best, worst };
  }

  return {
    enabled,
    logCount: sorted.length,
    comparisons,
    comfortBars,
    irritationNote,
    drynessNote,
    oilinessNote,
    suspects: suspects.slice(0, 3),
    suspectBasis: { irritatedDays: irritated.length, calmDays: calm.length },
    startEffects: startEffects.slice(0, 3),
    weekday,
  };
}
