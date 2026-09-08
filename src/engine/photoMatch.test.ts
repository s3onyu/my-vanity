import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '@/data';
import { guessBrandAndName, matchProductsFromText, tokenizeOcr } from './photoMatch';

describe('photoMatch — 사진 글자 → 제품 대조', () => {
  it('토큰화: 한글 2자·영문 3자 이상만 남긴다', () => {
    expect(tokenizeOcr('COSRX  Advanced Snail 96 Mucin\n독도 토너 a 1')).toEqual(['cosrx', 'advanced', 'snail', 'mucin', '독도', '토너']);
  });

  it('브랜드+제품명이 그대로 읽히면 그 제품이 1순위', () => {
    const m = matchProductsFromText('라운드랩\n1025 독도 토너\n200ml', PRODUCTS);
    expect(m.length).toBeGreaterThan(0);
    expect(m[0].product.name).toBe('1025 독도 토너');
    expect(m[0].product.brand).toBe('라운드랩');
  });

  it('영문 별칭(cosrx)으로도 후보를 찾는다', () => {
    const m = matchProductsFromText('COSRX\nADVANCED SNAIL 96 MUCIN POWER ESSENCE', PRODUCTS);
    expect(m.some((x) => x.product.brand === '코스알엑스')).toBe(true);
  });

  it('OCR 오타가 섞여도 브랜드 토큰이 맞으면 후보가 나온다', () => {
    const m = matchProductsFromText('아누아 어성초 77 수분 진졍 토너', PRODUCTS);
    expect(m[0].product.brand).toBe('아누아');
    expect(m[0].product.name).toContain('어성초 77');
  });

  it('의미 없는 글자만 있으면 빈 결과', () => {
    expect(matchProductsFromText('!!! ... 12', PRODUCTS)).toEqual([]);
  });

  it('직접 등록 폼 프리필: 브랜드와 가장 긴 줄을 제품명으로 추정', () => {
    const g = guessBrandAndName('토리든\n다이브인 저분자 히알루론산 세럼\n50ml', PRODUCTS);
    expect(g.brand).toBe('토리든');
    expect(g.name).toBe('다이브인 저분자 히알루론산 세럼');
  });
});
