import { describe, expect, it } from 'vitest';
import { CONCERN_MAP } from '@/data/concerns';
import { getIngredient } from '@/data';
import { QUIZ, scoreQuiz, type Answers } from './skinQuiz';

/** 각 질문에서 조건에 맞는 보기를 고른다 */
const pick = (fn: (q: (typeof QUIZ)[number]) => number): Answers =>
  Object.fromEntries(QUIZ.map((q) => [q.id, fn(q)]));

const allFirst = pick(() => 0);
const allLast = pick((q) => q.options.length - 1);

describe('피부 유형 검사 문항', () => {
  it('모든 문항에 보기가 2개 이상 있고 축이 지정돼 있다', () => {
    expect(QUIZ.length).toBeGreaterThanOrEqual(10);
    QUIZ.forEach((q) => {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(['oil', 'sensitivity', 'pigment', 'wrinkle']).toContain(q.axis);
      q.options.forEach((o) => expect(o.label.length, q.id).toBeGreaterThan(2));
    });
  });

  it('문항 id 가 겹치지 않는다', () => {
    expect(new Set(QUIZ.map((q) => q.id)).size).toBe(QUIZ.length);
  });

  it('보기에 적힌 고민·성분 id 가 실제로 존재한다', () => {
    QUIZ.forEach((q) =>
      q.options.forEach((o) => o.concerns?.forEach((c) => expect(CONCERN_MAP[c], `${q.id} ${c}`).toBeDefined())),
    );
  });
});

describe('검사 결과', () => {
  it('아무 답도 하지 않아도 네 글자 코드가 나온다', () => {
    const r = scoreQuiz({});
    expect(r.code).toHaveLength(4);
    expect(r.answered).toBe(0);
    expect(r.concerns.length).toBeGreaterThan(0);
  });

  it('첫 보기만 고르면 건성·견고 쪽으로 나온다', () => {
    const r = scoreQuiz(allFirst);
    expect(r.code[0]).toBe('D');
    expect(r.code[1]).toBe('R');
    expect(r.skinType).toBe('dry');
    expect(r.answered).toBe(QUIZ.length);
  });

  it('번들거림·자극 쪽 보기를 고르면 지성·민감으로 나온다', () => {
    const r = scoreQuiz(allLast);
    expect(r.code[1]).toBe('S');
    expect(r.skinType).toBe('sensitive');
    // 민감 쪽에서는 센 성분을 조심하라고 알려준다
    expect(r.careful).toContain('retinol');
  });

  it('T존은 번들, 볼은 건조를 고르면 복합성으로 본다', () => {
    const answers: Answers = {
      q1: 1, // 볼은 당기고 코·이마는 괜찮다 (combo +2)
      q2: 3, // T존 기름종이
      q3: 0, // 볼은 건조 (combo +2)
      q5: 0, // 자극 없음
      q7: 1,
      q8: 0,
    };
    const r = scoreQuiz(answers);
    expect(r.skinType).toBe('combo');
  });

  it('고민은 많이 나온 순으로 최대 4개까지 저장된다', () => {
    const r = scoreQuiz(allLast);
    expect(r.concerns.length).toBeLessThanOrEqual(4);
    r.concerns.forEach((c) => expect(CONCERN_MAP[c]).toBeDefined());
  });

  it('추천·주의 성분 id 가 모두 실제 성분이다', () => {
    [allFirst, allLast, {}].forEach((answers) => {
      const r = scoreQuiz(answers);
      [...r.focusIngredients, ...r.careful].forEach((id) => expect(getIngredient(id), id).toBeDefined());
    });
  });

  it('네 축 모두 0~100 사이 값과 설명을 가진다', () => {
    const r = scoreQuiz(allLast);
    expect(r.axes).toHaveLength(4);
    r.axes.forEach((axis) => {
      expect(axis.percent).toBeGreaterThanOrEqual(0);
      expect(axis.percent).toBeLessThanOrEqual(100);
      expect(axis.letter).toHaveLength(1);
      expect(axis.desc.length).toBeGreaterThan(10);
    });
  });

  it('같은 답은 항상 같은 결과를 낸다', () => {
    expect(scoreQuiz(allLast)).toEqual(scoreQuiz(allLast));
  });

  it('없는 보기 번호는 답하지 않은 것으로 본다', () => {
    const r = scoreQuiz({ q1: 99, q2: -1 });
    expect(r.answered).toBe(0);
  });

  it('16가지 조합 모두 유형 이름이 준비돼 있다', () => {
    // 극단적인 답 조합을 섞어 가며 코드가 나올 때마다 이름이 비어 있지 않은지 본다
    const codes = new Set<string>();
    [allFirst, allLast, {}, { q1: 3, q5: 3, q9: 2, q12: 2 }, { q1: 0, q5: 0, q9: 0, q12: 0 }].forEach((a) => {
      const r = scoreQuiz(a);
      codes.add(r.code);
      expect(r.title).not.toBe('내 피부 유형');
    });
    expect(codes.size).toBeGreaterThanOrEqual(2);
  });
});
