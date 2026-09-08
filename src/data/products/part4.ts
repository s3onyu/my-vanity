import type { Product } from '@/types';
import { p } from './_helper';

/**
 * 사진 인식 개선 과정에서 보강한 인기 라인업 — 데모/미검증 데이터.
 * 포장 영문명을 별칭에 넣어 사진(OCR)·영문 검색이 잘 잡히게 한다.
 */
export const PRODUCTS_PART4: Product[] = [
  p('a001', '아누아', '어성초 77 B3 징크 트러블 세럼', '어성초세럼|B3징크|징크세럼|anua heartleaf 77 niacinamide zinc trouble serum|77 plus heartleaf serum', '세럼', 'houttuynia|niacinamide|zinc-pca|panthenol', 'breakout|sebum|pigmentation', 'oily|combo|normal|sensitive'),
  p('a002', '아누아', '어성초 77 클리어 패드', '어성초패드|anua heartleaf 77 clear pad', '패드', 'houttuynia|gluconolactone|panthenol', 'breakout|texture|sebum', 'oily|combo|normal'),
  p('a003', '아누아', '나이아신아마이드 10 + TXA 4 세럼', '나이아신세럼|txa세럼|anua niacinamide 10 txa 4 serum', '세럼', 'niacinamide|tranexamic-acid|hyaluronic-acid', 'pigmentation|dullness|sebum', 'dry|oily|combo|normal'),
  p('a004', '아누아', '어성초 70 데일리 로션', '어성초로션|anua heartleaf 70 daily lotion', '로션', 'houttuynia|panthenol|ceramide|squalane', 'barrier|breakout|dryness', 'dry|oily|combo|normal|sensitive'),
  p('a005', '아누아', '어성초 포어 컨트롤 클렌징 오일', '어성초클렌징오일|anua heartleaf pore control cleansing oil', '클렌징', 'houttuynia|jojoba-oil|sunflower-oil', 'sebum|breakout', 'oily|combo|normal|sensitive'),
  p('a006', '아누아', '어성초 실키 모이스처 선크림', '어성초선크림|silky sun|anua heartleaf silky moisture sun cream', '선크림', 'uvinul-a-plus|uvinul-t150|houttuynia|hyaluronic-acid', 'barrier|pigmentation', 'dry|combo|normal|sensitive'),
  p('a007', '아누아', '어성초 77 토닝 토너', '토닝토너|77 toning|anua heartleaf 77 toning toner', '토너', 'houttuynia|gluconolactone|lactobionic-acid|panthenol', 'texture|sebum|breakout', 'oily|combo|normal'),
  p('a008', '아누아', '아젤라익 애씨드 10 하이알루론 레드니스 수딩 세럼', '아젤라익세럼|redness serum|anua azelaic acid 10 hyaluron redness soothing serum', '세럼', 'azelaic-acid|hyaluronic-acid|centella', 'breakout|pigmentation|barrier', 'oily|combo|normal'),
  p('a009', '아누아', '어성초 77 PLUS 수딩 토너', '77플러스|77 plus toner|anua heartleaf 77 plus soothing toner', '토너', 'houttuynia|panthenol|allantoin|betaine', 'breakout|barrier|dryness', 'dry|oily|combo|normal|sensitive'),
  p('a010', '아누아', '피치 70 나이아신 클렌징 폼', '피치클렌징폼|anua peach 70 niacin cleansing foam', '클렌징', 'niacinamide|glycerin|betaine', 'dullness|sebum', 'dry|oily|combo|normal'),
  p('a011', '아누아', '어성초 80 수분 진정 앰플 미스트', '어성초미스트|anua heartleaf 80 soothing ampoule mist', '미스트', 'houttuynia|panthenol|hyaluronic-acid', 'breakout|barrier|dryness', 'dry|oily|combo|normal|sensitive'),
  p('a012', '아누아', '어성초 시카 데일리 수딩 크림', '어성초시카크림|anua heartleaf cica daily soothing cream', '크림', 'houttuynia|centella|madecassoside|ceramide', 'breakout|barrier', 'dry|oily|combo|normal|sensitive'),
];
