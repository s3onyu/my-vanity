import { describe, expect, it } from 'vitest';
import { CATALOG, PRODUCTS } from '@/data';
import { analyzeRoutine } from './compatibility';

const byName = (name: string) => PRODUCTS.find((p) => p.name === name)!;
const toner = byName('1025 독도 토너');
const cream = PRODUCTS.find((p) => p.brand === '제로이드' && p.name.includes('수딩'))!;
const sun = PRODUCTS.find((p) => p.category === '선크림' && p.brand === '라운드랩')!;

describe('바르는 순서·기본 단계 규칙', () => {
  it('크림 → 토너 순서는 감점되고, 토너 → 크림 순서는 감점되지 않는다', () => {
    const wrong = analyzeRoutine({ productIds: [cream.id, toner.id], routineType: 'AM', skinType: 'sensitive' }, CATALOG);
    const right = analyzeRoutine({ productIds: [toner.id, cream.id], routineType: 'AM', skinType: 'sensitive' }, CATALOG);
    const orderReason = wrong.reasons.find((r) => r.key === 'order');
    expect(orderReason).toBeDefined();
    expect(orderReason!.delta).toBe(-6);
    expect(orderReason!.title).toBe('크림을 토너보다 먼저 발라요');
    expect(wrong.stats.inOrder).toBe(false);
    expect(right.reasons.some((r) => r.key === 'order')).toBe(false);
    expect(right.stats.inOrder).toBe(true);
    expect(right.score).toBeGreaterThan(wrong.score);
  });

  it('아침 루틴은 활성 성분이 없어도 선크림이 없으면 감점된다', () => {
    const r = analyzeRoutine({ productIds: [toner.id, cream.id], routineType: 'AM', skinType: 'normal' }, CATALOG);
    const sunReason = r.reasons.find((x) => x.label === '아침 루틴에 선크림 없음');
    expect(sunReason).toBeDefined();
    expect(sunReason!.delta).toBe(-6);
    // 저녁엔 해당 없음
    const pm = analyzeRoutine({ productIds: [toner.id, cream.id], routineType: 'PM', skinType: 'normal' }, CATALOG);
    expect(pm.reasons.some((x) => x.label === '아침 루틴에 선크림 없음')).toBe(false);
  });

  it('제품 2개짜리 루틴은 "제품 수 적정" 보너스를 받지 못하고 90점 근처가 되지 않는다', () => {
    const r = analyzeRoutine({ productIds: [cream.id, toner.id], routineType: 'AM', skinType: 'sensitive' }, CATALOG);
    const bonus = r.reasons.find((x) => x.key === 'positive-bonus');
    expect(bonus?.detail ?? '').not.toContain('제품 수 적정');
    expect(r.score).toBeLessThan(82);
    expect(r.score).toBeGreaterThanOrEqual(65);
  });

  it('순서를 맞추고 선크림을 더하면 다시 높은 점수가 된다', () => {
    const r = analyzeRoutine({ productIds: [toner.id, cream.id, sun.id], routineType: 'AM', skinType: 'sensitive' }, CATALOG);
    expect(r.reasons.some((x) => x.key === 'order')).toBe(false);
    expect(r.score).toBeGreaterThanOrEqual(88);
  });

  it('뒤집힌 쌍이 여러 개여도 감점은 최대 18점', () => {
    const base = PRODUCTS.find((p) => p.category === '베이스')!;
    const cleanser = PRODUCTS.find((p) => p.category === '클렌징')!;
    const serum = PRODUCTS.find((p) => p.category === '세럼')!;
    const r = analyzeRoutine({ productIds: [base.id, sun.id, cream.id, serum.id, toner.id, cleanser.id], routineType: 'AM', skinType: 'normal' }, CATALOG);
    expect(r.reasons.find((x) => x.key === 'order')!.delta).toBe(-18);
    expect(r.stats.orderIssues.length).toBe(15);
  });
});
