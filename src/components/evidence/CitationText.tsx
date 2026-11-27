import { Fragment, type ReactNode } from 'react';

/** "(PMID 12345678)" 를 PubMed 원문 링크로 바꿔 보여준다 */
const PMID_RE = /\(PMID (\d{1,9})\)/g;

export const pubmedUrl = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

/** 인용 문자열에서 PMID 번호만 뽑는다 (검사·링크에 공용) */
export function pmidsIn(text: string): string[] {
  return [...text.matchAll(PMID_RE)].map((m) => m[1]);
}

/**
 * 성분·조합 설명의 출처 문자열을 그대로 보여주되, PMID 는 PubMed 원문으로 걸어 준다.
 * 적어 둔 논문이 실제 기록과 맞는지 누구나 눌러서 확인할 수 있게 하는 것이 목적이다.
 */
export function CitationText({ text, className }: { text: string; className?: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PMID_RE)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <span key={`${m[1]}-${start}`} className="citation">
        (
        <a className="citation-link" href={pubmedUrl(m[1])} target="_blank" rel="noopener noreferrer" title="PubMed 에서 원문 보기">
          PMID {m[1]}
        </a>
        )
      </span>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </span>
  );
}
