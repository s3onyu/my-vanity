import { describe, expect, it } from 'vitest';
import type { RoutineItem, SkinLog } from '@/types';
import { CATALOG, PRODUCTS } from '@/data';
import { buildProductHistories, compareHistories, sortHistories } from './productHistory';

const a = PRODUCTS.find((p) => p.name === '1025 독도 토너')!;
const b = PRODUCTS.find((p) => p.category === '크림')!;

const log = (date: string, products: string[], over: Partial<SkinLog> = {}): SkinLog => ({
  id: `log-${date}-${over.period ?? 'PM'}`,
  date,
  period: 'PM',
  products,
  comfort: 3,
  dryness: 3,
  oiliness: 3,
  irritation: 1,
  memo: '',
  ...over,
});

const routines: RoutineItem[] = [
  { id: 'r1', routineType: 'AM', productId: a.id, sortOrder: 0, startedAt: '2026-10-01' },
  { id: 'r2', routineType: 'PM', productId: a.id, sortOrder: 0, startedAt: '2026-10-05' },
  { id: 'r3', routineType: 'PM', productId: b.id, sortOrder: 1, startedAt: '2026-10-20' },
];

describe('제품별 사용 기록', () => {
  const logs: SkinLog[] = [
    log('2026-10-21', [a.id, b.id], { comfort: 4, irritation: 1 }),
    log('2026-10-22', [a.id, b.id], { comfort: 5, irritation: 1 }),
    log('2026-10-23', [a.id], { comfort: 3, irritation: 4 }),
    log('2026-10-24', [a.id], { comfort: 2, irritation: 5 }),
  ];
  const { histories, withLogs, totalLogs } = buildProductHistories(logs, routines, CATALOG, '2026-10-25');

  it('루틴에 담긴 제품과 기록에 등장한 제품을 모두 모은다', () => {
    expect(histories.map((h) => h.product.id).sort()).toEqual([a.id, b.id].sort());
    expect(withLogs).toBe(2);
    expect(totalLogs).toBe(4);
  });

  it('여러 루틴에 담긴 제품은 가장 이른 시작일과 사용 일수를 쓴다', () => {
    const h = histories.find((x) => x.product.id === a.id)!;
    expect(h.startedAt).toBe('2026-10-01');
    expect(h.routineTypes).toEqual(['AM', 'PM']);
    expect(h.usageDays).toBe(25);
  });

  it('지표 평균과 자극 기록 수를 제품별로 계산한다', () => {
    const ha = histories.find((x) => x.product.id === a.id)!;
    const hb = histories.find((x) => x.product.id === b.id)!;
    expect(ha.logCount).toBe(4);
    expect(ha.averages.comfort).toBe(3.5);
    expect(ha.irritatedCount).toBe(2);
    expect(hb.logCount).toBe(2);
    expect(hb.averages.comfort).toBe(4.5);
    expect(hb.irritatedCount).toBe(0);
  });

  it('기록을 남긴 첫날·마지막날을 알려준다', () => {
    const hb = histories.find((x) => x.product.id === b.id)!;
    expect(hb.firstLogDate).toBe('2026-10-21');
    expect(hb.lastLogDate).toBe('2026-10-22');
  });

  it('그 제품을 쓴 날과 쓰지 않은 날의 편안함 차이를 낸다', () => {
    const hb = histories.find((x) => x.product.id === b.id)!;
    // b 를 쓴 날 평균 4.5, 안 쓴 날 평균 2.5
    expect(hb.comfortVsOthers).toBe(2);
    // a 는 모든 기록에 들어 있어 비교할 상대가 없다
    expect(histories.find((x) => x.product.id === a.id)!.comfortVsOthers).toBeNull();
  });

  it('기록이 없는 제품은 평균이 null 이고 오류를 내지 않는다', () => {
    const { histories: only } = buildProductHistories([], routines, CATALOG, '2026-10-25');
    expect(only).toHaveLength(2);
    expect(only[0].averages.comfort).toBeNull();
    expect(only[0].logCount).toBe(0);
    expect(only[0].beforeAfter).toBeNull();
  });

  it('루틴에 담기 전후 편안함은 양쪽에 기록이 2건 이상일 때만 낸다', () => {
    const many: SkinLog[] = [
      log('2026-10-16', [a.id], { comfort: 2 }),
      log('2026-10-17', [a.id], { comfort: 2 }),
      log('2026-10-21', [a.id, b.id], { comfort: 4 }),
      log('2026-10-22', [a.id, b.id], { comfort: 4 }),
    ];
    const { histories: hs } = buildProductHistories(many, routines, CATALOG, '2026-10-25');
    const hb = hs.find((x) => x.product.id === b.id)!;
    expect(hb.beforeAfter).not.toBeNull();
    expect(hb.beforeAfter!.before).toBe(2);
    expect(hb.beforeAfter!.after).toBe(4);
    expect(hb.beforeAfter!.delta).toBe(2);
  });
});

describe('제품 비교', () => {
  const logs: SkinLog[] = [
    log('2026-10-21', [a.id], { comfort: 5, irritation: 1 }),
    log('2026-10-22', [b.id], { comfort: 2, irritation: 4 }),
  ];
  const { histories } = buildProductHistories(logs, routines, CATALOG, '2026-10-25');

  it('지표마다 더 좋은 쪽을 가리킨다 (편안함은 높을수록, 자극감은 낮을수록 좋다)', () => {
    const ordered = [histories.find((h) => h.product.id === a.id)!, histories.find((h) => h.product.id === b.id)!];
    const rows = compareHistories(ordered);
    const comfort = rows.find((r) => r.metric === 'comfort')!;
    const irritation = rows.find((r) => r.metric === 'irritation')!;
    expect(comfort.values).toEqual([5, 2]);
    expect(comfort.bestIndex).toBe(0);
    expect(irritation.higherIsBetter).toBe(false);
    expect(irritation.bestIndex).toBe(0);
  });

  it('값이 같으면 승자를 정하지 않는다', () => {
    const same: SkinLog[] = [log('2026-10-21', [a.id], { comfort: 3 }), log('2026-10-22', [b.id], { comfort: 3 })];
    const { histories: hs } = buildProductHistories(same, routines, CATALOG, '2026-10-25');
    const rows = compareHistories([hs.find((h) => h.product.id === a.id)!, hs.find((h) => h.product.id === b.id)!]);
    expect(rows.find((r) => r.metric === 'comfort')!.bestIndex).toBeNull();
  });

  it('정렬 기준을 바꿀 수 있다', () => {
    expect(sortHistories(histories, 'started')[0].startedAt).toBe('2026-10-20');
    expect(sortHistories(histories, 'comfort')[0].product.id).toBe(a.id);
    expect(sortHistories(histories, 'irritation')[0].product.id).toBe(b.id);
  });
});
