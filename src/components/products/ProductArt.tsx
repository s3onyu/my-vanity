import type { ReactElement } from 'react';
import type { ColorTag, Product } from '@/types';
import { COLOR_HEX } from '@/data/concerns';

const TONES: ColorTag[] = ['rose', 'mint', 'sky', 'butter', 'lilac', 'gold', 'plum'];

/** 브랜드 이름으로 결정되는 고정 색 — 같은 브랜드는 늘 같은 색으로 보인다 */
export function brandTone(brand: string): ColorTag {
  let h = 7;
  for (let i = 0; i < brand.length; i += 1) h = (h * 31 + brand.charCodeAt(i)) % 100003;
  return TONES[h % TONES.length];
}

/** 라벨에 쓸 짧은 브랜드 표기 (한글 1~2자, 영문 2자) */
function brandMark(brand: string): string {
  const s = brand.replace(/\s+/g, '');
  if (/^[A-Za-z]/.test(s)) return s.slice(0, 2).toUpperCase();
  return s.slice(0, 2);
}

interface Props {
  product: Pick<Product, 'brand' | 'category'>;
  size?: number | string;
  className?: string;
}

/**
 * 제품 사진이 없을 때 쓰는 카테고리별 일러스트.
 * 병·스포이드·펌프·자·튜브·파우치·쿠션 실루엣을 브랜드 색으로 그린다.
 */
export function ProductArt({ product, size = 44, className }: Props) {
  const tone = brandTone(product.brand);
  const c = COLOR_HEX[tone];
  const mark = brandMark(product.brand);
  const cap = '#6f6459';
  const glass = 'rgba(255,255,255,0.55)';

  let shape: ReactElement;
  switch (product.category) {
    case '세럼':
    case '앰플':
    case '오일':
      // 스포이드 병
      shape = (
        <>
          <rect x="22" y="22" width="20" height="34" rx="5" fill={c.base} />
          <rect x="25" y="26" width="6" height="26" rx="3" fill={glass} />
          <rect x="27" y="12" width="10" height="10" rx="2" fill={cap} />
          <ellipse cx="32" cy="10" rx="6" ry="4" fill={product.category === '오일' ? '#c9a36b' : cap} />
          <rect x="31" y="22" width="2" height="18" fill="rgba(0,0,0,0.18)" />
        </>
      );
      break;
    case '로션':
    case '클렌징':
      // 펌프 병
      shape = (
        <>
          <rect x="20" y="20" width="24" height="36" rx="6" fill={c.base} />
          <rect x="24" y="26" width="6" height="24" rx="3" fill={glass} />
          <rect x="28" y="12" width="8" height="9" rx="1.5" fill={cap} />
          <rect x="30" y="7" width="12" height="4" rx="2" fill={cap} />
        </>
      );
      break;
    case '크림':
    case '아이크림':
    case '패드':
      // 자(jar)
      shape = (
        <>
          <rect x="14" y="24" width="36" height="28" rx="7" fill={c.base} />
          <rect x="12" y="16" width="40" height="11" rx="4" fill={cap} />
          <rect x="18" y="32" width="8" height="14" rx="3" fill={glass} />
        </>
      );
      break;
    case '선크림':
      // 튜브
      shape = (
        <>
          <path d="M22 14 H42 V42 C42 50 22 50 22 42 Z" fill={c.base} />
          <rect x="20" y="10" width="24" height="6" rx="2" fill={cap} />
          <rect x="26" y="20" width="5" height="20" rx="2.5" fill={glass} />
          <circle cx="32" cy="55" r="5" fill={cap} />
        </>
      );
      break;
    case '마스크':
      // 시트 파우치
      shape = (
        <>
          <path d="M14 14 Q32 8 50 14 V52 Q32 56 14 52 Z" fill={c.base} />
          <path d="M14 14 Q32 8 50 14 V19 Q32 13 14 19 Z" fill={cap} opacity="0.7" />
          <ellipse cx="32" cy="36" rx="9" ry="11" fill={glass} />
          <circle cx="29" cy="34" r="1.3" fill={cap} />
          <circle cx="35" cy="34" r="1.3" fill={cap} />
        </>
      );
      break;
    case '베이스':
      // 쿠션 컴팩트
      shape = (
        <>
          <circle cx="32" cy="34" r="19" fill={c.base} />
          <circle cx="32" cy="34" r="12" fill={glass} />
          <rect x="18" y="12" width="28" height="6" rx="3" fill={cap} />
        </>
      );
      break;
    case '미스트':
      // 스프레이 병
      shape = (
        <>
          <rect x="22" y="24" width="20" height="32" rx="5" fill={c.base} />
          <rect x="26" y="30" width="5" height="20" rx="2.5" fill={glass} />
          <rect x="27" y="14" width="10" height="10" rx="2" fill={cap} />
          <rect x="37" y="16" width="8" height="4" rx="2" fill={cap} />
        </>
      );
      break;
    default:
      // 토너 · 에센스 · 필링: 긴 병
      shape = (
        <>
          <rect x="22" y="16" width="20" height="40" rx="5" fill={c.base} />
          <rect x="26" y="24" width="5" height="24" rx="2.5" fill={glass} />
          <rect x="26" y="8" width="12" height="9" rx="2" fill={cap} />
        </>
      );
  }

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label={`${product.brand} ${product.category} 일러스트`}>
      <rect width="64" height="64" rx="14" fill={c.soft} />
      {shape}
      <rect x="20" y="40" width="24" height="9" rx="2" fill="#fff" opacity="0.85" />
      <text x="32" y="47" textAnchor="middle" fontSize="7" fontWeight="700" fill={c.ink} fontFamily="Pretendard Variable, Inter, sans-serif">
        {mark}
      </text>
    </svg>
  );
}
