import { describe, expect, it } from 'vitest';
import { CATALOG, PRODUCTS } from '@/data';
import { analyzeRoutine } from './compatibility';

const JARGON = ['가중치', '지수', '보정', '메커니즘', 'mechanism', '레이어링', '클램프', '누적 노출'];

describe('궁합 근거 — 쉬운 말 표기', () => {
  const retinol = PRODUCTS.find((p) => p.keyIngredients.includes('retinol'))!;
  const aha = PRODUCTS.find((p) => p.keyIngredients.includes('glycolic-acid'))!;
  const creams = PRODUCTS.filter((p) => p.category === '크림').slice(0, 5);

  it('모든 근거에 쉬운 제목·이유·영향 크기가 있고, 제목·이유에는 전문 용어가 없다', () => {
    const r = analyzeRoutine({ productIds: [retinol.id, aha.id, ...creams.map((c) => c.id)], routineType: 'AM', skinType: 'sensitive' }, CATALOG);
    expect(r.reasons.length).toBeGreaterThan(4);
    r.reasons.forEach((reason) => {
      expect(reason.title.length).toBeGreaterThan(4);
      expect(reason.why.length).toBeGreaterThan(10);
      expect(['big', 'medium', 'small']).toContain(reason.impact);
      JARGON.forEach((word) => {
        expect(reason.title).not.toContain(word);
        expect(reason.why).not.toContain(word);
      });
    });
    // 기술적 설명은 따로 남아 있다
    expect(r.reasons.some((x) => x.detail.includes('가중치') || x.detail.includes('초과분'))).toBe(true);
  });

  it('한눈에 보기에는 가장 크게 깎인 이유와 점수를 지켜준 것이 쉬운 말로 들어간다', () => {
    const r = analyzeRoutine({ productIds: creams.map((c) => c.id), routineType: 'PM', skinType: 'normal' }, CATALOG);
    expect(r.headline[0]).toContain('가장 크게 깎인 이유');
    expect(r.headline[0]).toContain('크림');
    expect(r.headline.some((h) => h.includes('점수를 지켜준 것'))).toBe(true);
  });

  it('감점 항목에는 실천 팁이 붙는다', () => {
    const r = analyzeRoutine({ productIds: [retinol.id, aha.id], routineType: 'AM', skinType: 'normal' }, CATALOG);
    r.reasons.filter((x) => x.delta < 0).forEach((x) => expect(x.tip).toBeTruthy());
  });
});
