import type { ReactNode } from 'react';
import type { Product } from '@/types';
import { getIngredient } from '@/data';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore, selectMatchOf } from '@/store/useAppStore';
import { ProductThumb } from './ProductThumb';

interface IngredientTagsProps {
  ids: string[];
  max?: number;
}

/** 핵심 성분 태그 — 클릭하면 성분 상세 시트가 열린다 */
export function IngredientTags({ ids, max = 5 }: IngredientTagsProps) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  const shown = ids.slice(0, max);
  return (
    <div className="product-card__tags">
      {shown.map((id) => {
        const ing = getIngredient(id);
        if (!ing) return null;
        return (
          <button key={id} type="button" className={`ing-tag ing-tag--${ing.colorTag}`} onClick={() => openIngredient(id)}>
            {ing.nameKo}
          </button>
        );
      })}
      {ids.length > max && <span className="ing-tag">+{ids.length - max}</span>}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  /** 👍/👎 토글 표시 여부 */
  showMatch?: boolean;
  /** 우측 액션 (기본: +담기) */
  action?: ReactNode;
  footer?: ReactNode;
}

export function ProductCard({ product, showMatch = true, action, footer }: ProductCardProps) {
  const match = useAppStore(selectMatchOf(product.id));
  const toggleMatch = useAppStore((s) => s.toggleMatch);
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const showToast = useAppStore((s) => s.showToast);
  const removeCustomProduct = useAppStore((s) => s.removeCustomProduct);

  const onAdd = async () => {
    const r = await addToRoutine(product.id);
    showToast(r === 'added' ? `${activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 담았어요` : '이미 이 루틴에 담겨 있어요');
  };

  const onMatch = async (type: 'good' | 'avoided') => {
    const r = await toggleMatch(product.id, type);
    if (r === 'unset') showToast('기록에서 뺐어요');
    else showToast(type === 'good' ? '잘 맞았던 제품으로 기록했어요' : '기피 제품으로 기록했어요. 추천에서 제외돼요');
  };

  return (
    <article className="product-card">
      <div className="row row--between">
        <div className="product-card__brand">{product.brand}</div>
        <div className="row" style={{ gap: 4 }}>
          <Badge>{product.category}</Badge>
          {product.custom ? <Badge color="mint">내가 등록</Badge> : !product.verified && <Badge color="butter">데모·미검증</Badge>}
        </div>
      </div>
      <div className="row">
        <ProductThumb product={product} size={44} editable />
        <div className="product-card__name flex-1">{product.name}</div>
        {product.custom && (
          <button
            type="button"
            className="icon-btn"
            aria-label="등록한 제품 삭제"
            onClick={async () => {
              if (window.confirm(`${product.name}을(를) 내 제품 목록에서 지울까요? 루틴과 기록에서도 빠져요.`)) {
                await removeCustomProduct(product.id);
                showToast('등록한 제품을 지웠어요');
              }
            }}
          >
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>
      <IngredientTags ids={product.keyIngredients} />
      <div className="product-card__actions">
        {showMatch && (
          <>
            <button
              type="button"
              className={`match-btn${match === 'good' ? ' is-good' : ''}`}
              onClick={() => onMatch('good')}
              aria-pressed={match === 'good'}
            >
              👍 잘 맞았어요
            </button>
            <button
              type="button"
              className={`match-btn${match === 'avoided' ? ' is-avoided' : ''}`}
              onClick={() => onMatch('avoided')}
              aria-pressed={match === 'avoided'}
            >
              👎 트러블 있었어요
            </button>
          </>
        )}
        {action ?? (
          <button type="button" className="btn btn--sm" onClick={onAdd}>
            <Icon name="plus" size={14} /> 담기
          </button>
        )}
      </div>
      {footer}
    </article>
  );
}
