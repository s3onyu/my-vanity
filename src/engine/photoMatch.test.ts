import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '@/data';
import { analyzePhotoText, detectBrand, extractCategory, extractIngredientIds, tokenizeOcr } from './photoMatch';

const brands = [...new Set(PRODUCTS.map((p) => p.brand))];

describe('photoMatch — 사진 글자 → 제품 대조', () => {
  it('토큰화: 한글 2자·영문 3자·숫자 2자리 이상만 남긴다', () => {
    expect(tokenizeOcr('COSRX  Advanced Snail 96 Mucin\n독도 토너 a 1 77+')).toEqual(['cosrx', 'advanced', 'snail', '96', 'mucin', '독도', '토너', '77']);
  });

  it('브랜드 감지: 영문 표기와 대소문자 섞임, 한 글자 오타를 허용한다', () => {
    expect(detectBrand('ANua 77+ HEARTLEAF', brands)?.name).toBe('아누아');
    expect(detectBrand('C0SRX snail', brands)?.name).toBe('코스알엑스');
    expect(detectBrand('round lab dokdo', brands)?.name).toBe('라운드랩');
    expect(detectBrand('RTT i Fu Ep', brands)).toBeNull();
  });

  it('키워드에서 성분·카테고리를 뽑는다', () => {
    expect(extractIngredientIds('HEARTLEAF 77 NIACINAMIDE ZINC TROUBLE SERUM')).toEqual(['niacinamide', 'zinc-pca', 'houttuynia']);
    expect(extractCategory('HEARTLEAF 77 NIACINAMIDE ZINC TROUBLE SERUM')).toBe('세럼');
    expect(extractCategory('어성초 77 수분 진정 토너')).toBe('토너');
  });

  it('브랜드+제품명이 그대로 읽히면 이름 일치 1순위', () => {
    const a = analyzePhotoText('라운드랩\n1025 독도 토너\n200ml', PRODUCTS);
    expect(a.brand?.name).toBe('라운드랩');
    expect(a.nameMatches[0].product.name).toBe('1025 독도 토너');
  });

  it('실제 라벨처럼 영문만 읽혀도(Anua 77+ Heartleaf … Zinc Trouble Serum) 해당 제품을 찾는다', () => {
    const a = analyzePhotoText('ANua\n77+\nHEARTLEAF\nNIACINAMIDE ZINC\nTROUBLE SERUM\n30ml', PRODUCTS);
    expect(a.brand?.name).toBe('아누아');
    expect(a.nameMatches[0].product.name).toBe('어성초 77 B3 징크 트러블 세럼');
    expect(a.guess.category).toBe('세럼');
    expect(a.guess.ingredientIds).toContain('niacinamide');
    expect(a.guess.name).toBe('HEARTLEAF NIACINAMIDE ZINC TROUBLE SERUM');
  });

  it('브랜드만 읽히면 이름 일치는 비고 브랜드 제품 목록을 돌려준다', () => {
    const a = analyzePhotoText('RTT\ni Fu Ep. |\nANua', PRODUCTS);
    expect(a.brand?.name).toBe('아누아');
    expect(a.nameMatches).toEqual([]);
    expect(a.brandProducts.length).toBeGreaterThanOrEqual(10);
    expect(a.brandProducts.every((m) => m.product.brand === '아누아')).toBe(true);
    expect(a.guess.brand).toBe('아누아');
  });

  it('OCR 오타가 섞여도(HEARTLEAP, 진졍) 후보를 찾는다', () => {
    const a = analyzePhotoText('anua HEARTLEAP 77 soothing toner', PRODUCTS);
    expect(a.nameMatches.some((m) => m.product.name.includes('어성초 77'))).toBe(true);
    const b = analyzePhotoText('아누아 어성초 77 수분 진졍 토너', PRODUCTS);
    expect(b.nameMatches[0].product.name).toBe('어성초 77 수분 진정 토너');
  });

  it('의미 없는 글자만 있으면 아무것도 없다', () => {
    const a = analyzePhotoText('!!! ... 12', PRODUCTS);
    expect(a.brand).toBeNull();
    expect(a.nameMatches).toEqual([]);
    expect(a.brandProducts).toEqual([]);
  });

  it('등록 폼 추정: 브랜드·제품명 줄·카테고리·성분을 채운다', () => {
    const a = analyzePhotoText('토리든\n다이브인 저분자 히알루론산 세럼\n50ml', PRODUCTS);
    expect(a.guess.brand).toBe('토리든');
    expect(a.guess.name).toBe('다이브인 저분자 히알루론산 세럼');
    expect(a.guess.category).toBe('세럼');
    expect(a.guess.ingredientIds).toContain('hyaluronic-acid');
  });
});
