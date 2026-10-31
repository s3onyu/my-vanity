import { describe, expect, it } from 'vitest';
import { normalizeToken, parseIngredientList, pickKeyIngredients, splitIngredientText } from './ingredientParser';

describe('normalizeToken', () => {
  it('괄호 설명·함량·기호를 털어낸다', () => {
    expect(normalizeToken('나이아신아마이드 2%')).toBe('나이아신아마이드');
    expect(normalizeToken('센텔라아시아티카(병풀)추출물')).toBe('센텔라아시아티카추출물');
    expect(normalizeToken('살리실릭애씨드(BHA)')).toBe('살리실릭애씨드');
  });
});

describe('splitIngredientText', () => {
  it('쉼표·가운뎃점·줄바꿈 어느 쪽으로 적어도 자른다', () => {
    expect(splitIngredientText('정제수, 글리세린·판테놀\n나이아신아마이드')).toEqual(['정제수', '글리세린', '판테놀', '나이아신아마이드']);
  });

  it('이름 안의 쉼표를 잘못 자르지 않는다', () => {
    expect(splitIngredientText('정제수, 1,2-헥산다이올, 글리세린')).toEqual(['정제수', '1,2-헥산다이올', '글리세린']);
  });

  it('"전성분:" 머리말을 떼어낸다', () => {
    expect(splitIngredientText('전성분: 정제수, 글리세린')).toEqual(['정제수', '글리세린']);
  });
});

describe('parseIngredientList', () => {
  const REAL = '정제수, 글리세린, 1,2-헥산다이올, 나이아신아마이드, 판테놀, 병풀추출물, 소듐하이알루로네이트, 부틸렌글라이콜, 카보머, 향료';

  it('아는 성분만 골라내고 나머지는 따로 모은다', () => {
    const r = parseIngredientList(REAL);
    const ids = r.matched.map((m) => m.ingredient.id);
    expect(ids).toContain('niacinamide');
    expect(ids).toContain('panthenol');
    expect(ids).toContain('centella');
    expect(ids).toContain('hyaluronic-acid'); // 소듐하이알루로네이트 → 별칭으로 인식
    expect(r.unmatched).toContain('카보머');
    expect(r.total).toBe(10);
  });

  it('전성분에 적힌 순서를 함께 돌려준다 (앞쪽일수록 함량이 높다)', () => {
    const r = parseIngredientList(REAL);
    const nia = r.matched.find((m) => m.ingredient.id === 'niacinamide');
    const centella = r.matched.find((m) => m.ingredient.id === 'centella');
    expect(nia!.position).toBeLessThan(centella!.position);
  });

  it('같은 성분이 두 번 적혀 있어도 한 번만 센다', () => {
    const r = parseIngredientList('나이아신아마이드, 글리세린, 나이아신아마이드');
    expect(r.matched.filter((m) => m.ingredient.id === 'niacinamide')).toHaveLength(1);
  });

  it('영문 INCI 로 적힌 전성분도 읽는다', () => {
    const r = parseIngredientList('Water, Glycerin, Niacinamide, Panthenol');
    expect(r.matched.map((m) => m.ingredient.id)).toContain('niacinamide');
  });

  it('빈 문자열이면 아무것도 돌려주지 않는다', () => {
    expect(parseIngredientList('')).toEqual({ matched: [], unmatched: [], total: 0 });
  });
});

describe('pickKeyIngredients', () => {
  it('효과가 센 성분을 뒤에 적혀 있어도 먼저 집는다', () => {
    const r = parseIngredientList('정제수, 글리세린, 베타인, 트레할로스, 스쿠알란, 알란토인, 판테놀, 세라마이드, 레티놀');
    expect(pickKeyIngredients(r, 3)).toContain('retinol');
  });

  it('최대 개수를 넘기지 않는다', () => {
    const r = parseIngredientList('글리세린, 베타인, 판테놀, 알란토인, 스쿠알란, 세라마이드, 트레할로스, 녹차추출물, 병풀추출물, 마데카소사이드');
    expect(pickKeyIngredients(r, 8).length).toBeLessThanOrEqual(8);
  });
});
