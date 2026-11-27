import type { Product, ProductMatch, SkinType } from '@/types';
import type { Catalog } from './catalog';
import { ingredientName } from './catalog';
import { STRONG_ACTIVES } from './constants';

/**
 * 내 기록 기반 추천 (요청: "잘 맞았던 제품 / 안 맞았던 제품을 바탕으로 추천").
 *
 * 👍 잘 맞았어요 · 👎 트러블 있었어요 로 표시한 제품의 성분을 모아,
 * 어떤 성분이 나에게 반복해서 좋았고 어떤 성분이 반복해서 걸렸는지를 추려
 * 아직 안 써 본 제품을 고른다.
 *
 * ⚠️ 이건 통계적 연관이지 원인 규명이 아니다. 한 제품에는 수십 가지 성분이 들어 있고
 * 표시 성분은 그중 일부만 담고 있어서, 같이 들어 있던 다른 성분이나 제형·사용법이
 * 진짜 이유일 수 있다. 화면에서는 반드시 이 한계를 같이 보여주고, 반복해서 반응한다면
 * 첩포검사(피부과)나 ROAT(팔 안쪽 반복 도포)로 확인하도록 안내한다.
 *
 * 근거: NACDG 첩포검사 결과(nacdg-2023), ROAT 기간 연구(roat-duration, roat-dermnet),
 *       회피 상담·목록의 효과(steuer-2018, kist-2004), 민감성 자가 보고(farage-2019).
 */

/** 어디에나 들어 있어서 원인 추정에 도움이 안 되는 성분 */
const UBIQUITOUS = new Set(['glycerin', 'dimethicone']);

/** 카탈로그의 이 비율 이상이 담고 있는 성분은 변별력이 없다고 본다 */
const UBIQUITOUS_RATIO = 0.35;

export type FitVerdict = 'favorite' | 'suspect' | 'unclear';
export type FitConfidence = 'low' | 'medium' | 'high';

export interface IngredientSignal {
  ingredientId: string;
  name: string;
  /** 👍 표시한 제품 중 이 성분이 든 개수 / 전체 */
  goodCount: number;
  goodTotal: number;
  /** 👎 표시한 제품 중 이 성분이 든 개수 / 전체 */
  avoidedCount: number;
  avoidedTotal: number;
  /** -100(반복해서 걸렸음) ~ +100(반복해서 좋았음) */
  score: number;
  verdict: FitVerdict;
  confidence: FitConfidence;
  /**
   * 활성 성분·향료·에센셜오일·자외선 차단 성분처럼 자극·접촉 알레르기 보고가 많은 계열인지.
   * 아니라면(펩타이드·스쿠알란 등) 안 맞은 제품에 겹쳐 나와도 우연일 가능성이 커서 약하게만 반영한다.
   */
  notable: boolean;
}

export interface PersonalFitProfile {
  favorites: IngredientSignal[];
  suspects: IngredientSignal[];
  goodTotal: number;
  avoidedTotal: number;
  /** 추천을 내놓기에 기록이 충분한지 */
  ready: boolean;
  /** 부족하다면 몇 개를 더 표시하면 되는지 */
  needMoreGood: number;
  needMoreAvoided: number;
}

export interface FitRecommendation {
  product: Product;
  score: number;
  favoriteHits: IngredientSignal[];
  suspectHits: IngredientSignal[];
  /** 왜 골랐는지 — 숫자를 그대로 보여준다 */
  reasons: string[];
  cautions: string[];
}

/** 최소 이만큼은 표시해야 패턴이라고 부를 수 있다 */
export const MIN_GOOD = 2;
export const MIN_AVOIDED = 2;

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

/**
 * 표본이 작을 때 100%/0% 로 튀지 않도록, 카탈로그 전체에서 그 성분이 들어 있는 비율(base)을
 * 가상의 기록 1건으로 섞어 보정한다. 한쪽 기록이 아예 없으면 그쪽은 base 그대로가 되므로
 * 점수는 "아무 제품이나 골랐을 때보다 얼마나 자주 나왔는가" 를 뜻하게 된다.
 * 👍 2개 중 2개에 들어 있어도 100이 아니라 50~60쯤이 나오고, 기록이 쌓일수록 커진다.
 */
function smoothedScore(goodCount: number, goodTotal: number, avoidedCount: number, avoidedTotal: number, base: number): number {
  const g = (goodCount + base) / (goodTotal + 1);
  const a = (avoidedCount + base) / (avoidedTotal + 1);
  return Math.round((g - a) * 100);
}

