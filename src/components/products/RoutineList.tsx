import { usageDay } from '@/lib/date';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore, useRoutine } from '@/store/useAppStore';
import { findProduct } from '@/store/catalog';
import { CATEGORY_STEP } from '@/engine/constants';
import { IngredientTags } from './ProductCard';
import { ProductThumb } from './ProductThumb';

export function RoutineList() {
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const items = useRoutine(activeRoutine);
  const moveRoutineItem = useAppStore((s) => s.moveRoutineItem);
  const removeFromRoutine = useAppStore((s) => s.removeFromRoutine);
  const sortRoutineByStep = useAppStore((s) => s.sortRoutineByStep);
  const showToast = useAppStore((s) => s.showToast);

  if (items.length === 0) {
    return (
      <div className="empty">
        <strong>{activeRoutine === 'AM' ? '아침' : '저녁'} 루틴이 비어 있어요</strong>
        위 검색창에서 제품을 찾아 “담기”를 누르면 순서대로 쌓여요.
      </div>
    );
  }

  const steps = items.map((it) => CATEGORY_STEP[findProduct(it.productId)?.category ?? '크림']);
  const outOfOrder = steps.some((s, i) => i > 0 && s < steps[i - 1]);

  return (
    <>
      {outOfOrder && (
        <div className="notice notice--warn mb-2 row" style={{ gap: 10 }}>
          <span className="flex-1">🔀 바르는 순서가 권장 순서와 달라요. 묽은 것부터 되직한 것, 마지막에 선크림 순서예요.</span>
          <button
            type="button"
            className="btn btn--sm"
            onClick={async () => {
              const changed = await sortRoutineByStep(activeRoutine);
              showToast(changed ? '권장 순서로 정렬했어요' : '이미 권장 순서예요');
            }}
          >
            순서 맞추기
          </button>
        </div>
      )}
    <ol className="routine-list" aria-label={`${activeRoutine === 'AM' ? '아침' : '저녁'} 루틴`}>
      {items.map((item, idx) => {
        const product = findProduct(item.productId);
        if (!product) return null;
        const day = usageDay(item.startedAt);
        return (
          <li key={item.id} className="routine-item">
            <div className="routine-item__visual">
              <ProductThumb product={product} size={48} editable />
              <span className="routine-item__step" aria-hidden="true">
                {idx + 1}
              </span>
            </div>
            <div className="routine-item__body">
              <div className="product-card__brand">{product.brand}</div>
              <div className="product-card__name ellipsis">{product.name}</div>
              <div className="routine-item__meta">
                <Badge>{product.category}</Badge>
                <span>사용 {day}일째</span>
                <span>· {item.startedAt.slice(5).replace('-', '/')} 시작</span>
              </div>
              <div className="mt-1">
                <IngredientTags ids={product.keyIngredients} max={4} />
              </div>
            </div>
            <div className="routine-item__ctrl">
              <button
                type="button"
                className="icon-btn"
                aria-label="위로"
                disabled={idx === 0}
                onClick={() => moveRoutineItem(item.id, -1)}
              >
                <Icon name="up" size={14} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="아래로"
                disabled={idx === items.length - 1}
                onClick={() => moveRoutineItem(item.id, 1)}
              >
                <Icon name="down" size={14} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="루틴에서 빼기"
                onClick={async () => {
                  await removeFromRoutine(item.id);
                  showToast('루틴에서 뺐어요');
                }}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </li>
        );
      })}
    </ol>
    </>
  );
}
