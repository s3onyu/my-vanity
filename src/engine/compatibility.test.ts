import { describe, expect, it } from 'vitest';
import type { ConcernId, Ingredient, IngredientInteraction, Product } from '@/types';
import { buildCatalog } from './catalog';
import { analyzeRoutine } from './compatibility';
import { recommend } from './recommend';
import { extractTriggers } from './triggers';

// ---------------------------------------------------------------------------
//  테스트용 미니 카탈로그
// ---------------------------------------------------------------------------

const ing = (id: string, extra: Partial<Ingredient> = {}): Ingredient => ({
  id,
  nameKo: id,
  nameInci: id,
  categories: ['hydration'],
  colorTag: 'sky',
  shortDesc: '',
  longDesc: '',
  pairsWell: [],
  pairCaution: [],
  relatedConcerns: [],
  source: '',
  evidenceLevel: 'moderate',
  lastReviewed: '2026-08-01',
  ...extra,
});

const INGREDIENTS: Ingredient[] = [
  ing('niacinamide', { tags: ['active'] }),
  ing('retinol', { tags: ['active'] }),
  ing('glycolic-acid', { tags: ['active'] }),
  ing('salicylic-acid', { tags: ['active'] }),
  ing('ascorbic-acid', { tags: ['active'] }),
  ing('tea-tree', { tags: ['active', 'essential-oil', 'fragrance'] }),
  ing('lavender-oil', { tags: ['essential-oil', 'fragrance'] }),
  ing('fragrance', { tags: ['fragrance'] }),
  ing('ceramide'),
  ing('panthenol'),
  ing('centella'),
  ing('squalane'),
  ing('hyaluronic-acid'),
  ing('glycerin'),
  ing('betaine'),
  ing('shea-butter'),
  ing('zinc-oxide', { tags: ['filter'] }),
  ing('tocopherol'),
  ing('ferulic-acid'),
];

const prod = (id: string, brand: string, category: Product['category'], key: string[], extra: Partial<Product> = {}): Product => ({
  id,
  brand,
  name: id,
  aliases: [],
  category,
  keyIngredients: key,
  relatedConcerns: ['dryness'],
  skinTypes: ['dry', 'normal', 'combo', 'oily', 'sensitive'],
  verified: false,
  ...extra,
});

const PRODUCTS: Product[] = [
  prod('toner', 'A', '토너', ['panthenol', 'betaine', 'hyaluronic-acid']),
  prod('serum-nia', 'B', '세럼', ['niacinamide', 'hyaluronic-acid']),
  prod('cream-cer', 'C', '크림', ['ceramide', 'squalane', 'glycerin']),
  prod('sunscreen', 'D', '선크림', ['zinc-oxide', 'centella']),
  prod('retinol-serum', 'E', '세럼', ['retinol', 'squalane']),
  prod('aha-toner', 'F', '토너', ['glycolic-acid']),
  prod('bha-pad', 'G', '패드', ['salicylic-acid', 'tea-tree']),
  prod('vitc', 'H', '세럼', ['ascorbic-acid', 'tocopherol', 'ferulic-acid']),
  prod('cream1', 'I', '크림', ['ceramide', 'glycerin']),
  prod('cream2', 'J', '크림', ['shea-butter', 'glycerin']),
  prod('cream3', 'K', '크림', ['ceramide', 'panthenol']),
  prod('cream4', 'L', '크림', ['squalane', 'glycerin']),
  prod('cream5', 'M', '크림', ['ceramide', 'glycerin', 'betaine']),
  prod('lav-cream', 'N', '크림', ['lavender-oil', 'fragrance', 'shea-butter']),
  prod('lav-oil', 'O', '오일', ['lavender-oil', 'squalane']),
  prod('tt-toner', 'P', '토너', ['tea-tree', 'fragrance']),
  // 추천 테스트용 후보
  prod('cand-sun', 'SunBrand', '선크림', ['zinc-oxide', 'panthenol'], { relatedConcerns: ['pigmentation'] }),
  prod('cand-cream-a', 'Q', '크림', ['ceramide', 'centella'], { relatedConcerns: ['barrier', 'dryness'] }),
  prod('cand-cream-b', 'Q', '크림', ['ceramide', 'panthenol'], { relatedConcerns: ['barrier', 'dryness'] }),
  prod('cand-tt', 'R', '세럼', ['tea-tree', 'niacinamide'], { relatedConcerns: ['breakout'] }),
  prod('cand-avoided', 'S', '세럼', ['betaine'], { relatedConcerns: ['dryness'] }),
  prod('avoid1', 'T', '세럼', ['tea-tree', 'glycerin']),
  prod('avoid2', 'U', '토너', ['tea-tree', 'betaine']),
];