function confidenceOf(hits: number, total: number): FitConfidence {
  if (hits >= 3 && total >= 4) return 'high';
  if (hits >= 2) return 'medium';
  return 'low';
}

function ingredientsOf(productId: string, catalog: Catalog): Set<string> {
  return new Set(catalog.products.get(productId)?.keyIngredients ?? []);
}

/** 성분별로 카탈로그 제품 중 몇 %가 담고 있는지 — 점수 보정과 흔한 성분 거르기에 쓴다 */
function buildBaseRates(catalog: Catalog): Map<string, number> {
  const counts = new Map<string, number>();
  let total = 0;
  catalog.products.forEach((p) => {
    total += 1;
    new Set(p.keyIngredients).forEach((i) => counts.set(i, (counts.get(i) ?? 0) + 1));
  });
  const rates = new Map<string, number>();
  counts.forEach((c, id) => rates.set(id, total > 0 ? c / total : 0));
  return rates;
}

export interface FitProfileOptions {
  /**
   * 피부 기록에서 자극감이 반복해서 높았던 제품 — 사용자가 👎 를 누르지 않았어도
   * 안 맞았던 쪽 신호로 같이 센다. (내 기록 탭의 ProductHistory 에서 넘긴다)
   */
  irritatingProductIds?: string[];
}

/** 👍/👎 기록에서 내 피부의 성분 성향을 뽑는다 */
export function buildFitProfile(matches: ProductMatch[], catalog: Catalog, opts: FitProfileOptions = {}): PersonalFitProfile {
  const goodIds = [...new Set(matches.filter((m) => m.matchType === 'good').map((m) => m.productId))];
  // 직접 👍 를 누른 제품은 기록상 자극이 있었더라도 안 맞은 쪽으로 세지 않는다 (직접 표시가 우선)
  const fromLogs = (opts.irritatingProductIds ?? []).filter((id) => !goodIds.includes(id));
  const avoidedIds = [...new Set([...matches.filter((m) => m.matchType === 'avoided').map((m) => m.productId), ...fromLogs])];

  const goodTotal = goodIds.length;
  const avoidedTotal = avoidedIds.length;
  const baseRates = buildBaseRates(catalog);

  const goodHits = new Map<string, number>();
  const avoidHits = new Map<string, number>();
  goodIds.forEach((id) => ingredientsOf(id, catalog).forEach((i) => goodHits.set(i, (goodHits.get(i) ?? 0) + 1)));
  avoidedIds.forEach((id) => ingredientsOf(id, catalog).forEach((i) => avoidHits.set(i, (avoidHits.get(i) ?? 0) + 1)));

  const signals: IngredientSignal[] = [];
  new Set([...goodHits.keys(), ...avoidHits.keys()]).forEach((id) => {
    const base = baseRates.get(id) ?? 0;
    if (UBIQUITOUS.has(id) || base >= UBIQUITOUS_RATIO) return;
    const ing = catalog.ingredients.get(id);
    if (!ing) return;
    const goodCount = goodHits.get(id) ?? 0;
    const avoidedCount = avoidHits.get(id) ?? 0;
    const score = smoothedScore(goodCount, goodTotal, avoidedCount, avoidedTotal, base);

    let verdict: FitVerdict = 'unclear';
    if (score <= -20 && avoidedCount >= MIN_AVOIDED) verdict = 'suspect';
    else if (score >= 20 && goodCount >= MIN_GOOD) verdict = 'favorite';

    const tags = ing.tags ?? [];
    signals.push({
      ingredientId: id,
      name: ingredientName(catalog, id),
      goodCount,
      goodTotal,
      avoidedCount,
      avoidedTotal,
      score,
      verdict,
      confidence: confidenceOf(verdict === 'suspect' ? avoidedCount : goodCount, verdict === 'suspect' ? avoidedTotal : goodTotal),
      notable: tags.includes('active') || tags.includes('fragrance') || tags.includes('essential-oil') || tags.includes('filter'),
    });
  });

  const favorites = signals
    .filter((s) => s.verdict === 'favorite')
    .sort((a, b) => b.score - a.score || b.goodCount - a.goodCount)
    .slice(0, 5);
  // 의심 성분은 활성·향료를 먼저 보여준다 (자극 보고가 많은 축이라 설명이 된다)
  const suspects = signals
    .filter((s) => s.verdict === 'suspect')
    .sort((a, b) => Number(b.notable) - Number(a.notable) || a.score - b.score || b.avoidedCount - a.avoidedCount)
    .slice(0, 5);

  return {
    favorites,
    suspects,
    goodTotal,
    avoidedTotal,
    ready: goodTotal >= MIN_GOOD || avoidedTotal >= MIN_AVOIDED,
    needMoreGood: Math.max(0, MIN_GOOD - goodTotal),
    needMoreAvoided: Math.max(0, MIN_AVOIDED - avoidedTotal),
  };
}

