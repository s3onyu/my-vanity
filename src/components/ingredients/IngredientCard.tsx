import type { Ingredient } from '@/types';
import { CATEGORY_COLOR, CATEGORY_LABEL, COLOR_HEX } from '@/data/concerns';
import { Badge } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';

export function CategoryBadges({ ingredient, max = 3 }: { ingredient: Ingredient; max?: number }) {
  return (
    <>
      {ingredient.categories.slice(0, max).map((c) => (
        <Badge key={c} color={CATEGORY_COLOR[c]}>
          {CATEGORY_LABEL[c]}
        </Badge>
      ))}
    </>
  );
}

/** 성분 백과 그리드 카드 */
export function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  return (
    <button type="button" className={`ing-card ing-card--${ingredient.colorTag}`} onClick={() => openIngredient(ingredient.id)}>
      <span className="ing-card__name">{ingredient.nameKo}</span>
      <span className="ing-card__inci">{ingredient.nameInci}</span>
      <span className="ing-card__tags">
        <CategoryBadges ingredient={ingredient} />
      </span>
    </button>
  );
}

/** 한 줄 리스트형 (관리 페이지 등) */
export function IngredientRow({ ingredient, hint }: { ingredient: Ingredient; hint?: string }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  return (
    <button type="button" className="ing-row" onClick={() => openIngredient(ingredient.id)}>
      <span className="ing-row__dot" style={{ background: COLOR_HEX[ingredient.colorTag].base }} />
      <span className="flex-1">
        <span className="product-card__name">{ingredient.nameKo}</span>
        <span className="small muted" style={{ display: 'block' }}>
          {hint ?? ingredient.shortDesc}
        </span>
      </span>
      <span className="row" style={{ gap: 4 }}>
        <CategoryBadges ingredient={ingredient} max={2} />
      </span>
    </button>
  );
}
