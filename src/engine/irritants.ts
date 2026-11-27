import type { Product, SkinType, SourceRef } from '@/types';
import { SKIN_TYPE_LABEL } from '@/data/concerns';
import { resolveSources } from '@/data/sources';
import { type Catalog, ingredientName } from './catalog';
import { ACTIVE_WEIGHTS, EXFOLIATION_FAMILY, FAMILY_LABEL, STRONG_ACTIVES } from './constants';

/** 유분이 묵직해서 지성·여드름 경향 피부에서 답답하다는 이야기가 자주 나오는 성분 */
const HEAVY_OILS = new Set([
  'petrolatum',
  'mineral-oil',
  'shea-butter',
  'olive-oil',
  'evening-primrose-oil',
  'camellia-oil',
  'coconut-oil',
]);

/** 건조·당김과 가장 자주 연결되는 성분 */
const DRYING = new Set(['alcohol-denat', 'kaolin', 'sulfur', 'benzoyl-peroxide', 'silica']);

export type IrritantReason = 'strong-active' | 'exfoliation' | 'fragrance' | 'essential-oil' | 'drying' | 'heavy-oil';

export interface IrritantFlag {
  ingredientId: string;
  name: string;
  reason: IrritantReason;
  /** 왜 이 피부 타입에 신경 쓰이는지 한 줄 */
  why: string;
  /** 어떻게 쓰면 되는지 */
  tip: string;
  /** 1 = 참고, 2 = 주의, 3 = 특히 주의 */
  level: 1 | 2 | 3;
  sources: SourceRef[];
}

export interface IrritantCheck {
  skinType: SkinType | null;
  flags: IrritantFlag[];
  /** 가장 높은 level */
  level: 0 | 1 | 2 | 3;
  /** 한 줄 요약 — 없으면 null */
  summary: string | null;
}

const SOURCE_BY_REASON: Record<IrritantReason, string[]> = {
  'strong-active': ['mukherjee-2006', 'zasada-2019'],
  exfoliation: ['kornhauser-2010', 'mfds-aha'],
  fragrance: ['johansen-2003'],
  'essential-oil': ['degroot-2016', 'sccs-ttol'],
  drying: ['draelos-2005'],
  'heavy-oil': ['cir'],
};

