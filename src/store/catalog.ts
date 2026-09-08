import { useMemo } from 'react';
import type { Product } from '@/types';
import { CATALOG, INGREDIENTS, INTERACTIONS, PRODUCTS, getProduct } from '@/data';
import { buildCatalog, type Catalog } from '@/engine/catalog';
import { useAppStore } from './useAppStore';

/**
 * 마스터 제품 + 사용자가 직접 등록한 제품을 합친 카탈로그.
 * 직접 등록한 제품이 없으면 정적 CATALOG 를 그대로 재사용한다.
 */
export function useCatalog(): Catalog {
  const custom = useAppStore((s) => s.customProducts);
  return useMemo(() => (custom.length ? buildCatalog(INGREDIENTS, [...PRODUCTS, ...custom], INTERACTIONS) : CATALOG), [custom]);
}

/** id 로 제품 찾기 — 마스터에 없으면 직접 등록한 제품에서 찾는다 (훅 아님) */
export function findProduct(id: string): Product | undefined {
  return getProduct(id) ?? useAppStore.getState().customProducts.find((p) => p.id === id);
}

/** 훅 버전 — 직접 등록 제품이 바뀌면 다시 계산된다 */
export function useProduct(id: string): Product | undefined {
  const custom = useAppStore((s) => s.customProducts);
  return useMemo(() => getProduct(id) ?? custom.find((p) => p.id === id), [id, custom]);
}
