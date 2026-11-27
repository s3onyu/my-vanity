import { describe, expect, it } from 'vitest';
import { INGREDIENTS } from './index';
import { pmidsIn } from '@/components/evidence/CitationText';

/**
 * 성분 설명의 출처 검사.
 *
 * 2026-11 에 성분 113건의 출처를 PubMed 기록과 대조했다. 저자·학술지·연도가 실제와 다른 10건을 바로잡고,
 * PubMed 에 색인되지 않아 확인할 수 없던 2건은 뺐다. 그 뒤로 논문 인용에는 반드시 PMID 를 함께 적는다.
 * (대조 방법은 메모리 "verify-citations-by-pmid" 참고)
 */

/** 논문처럼 보이는 조각: 라틴 문자 + 4자리 연도. 기관 자료·교과서는 제외한다 */
const INSTITUTIONAL = /^(식약처|대한화장품|CIR Expert Panel|EU SCCS|FDA |EMA |WHO |ICH |Draelos ZD, Cosmetic Dermatology|화장품 성분학|SCCS Opinion)/;
const looksLikePaper = (c: string) => /[A-Za-z]/.test(c) && /\b(19|20)\d{2}\b/.test(c) && !INSTITUTIONAL.test(c);

const allCitations = INGREDIENTS.flatMap((i) =>
  i.source
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((cite) => ({ id: i.id, cite })),
);

describe('성분 출처 인용', () => {
  it('모든 성분에 출처가 있다', () => {
    const missing = INGREDIENTS.filter((i) => !i.source.trim()).map((i) => i.id);
    expect(missing).toEqual([]);
  });

  it('논문 인용에는 PMID 가 함께 적혀 있다 (PubMed 로 대조한 것만 넣는다)', () => {
    const noPmid = allCitations.filter((c) => looksLikePaper(c.cite) && pmidsIn(c.cite).length === 0);
    expect(noPmid.map((c) => `${c.id}: ${c.cite}`)).toEqual([]);
  });

  it('PMID 는 숫자 1~8자리이고 중복 표기가 없다', () => {
    const bad = allCitations.filter((c) => pmidsIn(c.cite).some((p) => !/^\d{1,8}$/.test(p) || p.startsWith('0')));
    expect(bad.map((c) => c.cite)).toEqual([]);
    const multi = allCitations.filter((c) => pmidsIn(c.cite).length > 1);
    expect(multi.map((c) => c.cite)).toEqual([]);
  });

  it('PubMed 에 색인되지 않아 확인할 수 없던 잡지는 더 이상 인용하지 않는다', () => {
    // "J Cosmet Dermatol" 은 PubMed 에 색인된 다른 학술지이므로 걸리면 안 된다
    const unindexed = /Cosmet Toiletries|(?<!J )Cosmet Dermatol \d|J Am Oil Chem Soc|J Funct Foods/;
    const left = allCitations.filter((c) => unindexed.test(c.cite));
    expect(left.map((c) => `${c.id}: ${c.cite}`)).toEqual([]);
  });

  it('대조한 논문 인용이 100건 이상 남아 있다', () => {
    const withPmid = allCitations.filter((c) => pmidsIn(c.cite).length === 1);
    expect(withPmid.length).toBeGreaterThanOrEqual(100);
  });
});