export interface FitRecommendInput {
  matches: ProductMatch[];
  /** 이미 루틴에 담은 제품 — 추천에서 뺀다 */
  ownedProductIds: string[];
  skinType: SkinType | null;
  limit?: number;
  irritatingProductIds?: string[];
}

export interface FitRecommendResult {
  profile: PersonalFitProfile;
  items: FitRecommendation[];
}

/**
 * 성향 프로필로 아직 안 써 본 제품을 고른다.
 * 의심 성분이 든 제품은 아예 빼지 않고 점수를 크게 깎은 뒤 이유를 적어 보여준다
 * (완전히 숨기면 왜 안 보이는지 알 수 없고, 같은 성분이라도 농도·제형이 달라서다).
 */
export function recommendByFit(input: FitRecommendInput, catalog: Catalog): FitRecommendResult {
  const limit = input.limit ?? 6;
  const profile = buildFitProfile(input.matches, catalog, { irritatingProductIds: input.irritatingProductIds });

  const owned = new Set(input.ownedProductIds);
  // 이미 평가한 제품은 다시 추천하지 않는다
  input.matches.forEach((m) => owned.add(m.productId));
  (input.irritatingProductIds ?? []).forEach((id) => owned.add(id));

  const favById = new Map(profile.favorites.map((s) => [s.ingredientId, s]));
  const susById = new Map(profile.suspects.map((s) => [s.ingredientId, s]));

  if (!profile.ready) return { profile, items: [] };

  const scored: FitRecommendation[] = [];
  catalog.products.forEach((p) => {
    if (owned.has(p.id)) return;

    // 근거가 강한 순으로 — 카드에서 첫 줄에 가장 뚜렷한 이유가 오게 한다
    const favoriteHits = p.keyIngredients
      .map((i) => favById.get(i))
      .filter((s): s is IngredientSignal => Boolean(s))
      .sort((a, b) => b.score - a.score);
    const suspectHits = p.keyIngredients
      .map((i) => susById.get(i))
      .filter((s): s is IngredientSignal => Boolean(s))
      .sort((a, b) => Number(b.notable) - Number(a.notable) || a.score - b.score);
    if (favoriteHits.length === 0 && suspectHits.length === 0) return;

    let score = 0;
    favoriteHits.forEach((s) => {
      score += s.score * (s.confidence === 'high' ? 1 : s.confidence === 'medium' ? 0.7 : 0.4);
    });
    suspectHits.forEach((s) => {
      const byConfidence = s.confidence === 'high' ? 1.4 : s.confidence === 'medium' ? 1.1 : 0.8;
      // 자극 보고가 드문 성분은 우연히 겹쳤을 가능성이 커서 절반만 깎는다
      score += s.score * byConfidence * (s.notable ? 1 : 0.5);
    });

    if (input.skinType && p.skinTypes.includes(input.skinType)) score += 12;
    if (input.skinType === 'sensitive' && p.keyIngredients.some((i) => STRONG_ACTIVES.has(i))) score -= 18;

    const reasons = favoriteHits.map(
      (s) => `${s.name} — 잘 맞았다고 표시한 ${s.goodTotal}개 중 ${s.goodCount}개(${pct(s.goodCount, s.goodTotal)}%)에 들어 있었어요`,
    );
    const cautions = suspectHits.map(
      (s) =>
        `${s.name} — 안 맞았다고 표시한 ${s.avoidedTotal}개 중 ${s.avoidedCount}개(${pct(s.avoidedCount, s.avoidedTotal)}%)에 들어 있었어요${
          s.notable ? '' : ' (자극 보고가 드문 성분이라 우연일 수 있어요)'
        }`,
    );

    scored.push({ product: p, score: Math.round(score), favoriteHits, suspectHits, reasons, cautions });
  });

  scored.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'ko'));

  // 한 브랜드가 목록을 다 차지하지 않게 브랜드당 1개
  const seen = new Set<string>();
  const items: FitRecommendation[] = [];
  for (const r of scored) {
    if (r.score <= 0) break;
    if (seen.has(r.product.brand)) continue;
    seen.add(r.product.brand);
    items.push(r);
    if (items.length >= limit) break;
  }

  return { profile, items };
}

/** 이 기능이 기대는 근거 자료 id */
export const FIT_SOURCE_IDS = ['nacdg-2023', 'roat-duration', 'roat-dermnet', 'steuer-2018', 'kist-2004', 'farage-2019'];