const INTERACTIONS: IngredientInteraction[] = [
  { id: 'ix1', ingredientA: 'retinol', ingredientB: 'glycolic-acid', severity: 'caution', reason: '', recommendation: '아침/저녁으로 나눠요' },
  { id: 'ix2', ingredientA: 'retinol', ingredientB: 'salicylic-acid', severity: 'caution', reason: '', recommendation: '' },
  { id: 'ix3', ingredientA: 'ascorbic-acid', ingredientB: 'tocopherol', severity: 'good', reason: '', recommendation: '' },
  { id: 'ix4', ingredientA: 'ascorbic-acid', ingredientB: 'ferulic-acid', severity: 'good', reason: '', recommendation: '' },
  { id: 'ix5', ingredientA: 'retinol', ingredientB: 'ascorbic-acid', severity: 'caution', reason: '', recommendation: '' },
  { id: 'ix6', ingredientA: 'ceramide', ingredientB: 'retinol', severity: 'good', reason: '', recommendation: '' },
];

const catalog = buildCatalog(INGREDIENTS, PRODUCTS, INTERACTIONS);

// ---------------------------------------------------------------------------

describe('analyzeRoutine — 궁합 점수 엔진', () => {
  it('빈 루틴은 0점과 empty 플래그를 돌려준다', () => {
    const r = analyzeRoutine({ productIds: [], routineType: 'AM', skinType: 'normal' }, catalog);
    expect(r.empty).toBe(true);
    expect(r.score).toBe(0);
  });

  it('균형 잡힌 아침 루틴(토너·나이아신 세럼·세라마이드 크림·선크림)은 88점 이상', () => {
    const r = analyzeRoutine(
      { productIds: ['toner', 'serum-nia', 'cream-cer', 'sunscreen'], routineType: 'AM', skinType: 'normal' },
      catalog,
    );
    expect(r.score).toBeGreaterThanOrEqual(88);
    expect(r.reasons.some((x) => x.key === 'positive-bonus')).toBe(true);
    // 위험 요소가 없다는 이유만으로 만점은 아님
    expect(r.score).toBeLessThanOrEqual(96);
  });

  it('크림 5개를 담으면 카테고리 중복 감점으로 50점대까지 떨어진다', () => {
    const r = analyzeRoutine(
      { productIds: ['cream1', 'cream2', 'cream3', 'cream4', 'cream5'], routineType: 'PM', skinType: 'normal' },
      catalog,
    );
    expect(r.score).toBeGreaterThanOrEqual(45);
    expect(r.score).toBeLessThan(60);
    const cat = r.reasons.find((x) => x.key === 'category-duplicate');
    expect(cat).toBeDefined();
    expect(cat!.delta).toBeLessThanOrEqual(-36);
  });

  it('세럼 여러 개는 크림 여러 개보다 훨씬 약하게 감점된다', () => {
    const creams = analyzeRoutine({ productIds: ['cream1', 'cream2', 'cream3'], routineType: 'PM', skinType: 'normal' }, catalog);
    const serums = analyzeRoutine(
      { productIds: ['serum-nia', 'retinol-serum', 'vitc'], routineType: 'PM', skinType: 'normal' },
      catalog,
    );
    const creamPenalty = creams.reasons.find((x) => x.key === 'category-duplicate')!.delta;
    const serumPenalty = serums.reasons.find((x) => x.key === 'category-duplicate')!.delta;
    expect(Math.abs(serumPenalty)).toBeLessThan(Math.abs(creamPenalty) / 2);
  });

  it('레티놀 + AHA + BHA 를 민감성 피부가 아침에 선크림 없이 쓰면 40점 미만', () => {
    const r = analyzeRoutine(
      { productIds: ['retinol-serum', 'aha-toner', 'bha-pad'], routineType: 'AM', skinType: 'sensitive' },
      catalog,
    );
    expect(r.score).toBeLessThan(40);
    const keys = r.reasons.map((x) => x.key);
    expect(keys).toContain('active-load');
    expect(keys).toContain('skin-type');
    expect(keys).toContain('mechanism-stacking');
    expect(keys).toContain('interaction');
    expect(keys).toContain('structural-gap');
    expect(r.reasons.filter((x) => x.key === 'structural-gap').some((x) => x.label.includes('선크림'))).toBe(true);
  });

  it('같은 루틴이라도 중성 피부보다 민감성 피부의 점수가 낮다', () => {
    const ids = ['retinol-serum', 'cream-cer'];
    const normal = analyzeRoutine({ productIds: ids, routineType: 'PM', skinType: 'normal' }, catalog);
    const sensitive = analyzeRoutine({ productIds: ids, routineType: 'PM', skinType: 'sensitive' }, catalog);
    expect(sensitive.score).toBeLessThan(normal.score);
  });

  it('장벽 지지 성분이 있으면 활성 성분 부담이 완화된다', () => {
    const bare = analyzeRoutine({ productIds: ['aha-toner'], routineType: 'PM', skinType: 'normal' }, catalog);
    const buffered = analyzeRoutine({ productIds: ['aha-toner', 'cream-cer'], routineType: 'PM', skinType: 'normal' }, catalog);
    expect(buffered.score).toBeGreaterThan(bare.score);
    expect(buffered.reasons.some((x) => x.key === 'barrier-relief')).toBe(true);
    expect(bare.reasons.some((x) => x.key === 'structural-gap' && x.label.includes('장벽'))).toBe(true);
  });

  it('향료·에센셜오일이 여러 제품에 겹치면 감점되고 민감성은 더 감점된다', () => {
    const ids = ['lav-cream', 'lav-oil', 'tt-toner'];
    const normal = analyzeRoutine({ productIds: ids, routineType: 'PM', skinType: 'normal' }, catalog);
    const sensitive = analyzeRoutine({ productIds: ids, routineType: 'PM', skinType: 'sensitive' }, catalog);
    const fn = normal.reasons.find((x) => x.key === 'fragrance')!;
    const fs = sensitive.reasons.find((x) => x.key === 'fragrance')!;
    expect(fn.delta).toBeLessThan(0);
    expect(fs.delta).toBe(fn.delta - 3);
  });

  it('제품이 5개를 넘고 성분이 12종을 넘으면 누적 노출 감점이 붙는다', () => {
    const r = analyzeRoutine(
      {
        productIds: ['toner', 'serum-nia', 'cream-cer', 'sunscreen', 'vitc', 'lav-oil', 'cream2'],
        routineType: 'AM',
        skinType: 'normal',
      },
      catalog,
    );
    expect(r.reasons.some((x) => x.key === 'overexposure')).toBe(true);
  });

  it('좋은 조합(비타민C + E + 페룰릭)은 소폭 가점된다', () => {
    const r = analyzeRoutine({ productIds: ['vitc', 'cream-cer', 'sunscreen'], routineType: 'AM', skinType: 'normal' }, catalog);
    const good = r.reasons.find((x) => x.key === 'interaction' && x.delta > 0);
    expect(good).toBeDefined();
  });

  it('점수는 항상 8~96 사이로 클램프된다', () => {
    const worst = analyzeRoutine(
      {
        productIds: ['retinol-serum', 'aha-toner', 'bha-pad', 'vitc', 'cream1', 'cream2', 'cream3', 'cream4', 'cream5', 'lav-cream', 'tt-toner'],
        routineType: 'AM',
        skinType: 'sensitive',
      },
      catalog,
    );
    expect(worst.score).toBeGreaterThanOrEqual(8);
    expect(worst.score).toBeLessThanOrEqual(96);
  });
});

