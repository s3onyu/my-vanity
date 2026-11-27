import { describe, expect, it } from 'vitest';
import { CATALOG, INTERACTIONS } from '@/data';
import { SOURCES, resolveSources } from '@/data/sources';
import type { InteractionHit } from './compatibility';
import { separationAdvice, separationPlan, timeSlotOf } from './separation';

const hitOf = (id: string): InteractionHit => {
  const interaction = INTERACTIONS.find((i) => i.id === id)!;
  return { interaction, productsA: ['A 제품'], productsB: ['B 제품'] };
};

describe('근거 출처 데이터', () => {
  it('모든 성분 조합이 근거 자료와 나눠 쓰는 방법을 가진다', () => {
    const missingSource = INTERACTIONS.filter((i) => !i.sourceIds?.length);
    const missingSep = INTERACTIONS.filter((i) => !i.separation);
    expect(missingSource).toEqual([]);
    expect(missingSep).toEqual([]);
  });

  it('모든 sourceIds 가 실제 자료를 가리킨다 (오타·삭제된 id 없음)', () => {
    const unknown = INTERACTIONS.flatMap((i) => (i.sourceIds ?? []).filter((id) => !SOURCES[id]));
    expect(unknown).toEqual([]);
  });

  it('출처에는 발행 기관이 반드시 있고, 링크가 있으면 https 로 시작한다', () => {
    Object.values(SOURCES).forEach((s) => {
      expect(s.publisher.length).toBeGreaterThan(1);
      if (s.url) expect(s.url.startsWith('https://')).toBe(true);
    });
  });

  it('없는 id 는 조용히 건너뛴다', () => {
    expect(resolveSources(['pinnell-2001', 'nope-9999'])).toHaveLength(1);
    expect(resolveSources(undefined)).toEqual([]);
  });
});

describe('성분 선호 시간대', () => {
  it('비타민C 는 아침, 레티놀·산 계열은 저녁', () => {
    expect(timeSlotOf('ascorbic-acid')).toBe('AM');
    expect(timeSlotOf('retinol')).toBe('PM');
    expect(timeSlotOf('glycolic-acid')).toBe('PM');
    expect(timeSlotOf('ceramide')).toBe('any');
  });
});

describe('나눠 쓰기 계획', () => {
  it('비타민C × 레티놀은 아침/저녁으로 나누고 각 시간대에 성분을 배치한다', () => {
    const advice = separationAdvice(hitOf('ix05'), CATALOG)!;
    expect(advice.kind).toBe('time');
    expect(advice.headline).toContain('아침');
    expect(advice.headline).toContain('저녁');
    const am = advice.slots.find((s) => s.slot === 'AM')!;
    const pm = advice.slots.find((s) => s.slot === 'PM')!;
    expect(am.ingredientIds).toEqual(['ascorbic-acid']);
    expect(pm.ingredientIds).toEqual(['retinol']);
    expect(advice.sources.length).toBeGreaterThan(0);
  });

  it('레티놀 × 글라이콜릭처럼 같은 저녁 성분끼리는 날짜를 번갈아 쓰게 안내한다', () => {
    const advice = separationAdvice(hitOf('ix01'), CATALOG)!;
    expect(advice.kind).toBe('day');
    expect(advice.slots.map((s) => s.slot)).toEqual(['dayA', 'dayB']);
    // 자극이 큰 레티놀을 둘째 날로 미룬다
    expect(advice.slots[1].ingredientIds).toEqual(['retinol']);
  });

  it('레티놀 + 과산화벤조일은 서로를 분해하므로 시간대를 나눈다', () => {
    const advice = separationAdvice(hitOf('ix33'), CATALOG)!;
    expect(advice.kind).toBe('time');
    expect(advice.sources.some((s) => s.id === 'martin-1998')).toBe(true);
  });

  it('레티놀 + 레티날처럼 같은 계열 중복은 하나를 바꾸라고 안내한다', () => {
    const advice = separationAdvice(hitOf('ix58'), CATALOG)!;
    expect(advice.kind).toBe('swap');
    expect(advice.headline).toContain('바꾸는');
  });

  it('함께 쓰기 좋은 조합에는 계획을 만들지 않는다', () => {
    expect(separationAdvice(hitOf('ix07'), CATALOG)).toBeNull();
  });

  it('루틴 전체 계획은 특히 주의 조합을 먼저 보여준다', () => {
    const plan = separationPlan([hitOf('ix01'), hitOf('ix33'), hitOf('ix07')], CATALOG);
    expect(plan).toHaveLength(2);
    expect(plan[0].severity).toBe('high_caution');
  });

  it('모든 주의 조합이 빈칸 없는 계획을 만들어 낸다', () => {
    const cautions = INTERACTIONS.filter((i) => i.severity === 'caution' || i.severity === 'high_caution');
    cautions.forEach((i) => {
      const advice = separationAdvice(hitOf(i.id), CATALOG);
      expect(advice, i.id).not.toBeNull();
      expect(advice!.headline.length, i.id).toBeGreaterThan(4);
      expect(advice!.steps.length, i.id).toBeGreaterThanOrEqual(3);
      expect(advice!.slots.length, i.id).toBeGreaterThanOrEqual(1);
      advice!.slots.forEach((s) => expect(s.ingredientIds.length, i.id).toBeGreaterThan(0));
    });
  });
});
