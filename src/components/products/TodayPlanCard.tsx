import { useMemo } from 'react';
import type { RoutineType } from '@/types';
import { formatKoDate, todayISO } from '@/lib/date';
import { frequencyLabel, planOutOfOrder, todayPlan, type DayPlan } from '@/engine/schedule';
import { SLOT_ICON, SLOT_LABEL } from '@/engine/separation';
import { Badge } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';
import { ProductThumb } from './ProductThumb';

function PlanBlock({ type, plan }: { type: RoutineType; plan: DayPlan }) {
  const navigate = useAppStore((s) => s.navigate);
  const setActiveRoutine = useAppStore((s) => s.setActiveRoutine);
  const outOfOrder = planOutOfOrder(plan);

  return (
    <div className="today-block">
      <div className="row row--between">
        <span className="h3">
          {SLOT_ICON[type]} {SLOT_LABEL[type]}에 쓸 제품 <span className="muted small">{plan.use.length}단계</span>
        </span>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setActiveRoutine(type);
            navigate('products');
          }}
        >
          루틴 보기
        </button>
      </div>

      {plan.use.length === 0 ? (
        <p className="small muted mt-1">
          {plan.skip.length > 0
            ? `오늘은 ${SLOT_LABEL[type]}에 쉬는 날이에요. 쉬는 제품 ${plan.skip.length}개`
            : `${SLOT_LABEL[type]} 루틴이 비어 있어요. 내 화장대에서 제품을 담아보세요.`}
        </p>
      ) : (
        <ol className="today-list">
          {plan.use.map((e) => (
            <li key={e.item.id} className="today-item">
              <span className="today-item__step" aria-hidden="true">
                {e.step}
              </span>
              <ProductThumb product={e.product} size={34} />
              <div className="flex-1">
                <div className="today-item__name ellipsis">{e.product.name}</div>
                <div className="tiny muted">
                  {e.product.category}
                  {e.frequency.kind !== 'daily' && ` · ${frequencyLabel(e.frequency)}`}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {outOfOrder && (
        <p className="tiny" style={{ color: 'var(--butter-ink)' }}>
          🔀 순서가 권장 순서와 달라요. 루틴에서 “순서 맞추기”를 눌러보세요.
        </p>
      )}

      {plan.skip.length > 0 && (
        <p className="tiny muted today-skip">
          오늘 쉬는 제품:{' '}
          {plan.skip
            .map((s) => `${s.product.name}${s.inDays !== null ? ` (${s.inDays === 0 ? '오늘' : `${s.inDays}일 뒤`})` : ''}`)
            .join(', ')}
        </p>
      )}
    </div>
  );
}

/**
 * 오늘 쓸 제품 (요청 4번).
 * 제품별 사용 빈도(매일·격일·요일)를 반영해 아침/저녁에 오늘 쓸 것만 순서대로 보여준다.
 */
export function TodayPlanCard() {
  const routines = useAppStore((s) => s.routines);
  const catalog = useCatalog();
  const today = todayISO();
  const plan = useMemo(() => todayPlan(routines, catalog, today), [routines, catalog, today]);
  const total = plan.AM.use.length + plan.PM.use.length;
  const resting = plan.AM.skip.length + plan.PM.skip.length;

  if (routines.length === 0) return null;

  return (
    <div className="card today-card">
      <div className="row row--between">
        <div>
          <div className="eyebrow">Today</div>
          <div className="h2">오늘 쓸 제품</div>
        </div>
        <div className="row" style={{ gap: 4 }}>
          <Badge color="mint">{total}개</Badge>
          {resting > 0 && <Badge color="butter">쉬는 날 {resting}개</Badge>}
        </div>
      </div>
      <p className="tiny muted mt-1">{formatKoDate(today)} 기준 · 제품마다 정한 사용 빈도를 반영했어요</p>
      <div className="today-blocks mt-2">
        <PlanBlock type="AM" plan={plan.AM} />
        <div className="divider" />
        <PlanBlock type="PM" plan={plan.PM} />
      </div>
    </div>
  );
}
