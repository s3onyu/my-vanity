import type { Product, ProductCategory } from '@/types';
import { BRAND_ALIASES, brandVariants } from '@/data/brands';

export interface PhotoMatch {
  product: Product;
  score: number;
  /** 어떤 글자가 맞았는지 (설명용) */
  hits: string[];
}

export interface DetectedBrand {
  name: string;
  /** 사진에서 실제로 읽힌 표기 */
  matched: string;
  confidence: 'high' | 'medium';
}

export interface PhotoGuess {
  brand: string;
  name: string;
  category: ProductCategory | null;
  ingredientIds: string[];
}

export interface PhotoAnalysis {
  tokens: string[];
  brand: DetectedBrand | null;
  /** 제품명·별칭까지 맞는 제품 */
  nameMatches: PhotoMatch[];
  /** 브랜드만 맞는 제품 — 이름이 흐릿할 때 골라 담을 수 있게 */
  brandProducts: PhotoMatch[];
  /** 직접 등록 폼 미리 채우기 */
  guess: PhotoGuess;
}

const HANGUL = 'ㄱ-ㆎ가-힣';
const norm = (s: string) => s.toLowerCase().replace(new RegExp(`[^0-9a-z${HANGUL}]+`, 'g'), '');
const isHangul = (s: string) => new RegExp(`[${HANGUL}]`).test(s);
const spaced = (s: string) => s.toLowerCase().replace(new RegExp(`[^0-9a-z${HANGUL}+]+`, 'g'), ' ').replace(/\s+/g, ' ').trim();

/** OCR 결과를 검색 토큰으로 쪼갠다 — 한글 2자 이상, 영문 3자 이상, 숫자 2자리 이상 */
export function tokenizeOcr(text: string): string[] {
  const out = new Set<string>();
  spaced(text)
    .split(' ')
    .filter(Boolean)
    .forEach((t) => {
      const clean = t.replace(/\+/g, '');
      if (!clean) return;
      if (isHangul(clean) ? clean.length >= 2 : /^\d+$/.test(clean) ? clean.length >= 2 : clean.length >= 3) out.add(clean);
    });
  return [...out];
}

// ---------------------------------------------------------------------------
//  문자열 유사도 (OCR 오타 허용)
// ---------------------------------------------------------------------------

function bigrams(s: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length - 1; i += 1) out.push(s.slice(i, i + 2));
  return out;
}

