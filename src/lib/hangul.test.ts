import { describe, expect, it } from 'vitest';
import { isChosungQuery, searchTokens, toChosung } from './hangul';

describe('toChosung', () => {
  it('한글 음절을 초성으로 바꾼다', () => {
    expect(toChosung('제로이드')).toBe('ㅈㄹㅇㄷ');
    expect(toChosung('오드로이')).toBe('ㅇㄷㄹㅇ');
    expect(toChosung('아토베리어')).toBe('ㅇㅌㅂㄹㅇ');
  });

  it('쌍자음 초성도 제대로 뽑는다', () => {
    expect(toChosung('깨끗한')).toBe('ㄲㄲㅎ');
    expect(toChosung('쑥떡')).toBe('ㅆㄸ');
  });

  it('한글이 아닌 문자는 그대로 둔다', () => {
    expect(toChosung('코스알엑스 bha 7')).toBe('ㅋㅅㅇㅇㅅ bha 7');
    expect(toChosung('VT')).toBe('VT');
  });
});

describe('isChosungQuery', () => {
  it('자음만 두 글자 이상이면 초성 검색으로 본다', () => {
    expect(isChosungQuery('ㅈㄹㅇㄷ')).toBe(true);
    expect(isChosungQuery('ㄷㄹ')).toBe(true);
  });

  it('완성된 음절이나 모음, 영문이 섞이면 초성 검색이 아니다', () => {
    expect(isChosungQuery('제로이드')).toBe(false);
    expect(isChosungQuery('ㄱ크림')).toBe(false);
    expect(isChosungQuery('ㅏㅏ')).toBe(false);
    expect(isChosungQuery('abc')).toBe(false);
  });

  it('한 글자는 결과가 너무 많아 초성 검색으로 보지 않는다', () => {
    expect(isChosungQuery('ㅈ')).toBe(false);
  });
});

describe('searchTokens', () => {
  it('공백과 가운뎃점, 쉼표로 쪼갠다', () => {
    expect(searchTokens('제로이드 인텐시브 크림')).toEqual(['제로이드', '인텐시브', '크림']);
    expect(searchTokens('아누아, 어성초')).toEqual(['아누아', '어성초']);
    expect(searchTokens('  토리든   다이브인  ')).toEqual(['토리든', '다이브인']);
  });

  it('빈 문자열은 빈 배열이다', () => {
    expect(searchTokens('   ')).toEqual([]);
  });
});
