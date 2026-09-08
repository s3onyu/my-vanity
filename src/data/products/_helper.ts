import type { ConcernId, Product, ProductCategory, SkinType } from '@/types';

const split = (s: string) => (s ? s.split('|').map((x) => x.trim()).filter(Boolean) : []);

/**
 * 시드 데이터 압축 표기 도우미.
 * p(id, 브랜드, 제품명, '별칭|별칭', 카테고리, '성분id|성분id', '고민|고민', '피부타입|피부타입', verified?)
 */
export function p(
  id: string,
  brand: string,
  name: string,
  aliases: string,
  category: ProductCategory,
  keyIngredients: string,
  relatedConcerns: string,
  skinTypes: string,
  verified = false,
): Product {
  return {
    id,
    brand,
    name,
    aliases: split(aliases),
    category,
    keyIngredients: split(keyIngredients),
    relatedConcerns: split(relatedConcerns) as ConcernId[],
    skinTypes: split(skinTypes) as SkinType[],
    verified,
  };
}