export function dice(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bb = new Map<string, number>();
  bigrams(b).forEach((g) => bb.set(g, (bb.get(g) ?? 0) + 1));
  let inter = 0;
  bigrams(a).forEach((g) => {
    const c = bb.get(g) ?? 0;
    if (c > 0) {
      inter += 1;
      bb.set(g, c - 1);
    }
  });
  return (2 * inter) / (a.length - 1 + (b.length - 1));
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    const cur = [i];
    for (let j = 1; j <= n; j += 1) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** OCR 토큰 하나가 목표 토큰과 얼마나 맞는지 0~1 */
function tokenSim(ocr: string, target: string): number {
  if (ocr === target) return 1;
  if (isHangul(target)) {
    if (target.length >= 3 && levenshtein(ocr, target) <= 1) return 0.85;
    return 0;
  }
  if (/^\d+$/.test(target)) return 0;
  if (target.length >= 4 && levenshtein(ocr, target) <= 1) return 0.9;
  if (target.length >= 5 && dice(ocr, target) >= 0.72) return 0.8;
  return 0;
}

/** 목표 토큰이 OCR 토큰 중 어느 것과든 맞으면 최고 유사도 */
function bestSim(tokens: string[], collapsed: string, target: string): number {
  let best = 0;
  tokens.forEach((t) => {
    best = Math.max(best, tokenSim(t, target));
  });
  if (best < 0.7 && target.length >= 3 && collapsed.includes(target)) best = 0.7;
  return best;
}

// ---------------------------------------------------------------------------
//  키워드 사전 — 포장 문구에서 성분·카테고리 추정
// ---------------------------------------------------------------------------

const INGREDIENT_KEYWORDS: [RegExp, string][] = [
  [/niacinamide|나이아신|niacin|\bb3\b/, 'niacinamide'],
  [/\bzinc\b|징크/, 'zinc-pca'],
  [/heartleaf|houttuynia|어성초|하트리프/, 'houttuynia'],
  [/centella|\bcica\b|시카|병풀|센텔라|tiger grass/, 'centella'],
  [/madecassoside|마데카/, 'madecassoside'],
  [/retinal|레티날/, 'retinal'],
  [/retinol|레티놀/, 'retinol'],
  [/ascorbic|vitamin ?c\b|비타민 ?c|vita ?c/, 'ascorbic-acid'],
  [/hyaluron|히알루론|hyalu/, 'hyaluronic-acid'],
  [/ceramide|세라마이드/, 'ceramide'],
  [/panthenol|판테놀|\bb5\b/, 'panthenol'],
  [/\baha\b|glycolic|글라이콜릭|글리콜릭/, 'glycolic-acid'],
  [/\bbha\b|salicylic|살리실릭/, 'salicylic-acid'],
  [/\bpha\b|gluconolactone|글루코노/, 'gluconolactone'],
  [/\blha\b/, 'lha'],
  [/snail|달팽이|mucin/, 'snail-mucin'],
  [/propolis|프로폴리스/, 'propolis'],
  [/green ?tea|녹차/, 'green-tea'],
  [/tea ?tree|티트리/, 'tea-tree'],
  [/mugwort|artemisia|쑥/, 'mugwort'],
  [/\brice\b|쌀|라이스/, 'rice-extract'],
  [/peptide|펩타이드/, 'peptides'],
  [/collagen|콜라겐/, 'collagen'],
  [/squalane|스쿠알란/, 'squalane'],
  [/azelaic|아젤라/, 'azelaic-acid'],
  [/tranexamic|\btxa\b|트라넥사믹/, 'tranexamic-acid'],
  [/arbutin|알부틴/, 'alpha-arbutin'],
  [/galactomyces|갈락토/, 'galactomyces'],
  [/bifida|비피다/, 'bifida'],
  [/allantoin|알란토인/, 'allantoin'],
  [/\baloe\b|알로에/, 'aloe'],
  [/ginseng|인삼|진생/, 'ginseng'],
  [/birch|자작나무/, 'birch-sap'],
  [/beta ?glucan|베타글루칸/, 'beta-glucan'],
  [/\bpdrn\b/, 'pdrn'],
  [/bakuchiol|바쿠치올/, 'bakuchiol'],
  [/adenosine|아데노신/, 'adenosine'],
  [/glutathione|글루타치온/, 'glutathione'],
  [/tocopherol|vitamin ?e\b|비타민 ?e/, 'tocopherol'],
  [/ferulic|페룰릭/, 'ferulic-acid'],
  [/\bshea\b|시어/, 'shea-butter'],
  [/\boat\b|오트|귀리/, 'colloidal-oatmeal'],
  [/\burea\b|우레아/, 'urea'],
  [/lactic|락틱/, 'lactic-acid'],
  [/mandelic|만델릭/, 'mandelic-acid'],
  [/betaine|베타인/, 'betaine'],
  [/glycerin|글리세린/, 'glycerin'],
  [/ectoin|엑토인/, 'ectoin'],
  [/calendula|카렌듈라|금잔화/, 'calendula'],
  [/\bcaffeine\b|카페인/, 'caffeine'],
  [/probiotic|lactobacillus|유산균/, 'lactobacillus'],
];

const CATEGORY_KEYWORDS: [RegExp, ProductCategory][] = [
  [/\bsun\b|sunscreen|sun cream|\bspf\b|선크림|선 크림|자외선|\buv\b/, '선크림'],
  [/cleans|\bfoam\b|\bwash\b|클렌징|클렌저|세안|\b폼\b/, '클렌징'],
  [/ampoule|앰플/, '앰플'],
  [/serum|세럼/, '세럼'],
  [/essence|에센스/, '에센스'],
  [/toner|토너|\bskin\b/, '토너'],
  [/lotion|emulsion|로션|에멀전/, '로션'],
  [/\beye\b|아이크림|아이 크림/, '아이크림'],
  [/\bmist\b|미스트/, '미스트'],
  [/\bpeel|필링|peeling/, '필링'],
  [/\bpads?\b|패드/, '패드'],
  [/\bmask\b|마스크|\b팩\b/, '마스크'],
  [/\boil\b|오일/, '오일'],
  [/primer|cushion|foundation|프라이머|쿠션|파운데이션/, '베이스'],
  [/cream|크림|\bbalm\b|\b밤\b/, '크림'],
];

export function extractIngredientIds(text: string): string[] {
  const s = spaced(text);
  const out: string[] = [];
  INGREDIENT_KEYWORDS.forEach(([re, id]) => {
    if (re.test(s) && !out.includes(id)) out.push(id);
  });
  return out.slice(0, 8);
}

export function extractCategory(text: string): ProductCategory | null {
  const s = spaced(text);
  return CATEGORY_KEYWORDS.find(([re]) => re.test(s))?.[1] ?? null;
}

// ---------------------------------------------------------------------------
//  브랜드 감지
// ---------------------------------------------------------------------------

export function detectBrand(text: string, brands: string[]): DetectedBrand | null {
  const collapsed = norm(text);
  const tokens = tokenizeOcr(text);
  let best: (DetectedBrand & { weight: number }) | null = null;
  brands.forEach((brand) => {
    brandVariants(brand).forEach((variant) => {
      const v = norm(variant);
      if (!v) return;
      const minLen = isHangul(v) ? 2 : 3;
      if (v.length >= minLen && collapsed.includes(v)) {
        const weight = v.length + 10;
        if (!best || weight > best.weight) best = { name: brand, matched: variant, confidence: 'high', weight };
        return;
      }
      if (!isHangul(v) && v.length >= 4) {
        tokens.forEach((t) => {
          if (t.length >= 4 && (levenshtein(t, v) <= 1 || dice(t, v) >= 0.78)) {
            const weight = v.length;
            if (!best || weight > best.weight) best = { name: brand, matched: t, confidence: 'medium', weight };
          }
        });
      }
    });
  });
  if (!best) return null;
  const { name, matched, confidence } = best as DetectedBrand & { weight: number };
  return { name, matched, confidence };
}

// ---------------------------------------------------------------------------
//  제품 대조
// ---------------------------------------------------------------------------

function scoreProduct(p: Product, tokens: string[], collapsed: string, brand: DetectedBrand | null, category: ProductCategory | null, ingredientIds: string[]) {
  let score = 0;
  const hits: string[] = [];
  let nameSignal = 0;

  if (brand && p.brand === brand.name) {
    score += 6;
    hits.push(brand.matched);
  } else if (!brand) {
    const v = brandVariants(p.brand).map(norm).find((x) => x.length >= (isHangul(x) ? 2 : 3) && collapsed.includes(x));
    if (v) {
      score += 6;
      hits.push(p.brand);
    }
  }

  const nameN = norm(p.name);
  if (nameN.length >= 3 && collapsed.includes(nameN)) {
    score += 12;
    nameSignal += 3;
    hits.push(p.name);
  }

  const nameTokens = p.name.split(/\s+/).map(norm).filter((t) => t.length >= 2);
  let matchedTokens = 0;
  nameTokens.forEach((t) => {
    const sim = bestSim(tokens, collapsed, t);
    if (sim > 0) {
      score += 2.5 * sim;
      matchedTokens += 1;
      nameSignal += sim;
      hits.push(t);
    }
  });
  if (nameTokens.length >= 2 && matchedTokens === nameTokens.length) score += 4;

  // 브랜드 표기('anua', 'round lab')는 별칭에 섞여 있어도 이름 신호로 치지 않는다
  const brandForms = new Set(brandVariants(p.brand).map(norm));
  const brandTokens = new Set(brandVariants(p.brand).flatMap((v) => v.split(/\s+/)).map(norm));
  p.aliases.forEach((alias) => {
    const a = norm(alias);
    if (brandForms.has(a)) return;
    if (a.length >= 3 && collapsed.includes(a)) {
      score += 5;
      nameSignal += 2;
      hits.push(alias);
      return;
    }
    const aliasTokens = alias
      .split(/\s+/)
      .map(norm)
      .filter((t) => t.length >= 3 && !brandTokens.has(t));
    let aliasHits = 0;
    aliasTokens.forEach((t) => {
      const sim = bestSim(tokens, collapsed, t);
      if (sim >= 0.8) {
        score += 1.5 * sim;
        aliasHits += 1;
        nameSignal += sim * 0.6;
        hits.push(t);
      }
    });
    if (aliasTokens.length >= 3 && aliasHits >= aliasTokens.length - 1) score += 3;
  });

  if (category) {
    if (p.category === category) score += 1.5;
    else score -= 1;
  }
  ingredientIds.forEach((id) => {
    if (p.keyIngredients.includes(id)) score += 1.5;
  });

  return { score, hits: [...new Set(hits)], nameSignal };
}

/**
 * 사진에서 읽은 글자를 분석해 (1) 브랜드 (2) 이름까지 맞는 제품 (3) 브랜드 제품 목록 (4) 등록 폼 추정값을 돌려준다.
 */
export function analyzePhotoText(text: string, products: Product[]): PhotoAnalysis {
  const collapsed = norm(text);
  const tokens = tokenizeOcr(text);
  const brands = [...new Set(products.map((p) => p.brand))];
  const brand = collapsed ? detectBrand(text, brands) : null;
  const category = extractCategory(text);
  const ingredientIds = extractIngredientIds(text);

  const nameMatches: PhotoMatch[] = [];
  const brandProducts: PhotoMatch[] = [];
  if (collapsed) {
    products.forEach((p) => {
      const { score, hits, nameSignal } = scoreProduct(p, tokens, collapsed, brand, category, ingredientIds);
      if (nameSignal >= 1.5 && score >= 7) nameMatches.push({ product: p, score, hits });
      else if (brand && p.brand === brand.name) brandProducts.push({ product: p, score, hits });
    });
  }
  const byScore = (a: PhotoMatch, b: PhotoMatch) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'ko');
  nameMatches.sort(byScore);
  brandProducts.sort(byScore);

  // 등록 폼 추정
  const brandName = brand?.name ?? '';
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => {
      const letters = (l.match(new RegExp(`[0-9a-zA-Z${HANGUL}]`, 'g')) ?? []).length;
      return l.length >= 4 && letters / l.length >= 0.6 && tokenizeOcr(l).some((t) => t.length >= 3);
    })
    .filter((l) => !brandName || !brandVariants(brandName).some((v) => norm(l) === norm(v)))
    // 용량·바코드 같은 줄은 제외
    .filter((l) => !/^\s*[\d.,]+\s*(ml|g|oz|fl|mg|kg)\b/i.test(l) && !/\b\d{8,}\b/.test(l));
  // 성분·카테고리 단어가 든 줄들을 이어 붙이면 포장의 제품명에 가깝다 (예: HEARTLEAF NIACINAMIDE ZINC TROUBLE SERUM)
  const keywordLines = lines.filter((l) => extractCategory(l) || extractIngredientIds(l).length);
  const preferred = keywordLines.length ? keywordLines.join(' ') : [...lines].sort((a, b) => b.length - a.length)[0];
  let name = (preferred ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!name && (ingredientIds.length || category)) {
    const ingNames = ingredientIds.slice(0, 2).map((id) => INGREDIENT_LABEL[id] ?? id);
    name = [...ingNames, category ?? ''].filter(Boolean).join(' ');
  }

  return {
    tokens,
    brand,
    nameMatches: nameMatches.slice(0, 8),
    brandProducts: brandProducts.slice(0, 14),
    guess: { brand: brandName, name, category, ingredientIds },
  };
}

