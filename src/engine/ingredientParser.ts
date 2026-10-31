import type { Ingredient } from '@/types';
import { INGREDIENTS } from '@/data/index';

/**
 * 화장품 뒷면의 "전성분"을 통째로 붙여넣으면 아는 성분을 골라낸다.
 *
 * 제품 DB 에 없는 작은 브랜드도 전성분만 있으면 궁합 분석을 돌릴 수 있게 하려는 장치다.
 * 전성분 표기는 대체로 배합 비율이 높은 순서라, 앞쪽에 있을수록 비중이 큰 성분으로 본다.
 */

export interface MatchedIngredient {
  ingredient: Ingredient;
  /** 전성분에 적혀 있던 원래 표기 */
  token: string;
  /** 전성분에서 몇 번째인지 (0부터) — 앞쪽일수록 함량이 높다 */
  position: number;
}

export interface ParsedIngredients {
  matched: MatchedIngredient[];
  /** 아는 성분이 아니어서 넘긴 표기 */
  unmatched: string[];
  /** 잘라낸 전체 성분 표기 수 */
  total: number;
}

/** 전성분에 자주 쓰이는 다른 이름 → 우리 성분 id */
const ALIASES: Record<string, string> = {
  소듐하이알루로네이트: 'hyaluronic-acid',
  하이알루로닉애씨드: 'hyaluronic-acid',
  하이알루론산: 'hyaluronic-acid',
  소듐하이알루로네이트크로스폴리머: 'hyaluronic-acid',
  덱스판테놀: 'panthenol',
  프로비타민b5: 'panthenol',
  센텔라아시아티카추출물: 'centella',
  센텔라아시아티카잎추출물: 'centella',
  병풀잎추출물: 'centella',
  세라마이드엔피: 'ceramide',
  세라마이드np: 'ceramide',
  소듐피씨에이: 'sodium-pca',
  비타민e: 'tocopherol',
  토코페릴아세테이트: 'tocopherol',
  비타민b3: 'niacinamide',
  니코틴아마이드: 'niacinamide',
  비타민c: 'ascorbic-acid',
  엘아스코빅애씨드: 'ascorbic-acid',
  살리실산: 'salicylic-acid',
  베타하이드록시애씨드: 'salicylic-acid',
  글리콜릭애씨드: 'glycolic-acid',
  글라이콜산: 'glycolic-acid',
  젖산: 'lactic-acid',
  요소: 'urea',
  스쿠알렌: 'squalane',
  시어버터추출물: 'shea-butter',
  달팽이분비물여과물: 'snail-mucin',
  티트리오일: 'tea-tree',
  멜라루카잎오일: 'tea-tree',
  어성초: 'houttuynia',
  약모밀추출물: 'houttuynia',
  카올린클레이: 'kaolin',
  징크피씨에이: 'zinc-pca',
  아연피씨에이: 'zinc-pca',
  레티닐팔미테이트: 'retinyl-palmitate',
  비타민a: 'retinol',
};

/** 비교용으로 다듬는다 — 괄호 설명·공백·기호·대소문자를 털어낸다 */
export function normalizeToken(raw: string): string {
  return raw
    .replace(/[([{（［][^)\]}）］]*[)\]}）］]/g, '') // 괄호 안 설명 제거
    .replace(/\d+(\.\d+)?\s*%/g, '') // 함량 표기 제거
    .replace(/[\s·・‧,./\-–—_'"]/g, '') // 공백·구분기호 제거
    .toLowerCase();
}

/** 정규화한 이름 → 성분. 모듈을 처음 쓸 때 한 번만 만든다. */
let lookup: Map<string, Ingredient> | null = null;
function getLookup(): Map<string, Ingredient> {
  if (lookup) return lookup;
  const map = new Map<string, Ingredient>();
  const put = (key: string, ing: Ingredient) => {
    const k = normalizeToken(key);
    if (k.length >= 2 && !map.has(k)) map.set(k, ing);
  };
  INGREDIENTS.forEach((ing) => {
    put(ing.nameKo, ing);
    put(ing.nameInci, ing);
    put(ing.id, ing);
  });
  Object.entries(ALIASES).forEach(([alias, id]) => {
    const ing = INGREDIENTS.find((i) => i.id === id);
    if (ing) put(alias, ing);
  });
  lookup = map;
  return map;
}

/**
 * 전성분 문자열을 성분 표기 단위로 자른다.
 * "1,2-헥산다이올"처럼 이름 안에 쉼표가 있는 경우가 있어, 숫자만 남은 조각은 뒤와 다시 붙인다.
 */
export function splitIngredientText(text: string): string[] {
  const rough = text
    .replace(/전성분\s*[:：]?/g, ' ')
    .split(/[,\n;|·・‧、]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const piece of rough) {
    if (/^\d+$/.test(piece) && out.length >= 0) {
      out.push(piece); // 다음 조각과 합칠 후보
      continue;
    }
    const prev = out[out.length - 1];
    if (prev && /^\d+$/.test(prev)) {
      out[out.length - 1] = `${prev},${piece}`;
      continue;
    }
    out.push(piece);
  }
  return out.filter((t) => t.length >= 2 && t.length <= 60);
}

/** 전성분 텍스트에서 아는 성분을 골라낸다 */
export function parseIngredientList(text: string): ParsedIngredients {
  const map = getLookup();
  const tokens = splitIngredientText(text);
  const matched: MatchedIngredient[] = [];
  const unmatched: string[] = [];
  const seen = new Set<string>();

  tokens.forEach((token, position) => {
    const key = normalizeToken(token);
    if (!key) return;
    let ing = map.get(key);
    if (!ing) {
      // 표기가 조금 길거나 짧은 경우 — "센텔라아시아티카(병풀)추출물" 같은 변형을 받아준다
      for (const [name, candidate] of map) {
        if (name.length >= 4 && (key.includes(name) || name.includes(key))) {
          ing = candidate;
          break;
        }
      }
    }
    if (ing && !seen.has(ing.id)) {
      seen.add(ing.id);
      matched.push({ ingredient: ing, token, position });
    } else if (!ing) {
      unmatched.push(token);
    }
  });

  return { matched, unmatched, total: tokens.length };
}

/**
 * 궁합 분석에 넣을 "핵심 성분"을 고른다 (최대 max 개).
 * 전성분은 함량 순이라 앞쪽을 우선하되, 효과가 센 성분(active)은 뒤에 적혀 있어도 먼저 집는다.
 */
export function pickKeyIngredients(parsed: ParsedIngredients, max = 8): string[] {
  const score = (m: MatchedIngredient) => (m.ingredient.tags?.includes('active') ? -1000 : 0) + m.position;
  return [...parsed.matched]
    .sort((a, b) => score(a) - score(b))
    .slice(0, max)
    .map((m) => m.ingredient.id);
}
