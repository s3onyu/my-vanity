import type { ConcernId, IngredientInteraction, Product, ProductCategory, ProductMatch, RoutineType, SkinType } from '@/types';
import { CONCERN_MAP, SKIN_TYPE_LABEL } from '@/data/concerns';
import { type Catalog, findInteraction, ingredientName } from './catalog';
import { STRONG_ACTIVES } from './constants';
import { extractTriggers, type TriggerInfo } from './triggers';

export interface RecommendInput {
  routineType: RoutineType;
  /** 현재 보고 있는 루틴(AM 또는 PM)의 제품 id */
  routineProductIds: string[];
  /** 아침+저녁 전체 보유 제품 id (추천 후보에서 제외) */
  ownedProductIds: string[];
  skinType: SkinType | null;
  concerns: ConcernId[];
  matches: ProductMatch[];
  concernFilter: ConcernId | 'all';
  limit?: number;
}

export interface Recommendation {
  product: Product;
  score: number;
  matchedConcerns: ConcernId[];
  freshIngredients: string[];
  conflicts: IngredientInteraction[];
  goodMatchIngredients: string[];
  triggerHits: string[];
  /** 왜 추천되었는지 */
  reason: string;
  /** 기존 루틴과 충돌 등 경고 */
  warnings: string[];
  fillsSunscreenGap: boolean;
}

export interface GapAlert {
  category: ProductCategory;
  title: string;
  desc: string;
}

export interface RecommendResult {
  items: Recommendation[];
  triggers: TriggerInfo;
  gaps: GapAlert[];
}

function routineIngredientSet(ids: string[], catalog: Catalog): Set<string> {
  const set = new Set<string>();
  ids.forEach((pid) => catalog.products.get(pid)?.keyIngredients.forEach((i) => set.add(i)));
  return set;
}

function conflictsWithRoutine(product: Product, have: Set<string>, catalog: Catalog): IngredientInteraction[] {
  const out: IngredientInteraction[] = [];
  product.keyIngredients.forEach((a) => {
    have.forEach((b) => {
      if (a === b) return;
      const ix = findInteraction(catalog, a, b);
      if (ix && (ix.severity === 'caution' || ix.severity === 'high_caution') && !out.some((o) => o.id === ix.id)) {
        out.push(ix);
      }
    });
  });
  return out;
}

/** 아침/저녁 루틴에 필수 카테고리가 비어 있으면 안내 */
export function findGaps(routineType: RoutineType, routineProductIds: string[], catalog: Catalog): GapAlert[] {
  const cats = new Set(routineProductIds.map((id) => catalog.products.get(id)?.category));
  const gaps: GapAlert[] = [];
  if (routineType === 'AM' && !cats.has('선크림')) {
    gaps.push({
      category: '선크림',
      title: '아침 루틴에 선크림 칸이 비어 있어요',
      desc: '자외선 차단은 아침 루틴의 마지막 단계로 가장 자주 권장돼요. 활성 성분을 쓴다면 더 중요해요.',
    });
  }
  if (!cats.has('크림') && !cats.has('로션')) {
    gaps.push({
      category: '크림',
      title: `${routineType === 'AM' ? '아침' : '저녁'} 루틴에 보습 마무리(크림/로션)가 없어요`,
      desc: '세럼·앰플만 쓰면 수분이 쉽게 날아갈 수 있어요. 마무리 단계를 하나 더하는 편이 무난해요.',
    });
  }
  return gaps;
}

/**
 * 고민 기반 추천 엔진 (FOR YOU).
 * 명세 5-3 + 5-4 의 규칙을 그대로 반영한다.
 */
