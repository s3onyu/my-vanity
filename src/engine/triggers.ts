import type { ProductMatch } from '@/types';
import type { Catalog } from './catalog';

export interface TriggerInfo {
  /** 기피 제품 2개 이상에 공통으로 들어 있는 성분 id (최대 3개) */
  triggerIds: string[];
  /** 잘 맞은 제품들의 성분 id 합집합 */
  goodIds: string[];
  avoidedProductIds: string[];
  goodProductIds: string[];
}

/** 어디에나 들어 있어 원인 추정에 도움이 안 되는 성분 */
const UBIQUITOUS = new Set(['glycerin']);

/**
 * 내 피부 궁합 기록에서 의심 성분(trigger)과 잘 맞은 성분을 추출한다.
 * 상관관계일 뿐 원인이라고 단정할 수 없다 — UI 에서 반드시 안내 문구와 함께 표시한다.
 */
export function extractTriggers(matches: ProductMatch[], catalog: Catalog): TriggerInfo {
  const avoided = matches.filter((m) => m.matchType === 'avoided').map((m) => m.productId);
  const good = matches.filter((m) => m.matchType === 'good').map((m) => m.productId);

  const goodIds = new Set<string>();
  good.forEach((pid) => catalog.products.get(pid)?.keyIngredients.forEach((i) => goodIds.add(i)));

  let triggerIds: string[] = [];
  if (avoided.length >= 2) {
    const counts = new Map<string, number>();
    avoided.forEach((pid) => {
      new Set(catalog.products.get(pid)?.keyIngredients ?? []).forEach((i) => counts.set(i, (counts.get(i) ?? 0) + 1));
    });
    const isActiveOrFragrance = (id: string) => {
      const tags = catalog.ingredients.get(id)?.tags ?? [];
      return tags.includes('active') || tags.includes('fragrance') || tags.includes('essential-oil');
    };
    triggerIds = [...counts.entries()]
      .filter(([id, c]) => c >= 2 && !UBIQUITOUS.has(id))
      // 활성/향료 성분을 우선, 그 다음 등장 횟수
      .sort((a, b) => Number(isActiveOrFragrance(b[0])) - Number(isActiveOrFragrance(a[0])) || b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
  }

  return { triggerIds, goodIds: [...goodIds], avoidedProductIds: avoided, goodProductIds: good };
}
