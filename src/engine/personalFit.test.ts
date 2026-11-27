import { describe, expect, it } from 'vitest';
import { CATALOG, PRODUCTS } from '@/data';
import { SOURCES } from '@/data/sources';
import type { ProductMatch } from '@/types';
import { FIT_SOURCE_IDS, buildFitProfile, recommendByFit } from './personalFit';

let seq = 0;
const match = (productId: string, matchType: 'good' | 'avoided'): ProductMatch => ({
  id: `m${seq++}`,
  productId,
  matchType,
  createdAt: '2026-11-01',
});

/** 특정 성분이 든 제품 n개의 id */
const withIngredient = (ing: string, n: number, exclude: string[] = []) =>
  PRODUCTS.filter((p) => p.keyIngredients.includes(ing) && !exclude.includes(p.id))
    .slice(0, n)
    .map((p) => p.id);

/** 특정 성분이 없는 제품 n개의 id */
const withoutIngredient = (ing: string, n: number) =>
  PRODUCTS.filter((p) => !p.keyIngredients.includes(ing))
    .slice(0, n)
    .map((p) => p.id);

describe('buildFitProfile', () => {
  it('기록이 없으면 추천할 준비가 안 된 상태다', () => {
    const profile = buildFitProfile([], CATALOG);
    expect(profile.ready).toBe(false);
    expect(profile.needMoreGood).toBe(2);
    expect(profile.favorites).toEqual([]);
    expect(profile.suspects).toEqual([]);
  });

  it('잘 맞은 제품에 반복해 나오는 성분을 favorite 으로 뽑는다', () => {
    const ids = withIngredient('ceramide', 3);
    const profile = buildFitProfile(ids.map((id) => match(id, 'good')), CATALOG);
    expect(profile.goodTotal).toBe(3);
    expect(profile.favorites.map((f) => f.ingredientId)).toContain('ceramide');
    const sig = profile.favorites.find((f) => f.ingredientId === 'ceramide')!;
    expect(sig.goodCount).toBe(3);
    expect(sig.score).toBeGreaterThan(0);
  });

  it('안 맞은 제품에 반복해 나오는 성분을 suspect 으로 뽑는다', () => {
    const ids = withIngredient('retinol', 3);
    const profile = buildFitProfile(ids.map((id) => match(id, 'avoided')), CATALOG);
    expect(profile.suspects.map((s) => s.ingredientId)).toContain('retinol');
    const sig = profile.suspects.find((s) => s.ingredientId === 'retinol')!;
    expect(sig.avoidedCount).toBe(3);
    expect(sig.score).toBeLessThan(0);
  });

  it('한 번만 나온 성분은 패턴으로 보지 않는다', () => {
    const profile = buildFitProfile([match(withIngredient('retinol', 1)[0], 'avoided')], CATALOG);
    expect(profile.suspects).toEqual([]);
  });

  it('표본이 작으면 100점이 아니라 보정된 점수가 나온다', () => {
    const ids = withIngredient('ceramide', 2);
    const profile = buildFitProfile(ids.map((id) => match(id, 'good')), CATALOG);
    const sig = profile.favorites.find((f) => f.ingredientId === 'ceramide')!;
    // 2개 중 2개여도 카탈로그 평균 비율을 가상의 1건으로 섞어서 100보다 한참 낮게 나온다
    expect(sig.score).toBeLessThan(80);
    expect(sig.score).toBeGreaterThan(35);
  });

  it('기록이 쌓일수록 확신(confidence)이 올라간다', () => {
    const two = buildFitProfile(withIngredient('ceramide', 2).map((id) => match(id, 'good')), CATALOG);
    const four = buildFitProfile(withIngredient('ceramide', 4).map((id) => match(id, 'good')), CATALOG);
    expect(two.favorites.find((f) => f.ingredientId === 'ceramide')!.confidence).toBe('medium');
    expect(four.favorites.find((f) => f.ingredientId === 'ceramide')!.confidence).toBe('high');
  });

  it('어디에나 들어 있는 성분(글리세린)은 신호로 쓰지 않는다', () => {
    const ids = withIngredient('glycerin', 4);
    const profile = buildFitProfile(ids.map((id) => match(id, 'good')), CATALOG);
    expect(profile.favorites.map((f) => f.ingredientId)).not.toContain('glycerin');
  });

  it('기록에서 자극감이 높았던 제품도 안 맞은 쪽으로 센다', () => {
    const ids = withIngredient('retinol', 3);
    const profile = buildFitProfile([], CATALOG, { irritatingProductIds: ids });
    expect(profile.avoidedTotal).toBe(3);
    expect(profile.suspects.map((s) => s.ingredientId)).toContain('retinol');
  });
});

