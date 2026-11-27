import { describe, expect, it } from 'vitest';
import type { RoutineItem } from '@/types';
import { CATALOG, PRODUCTS } from '@/data';
import { daysUntilNext, frequencyLabel, isScheduled, planOutOfOrder, todayPlan } from './schedule';

const toner = PRODUCTS.find((p) => p.name === '1025 독도 토너')!;
const cream = PRODUCTS.find((p) => p.category === '크림')!;
const sun = PRODUCTS.find((p) => p.category === '선크림')!;

const item = (over: Partial<RoutineItem> = {}): RoutineItem => ({
  id: 'rt1',
  routineType: 'AM',
  productId: toner.id,
  sortOrder: 0,
  startedAt: '2026-11-02', // 월요일
  ...over,
});

describe('사용 빈도', () => {
  it('빈도를 정하지 않으면 매일 쓰는 것으로 본다', () => {
    const it0 = item();
    expect(isScheduled(it0, '2026-11-02')).toBe(true);
    expect(isScheduled(it0, '2026-11-03')).toBe(true);
    expect(frequencyLabel({ kind: 'daily' })).toBe('매일');
  });

  it('격일은 사용 시작일부터 하루 걸러 — 날짜만 알면 결과가 항상 같다', () => {
    const alt = item({ frequency: { kind: 'alt' } });
    expect(isScheduled(alt, '2026-11-02')).toBe(true);
    expect(isScheduled(alt, '2026-11-03')).toBe(false);
    expect(isScheduled(alt, '2026-11-04')).toBe(true);
    // 시작일 이전도 같은 규칙으로 계산된다
    expect(isScheduled(alt, '2026-11-01')).toBe(false);
    expect(isScheduled(alt, '2026-10-31')).toBe(true);
  });

  it('요일 지정은 고른 요일에만 쓴다', () => {
    const weekly = item({ frequency: { kind: 'weekdays', days: [1, 4] } }); // 월·목
    expect(isScheduled(weekly, '2026-11-02')).toBe(true); // 월
    expect(isScheduled(weekly, '2026-11-03')).toBe(false); // 화
    expect(isScheduled(weekly, '2026-11-05')).toBe(true); // 목
    expect(frequencyLabel({ kind: 'weekdays', days: [4, 1] })).toBe('월·목');
  });

  it('요일을 하나도 고르지 않으면 쓰는 날이 없다', () => {
    const none = item({ frequency: { kind: 'weekdays', days: [] } });
    expect(isScheduled(none, '2026-11-02')).toBe(false);
    expect(daysUntilNext(none, '2026-11-02')).toBeNull();
  });

  it('다음으로 쓰는 날까지 며칠인지 알려준다', () => {
    const alt = item({ frequency: { kind: 'alt' } });
    expect(daysUntilNext(alt, '2026-11-02')).toBe(0);
    expect(daysUntilNext(alt, '2026-11-03')).toBe(1);
    const weekly = item({ frequency: { kind: 'weekdays', days: [0] } }); // 일요일
    expect(daysUntilNext(weekly, '2026-11-02')).toBe(6);
  });
});

describe('오늘 쓸 제품', () => {
  const routines: RoutineItem[] = [
    item({ id: 'a', routineType: 'AM', productId: toner.id, sortOrder: 0 }),
    item({ id: 'b', routineType: 'AM', productId: sun.id, sortOrder: 1 }),
    item({ id: 'c', routineType: 'PM', productId: cream.id, sortOrder: 0, frequency: { kind: 'alt' } }),
  ];

  it('아침·저녁을 나눠 순서대로 돌려준다', () => {
    const plan = todayPlan(routines, CATALOG, '2026-11-02');
    expect(plan.AM.use.map((e) => e.product.id)).toEqual([toner.id, sun.id]);
    expect(plan.AM.use.map((e) => e.step)).toEqual([1, 2]);
    expect(plan.PM.use).toHaveLength(1);
    expect(plan.PM.skip).toHaveLength(0);
  });

  it('오늘 쉬는 제품은 쉬는 목록으로 빠지고 며칠 뒤인지 알려준다', () => {
    const plan = todayPlan(routines, CATALOG, '2026-11-03');
    expect(plan.PM.use).toHaveLength(0);
    expect(plan.PM.skip).toHaveLength(1);
    expect(plan.PM.skip[0].inDays).toBe(1);
  });

  it('쉬는 제품을 빼고 나면 순서는 다시 1번부터 매겨진다', () => {
    const rs: RoutineItem[] = [
      item({ id: 'x', routineType: 'AM', productId: toner.id, sortOrder: 0, frequency: { kind: 'weekdays', days: [] } }),
      item({ id: 'y', routineType: 'AM', productId: sun.id, sortOrder: 1 }),
    ];
    const plan = todayPlan(rs, CATALOG, '2026-11-02');
    expect(plan.AM.use).toHaveLength(1);
    expect(plan.AM.use[0].step).toBe(1);
  });

  it('루틴에 없는 제품 id 는 조용히 건너뛴다', () => {
    const plan = todayPlan([item({ productId: 'nope' })], CATALOG, '2026-11-02');
    expect(plan.AM.use).toEqual([]);
    expect(plan.AM.skip).toEqual([]);
  });

  it('순서가 뒤집혔는지 판단한다', () => {
    const wrong: RoutineItem[] = [
      item({ id: 'p', routineType: 'AM', productId: sun.id, sortOrder: 0 }),
      item({ id: 'q', routineType: 'AM', productId: toner.id, sortOrder: 1 }),
    ];
    expect(planOutOfOrder(todayPlan(wrong, CATALOG, '2026-11-02').AM)).toBe(true);
    expect(planOutOfOrder(todayPlan(routines, CATALOG, '2026-11-02').AM)).toBe(false);
  });
});
