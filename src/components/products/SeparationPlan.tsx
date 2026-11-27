import { getIngredient } from '@/data';
import { SEPARATION_META, type SeparationAdvice } from '@/engine/separation';
import { Badge } from '@/components/ui/Chip';
import { SourceList } from '@/components/evidence/SourceList';
import { useAppStore } from '@/store/useAppStore';

const SEVERITY_BADGE = { high_caution: 'rose', caution: 'butter', neutral: 'sky', good: 'mint' } as const;
const SEVERITY_LABEL = { high_caution: '특히 주의', caution: '주의', neutral: '무난', good: '좋음' } as const;

function SlotCard({ slot }: { slot: SeparationAdvice['slots'][number] }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  return (
    <div className={`plan-slot plan-slot--${slot.slot}`}>
      <div className="plan-slot__label">{slot.label}</div>
      <div className="plan-slot__ings">
        {slot.ingredientIds.map((id) => (
          <button key={id} type="button" className="link-btn" onClick={() => openIngredient(id)}>
            {getIngredient(id)?.nameKo ?? id}
          </button>
        ))}
      </div>
      {slot.products.length > 0 && (
        <div className="plan-slot__products">{[...new Set(slot.products)].slice(0, 3).join(', ')}</div>
      )}
    </div>
  );
}

/** 주의 조합 하나를 어떻게 나눠 쓰면 되는지 — 시간대·순서까지 구체적으로 (요청 6번) */
export function SeparationCard({ advice }: { advice: SeparationAdvice }) {
  const meta = SEPARATION_META[advice.kind];
  return (
    <div className={`plan-card plan-card--${advice.severity}`}>
      <div className="row row--between">
        <span className="plan-card__kind">
          {meta.icon} {meta.label}
        </span>
        <Badge color={SEVERITY_BADGE[advice.severity]}>{SEVERITY_LABEL[advice.severity]}</Badge>
      </div>
      <div className="plan-card__headline">{advice.headline}</div>
      <div className="plan-slots">
        {advice.slots.map((s, i) => (
          <SlotCard key={`${s.slot}-${i}`} slot={s} />
        ))}
      </div>
      <p className="plan-card__why">{advice.why}</p>
      <ol className="plan-steps">
        {advice.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <SourceList sources={advice.sources} />
    </div>
  );
}

/** 루틴 전체의 나눠 쓰기 계획 */
export function SeparationPlanSection({ advices }: { advices: SeparationAdvice[] }) {
  if (advices.length === 0) return null;
  return (
    <>
      <div className="score-card__label mt-3">🗓️ 이렇게 나눠 쓰면 돼요 ({advices.length}건)</div>
      <p className="small muted mb-2">
        주의 조합마다 아침/저녁 배치, 날짜 나누기, 바르는 순서 중 어떤 방법이 맞는지와 그 근거를 함께 정리했어요.
      </p>
      <div className="stack stack--sm">
        {advices.map((a) => (
          <SeparationCard key={a.interactionId} advice={a} />
        ))}
      </div>
    </>
  );
}
