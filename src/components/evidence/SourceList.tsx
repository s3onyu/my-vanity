import { useState } from 'react';
import type { SourceRef } from '@/types';
import { SOURCE_KIND_META, citation } from '@/data/sources';

interface Props {
  sources: SourceRef[];
  /** 접기 없이 바로 펼쳐 보여줄지 */
  open?: boolean;
  /** 제목 문구 */
  label?: string;
}

/**
 * 근거 출처 목록 (요청 1·5번).
 * 논문·식약처 고시·성분 DB 를 종류별로 구분해 보여주고, 링크가 있으면 새 탭으로 연다.
 * 기본은 접힌 상태 — 궁금한 사람만 펼쳐 보게 한다.
 */
export function SourceList({ sources, open = false, label = '근거 출처' }: Props) {
  const [expanded, setExpanded] = useState(open);
  if (sources.length === 0) return null;

  return (
    <div className="sources">
      <button
        type="button"
        className="sources__toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        📚 {label} {sources.length}건 {expanded ? '접기' : '보기'}
      </button>
      {expanded && (
        <ul className="sources__list">
          {sources.map((s) => {
            const meta = SOURCE_KIND_META[s.kind];
            return (
              <li key={s.id} className="source">
                <span className="source__kind" title={meta.label}>
                  {meta.icon}
                </span>
                <div className="flex-1">
                  <div className="source__label">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.label} ↗
                      </a>
                    ) : (
                      s.label
                    )}
                  </div>
                  <div className="source__cite">
                    {meta.label} · {citation(s)}
                  </div>
                  <p className="source__detail">{s.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** 한 줄 요약 — 카드 안에 가볍게 붙일 때 */
export function SourceInline({ sources }: { sources: SourceRef[] }) {
  if (sources.length === 0) return null;
  const first = sources[0];
  return (
    <p className="tiny muted source-inline">
      근거: {citation(first)}
      {sources.length > 1 ? ` 외 ${sources.length - 1}건` : ''}
    </p>
  );
}
