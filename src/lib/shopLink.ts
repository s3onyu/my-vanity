import type { Product } from '@/types';

/**
 * 제품을 실제로 사거나 가격을 확인할 수 있는 쇼핑 검색 링크 (요청 10번).
 *
 * 이 앱은 가격을 직접 들고 있지 않다 (수시로 바뀌고, 수백 개 제품의 실시간 가격을 받아올 방법이 없다).
 * 대신 브랜드·제품명으로 검색한 결과를 새 탭으로 열어 준다. 제휴·수수료 링크가 아니다.
 */
export interface ShopLink {
  id: 'oliveyoung' | 'naver';
  label: string;
  icon: string;
  /** 왜 이 쇼핑몰인지 */
  hint: string;
  url: string;
}

/** 검색이 잘 되도록 용량·호수 같은 꼬리말을 떼어낸다 */
export function shopQuery(product: Product): string {
  const name = product.name
    .replace(/\d+(\.\d+)?\s*(ml|mL|g|호|개입|매|팩)\b/g, ' ')
    .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${product.brand} ${name}`.trim();
}

export function shopLinks(product: Product): ShopLink[] {
  const q = encodeURIComponent(shopQuery(product));
  return [
    {
      id: 'oliveyoung',
      label: '올리브영에서 보기',
      icon: '🛒',
      hint: '오늘 가격·리뷰·품절 여부를 확인할 수 있어요',
      url: `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${q}`,
    },
    {
      id: 'naver',
      label: '네이버 쇼핑에서 보기',
      icon: '🔎',
      hint: '올리브영에 없는 작은 브랜드는 여기서 더 잘 찾아져요',
      url: `https://search.shopping.naver.com/search/all?query=${q}`,
    },
  ];
}

/**
 * 검색어로 바로 쇼핑몰을 열어 주는 링크.
 * 앱 목록에 없는 제품을 찾을 때 쓴다 — 올리브영에서 전성분을 복사해 오면 바로 분석할 수 있다.
 */
export function shopSearchLinks(query: string): ShopLink[] {
  const q = encodeURIComponent(query.trim());
  return [
    {
      id: 'oliveyoung',
      label: '올리브영에서 찾아보기',
      icon: '🛒',
      hint: '제품 페이지의 “상품정보 제공고시 → 모든 성분” 을 복사해 오면 바로 분석해 드려요',
      url: `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${q}`,
    },
    {
      id: 'naver',
      label: '네이버 쇼핑에서 찾아보기',
      icon: '🔎',
      hint: '올리브영에 없는 브랜드는 여기서 더 잘 찾아져요',
      url: `https://search.shopping.naver.com/search/all?query=${q}`,
    },
  ];
}

/** 1,000원 단위 콤마 */
export const formatWon = (won: number): string => `${Math.round(won).toLocaleString('ko-KR')}원`;

/** 용량이 있으면 1ml(또는 1g) 당 가격 */
export function pricePerUnit(price: number, volume: number | null | undefined): string | null {
  if (!volume || volume <= 0) return null;
  const per = price / volume;
  return `${per >= 100 ? Math.round(per).toLocaleString('ko-KR') : per.toFixed(1)}원/ml`;
}
