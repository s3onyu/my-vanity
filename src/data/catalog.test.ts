import { describe, expect, it } from 'vitest';
import {
  CATEGORY_LABEL,
  CONCERNS,
  INGREDIENTS,
  PRODUCTS,
  SKIN_TYPES,
  matchBrandInQuery,
  searchProducts,
  searchProductsDetailed,
  suggestBrands,
} from '.';
import { BRAND_ALIASES } from './brands';

const CATEGORIES = new Set([
  '토너',
  '에센스',
  '앰플',
  '세럼',
  '로션',
  '크림',
  '선크림',
  '클렌징',
  '마스크',
  '아이크림',
  '오일',
  '미스트',
  '필링',
  '패드',
  '베이스',
]);

describe('제품 시드 데이터', () => {
  const ingredientIds = new Set(INGREDIENTS.map((i) => i.id));
  const concernIds = new Set(CONCERNS.map((c) => c.id));
  const skinTypeIds = new Set(SKIN_TYPES.map((s) => s.id));

  it('id 가 겹치지 않는다', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    PRODUCTS.forEach((p) => {
      if (seen.has(p.id)) dupes.push(`${p.id} (${seen.get(p.id)} / ${p.name})`);
      seen.set(p.id, p.name);
    });
    expect(dupes).toEqual([]);
  });

  it('같은 브랜드에 같은 제품명이 두 번 들어가지 않는다', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    PRODUCTS.forEach((p) => {
      const key = `${p.brand} ${p.name}`.replace(/\s+/g, '');
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    });
    expect(dupes).toEqual([]);
  });

  it('없는 성분 id 를 가리키지 않는다', () => {
    const bad: string[] = [];
    PRODUCTS.forEach((p) => p.keyIngredients.forEach((id) => !ingredientIds.has(id) && bad.push(`${p.id}:${id}`)));
    expect(bad).toEqual([]);
  });

  it('카테고리·고민·피부타입 값이 모두 정의된 값이다', () => {
    const bad: string[] = [];
    PRODUCTS.forEach((p) => {
      if (!CATEGORIES.has(p.category)) bad.push(`${p.id} category=${p.category}`);
      p.relatedConcerns.forEach((c) => !concernIds.has(c) && bad.push(`${p.id} concern=${c}`));
      p.skinTypes.forEach((s) => !skinTypeIds.has(s) && bad.push(`${p.id} skinType=${s}`));
    });
    expect(bad).toEqual([]);
  });

  it('모든 제품에 성분과 피부타입이 하나 이상 있다', () => {
    const bad = PRODUCTS.filter((p) => p.keyIngredients.length === 0 || p.skinTypes.length === 0).map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('모든 제품의 브랜드가 브랜드 사전에 있다 (영문·다른 표기 검색이 되도록)', () => {
    const missing = [...new Set(PRODUCTS.filter((p) => !(p.brand in BRAND_ALIASES)).map((p) => p.brand))];
    expect(missing).toEqual([]);
  });

  it('의견에서 나온 브랜드는 라인업이 여러 개 들어 있다', () => {
    const count = (brand: string) => PRODUCTS.filter((p) => p.brand === brand).length;
    expect(count('제로이드')).toBeGreaterThanOrEqual(15);
    expect(count('오드로이')).toBeGreaterThanOrEqual(10);
  });

  it('성분 카테고리 라벨이 모두 정의돼 있다', () => {
    const bad: string[] = [];
    INGREDIENTS.forEach((i) => i.categories.forEach((c) => !CATEGORY_LABEL[c] && bad.push(`${i.id}:${c}`)));
    expect(bad).toEqual([]);
  });

  it('올리브영 인기 제품이 충분히 들어 있다', () => {
    expect(PRODUCTS.length).toBeGreaterThan(1100);
    expect(new Set(PRODUCTS.map((p) => p.brand)).size).toBeGreaterThan(190);
  });

  it('백화점 브랜드도 라인업이 들어 있다', () => {
    const count = (brand: string) => PRODUCTS.filter((p) => p.brand === brand).length;
    expect(count('설화수')).toBeGreaterThanOrEqual(10);
    expect(count('더히스토리오브후')).toBeGreaterThanOrEqual(5);
    expect(count('에스티로더')).toBeGreaterThanOrEqual(8);
    expect(count('키엘')).toBeGreaterThanOrEqual(8);
  });
});