export function recommend(input: RecommendInput, catalog: Catalog): RecommendResult {
  const limit = input.limit ?? 5;
  const triggers = extractTriggers(input.matches, catalog);
  const owned = new Set(input.ownedProductIds);
  const avoided = new Set(triggers.avoidedProductIds);
  const goodIds = new Set(triggers.goodIds);
  const triggerIds = new Set(triggers.triggerIds);
  const have = routineIngredientSet(input.routineProductIds, catalog);
  const routineCats = new Set(input.routineProductIds.map((id) => catalog.products.get(id)?.category));
  const isAM = input.routineType === 'AM';
  const skinLabel = input.skinType ? SKIN_TYPE_LABEL[input.skinType] : null;

  const scored: Recommendation[] = [];

  catalog.products.forEach((p) => {
    if (owned.has(p.id)) return; // 이미 루틴에 있음
    if (avoided.has(p.id)) return; // 기피 제품은 완전히 제외
    if (!isAM && p.category === '선크림') return; // 저녁에는 선크림 후보 제외
    if (input.concernFilter !== 'all' && !p.relatedConcerns.includes(input.concernFilter)) return;

    let s = 0;
    const matched = input.concerns.filter((c) => p.relatedConcerns.includes(c));
    s += matched.length * 30;
    if (input.concernFilter !== 'all') s += 20;

    const skinMatch = Boolean(input.skinType && p.skinTypes.includes(input.skinType));
    if (skinMatch) s += 18;

    const fresh = p.keyIngredients.filter((i) => !have.has(i));
    s += fresh.length * 4;
    if (fresh.length === 0) s -= 20;

    const conflicts = conflictsWithRoutine(p, have, catalog);
    conflicts.forEach((c) => {
      s -= c.severity === 'high_caution' ? 20 : 14;
    });

    if (!routineCats.has(p.category)) s += 8;

    const fillsSunscreenGap = isAM && p.category === '선크림' && !routineCats.has('선크림');
    if (fillsSunscreenGap) s += 26;

    if (input.skinType === 'sensitive' && p.keyIngredients.some((i) => STRONG_ACTIVES.has(i))) s -= 26;
    if (input.skinType === 'oily' && p.category === '오일') s -= 8;

    const triggerHits = p.keyIngredients.filter((i) => triggerIds.has(i));
    s -= Math.min(44, triggerHits.length * 22);

    const goodMatchIngredients = p.keyIngredients.filter((i) => goodIds.has(i));
    s += Math.min(18, goodMatchIngredients.length * 6);

    // ---- 근거 문장
    const parts: string[] = [];
    if (matched.length) parts.push(`${matched.map((m) => CONCERN_MAP[m].title).join(' · ')} 고민과 연결되는 성분이 들어 있어요`);
    else if (input.concernFilter !== 'all') parts.push(`${CONCERN_MAP[input.concernFilter].title} 쪽에서 자주 언급되는 구성이에요`);
    if (skinMatch && skinLabel) parts.push(`${skinLabel} 피부에서 무난하게 선택되는 편이에요`);
    if (fresh.length) parts.push(`지금 루틴에 없는 ${fresh.slice(0, 2).map((i) => ingredientName(catalog, i)).join(', ')}를 새로 더해요`);
    if (fillsSunscreenGap) parts.push('아침 루틴의 빈 선크림 칸을 채워요');
    if (goodMatchIngredients.length)
      parts.push(`예전에 잘 맞았던 성분(${goodMatchIngredients.slice(0, 2).map((i) => ingredientName(catalog, i)).join(', ')})이 들어 있어요`);

    const warnings: string[] = [];
    conflicts.forEach((c) =>
      warnings.push(
        `기존 루틴의 ${ingredientName(catalog, c.ingredientA)}·${ingredientName(catalog, c.ingredientB)} 조합은 ${
          c.severity === 'high_caution' ? '특히 주의' : '주의'
        }가 필요해요: ${c.recommendation}`,
      ),
    );
    if (triggerHits.length)
      warnings.push(`기피한 제품들에 공통으로 들어 있던 ${triggerHits.map((i) => ingredientName(catalog, i)).join(', ')}이(가) 포함돼 있어요`);
    if (input.skinType === 'sensitive' && p.keyIngredients.some((i) => STRONG_ACTIVES.has(i)))
      warnings.push('민감성 경향 피부에는 강한 활성 성분이라 소량·격일로 시작하는 편이 권장돼요');

    scored.push({
      product: p,
      score: s,
      matchedConcerns: matched,
      freshIngredients: fresh,
      conflicts,
      goodMatchIngredients,
      triggerHits,
      reason: parts.length ? `${parts.join('. ')}.` : '설정한 고민과 직접 연결되진 않지만 루틴에 새로운 성분을 더해요.',
      warnings,
      fillsSunscreenGap,
    });
  });

  scored.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'ko'));

  // 브랜드 쏠림 방지: 한 브랜드 최대 1개
  const seenBrand = new Set<string>();
  const items: Recommendation[] = [];
  for (const r of scored) {
    if (seenBrand.has(r.product.brand)) continue;
    seenBrand.add(r.product.brand);
    items.push(r);
    if (items.length >= limit) break;
  }

  return { items, triggers, gaps: findGaps(input.routineType, input.routineProductIds, catalog) };
}