describe('recommendByFit', () => {
  it('기록이 부족하면 아무것도 추천하지 않는다', () => {
    const out = recommendByFit({ matches: [], ownedProductIds: [], skinType: null }, CATALOG);
    expect(out.items).toEqual([]);
    expect(out.profile.ready).toBe(false);
  });

  it('잘 맞았던 성분이 든 제품을 추천하고 숫자로 이유를 댄다', () => {
    const ids = withIngredient('ceramide', 3);
    const out = recommendByFit({ matches: ids.map((id) => match(id, 'good')), ownedProductIds: [], skinType: null }, CATALOG);
    expect(out.items.length).toBeGreaterThan(0);
    expect(out.items[0].product.keyIngredients).toContain('ceramide');
    expect(out.items[0].reasons[0]).toMatch(/세라마이드.*3개 중 3개/);
  });

  it('이미 평가했거나 루틴에 담은 제품은 다시 추천하지 않는다', () => {
    const ids = withIngredient('ceramide', 3);
    const owned = withIngredient('ceramide', 5).slice(3);
    const out = recommendByFit({ matches: ids.map((id) => match(id, 'good')), ownedProductIds: owned, skinType: null }, CATALOG);
    const shown = out.items.map((i) => i.product.id);
    [...ids, ...owned].forEach((id) => expect(shown).not.toContain(id));
  });

  it('의심 성분이 든 제품은 뒤로 밀리고 주의 문구가 붙는다', () => {
    const good = withIngredient('ceramide', 3);
    const bad = withIngredient('retinol', 3);
    const out = recommendByFit(
      { matches: [...good.map((id) => match(id, 'good')), ...bad.map((id) => match(id, 'avoided'))], ownedProductIds: [], skinType: null, limit: 20 },
      CATALOG,
    );
    const withRetinol = out.items.filter((i) => i.product.keyIngredients.includes('retinol'));
    withRetinol.forEach((i) => expect(i.cautions.join(' ')).toMatch(/레티놀/));
    // 레티놀이 든 추천이 있다면 1위는 아니어야 한다
    if (withRetinol.length > 0) expect(out.items[0].product.keyIngredients).not.toContain('retinol');
  });

  it('한 브랜드가 추천을 독차지하지 않는다', () => {
    const ids = withIngredient('ceramide', 3);
    const out = recommendByFit({ matches: ids.map((id) => match(id, 'good')), ownedProductIds: [], skinType: null, limit: 6 }, CATALOG);
    const brands = out.items.map((i) => i.product.brand);
    expect(new Set(brands).size).toBe(brands.length);
  });

  it('민감성이면 강한 활성 성분 제품의 점수를 깎는다', () => {
    const ids = withIngredient('ceramide', 3);
    const matches = ids.map((id) => match(id, 'good'));
    const plain = recommendByFit({ matches, ownedProductIds: [], skinType: null, limit: 20 }, CATALOG);
    const sensitive = recommendByFit({ matches, ownedProductIds: [], skinType: 'sensitive', limit: 20 }, CATALOG);
    const scoreOf = (out: typeof plain, id: string) => out.items.find((i) => i.product.id === id)?.score;
    const strong = plain.items.find((i) => i.product.keyIngredients.some((k) => ['retinol', 'glycolic-acid', 'salicylic-acid'].includes(k)));
    if (strong) {
      const a = scoreOf(plain, strong.product.id);
      const b = scoreOf(sensitive, strong.product.id);
      if (a !== undefined && b !== undefined) expect(b).toBeLessThan(a);
    }
  });

  it('잘 맞은 성분도 안 맞은 성분도 없는 제품은 추천하지 않는다', () => {
    const ids = withIngredient('ceramide', 3);
    const out = recommendByFit({ matches: ids.map((id) => match(id, 'good')), ownedProductIds: [], skinType: null, limit: 20 }, CATALOG);
    out.items.forEach((i) => expect(i.favoriteHits.length + i.suspectHits.length).toBeGreaterThan(0));
  });

  it('잘 맞은 제품과 안 맞은 제품 둘 다 있으면 양쪽을 함께 본다', () => {
    const good = withIngredient('ceramide', 3);
    const bad = withoutIngredient('ceramide', 3);
    const out = recommendByFit(
      { matches: [...good.map((id) => match(id, 'good')), ...bad.map((id) => match(id, 'avoided'))], ownedProductIds: [], skinType: null },
      CATALOG,
    );
    expect(out.profile.goodTotal).toBe(3);
    expect(out.profile.avoidedTotal).toBe(3);
  });
});