describe('브랜드로 넓히는 검색', () => {
  it('검색어 안의 브랜드를 알아낸다', () => {
    expect(matchBrandInQuery('토니모리 모찌 토너')).toBe('토니모리');
    expect(matchBrandInQuery('tonymoly mochi')).toBe('토니모리');
    expect(matchBrandInQuery('ㅌㄴㅁㄹ')).toBe('토니모리');
    expect(matchBrandInQuery('ㅋㅋㅋ없는브랜드ㅋㅋㅋ')).toBeNull();
  });

  it('목록에 없는 제품이어도 그 브랜드 제품을 보여 준다', () => {
    const out = searchProductsDetailed('토니모리 없는제품명12345');
    expect(out.widenedBrand).toBe('토니모리');
    expect(out.products.length).toBeGreaterThan(0);
    expect(out.products.every((p) => p.brand === '토니모리')).toBe(true);
  });

  it('제품이 제대로 걸리면 넓히지 않는다', () => {
    const out = searchProductsDetailed('토니모리 모찌 토너');
    expect(out.widenedBrand).toBeUndefined();
    expect(out.products.some((p) => p.name.includes('모찌'))).toBe(true);
  });

  it('브랜드도 모르면 빈 결과 그대로 둔다', () => {
    const out = searchProductsDetailed('ㅋㅋㅋ존재하지않는제품명ㅋㅋㅋ');
    expect(out.products).toEqual([]);
    expect(out.widenedBrand).toBeUndefined();
  });
});

describe('제품 검색', () => {
  const names = (q: string, limit = 40) => searchProducts(q, limit).map((p) => `${p.brand} ${p.name}`);

  it('브랜드만 입력하면 그 브랜드 제품이 먼저 나온다', () => {
    const results = searchProducts('제로이드', 40);
    expect(results.length).toBeGreaterThanOrEqual(15);
    expect(results[0].brand).toBe('제로이드');
  });

  it('의견에서 나온 제품들을 찾을 수 있다', () => {
    expect(names('오드로이').length).toBeGreaterThanOrEqual(10);
    expect(names('핌프로브').some((n) => n.includes('레드 컨트롤'))).toBe(true);
    expect(names('제로이드 수딩').some((n) => n.includes('수딩'))).toBe(true);
  });

  it('가운데 단어를 빼고 쳐도 찾는다 (토큰 검색)', () => {
    // "제로이드 인텐시브 크림" 의 가운데를 뺀 검색어
    expect(names('제로이드 크림').some((n) => n.includes('제로이드'))).toBe(true);
    // 순서를 바꿔도 같다
    expect(names('크림 제로이드').some((n) => n.includes('제로이드'))).toBe(true);
    expect(names('아토베리어 토너').some((n) => n.includes('에스트라'))).toBe(true);
  });

  it('쇼핑몰에 적힌 긴 이름을 그대로 넣어도 찾는다', () => {
    expect(names('에스트라 아토베리어365 하이드로 수딩크림').length).toBeGreaterThan(0);
    expect(names('라로슈포제 시카플라스트 밤 B5+').length).toBeGreaterThan(0);
  });

  it('초성으로도 찾는다', () => {
    expect(searchProducts('ㅈㄹㅇㄷ', 10).some((p) => p.brand === '제로이드')).toBe(true);
    expect(searchProducts('ㅇㄷㄹㅇ', 10).some((p) => p.brand === '오드로이')).toBe(true);
  });

  it('영문 브랜드 표기로도 찾는다', () => {
    expect(searchProducts('zeroid', 10).some((p) => p.brand === '제로이드')).toBe(true);
    expect(searchProducts('cnp', 10).some((p) => p.brand === '차앤박')).toBe(true);
    expect(searchProducts('klairs', 10).some((p) => p.brand === '디어클레어스')).toBe(true);
  });

  it('쇼핑몰에서 쓰는 다른 표기도 받는다', () => {
    expect(searchProducts('바이오더마', 10).some((p) => p.brand === '비오더마')).toBe(true);
    expect(searchProducts('디오디너리', 10).some((p) => p.brand === '더오디너리')).toBe(true);
  });

  it('성분명으로도 제품이 나온다', () => {
    expect(searchProducts('세라마이드', 10).length).toBeGreaterThan(0);
  });

  it('없는 말을 넣으면 빈 배열이다', () => {
    expect(searchProducts('ㅋㅋㅋ존재하지않는제품명ㅋㅋㅋ')).toEqual([]);
  });

  it('브랜드 제안은 초성·부분 입력에도 동작한다', () => {
    expect(suggestBrands('제로')).toContain('제로이드');
    expect(suggestBrands('ㅇㄷㄹㅇ')).toContain('오드로이');
  });
});
