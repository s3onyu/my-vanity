import type { ConcernId, Ingredient, IngredientCategory, Product } from '@/types';
import { buildCatalog } from '@/engine/catalog';
import { INGREDIENTS_PART1 } from './ingredients/part1';
import { INGREDIENTS_PART2 } from './ingredients/part2';
import { PRODUCTS_PART1 } from './products/part1';
import { PRODUCTS_PART2 } from './products/part2';
import { PRODUCTS_PART3 } from './products/part3';
import { PRODUCTS_PART4 } from './products/part4';
import { PRODUCTS_PART5 } from './products/part5';
import { PRODUCTS_PART6 } from './products/part6';
import { PRODUCTS_PART7 } from './products/part7';
import { PRODUCTS_PART8 } from './products/part8';
import { BRAND_ALIASES } from './brands';
import { isChosungQuery, searchTokens, toChosung } from '@/lib/hangul';
import { INTERACTIONS } from './interactions';

export { INTERACTIONS };
export { CONCERNS, CONCERN_MAP, CATEGORY_LABEL, CATEGORY_COLOR, SKIN_TYPES, SKIN_TYPE_LABEL } from './concerns';

/** 성분 마스터 데이터 (데모/미검증) */
export const INGREDIENTS: Ingredient[] = [...INGREDIENTS_PART1, ...INGREDIENTS_PART2];

/** 제품 마스터 데이터 (데모/미검증) */
export const PRODUCTS: Product[] = [
  ...PRODUCTS_PART1,
  ...PRODUCTS_PART2,
  ...PRODUCTS_PART3,
  ...PRODUCTS_PART4,
  ...PRODUCTS_PART5,
  ...PRODUCTS_PART6,
  ...PRODUCTS_PART7,
  ...PRODUCTS_PART8,
];

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
  /** 브랜드 + 제품명 + 별칭을 모두 붙인 건초더미 — 토큰이 다 들어 있는지 볼 때 쓴다 */
  hay: string;
  /** 건초더미의 초성 — "ㅈㄹㅇㄷ" 같은 초성 검색용 */
  chosung: string;
}

const indexEntry = (p: Product): ProductIndexEntry => {
  const brand = norm(p.brand);
  const name = norm(p.name);
  const aliases = [...p.aliases, ...(BRAND_ALIASES[p.brand] ?? [])].map(norm);
  const hay = [brand, name, ...aliases].join(' ');
  return {
    product: p,
    brand,
    name,
    aliases,
    hay,
    chosung: toChosung(hay),
    ingredientNames: p.keyIngredients.flatMap((id) => {
      const ing = CATALOG.ingredients.get(id);
      return ing ? [norm(ing.nameKo), norm(ing.nameInci)] : [];
    }),
  };
};

const PRODUCT_INDEX: ProductIndexEntry[] = PRODUCTS.map(indexEntry);

/**
 * 한 제품이 검색어에 얼마나 맞는지 점수를 낸다. 0 이면 결과에서 빼고, 클수록 위로 올라간다.
 *
 * 쇼핑몰에 적힌 긴 이름(“제로이드 인텐시브 크림 80ml 기획”)을 그대로 치거나
 * 가운데를 빼고 치는(“제로이드 크림”) 경우가 많아, 붙여 쓴 검색어뿐 아니라
 * 공백으로 쪼갠 토큰이 **모두** 들어 있는지도 본다.
 */
function scoreEntry(e: ProductIndexEntry, whole: string, tokens: string[], chosung: string | null): number {
  if (e.brand === whole) return 100;
  if (e.brand.startsWith(whole)) return 92;
  if (e.name.startsWith(whole)) return 88;
  if (e.aliases.includes(whole)) return 84;
  if (e.brand.includes(whole)) return 74;
  if (e.name.includes(whole)) return 68;
  if (e.aliases.some((a) => a.includes(whole))) return 58;
  if (e.hay.includes(whole)) return 50;

  // 토큰 전부 일치 — "제로이드 크림", "크림 제로이드" 처럼 순서나 중간 단어가 달라도 찾는다
  if (tokens.length > 1 && tokens.every((t) => e.hay.includes(t))) {
    // 브랜드가 토큰으로 정확히 걸리면 같은 점수대에서 위로 올린다
    return tokens.some((t) => e.brand === t) ? 56 : 44;
  }

  if (chosung && e.chosung.includes(chosung)) return 36;
  if (e.ingredientNames.some((n) => n.includes(whole))) return 22;
  return 0;
}

