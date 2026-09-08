import { useState } from 'react';
import type { ConcernId, SkinType } from '@/types';
import { CONCERNS, SKIN_TYPES } from '@/data/concerns';
import { useAppStore } from '@/store/useAppStore';
import { Icon } from '@/components/ui/Icon';

interface OnboardingProps {
  /** true 면 "프로필 수정" 모드 (기존 값으로 시작, 취소 가능) */
  editMode?: boolean;
  onDone?: () => void;
}

const SKIN_ICON: Record<SkinType, { icon: string; cls: string }> = {
  dry: { icon: '🍂', cls: 'bg-butter-2' },
  oily: { icon: '💦', cls: 'bg-sky-2' },
  combo: { icon: '🌗', cls: 'bg-lilac-2' },
  normal: { icon: '🌿', cls: 'bg-mint-2' },
  sensitive: { icon: '🌸', cls: 'bg-rose-2' },
};

export function Onboarding({ editMode = false, onDone }: OnboardingProps) {
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const showToast = useAppStore((s) => s.showToast);

  const [step, setStep] = useState<0 | 1>(0);
  const [skinType, setSkinType] = useState<SkinType | null>(profile?.skinType ?? null);
  const [concerns, setConcerns] = useState<ConcernId[]>(profile?.concerns ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleConcern = (id: ConcernId) => {
    setError(null);
    setConcerns((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));
  };

  const next = () => {
    if (!skinType) {
      setError('피부 타입을 하나 골라주세요.');
      return;
    }
    setError(null);
    setStep(1);
  };

  const finish = async () => {
    if (!skinType) {
      setError('피부 타입을 하나 골라주세요.');
      setStep(0);
      return;
    }
    if (concerns.length === 0) {
      setError('고민을 최소 하나는 골라주세요. 추천의 기준이 돼요.');
      return;
    }
    setSaving(true);
    await saveProfile({ skinType, concerns });
    setSaving(false);
    showToast(editMode ? '프로필을 업데이트했어요' : '내 화장대를 준비했어요');
    onDone?.();
  };

  return (
    <div className="onboarding">
      <div className="row row--between">
        <div className="onboarding__logo">내 화장대</div>
        {editMode && (
          <button type="button" className="icon-btn" onClick={onDone} aria-label="취소">
            <Icon name="close" />
          </button>
        )}
      </div>

      <h1 className="onboarding__title">
        {step === 0 ? (
          <>
            요즘 피부는
            <br />
            <em>어떤 편</em>인가요?
          </>
        ) : (
          <>
            신경 쓰이는 고민을
            <br />
            <em>모두</em> 골라주세요
          </>
        )}
      </h1>
      <p className="onboarding__lead">
        {step === 0
          ? '피부 타입에 따라 성분 궁합 점수의 가중치가 달라져요. 언제든 프로필에서 바꿀 수 있어요.'
          : '고른 고민을 기준으로 성분과 제품을 추천해요. 진단이 아니라 참고용 분류예요.'}
      </p>

      <div className="onboarding__steps" aria-hidden="true">
        <span className="is-done" />
        <span className={step === 1 ? 'is-done' : ''} />
      </div>

      <div className="onboarding__body">
        {step === 0 ? (
          <div className="option-list" role="radiogroup" aria-label="피부 타입">
            {SKIN_TYPES.map((s) => {
              const selected = skinType === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`option${selected ? ' is-selected' : ''}`}
                  onClick={() => {
                    setSkinType(s.id);
                    setError(null);
                  }}
                >
                  <span className={`option__icon ${SKIN_ICON[s.id].cls}`}>{SKIN_ICON[s.id].icon}</span>
                  <span>
                    <span className="option__title">{s.label}</span>
                    <span className="option__desc">{s.desc}</span>
                  </span>
                  <span className="option__check">✓</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="option-grid" role="group" aria-label="피부 고민">
            {CONCERNS.map((c) => {
              const selected = concerns.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  className={`option${selected ? ' is-selected' : ''}`}
                  onClick={() => toggleConcern(c.id)}
                >
                  <span className={`option__icon bg-${c.colorTag}-2`}>{c.icon}</span>
                  <span>
                    <span className="option__title">{c.title}</span>
                  </span>
                  <span className="option__check">✓</span>
                </button>
              );
            })}
          </div>
        )}
        {error && (
          <p className="field-error mt-2" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="onboarding__footer">
        {step === 1 && (
          <button type="button" className="btn btn--ghost" onClick={() => setStep(0)}>
            이전
          </button>
        )}
        {step === 0 ? (
          <button type="button" className="btn btn--block" onClick={next}>
            다음
          </button>
        ) : (
          <button type="button" className="btn btn--block" onClick={finish} disabled={saving}>
            {editMode ? '저장하기' : '시작하기'}
          </button>
        )}
      </div>
      <p className="fine-print text-center">
        내 화장대는 성분 교육·루틴 관리 앱이며 의료 진단이나 치료를 대신하지 않아요.
      </p>
    </div>
  );
}
