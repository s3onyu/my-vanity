import { useState } from 'react';
import { LEGAL_DOCS, TERMS_VERSION } from '@/data/legal';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

/**
 * 첫 글쓰기 전 동의 화면.
 * 커뮤니티에 글을 올리기 전에 이용약관·개인정보 처리·커뮤니티 규칙에 동의를 받는다 (App Store 심사 요건).
 */
export function ConsentGate({ onAgreed, onCancel }: { onAgreed: () => void; onCancel: () => void }) {
  const agreeToTerms = useAppStore((s) => s.agreeToTerms);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const profile = useAppStore((s) => s.profile);
  const [checks, setChecks] = useState({ terms: false, privacy: false, rules: false });
  const [busy, setBusy] = useState(false);
  const allChecked = checks.terms && checks.privacy && checks.rules;
  const isRenewal = Boolean(profile?.agreedAt) && profile?.agreedVersion !== TERMS_VERSION;

  const items: { key: keyof typeof checks; doc: 'terms' | 'privacy' | 'rules'; label: string }[] = [
    { key: 'terms', doc: 'terms', label: '이용약관에 동의합니다' },
    { key: 'privacy', doc: 'privacy', label: '개인정보 처리방침을 읽고 동의합니다' },
    { key: 'rules', doc: 'rules', label: '커뮤니티 규칙을 지키겠습니다' },
  ];

  return (
    <div className="stack">
      <div className="notice notice--warn">
        {isRenewal
          ? '약관이 바뀌었어요. 다시 한 번 확인하고 동의해 주세요.'
          : '커뮤니티에 처음 글을 쓰시는군요. 아래 내용을 확인하고 동의해 주세요.'}
      </div>

      <div className="card card--soft">
        <div className="h3">글을 올리기 전에 알아두세요</div>
        <ul className="consent-list">
          <li>내가 쓴 글, 사진, 닉네임은 다른 사용자에게 공개돼요.</li>
          <li>개인정보나 연락처는 적지 말아 주세요.</li>
          <li>광고, 비방, 허위 효능 주장은 삭제될 수 있어요.</li>
          <li>개인 후기이며 효과를 보장하지 않는다는 문구가 함께 표시돼요.</li>
          <li>내가 쓴 글은 언제든 지울 수 있고, 설정에서 모든 데이터를 삭제할 수 있어요.</li>
        </ul>
      </div>

      <div className="stack stack--sm">
        <button
          type="button"
          className={`consent-all${allChecked ? ' is-on' : ''}`}
          onClick={() => {
            const next = !allChecked;
            setChecks({ terms: next, privacy: next, rules: next });
          }}
        >
          <span className="consent-check" aria-hidden="true">
            {allChecked ? '✓' : ''}
          </span>
          <span className="flex-1">모두 동의합니다</span>
        </button>

        {items.map((it) => (
          <div key={it.key} className="consent-row">
            <button
              type="button"
              className="consent-row__check"
              onClick={() => setChecks((c) => ({ ...c, [it.key]: !c[it.key] }))}
              aria-pressed={checks[it.key]}
              aria-label={it.label}
            >
              <span className={`consent-check${checks[it.key] ? ' is-on' : ''}`}>{checks[it.key] ? '✓' : ''}</span>
              <span className="flex-1">{it.label}</span>
            </button>
            <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'legal', doc: it.doc })}>
              보기
            </button>
          </div>
        ))}
      </div>

      <p className="tiny muted">
        동의 시점과 약관 버전({LEGAL_DOCS.terms.updatedAt})이 기록돼요. 동의하지 않아도 앱의 다른 기능은 그대로 쓸 수 있어요.
      </p>

      <div className="row">
        <button type="button" className="btn btn--ghost flex-1" onClick={onCancel}>
          나중에
        </button>
        <button
          type="button"
          className="btn flex-1"
          disabled={!allChecked || busy}
          onClick={async () => {
            setBusy(true);
            await agreeToTerms();
            setBusy(false);
            onAgreed();
          }}
        >
          <Icon name="check" size={15} /> 동의하고 글쓰기
        </button>
      </div>
    </div>
  );
}