/**
 * 브랜드명/제품명/별칭/성분명 검색.
 * "헤라" 만 입력해도 헤라 제품 여러 개가 나오고, "ㅈㄹㅇㄷ" 같은 초성도 받는다.
 */
export function searchProducts(query: string, limit = 40, extra: Product[] = []): Product[] {
  const whole = norm(query);
  if (whole.length < 1) return [];
  const rawTokens = searchTokens(query);
  const tokens = rawTokens.map(norm).filter(Boolean);
  // 두 글자 이상인 토큰이 하나도 없으면 토큰 검색은 너무 많이 걸려서 끈다
  const useTokens = tokens.some((t) => t.length >= 2) ? tokens : [];
  const chosung = isChosungQuery(query) ? query.replace(/\s+/g, '') : null;

  const entries = extra.length ? [...extra.map(indexEntry), ...PRODUCT_INDEX] : PRODUCT_INDEX;
  const scored: { p: Product; s: number }[] = [];
  entries.forEach((e) => {
    const s = scoreEntry(e, whole, useTokens, chosung);
    if (s > 0) scored.push({ p: e.product, s });
  });
  return scored
    .sort((a, b) => b.s - a.s || a.p.brand.localeCompare(b.p.brand, 'ko') || a.p.name.localeCompare(b.p.name, 'ko'))
    .slice(0, limit)
    .map((x) => x.p);
}

/** 검색어 안에 들어 있는 브랜드를 찾는다 — 긴 브랜드명이 먼저 걸리도록 길이 순으로 본다 */
export function matchBrandInQuery(query: string): string | null {
  const whole = norm(query);
  if (!whole) return null;
  const tokens = searchTokens(query).map(norm).filter(Boolean);
  const chosung = isChosungQuery(query) ? query.replace(/\s+/g, '') : null;

  let best: { brand: string; len: number } | null = null;
  for (const brand of Object.keys(BRAND_ALIASES)) {
    for (const variant of [brand, ...(BRAND_ALIASES[brand] ?? [])]) {
      const v = norm(variant);
      if (v.length < 2) continue;
      const hit =
        whole.includes(v) ||
        v.includes(whole) ||
        tokens.some((t) => t === v || v.startsWith(t) || t.startsWith(v)) ||
        (chosung !== null && toChosung(v) === chosung);
      if (hit && (!best || v.length > best.len)) best = { brand, len: v.length };
    }
  }
  return best?.brand ?? null;
}

export interface SearchOutcome {
  products: Product[];
  /**
   * 입력한 제품은 목록에 없지만 브랜드는 아는 경우의 브랜드명.
   * "토니모리 모찌 토너" 처럼 제품이 빠져 있어도 빈 화면 대신 그 브랜드 제품을 보여 주려고 쓴다.
   */
  widenedBrand?: string;
}

/**
 * 검색 결과 + 왜 이 결과인지. 결과가 0 이면 검색어에서 브랜드를 찾아 그 브랜드 제품으로 넓힌다.
 * 사용자가 제품을 하나하나 말해 주지 않아도 최소한 같은 브랜드까지는 닿게 하는 장치다.
 */
export function searchProductsDetailed(query: string, limit = 40, extra: Product[] = []): SearchOutcome {
  const products = searchProducts(query, limit, extra);
  if (products.length > 0) return { products };

  const brand = matchBrandInQuery(query);
  if (!brand) return { products };
  const widened = [...extra, ...PRODUCTS].filter((p) => p.brand === brand).slice(0, limit);
  if (widened.length === 0) return { products };
  return { products: widened, widenedBrand: brand };
}

/** 검색 결과가 없을 때 "혹시 이 브랜드?" 로 제안할 브랜드 — 초성·부분 일치로 찾는다 */
export function suggestBrands(query: string, limit = 4): string[] {
  const whole = norm(query);
  if (whole.length < 1) return [];
  const chosung = isChosungQuery(query) ? query.replace(/\s+/g, '') : null;
  const counts = new Map<string, number>();
  PRODUCTS.forEach((p) => counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1));
  return [...counts.keys()]
    .filter((brand) => {
      const n = norm(brand);
      if (n.includes(whole) || whole.includes(n)) return true;
      const variants = BRAND_ALIASES[brand] ?? [];
      if (variants.some((v) => norm(v).includes(whole))) return true;
      return Boolean(chosung && toChosung(n).includes(chosung));
    })
    .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
    .slice(0, limit);
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
