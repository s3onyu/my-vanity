import type { Ingredient, IngredientInteraction, Product } from '@/types';

/**
 * 엔진이 조회하는 마스터 데이터 묶음.
 * 데이터 모듈(src/data)이 아니라 이 객체를 주입받도록 해서 테스트와 Supabase 전환이 쉽다.
 */
export interface Catalog {
  ingredients: Map<string, Ingredient>;
  products: Map<string, Product>;
  interactions: IngredientInteraction[];
  /** 정렬된 "a|b" 키 → 상호작용 */
  interactionIndex: Map<string, IngredientInteraction>;
}

export const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export function buildCatalog(
  ingredients: Ingredient[],
  products: Product[],
  interactions: IngredientInteraction[],
): Catalog {
  const interactionIndex = new Map<string, IngredientInteraction>();
  interactions.forEach((ix) => interactionIndex.set(pairKey(ix.ingredientA, ix.ingredientB), ix));
  return {
    ingredients: new Map(ingredients.map((i) => [i.id, i])),
    products: new Map(products.map((p) => [p.id, p])),
    interactions,
    interactionIndex,
  };
}

export function findInteraction(catalog: Catalog, a: string, b: string): IngredientInteraction | undefined {
  return catalog.interactionIndex.get(pairKey(a, b));
}

export function ingredientName(catalog: Catalog, id: string): string {
  return catalog.ingredients.get(id)?.nameKo ?? id;
}