describe('extractTriggers — 의심 성분 추출', () => {
  it('기피 제품이 2개 이상이고 공통 성분이 있으면 의심 성분으로 뽑는다', () => {
    const t = extractTriggers(
      [
        { id: 'm1', productId: 'avoid1', matchType: 'avoided', createdAt: '' },
        { id: 'm2', productId: 'avoid2', matchType: 'avoided', createdAt: '' },
      ],
      catalog,
    );
    expect(t.triggerIds).toEqual(['tea-tree']);
  });

  it('기피 제품이 1개면 의심 성분을 뽑지 않는다', () => {
    const t = extractTriggers([{ id: 'm1', productId: 'avoid1', matchType: 'avoided', createdAt: '' }], catalog);
    expect(t.triggerIds).toEqual([]);
  });
});

describe('recommend — 고민 기반 추천 엔진', () => {
  const base = {
    routineType: 'AM' as const,
    routineProductIds: ['toner', 'serum-nia'],
    ownedProductIds: ['toner', 'serum-nia'],
    skinType: 'dry' as const,
    concerns: ['dryness', 'barrier'] as ConcernId[],
    matches: [],
    concernFilter: 'all' as const,
  };

  it('아침 루틴에 선크림이 없으면 선크림 후보가 가점을 받고 빈칸 알림이 뜬다', () => {
    const r = recommend({ ...base, concerns: ['dryness', 'barrier'] }, catalog);
    expect(r.gaps.some((g) => g.category === '선크림')).toBe(true);
    expect(r.items.some((i) => i.fillsSunscreenGap)).toBe(true);
  });

  it('저녁 루틴에는 선크림 후보가 제외된다', () => {
    const r = recommend({ ...base, routineType: 'PM', concerns: ['dryness', 'barrier'] }, catalog);
    expect(r.items.every((i) => i.product.category !== '선크림')).toBe(true);
  });

  it('한 브랜드에서 최대 1개만 노출된다', () => {
    const r = recommend({ ...base, concerns: ['dryness', 'barrier'] }, catalog);
    const brands = r.items.map((i) => i.product.brand);
    expect(new Set(brands).size).toBe(brands.length);
  });

  it('기피 제품은 후보에서 제외되고 의심 성분이 든 제품은 크게 감점된다', () => {
    const matches = [
      { id: 'm1', productId: 'avoid1', matchType: 'avoided' as const, createdAt: '' },
      { id: 'm2', productId: 'avoid2', matchType: 'avoided' as const, createdAt: '' },
      { id: 'm3', productId: 'cand-avoided', matchType: 'avoided' as const, createdAt: '' },
    ];
    const r = recommend({ ...base, matches, concerns: ['dryness', 'barrier', 'breakout'], limit: 50 }, catalog);
    expect(r.items.every((i) => i.product.id !== 'cand-avoided')).toBe(true);
    const tt = r.items.find((i) => i.product.id === 'cand-tt');
    expect(tt).toBeDefined();
    expect(tt!.triggerHits).toEqual(['tea-tree']);
    expect(tt!.warnings.some((w) => w.includes('기피한 제품'))).toBe(true);
  });

  it('잘 맞은 제품의 성분이 든 후보는 가점과 안내 문구를 받는다', () => {
    const matches = [{ id: 'm1', productId: 'cream-cer', matchType: 'good' as const, createdAt: '' }];
    const r = recommend({ ...base, matches, limit: 50 }, catalog);
    const a = r.items.find((i) => i.product.id === 'cand-cream-a');
    expect(a).toBeDefined();
    expect(a!.goodMatchIngredients).toContain('ceramide');
    expect(a!.reason).toContain('예전에 잘 맞았던 성분');
  });

  it('민감성 피부에는 강한 활성 성분 제품이 감점된다', () => {
    const normal = recommend({ ...base, skinType: 'normal', concerns: ['breakout'], limit: 50 }, catalog);
    const sensitive = recommend({ ...base, skinType: 'sensitive', concerns: ['breakout'], limit: 50 }, catalog);
    const n = normal.items.find((i) => i.product.id === 'cand-tt')!;
    const s = sensitive.items.find((i) => i.product.id === 'cand-tt')!;
    expect(s.score).toBeLessThan(n.score);
  });

  it('고민 필터를 걸면 해당 고민이 없는 제품은 제외된다', () => {
    const r = recommend({ ...base, concernFilter: 'breakout', concerns: ['breakout'], limit: 50 }, catalog);
    expect(r.items.every((i) => i.product.relatedConcerns.includes('breakout'))).toBe(true);
  });
});