describe('근거 자료', () => {
  it('이 기능이 기대는 근거 id 가 모두 실제로 있다', () => {
    FIT_SOURCE_IDS.forEach((id) => expect(SOURCES[id], id).toBeDefined());
  });

  it('근거마다 발행처가 적혀 있다', () => {
    FIT_SOURCE_IDS.forEach((id) => expect(SOURCES[id].publisher.length).toBeGreaterThan(3));
  });
});

describe('자극 보고가 드문 성분', () => {
  it('향료·활성 성분은 notable 로, 펩타이드 같은 성분은 아닌 것으로 표시한다', () => {
    const fragrance = withIngredient('fragrance', 3);
    const p1 = buildFitProfile(fragrance.map((id) => match(id, 'avoided')), CATALOG);
    expect(p1.suspects.find((s) => s.ingredientId === 'fragrance')?.notable).toBe(true);

    const peptides = withIngredient('peptides', 3);
    const p2 = buildFitProfile(peptides.map((id) => match(id, 'avoided')), CATALOG);
    expect(p2.suspects.find((s) => s.ingredientId === 'peptides')?.notable).toBe(false);
  });

  it('의심 성분 목록에서 notable 성분이 먼저 나온다', () => {
    const both = PRODUCTS.filter((p) => p.keyIngredients.includes('fragrance') && p.keyIngredients.includes('peptides')).slice(0, 3);
    if (both.length < 2) return;
    const profile = buildFitProfile(both.map((p) => match(p.id, 'avoided')), CATALOG);
    const ids = profile.suspects.map((s) => s.ingredientId);
    expect(ids.indexOf('fragrance')).toBeLessThan(ids.indexOf('peptides'));
  });

  it('우연일 수 있는 성분에는 그 말을 주의 문구에 붙인다', () => {
    const good = withIngredient('ceramide', 3);
    const bad = withIngredient('peptides', 3, good);
    const out = recommendByFit(
      { matches: [...good.map((id) => match(id, 'good')), ...bad.map((id) => match(id, 'avoided'))], ownedProductIds: [], skinType: null, limit: 30 },
      CATALOG,
    );
    const hit = out.items.find((i) => i.suspectHits.some((s) => s.ingredientId === 'peptides'));
    if (hit) expect(hit.cautions.join(' ')).toMatch(/우연일 수 있어요/);
  });

  it('직접 👍 한 제품은 기록상 자극이 있어도 안 맞은 쪽으로 세지 않는다', () => {
    const ids = withIngredient('ceramide', 3);
    const profile = buildFitProfile(ids.map((id) => match(id, 'good')), CATALOG, { irritatingProductIds: [ids[0]] });
    expect(profile.avoidedTotal).toBe(0);
    expect(profile.goodTotal).toBe(3);
  });
});

describe('논문 인용 검증', () => {
  it('논문 항목은 모두 PMID 주소로 걸려 있다 (PubMed 기록과 대조한 것만 넣는다)', () => {
    const papers = Object.values(SOURCES).filter((s) => s.kind === 'paper');
    expect(papers.length).toBeGreaterThanOrEqual(20);
    const bad = papers.filter((s) => !/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/.test(s.url ?? '')).map((s) => s.id);
    expect(bad).toEqual([]);
  });

  it('논문 항목에는 연도가 있다', () => {
    const bad = Object.values(SOURCES)
      .filter((s) => s.kind === 'paper' && !s.year)
      .map((s) => s.id);
    expect(bad).toEqual([]);
  });
});