/** 이 피부 타입에서 신경 쓸 이유와 수준 — 없으면 null */
function evaluate(id: string, skinType: SkinType, catalog: Catalog): Omit<IrritantFlag, 'ingredientId' | 'name' | 'sources'> | null {
  const ing = catalog.ingredients.get(id);
  const tags = ing?.tags ?? [];
  const sensitive = skinType === 'sensitive';
  const dry = skinType === 'dry' || skinType === 'combo';
  const oily = skinType === 'oily' || skinType === 'combo';
  const family = EXFOLIATION_FAMILY[id];

  if (tags.includes('essential-oil') && (sensitive || dry)) {
    return {
      reason: 'essential-oil',
      level: sensitive ? 3 : 2,
      why: `에센셜오일은 산화되면서 접촉 알레르기를 일으킬 수 있어, ${SKIN_TYPE_LABEL[skinType]} 피부에서는 반응이 더 쉽게 올 수 있어요.`,
      tip: '귀 뒤나 턱선에 하루 먼저 발라보고, 반응이 없을 때만 얼굴 전체에 써보세요.',
    };
  }
  if (tags.includes('fragrance') && sensitive) {
    return {
      reason: 'fragrance',
      level: 2,
      why: '향료는 접촉 알레르기의 흔한 원인이고, 여러 제품에 겹치면 어느 날 갑자기 반응이 올 수 있어요.',
      tip: '향이 있는 제품은 루틴에 하나만 두거나 무향 제품으로 바꿔보세요.',
    };
  }
  if (STRONG_ACTIVES.has(id) && (sensitive || dry)) {
    return {
      reason: 'strong-active',
      level: sensitive ? 3 : 2,
      why: `효과가 센 성분이라 ${SKIN_TYPE_LABEL[skinType]} 피부에서는 건조·따가움이 먼저 올 수 있어요.`,
      tip: '저농도 제품으로 주 2회부터 시작해, 괜찮으면 천천히 늘려보세요.',
    };
  }
  if (family && sensitive) {
    return {
      reason: 'exfoliation',
      level: 2,
      why: `${FAMILY_LABEL[family]} 계열은 각질 결합을 느슨하게 해서, 민감성 경향 피부에서는 장벽이 더 쉽게 얇아질 수 있어요.`,
      tip: '쓰는 날에는 진정·보습 제품으로 마무리하고, 같은 날 다른 각질 제품은 쉬어가세요.',
    };
  }
  if (DRYING.has(id) && dry) {
    return {
      reason: 'drying',
      level: id === 'alcohol-denat' ? 2 : 1,
      why: `${SKIN_TYPE_LABEL[skinType]} 피부에서는 유분과 수분을 함께 덜어내 당김이 심해질 수 있어요.`,
      tip: '부분적으로만 쓰거나, 바른 뒤 보습 단계를 한 겹 더해주세요.',
    };
  }
  if (HEAVY_OILS.has(id) && oily) {
    return {
      reason: 'heavy-oil',
      level: 1,
      why: `유분이 묵직한 성분이라 ${SKIN_TYPE_LABEL[skinType]} 피부에서는 답답하게 느껴진다는 이야기가 자주 나와요.`,
      tip: '얼굴 전체보다 건조한 부분에만 얇게 써보세요.',
    };
  }
  // 민감성인데 활성 성분이면 (STRONG_ACTIVES 에 없더라도) 가볍게 알려준다
  if (sensitive && (ACTIVE_WEIGHTS[id] ?? 0) >= 1.2) {
    return {
      reason: 'strong-active',
      level: 1,
      why: '활성 성분이라 민감성 경향 피부에서는 처음에 따끔할 수 있어요.',
      tip: '다른 센 성분과 같은 날 겹치지 않게 써보세요.',
    };
  }
  return null;
}

/**
 * 내 피부 타입에서 자극이 될 수 있는 성분을 골라낸다 (요청 11번).
 * 진단이 아니라 "이 성분은 당신 타입에서 이런 이야기가 자주 나온다" 수준의 안내이며, 근거 자료를 함께 돌려준다.
 */
export function checkIrritants(product: Product, skinType: SkinType | null, catalog: Catalog): IrritantCheck {
  if (!skinType) return { skinType, flags: [], level: 0, summary: null };
  const flags: IrritantFlag[] = [];
  new Set(product.keyIngredients).forEach((id) => {
    const verdict = evaluate(id, skinType, catalog);
    if (!verdict) return;
    flags.push({
      ingredientId: id,
      name: ingredientName(catalog, id),
      sources: resolveSources(SOURCE_BY_REASON[verdict.reason]),
      ...verdict,
    });
  });
  flags.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name, 'ko'));
  const level = (flags.length ? flags[0].level : 0) as IrritantCheck['level'];
  const summary = flags.length
    ? `${SKIN_TYPE_LABEL[skinType]} 피부에 신경 쓰일 수 있는 성분 ${flags.length}개 — ${flags
        .slice(0, 3)
        .map((f) => f.name)
        .join(', ')}${flags.length > 3 ? ' 외' : ''}`
    : null;
  return { skinType, flags, level, summary };
}

/** 여러 제품을 한 번에 — 루틴 전체에서 내 타입에 걸리는 성분 모으기 */
export function checkRoutineIrritants(products: Product[], skinType: SkinType | null, catalog: Catalog): IrritantFlag[] {
  const byId = new Map<string, IrritantFlag>();
  products.forEach((p) =>
    checkIrritants(p, skinType, catalog).flags.forEach((f) => {
      const prev = byId.get(f.ingredientId);
      if (!prev || prev.level < f.level) byId.set(f.ingredientId, f);
    }),
  );
  return [...byId.values()].sort((a, b) => b.level - a.level);
}
