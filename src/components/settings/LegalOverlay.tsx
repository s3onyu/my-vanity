import { useState } from 'react';
import { LEGAL_DOCS, SUPPORT_EMAIL, type LegalDoc } from '@/data/legal';
import { Overlay } from '@/components/layout/Overlay';
import { useAppStore } from '@/store/useAppStore';

const TABS: LegalDoc['id'][] = ['terms', 'privacy', 'rules'];

/** 이용약관 · 개인정보 처리방침 · 커뮤니티 규칙 본문 */
export function LegalOverlay({ initialDoc = 'terms' }: { initialDoc?: LegalDoc['id'] }) {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const [docId, setDocId] = useState<LegalDoc['id']>(initialDoc);
  const doc = LEGAL_DOCS[docId];

  return (
    <Overlay title="약관 및 정책" onClose={popOverlay}>
      <div className="tabs" role="tablist">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={docId === id}
            className={`tabs__btn${docId === id ? ' is-active' : ''}`}
            onClick={() => setDocId(id)}
          >
            {LEGAL_DOCS[id].title}
          </button>
        ))}
      </div>

      <h2 className="h1" style={{ fontSize: 24 }}>
        {doc.title}
      </h2>
      <p className="tiny muted mt-1">최종 수정일 {doc.updatedAt}</p>

      <div className="legal">
        {doc.sections.map((s) => (
          <section key={s.heading} className="legal__section">
            <h3 className="legal__heading">{s.heading}</h3>
            {s.body.map((p, i) => (
              <p key={i} className="legal__body">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="fine-print">
        문의: {SUPPORT_EMAIL} · 이 앱은 성분 교육과 루틴 관리를 돕는 도구이며 의료 진단이나 치료를 대신하지 않습니다.
      </p>
    </Overlay>
  );
}