/** 등록 폼 이름 추정용 짧은 한글 라벨 */
const INGREDIENT_LABEL: Record<string, string> = {
  niacinamide: '나이아신아마이드',
  'zinc-pca': '징크',
  houttuynia: '어성초',
  centella: '시카',
  retinol: '레티놀',
  retinal: '레티날',
  'ascorbic-acid': '비타민C',
  'hyaluronic-acid': '히알루론산',
  ceramide: '세라마이드',
  panthenol: '판테놀',
  'salicylic-acid': 'BHA',
  'glycolic-acid': 'AHA',
  gluconolactone: 'PHA',
  'snail-mucin': '달팽이',
  propolis: '프로폴리스',
  'green-tea': '녹차',
  'tea-tree': '티트리',
  mugwort: '쑥',
  'rice-extract': '쌀',
  peptides: '펩타이드',
  collagen: '콜라겐',
  squalane: '스쿠알란',
  'azelaic-acid': '아젤라익',
  'tranexamic-acid': '트라넥사믹',
  'alpha-arbutin': '알부틴',
  galactomyces: '갈락토미세스',
  bifida: '비피다',
  pdrn: 'PDRN',
};

/** 이전 API 호환 — 이름 일치 + 브랜드 제품을 합쳐 돌려준다 */
export function matchProductsFromText(text: string, products: Product[], limit = 8): PhotoMatch[] {
  const a = analyzePhotoText(text, products);
  return [...a.nameMatches, ...a.brandProducts].slice(0, limit);
}

/** 직접 등록 폼 프리필 (이전 API 호환) */
export function guessBrandAndName(text: string, products: Product[]): { brand: string; name: string } {
  const { guess } = analyzePhotoText(text, products);
  return { brand: guess.brand, name: guess.name };
}

export { BRAND_ALIASES };
