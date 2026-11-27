import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';
import { CATALOG } from '@/data';
import { checkIrritants, checkRoutineIrritants } from './irritants';

const make = (keyIngredients: string[]): Product => ({
  id: 'test',
  brand: '테스트',
  name: '테스트 제품',
  aliases: [],
  category: '세럼',
  keyIngredients,
  relatedConcerns: [],
  skinTypes: [],
  verified: false,
});

describe('내 피부 타입에서 자극이 될 수 있는 성분', () => {
  it('피부 타입을 고르지 않았으면 아무것도 표시하지 않는다', () => {
    const r = checkIrritants(make(['retinol', 'fragrance']), null, CATALOG);
    expect(r.flags).toEqual([]);
    expect(r.summary).toBeNull();
    expect(r.level).toBe(0);
  });

  it('민감성 피부에서 레티놀·향료를 집어낸다', () => {
    const r = checkIrritants(make(['retinol', 'fragrance', 'ceramide']), 'sensitive', CATALOG);
    const ids = r.flags.map((f) => f.ingredientId);
    expect(ids).toContain('retinol');
    expect(ids).toContain('fragrance');
    expect(ids).not.toContain('ceramide');
    expect(r.level).toBe(3);
    expect(r.summary).toContain('민감성');
  });

  it('같은 제품도 피부 타입에 따라 다르게 표시된다', () => {
    const product = make(['petrolatum', 'alcohol-denat']);
    const oily = checkIrritants(product, 'oily', CATALOG);
    const dry = checkIrritants(product, 'dry', CATALOG);
    expect(oily.flags.map((f) => f.ingredientId)).toEqual(['petrolatum']);
    expect(dry.flags.map((f) => f.ingredientId)).toEqual(['alcohol-denat']);
  });

  it('견고한(중성) 피부에서는 순한 구성에 아무 표시가 없다', () => {
    const r = checkIrritants(make(['hyaluronic-acid', 'glycerin', 'panthenol']), 'normal', CATALOG);
    expect(r.flags).toEqual([]);
  });

  it('모든 표시에는 이유·팁·근거 자료가 함께 붙는다', () => {
    const r = checkIrritants(make(['retinol', 'tea-tree', 'glycolic-acid', 'fragrance']), 'sensitive', CATALOG);
    expect(r.flags.length).toBeGreaterThanOrEqual(3);
    r.flags.forEach((f) => {
      expect(f.why.length).toBeGreaterThan(10);
      expect(f.tip.length).toBeGreaterThan(5);
      expect(f.sources.length).toBeGreaterThan(0);
      expect(f.name).not.toBe(f.ingredientId);
    });
  });

  it('심한 것부터 정렬된다', () => {
    const r = checkIrritants(make(['petrolatum', 'retinol']), 'combo', CATALOG);
    expect(r.flags[0].level).toBeGreaterThanOrEqual(r.flags[r.flags.length - 1].level);
  });

  it('루틴 전체에서는 같은 성분을 한 번만 모은다', () => {
    const a = make(['retinol', 'fragrance']);
    const b = { ...make(['retinol', 'glycolic-acid']), id: 'test2' };
    const flags = checkRoutineIrritants([a, b], 'sensitive', CATALOG);
    expect(flags.filter((f) => f.ingredientId === 'retinol')).toHaveLength(1);
    expect(flags.length).toBe(3);
  });
});
