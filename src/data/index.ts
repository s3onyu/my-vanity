import type { ConcernId, Ingredient, IngredientCategory, Product } from '@/types';
import { buildCatalog } from '@/engine/catalog';
import { INGREDIENTS_PART1 } from './ingredients/part1';
import { INGREDIENTS_PART2 } from './ingredients/part2';
import { PRODUCTS_PART1 } from './products/part1';
import { PRODUCTS_PART2 } from './products/part2';
import { PRODUCTS_PART3 } from './products/part3';
import { INTERACTIONS } from './interactions';

export { INTERACTIONS };
export { CONCERNS, CONCERN_MAP, CATEGORY_LABEL, CATEGORY_COLOR, SKIN_TYPES, SKIN_TYPE_LABEL } from './concerns';

/** 성분 마스터 데이터 (데모/미검증) */
export const INGREDIENTS: Ingredient[] = [...INGREDIENTS_PART1, ...INGREDIENTS_PART2];

/** 제품 마스터 데이터 (데모/미검증) */
export const PRODUCTS: Product[] = [...PRODUCTS_PART1, ...PRODUCTS_PART2, ...PRODUCTS_PART3];

export const CATALOG = buildCatalog(INGREDIENTS, PRODUCTS, INTERACTIONS);

export const getIngredient = (id: string) => CATALOG.ingredients.get(id);
export const getProduct = (id: string) => CATALOG.products.get(id);

export function productsWithIngredient(ingredientId: string, limit = 6): Product[] {
  return PRODUCTS.filter((p) => p.keyIngredients.includes(ingredientId)).slice(0, limit);
}

export function ingredientsForConcern(concern: ConcernId): Ingredient[] {
  return INGREDIENTS.filter((i) => i.relatedConcerns.includes(concern));
}

// ---------------------------------------------------------------------------
//  검색
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

interface ProductIndexEntry {
  product: Product;
  brand: string;
  name: string;
  aliases: string[];
  ingredientNames: string[];
}

const indexEntry = (p: Product): ProductIndexEntry => ({
  product: p,
  brand: norm(p.brand),
  name: norm(p.name),
  aliases: p.aliases.map(norm),
  ingredientNames: p.keyIngredients.flatMap((id) => {
    const ing = CATALOG.ingredients.get(id);
    return ing ? [norm(ing.nameKo), norm(ing.nameInci)] : [];
  }),
});

const PRODUCT_INDEX: ProductIndexEntry[] = PRODUCTS.map(indexEntry);

/**
 * 브랜드명/제품명/별칭/성분명 부분 일치 검색.
 * "헤라" 만 입력해도 헤라 제품 여러 개가 나온다. 결과는 일치 위치에 따라 정렬한다.
 */
export function searchProducts(query: string, limit = 40, extra: Product[] = []): Product[] {
  const q = norm(query);
  if (q.length < 1) return [];
  const scored: { p: Product; s: number }[] = [];
  const entries = extra.length ? [...extra.map(indexEntry), ...PRODUCT_INDEX] : PRODUCT_INDEX;
  entries.forEach((e) => {
    let s = 0;
    if (e.brand === q) s = 100;
    else if (e.brand.startsWith(q)) s = 90;
    else if (e.name.startsWith(q)) s = 85;
    else if (e.brand.includes(q)) s = 70;
    else if (e.name.includes(q)) s = 65;
    else if (e.aliases.some((a) => a === q)) s = 60;
    else if (e.aliases.some((a) => a.includes(q))) s = 50;
    else if (`${e.brand}${e.name}`.includes(q)) s = 45;
    else if (e.ingredientNames.some((n) => n.includes(q))) s = 30;
    if (s > 0) scored.push({ p: e.product, s });
  });
  return scored
    .sort((a, b) => b.s - a.s || a.p.brand.localeCompare(b.p.brand, 'ko') || a.p.name.localeCompare(b.p.name, 'ko'))
    .slice(0, limit)
    .map((x) => x.p);
}

export function searchIngredients(query: string, category: IngredientCategory | 'all' = 'all'): Ingredient[] {
  const q = norm(query);
  return INGREDIENTS.filter((i) => {
    if (category !== 'all' && !i.categories.includes(category)) return false;
    if (!q) return true;
    return norm(i.nameKo).includes(q) || norm(i.nameInci).includes(q) || norm(i.id).includes(q);
  });
}

/** 오늘의 성분 — 날짜 기준으로 결정되어 하루 동안 같은 성분이 보인다 */
export function ingredientOfTheDay(dateISO: string): Ingredient {
  const seed = dateISO.split('-').reduce((s, part) => s * 31 + Number(part), 7);
  const candidates = INGREDIENTS.filter((i) => !i.tags?.includes('fragrance') && i.id !== 'alcohol-denat');
  return candidates[seed % candidates.length];
}
