import type { Product } from '@/types';

export interface PhotoMatch {
  product: Product;
  score: number;
  /** 어떤 글자가 맞았는지 (설명용) */
  hits: string[];
}

const HANGUL = 'ㄱ-ㆎ가-힣';
const norm = (s: string) => s.toLowerCase().replace(new RegExp(`[^0-9a-z${HANGUL}]+`, 'g'), '');
const isHangul = (s: string) => new RegExp(`[${HANGUL}]`).test(s);

/** OCR 결과를 검색 토큰으로 쪼갠다 — 한글 2자 이상, 영문·숫자 3자 이상 */
export function tokenizeOcr(text: string): string[] {
  const raw = text
    .toLowerCase()
    .split(new RegExp(`[^0-9a-z${HANGUL}]+`))
    .map((t) => t.trim())
    .filter(Boolean);
  const out = new Set<string>();
  raw.forEach((t) => {
    if (isHangul(t) ? t.length >= 2 : t.length >= 3) out.add(t);
  });
  return [...out];
}

/**
 * 사진에서 읽은 글자와 제품 목록을 대조해 후보를 고른다.
 * 브랜드·제품명·별칭이 통째로 들어 있으면 크게, 토큰이 부분적으로 겹치면 조금씩 점수를 더한다.
 */
export function matchProductsFromText(text: string, products: Product[], limit = 8): PhotoMatch[] {
  const collapsed = norm(text);
  const tokens = tokenizeOcr(text);
  if (!collapsed) return [];
  const tokenSet = new Set(tokens);

  const results: PhotoMatch[] = [];
  products.forEach((p) => {
    let score = 0;
    const hits: string[] = [];

    const brandN = norm(p.brand);
    if (brandN.length >= 2 && collapsed.includes(brandN)) {
      score += 6;
      hits.push(p.brand);
    }
    const nameN = norm(p.name);
    if (nameN.length >= 3 && collapsed.includes(nameN)) {
      score += 12;
      hits.push(p.name);
    }
    p.aliases.forEach((alias) => {
      const a = norm(alias);
      if (a.length >= 3 && collapsed.includes(a)) {
        score += 5;
        hits.push(alias);
      }
    });

    // 제품명 토큰 부분 일치
    const nameTokens = p.name.split(/\s+/).map(norm).filter((t) => t.length >= 2);
    let nameTokenHits = 0;
    nameTokens.forEach((t) => {
      if (tokenSet.has(t)) {
        score += 2.5;
        nameTokenHits += 1;
        hits.push(t);
      } else if (t.length >= 3 && collapsed.includes(t)) {
        score += 1.5;
        nameTokenHits += 1;
      }
    });
    if (nameTokens.length >= 2 && nameTokenHits === nameTokens.length) score += 4;

    // 영문 별칭 토큰 (예: cosrx, dive in) — 4자 이상 토큰끼리 포함 관계
    const aliasTokens = p.aliases
      .flatMap((a) => a.split(/\s+/))
      .map(norm)
      .filter((t) => t.length >= 4);
    aliasTokens.forEach((t) => {
      if (tokens.some((tok) => tok.length >= 4 && (tok.includes(t) || t.includes(tok)))) {
        score += 2;
        hits.push(t);
      }
    });

    if (score >= 4) results.push({ product: p, score, hits: [...new Set(hits)] });
  });

  return results.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'ko')).slice(0, limit);
}

/** 직접 등록 폼을 미리 채우기 위한 브랜드·제품명 추정 */
export function guessBrandAndName(text: string, products: Product[]): { brand: string; name: string } {
  const collapsed = norm(text);
  const brands = [...new Set(products.map((p) => p.brand))];
  const brand = brands.find((b) => norm(b).length >= 2 && collapsed.includes(norm(b))) ?? '';
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length >= 2 && /[0-9a-zA-Zㄱ-ㆎ가-힣]/.test(l));
  const candidate = lines
    .filter((l) => !brand || norm(l) !== norm(brand))
    .sort((a, b) => b.length - a.length)[0];
  return { brand, name: (candidate ?? '').slice(0, 60) };
}
