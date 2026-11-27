import type { Product } from '@/types';
import { p } from './_helper';

/**
 * 국내 브랜드 라인업 보강 1/2 — 데모/미검증 데이터.
 *
 * "브랜드는 있는데 내가 쓰는 제품이 없다" 는 의견을 받아, 이미 들어 있던 브랜드의
 * 대표 라인을 토너-로션-크림-세럼-클렌징-선크림 단위로 채웠다. 올리브영에 입점한
 * 국내 스킨케어 브랜드를 기준으로 했고, 제품명은 쇼핑몰 표기를 따랐다.
 *
 * ⚠️ 올리브영 사이트를 프로그램으로 긁어 오지는 않는다 (봇 차단이 걸려 있고 우회는
 * 사이트 정책에 어긋난다). 그래서 이 목록은 '올리브영 전체 미러' 가 아니라 많이 찾는
 * 라인을 정리한 것이다. 성분은 제품명·라인 대표 성분만 넣었고 전부 미검증이다.
 * 정확한 전성분은 제품 등록 화면에 전성분을 붙여넣어 보완할 수 있다.
 */
export const PRODUCTS_PART6: Product[] = [
  // ── 토니모리 ────────────────────────────────────────────────────────────────
  p('z001', '토니모리', '원더 세라마이드 모찌 토너', '모찌토너|세라마이드모찌토너|토니모리 모찌 토너|wonder ceramide mochi toner', '토너', 'ceramide|hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('z002', '토니모리', '원더 세라마이드 모찌 에멀전', '모찌에멀전|모찌 로션|wonder ceramide mochi emulsion', '로션', 'ceramide|hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('z003', '토니모리', '원더 세라마이드 모찌 수분 크림', '모찌수분크림|모찌크림|wonder ceramide mochi cream', '크림', 'ceramide|hyaluronic-acid|panthenol|shea-butter', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z004', '토니모리', '원더 세라마이드 모찌 미스트', '모찌미스트|wonder ceramide mochi mist', '미스트', 'ceramide|hyaluronic-acid|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('z005', '토니모리', '원더 세라마이드 모찌 클렌징 폼', '모찌클렌징폼|모찌 폼클렌저', '클렌징', 'ceramide|glycerin|panthenol', 'barrier|dryness', 'dry|normal|sensitive|combo'),
  p('z006', '토니모리', '원더 아쿠아 수분 토너', '원더아쿠아토너|wonder aqua toner', '토너', 'hyaluronic-acid|glycerin|betaine', 'dryness', 'dry|normal|combo'),
  p('z007', '토니모리', '원더 아쿠아 수분 크림', '원더아쿠아수분크림|wonder aqua cream', '크림', 'hyaluronic-acid|glycerin|squalane', 'dryness', 'dry|normal|combo'),
  p('z008', '토니모리', '더 촉촉 그린티 수분 토너', '촉촉그린티토너|chok chok green tea toner', '토너', 'green-tea|hyaluronic-acid|glycerin', 'dryness|sebum', 'normal|combo|oily'),
  p('z009', '토니모리', '더 촉촉 그린티 수분 크림', '촉촉그린티크림|chok chok green tea cream', '크림', 'green-tea|hyaluronic-acid|glycerin', 'dryness|sebum', 'normal|combo|oily'),
  p('z010', '토니모리', '내추럴스 산양유 크림', '산양유크림|토니모리 산양유', '크림', 'glycerin|shea-butter|panthenol|tocopherol', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 미샤 ────────────────────────────────────────────────────────────────────
  p('z011', '미샤', '타임 레볼루션 퍼스트 트리트먼트 에센스', '미샤 에센스|퍼트에|퍼스트에센스|time revolution first treatment essence', '에센스', 'yeast-extract|galactomyces|niacinamide|adenosine', 'dullness|texture|dryness', 'dry|normal|combo|oily'),
  p('z012', '미샤', '타임 레볼루션 아티초크 인텐스 세럼', '아티초크 세럼|미샤 아티초크', '세럼', 'niacinamide|adenosine|peptides|panthenol', 'pores|texture|firming', 'normal|combo|oily'),
  p('z014', '미샤', '타임 레볼루션 아티초크 인텐스 크림', '아티초크 크림', '크림', 'niacinamide|adenosine|squalane|peptides', 'pores|firming|texture', 'normal|combo|oily'),
  p('z015', '미샤', '비폴렌 리뉴 앰플러', '비폴렌 앰플|미샤 비폴렌', '앰플', 'honey|propolis|panthenol|niacinamide', 'dryness|barrier|dullness', 'dry|normal|sensitive'),
  p('z016', '미샤', '비폴렌 리뉴 크림', '비폴렌 크림', '크림', 'honey|propolis|panthenol|shea-butter', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z017', '미샤', '슈퍼 아쿠아 울트라 하이알론 토너', '슈퍼아쿠아 토너|미샤 하이알론 토너', '토너', 'hyaluronic-acid|glycerin|betaine|panthenol', 'dryness', 'dry|normal|combo|sensitive'),
  p('z018', '미샤', '슈퍼 아쿠아 울트라 하이알론 크림', '슈퍼아쿠아 크림', '크림', 'hyaluronic-acid|glycerin|squalane|ceramide', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z019', '미샤', '니어 스킨 pH 밸런싱 클렌징 폼', '미샤 ph 클렌징폼', '클렌징', 'glycerin|panthenol|betaine', 'barrier', 'normal|combo|sensitive|dry'),

  // ── 에뛰드 ──────────────────────────────────────────────────────────────────
  p('z021', '에뛰드', '순정 약산성 pH5.5 토너', '순정 토너|에뛰드 순정|soonjung ph5.5 toner', '토너', 'panthenol|madecassoside|glycerin|betaine', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('z022', '에뛰드', '순정 약산성 pH5.5 로션', '순정 로션|soonjung lotion', '로션', 'panthenol|madecassoside|glycerin|squalane', 'barrier|dryness', 'sensitive|dry|normal'),
  p('z024', '에뛰드', '순정 pH 5.5 릴리프 토너', '순정 릴리프 토너', '토너', 'panthenol|madecassoside|allantoin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('z025', '에뛰드', '순정 약산성 pH6.5 휩 클렌저', '순정 클렌저|순정 휩클렌저', '클렌징', 'panthenol|glycerin|betaine', 'barrier', 'sensitive|dry|normal|combo'),
  p('z026', '에뛰드', '순정 썬 크림', '순정 선크림|soonjung sun cream', '선크림', 'zinc-oxide|titanium-dioxide|panthenol|madecassoside', 'pigmentation|barrier', 'sensitive|dry|normal'),
  p('z027', '에뛰드', '수분 가득 콜라겐 아이크림', '에뛰드 콜라겐 아이크림', '아이크림', 'collagen|adenosine|glycerin|shea-butter', 'firming|dryness', 'dry|normal|combo'),
  p('z028', '에뛰드', '모이스트풀 콜라겐 크림', '모이스트풀 크림|에뛰드 콜라겐 크림', '크림', 'collagen|hyaluronic-acid|glycerin|adenosine', 'dryness|firming', 'dry|normal'),
  p('z029', '에뛰드', '모이스트풀 콜라겐 토너', '모이스트풀 토너', '토너', 'collagen|hyaluronic-acid|glycerin', 'dryness|firming', 'dry|normal'),

  // ── 더페이스샵 ──────────────────────────────────────────────────────────────
  p('z030', '더페이스샵', '라이스 워터 브라이트 클렌징 폼', '라이스워터 클렌징폼|쌀 클렌징폼|rice water bright cleansing foam', '클렌징', 'rice-extract|glycerin|betaine', 'dullness|barrier', 'normal|combo|dry'),
  p('z031', '더페이스샵', '라이스 워터 브라이트 라이트 클렌징 오일', '라이스워터 클렌징오일|쌀 클렌징오일', '클렌징', 'rice-extract|mineral-oil|tocopherol', 'dullness', 'normal|combo|dry|oily'),
  p('z032', '더페이스샵', '예화담 진율향 윤기 에센스', '예화담 에센스|yehwadam', '에센스', 'ginseng|peony|adenosine|niacinamide', 'firming|dullness|dryness', 'dry|normal|combo'),
  p('z033', '더페이스샵', '예화담 진율향 윤기 크림', '예화담 크림', '크림', 'ginseng|peony|adenosine|shea-butter', 'firming|dryness', 'dry|normal'),
  p('z034', '더페이스샵', '망고씨드 실키 버터 크림', '망고씨드 크림|망고버터크림', '크림', 'shea-butter|glycerin|tocopherol|squalane', 'dryness|barrier', 'dry|normal'),
  p('z035', '더페이스샵', '망고씨드 실키 모이스처 토너', '망고씨드 토너', '토너', 'glycerin|hyaluronic-acid|betaine', 'dryness', 'dry|normal'),
  p('z036', '더페이스샵', '찰떡 세라마이드 토너', '찰떡토너|찰떡 세라마이드', '토너', 'ceramide|hyaluronic-acid|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z037', '더페이스샵', '찰떡 세라마이드 크림', '찰떡크림', '크림', 'ceramide|shea-butter|panthenol|glycerin', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 네이처리퍼블릭 ──────────────────────────────────────────────────────────
  p('z039', '네이처리퍼블릭', '수딩 앤 모이스처 알로에 베라 토너', '알로에 토너', '토너', 'aloe|glycerin|betaine', 'dryness|barrier', 'normal|combo|oily|sensitive'),
  p('z040', '네이처리퍼블릭', '수딩 앤 모이스처 알로에 베라 수분 크림', '알로에 수분크림', '크림', 'aloe|glycerin|hyaluronic-acid', 'dryness', 'normal|combo|oily'),
  p('z041', '네이처리퍼블릭', '진생 로얄 실크 워터리 크림', '진생로얄실크|인삼크림', '크림', 'ginseng|adenosine|peptides|shea-butter', 'firming|dryness', 'dry|normal'),
  p('z042', '네이처리퍼블릭', '캘리포니아 알로에 베라 선크림', '알로에 선크림', '선크림', 'aloe|zinc-oxide|titanium-dioxide|glycerin', 'pigmentation|barrier', 'normal|combo|sensitive'),
  p('z043', '네이처리퍼블릭', '그린 더만 세라마이드 크림', '그린더만 크림', '크림', 'ceramide|panthenol|madecassoside|shea-butter', 'barrier|dryness', 'sensitive|dry|normal'),

  // ── 이니스프리 (라인 보강) ──────────────────────────────────────────────────
  p('z044', '이니스프리', '그린티 씨드 히알루론산 토너', '그린티토너|그린티 씨드 토너|green tea seed toner', '토너', 'green-tea|hyaluronic-acid|glycerin|betaine', 'dryness|sebum', 'normal|combo|oily|dry'),
  p('z045', '이니스프리', '그린티 씨드 히알루론산 세럼', '그린티세럼|그린티 씨드 세럼', '세럼', 'green-tea|hyaluronic-acid|panthenol', 'dryness|sebum', 'normal|combo|oily|dry'),
  p('z046', '이니스프리', '그린티 씨드 히알루론산 크림', '그린티크림', '크림', 'green-tea|hyaluronic-acid|squalane|glycerin', 'dryness', 'normal|combo|dry'),
  p('z047', '이니스프리', '그린티 씨드 클렌징 폼', '그린티 클렌징폼', '클렌징', 'green-tea|glycerin|betaine', 'sebum|barrier', 'normal|combo|oily'),
  p('z048', '이니스프리', '레티놀 시카 흔적 앰플', '이니스프리 레티놀 앰플|레티놀시카앰플|retinol cica ampoule', '앰플', 'retinol|centella|madecassoside|panthenol', 'texture|pores|breakout', 'normal|combo|oily'),
  p('z049', '이니스프리', '레티놀 시카 흔적 크림', '레티놀시카크림', '크림', 'retinol|centella|ceramide|panthenol', 'texture|pores|barrier', 'normal|combo|dry'),
  p('z050', '이니스프리', '비타C 그린티 엔자임 브라이트닝 세럼', '비타C 세럼|이니스프리 비타씨 세럼', '세럼', 'ethyl-ascorbic-acid|green-tea|niacinamide', 'pigmentation|dullness', 'normal|combo|oily'),
  p('z052', '이니스프리', '블랙티 유스 인핸싱 크림', '블랙티 크림', '크림', 'black-tea|adenosine|shea-butter|peptides', 'firming|dryness', 'dry|normal'),
  p('z053', '이니스프리', '한란 인리치드 크림', '한란크림|이니스프리 한란', '크림', 'adenosine|peptides|shea-butter|squalane', 'firming|dryness', 'dry|normal'),

  // ── 홀리카홀리카 ────────────────────────────────────────────────────────────
  p('z055', '홀리카홀리카', '프라임 영 베어 스팀 크림', '스팀크림|홀리카 스팀크림', '크림', 'glycerin|shea-butter|hyaluronic-acid|ceramide', 'dryness|barrier', 'dry|normal'),
  p('z056', '홀리카홀리카', '피그 핏 클렌징 폼', '홀리카 클렌징폼', '클렌징', 'glycerin|betaine|panthenol', 'barrier', 'normal|combo|dry'),

  // ── 어퓨 ────────────────────────────────────────────────────────────────────
  p('z057', '어퓨', '마데카소사이드 수딩 토너', '어퓨 마데카 토너', '토너', 'madecassoside|centella|panthenol|allantoin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('z058', '어퓨', '마데카소사이드 수딩 크림', '어퓨 마데카 크림', '크림', 'madecassoside|centella|ceramide|panthenol', 'barrier|breakout', 'sensitive|combo|dry|normal'),
  p('z059', '어퓨', '순수 판테놀 미스트', '어퓨 판테놀 미스트', '미스트', 'panthenol|glycerin|hyaluronic-acid', 'dryness|barrier', 'sensitive|dry|normal|combo'),
  p('z060', '어퓨', '마데카소사이드 클렌징 폼', '어퓨 마데카 클렌징폼', '클렌징', 'madecassoside|glycerin|betaine', 'barrier|breakout', 'sensitive|combo|oily'),

  // ── 스킨푸드 (라인 보강) ────────────────────────────────────────────────────
  p('z062', '스킨푸드', '캐롯 카로틴 카밍 워터 토너', '캐롯토너|당근토너', '토너', 'allantoin|panthenol|glycerin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('z063', '스킨푸드', '캐롯 카로틴 카밍 워터 크림', '캐롯크림|당근크림', '크림', 'allantoin|panthenol|ceramide|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('z064', '스킨푸드', '블랙슈가 퍼펙트 에센셜 스크럽', '블랙슈가 스크럽|흑설탕 스크럽|black sugar scrub', '필링', 'glycerin|sunflower-oil|tocopherol', 'texture|dullness', 'normal|combo|oily'),
  p('z065', '스킨푸드', '로얄 허니 프로폴리스 엔리치 에센스', '로얄허니 에센스|스킨푸드 프로폴리스', '에센스', 'honey|propolis|panthenol|niacinamide', 'dryness|barrier|dullness', 'dry|normal|sensitive'),
  p('z066', '스킨푸드', '토마토 비타 토닝 토너', '토마토 토너', '토너', 'niacinamide|ethyl-ascorbic-acid|glycerin', 'dullness|pigmentation', 'normal|combo|oily'),

  // ── 바닐라코 (라인 보강) ────────────────────────────────────────────────────
  p('z067', '바닐라코', '클린 잇 제로 클렌징 밤 오리지널', '클린잇제로|제로밤|clean it zero original', '클렌징', 'mineral-oil|tocopherol|shea-butter', 'barrier', 'dry|normal|combo|sensitive'),
  p('z068', '바닐라코', '클린 잇 제로 클렌징 밤 퓨리파잉', '클린잇제로 퓨리파잉|제로밤 초록', '클렌징', 'mineral-oil|tea-tree|tocopherol', 'sebum|pores|breakout', 'oily|combo|normal'),
  p('z069', '바닐라코', '클린 잇 제로 클렌징 밤 레볼루션', '클린잇제로 레볼루션|제로밤 분홍', '클렌징', 'mineral-oil|tocopherol|peptides', 'texture|firming', 'normal|combo|dry'),
  p('z070', '바닐라코', '클린 잇 제로 폼 클렌저', '클린잇제로 폼클렌저', '클렌징', 'glycerin|betaine|panthenol', 'barrier', 'normal|combo|dry|sensitive'),
  p('z071', '바닐라코', '프라임 프라이머 클래식', '바닐라코 프라이머', '베이스', 'dimethicone|silica|glycerin', 'pores|sebum', 'oily|combo|normal'),

  // ── 라운드어라운드 ──────────────────────────────────────────────────────────
  p('z072', '라운드어라운드', '올리브 세라마이드 크림', '라운드어라운드 세라마이드 크림', '크림', 'ceramide|olive-oil|shea-butter|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z073', '라운드어라운드', '올리브 세라마이드 토너', '라운드어라운드 세라마이드 토너', '토너', 'ceramide|olive-oil|glycerin', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 아리얼 ──────────────────────────────────────────────────────────────────
  p('z074', '아리얼', '세븐데이즈 마스크 티트리', '아리얼 티트리 마스크|세븐데이즈 티트리', '마스크', 'tea-tree|centella|panthenol|glycerin', 'breakout|sebum|barrier', 'oily|combo|sensitive'),
  p('z075', '아리얼', '세븐데이즈 마스크 알로에', '아리얼 알로에 마스크', '마스크', 'aloe|glycerin|panthenol', 'dryness|barrier', 'normal|combo|sensitive'),
  p('z076', '아리얼', '세븐데이즈 마스크 히알루론산', '아리얼 히알루론산 마스크', '마스크', 'hyaluronic-acid|glycerin|betaine', 'dryness', 'dry|normal|combo'),

  // ── 메디힐 (라인 보강) ──────────────────────────────────────────────────────
  p('z078', '메디힐', '티트리 케어 솔루션 에센셜 마스크', '메디힐 티트리 마스크', '마스크', 'tea-tree|centella|panthenol', 'breakout|sebum', 'oily|combo|sensitive'),
  p('z079', '메디힐', '히알루론산 모이스처 에센셜 마스크', '메디힐 히알루론산 마스크', '마스크', 'hyaluronic-acid|glycerin|panthenol', 'dryness', 'dry|normal|combo'),
  p('z081', '메디힐', '콜라겐 임팩트 에센셜 마스크', '메디힐 콜라겐 마스크', '마스크', 'collagen|adenosine|hyaluronic-acid', 'firming|dryness', 'dry|normal'),
  p('z082', '메디힐', '마데카소사이드 흔적 패드', '메디힐 마데카 패드', '패드', 'madecassoside|centella|panthenol|lactic-acid', 'barrier|texture|breakout', 'combo|oily|normal|sensitive'),

  // ── 제이엠솔루션 ────────────────────────────────────────────────────────────
  p('z083', '제이엠솔루션', '워터 럭스 어벤느 블랙 마스크', '제이엠 블랙마스크', '마스크', 'thermal-water|hyaluronic-acid|glycerin', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z085', '제이엠솔루션', '마린 루미너스 진주 마스크', '제이엠 진주 마스크', '마스크', 'pearl|niacinamide|glycerin', 'dullness|pigmentation', 'normal|combo|dry'),

  // ── 파파레서피 (라인 보강) ──────────────────────────────────────────────────
  p('z086', '파파레서피', '봄비 꿀 수분 마스크팩', '봄비 꿀마스크|파파레서피 봄비', '마스크', 'honey|propolis|panthenol|glycerin', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z087', '파파레서피', '봄비 허니 모이스처 크림', '봄비 크림', '크림', 'honey|propolis|shea-butter|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z088', '파파레서피', '봄비 허니 모이스처 토너', '봄비 토너', '토너', 'honey|propolis|glycerin|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z089', '파파레서피', '잠이 꿀 수분 크림', '파파레서피 잠이꿀', '크림', 'honey|hyaluronic-acid|glycerin|ceramide', 'dryness|barrier', 'dry|normal'),

  // ── 닥터지 (라인 보강) ──────────────────────────────────────────────────────
  p('z091', '닥터지', '레드 블레미쉬 클리어 수딩 폼', '닥터지 레드 폼클렌저', '클렌징', 'centella|madecassoside|glycerin|betaine', 'barrier|breakout', 'sensitive|combo|oily'),
  p('z093', '닥터지', '레드 블레미쉬 수딩 선 플러스', '닥터지 레드 선크림', '선크림', 'centella|madecassoside|zinc-oxide|titanium-dioxide', 'pigmentation|barrier', 'sensitive|combo|oily|normal'),
  p('z094', '닥터지', '브라이트닝 피콜라겐 크림', '닥터지 피콜라겐', '크림', 'collagen|niacinamide|adenosine|ceramide', 'firming|dullness|dryness', 'dry|normal|combo'),
  p('z095', '닥터지', '블랙 스네일 크림', '닥터지 스네일 크림', '크림', 'snail-mucin|adenosine|panthenol|ceramide', 'firming|barrier|dryness', 'dry|normal|combo'),

  // ── 아이오페 (라인 보강) ────────────────────────────────────────────────────
  p('z098', '아이오페', '더마 리페어 시카 크림', '아이오페 시카크림', '크림', 'centella|madecassoside|ceramide|panthenol', 'barrier|dryness', 'sensitive|dry|normal'),

  // ── 라네즈 (라인 보강) ──────────────────────────────────────────────────────
  p('z101', '라네즈', '워터 뱅크 블루 히알루로닉 크림', '워터뱅크 크림|라네즈 수분크림|water bank cream', '크림', 'hyaluronic-acid|glycerin|squalane|panthenol', 'dryness|barrier', 'dry|normal|combo'),
  p('z102', '라네즈', '워터 뱅크 블루 히알루로닉 에센스 토너', '워터뱅크 토너', '토너', 'hyaluronic-acid|glycerin|betaine|panthenol', 'dryness|barrier', 'dry|normal|combo'),
  p('z103', '라네즈', '워터 뱅크 블루 히알루로닉 세럼', '워터뱅크 세럼', '세럼', 'hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('z104', '라네즈', '크림 스킨 리피너', '라네즈 크림스킨|크림스킨 토너|cream skin refiner', '토너', 'ceramide|hyaluronic-acid|glycerin|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z105', '라네즈', '래디언-씨 브라이트닝 세럼', '라네즈 비타민 세럼|래디언씨 세럼', '세럼', 'ascorbyl-glucoside|niacinamide|tocopherol', 'pigmentation|dullness', 'normal|combo|dry'),
  p('z106', '라네즈', '퍼펙트 리뉴 3X 세럼', '라네즈 퍼펙트리뉴', '세럼', 'peptides|adenosine|niacinamide|ceramide', 'firming|texture', 'dry|normal|combo'),
  p('z107', '라네즈', '시카 슬리핑 마스크', '라네즈 시카 슬리핑팩', '마스크', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|combo|normal'),

  // ── 마몽드 (라인 보강) ──────────────────────────────────────────────────────
  p('z108', '마몽드', '로즈 워터 토너', '마몽드 장미수|로즈워터 토너', '토너', 'rose|glycerin|betaine|panthenol', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('z109', '마몽드', '레드 에너지 리커버리 세럼', '마몽드 레드에너지 세럼', '세럼', 'rose|adenosine|niacinamide|peptides', 'firming|dullness', 'normal|combo|dry'),
  p('z110', '마몽드', '엔리치 아쿠아 필 토너', '마몽드 아쿠아필 토너', '토너', 'lactic-acid|glycerin|panthenol', 'texture|pores|dullness', 'normal|combo|oily'),
  p('z111', '마몽드', '비타민 B5 수분 크림', '마몽드 판테놀 크림', '크림', 'panthenol|hyaluronic-acid|ceramide|glycerin', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 한율 (라인 보강) ────────────────────────────────────────────────────────
  p('z112', '한율', '어린쑥 수분 진정 크림', '한율 쑥크림|어린쑥 크림', '크림', 'mugwort|panthenol|ceramide|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('z114', '한율', '어린쑥 진정 클렌징 폼', '한율 쑥 클렌징폼', '클렌징', 'mugwort|glycerin|betaine', 'barrier', 'sensitive|normal|combo|dry'),
  p('z115', '한율', '빨간쌀 진정 에센스', '한율 빨간쌀 에센스', '에센스', 'rice-extract|niacinamide|panthenol', 'dullness|barrier|dryness', 'dry|normal|sensitive'),

  // ── 프리메라 (라인 보강) ────────────────────────────────────────────────────
  p('z117', '프리메라', '알파인 베리 워터리 크림', '프리메라 알파인베리', '크림', 'hyaluronic-acid|beta-glucan|glycerin', 'dryness', 'normal|combo|dry'),
  p('z118', '프리메라', '와일드 씨드 퍼밍 크림', '프리메라 와일드씨드 크림', '크림', 'peptides|adenosine|shea-butter|beta-glucan', 'firming|dryness', 'dry|normal'),

  // ── 일리윤 (라인 보강) ──────────────────────────────────────────────────────
  p('z120', '일리윤', '세라마이드 아토 토너', '일리윤 세라마이드 토너', '토너', 'ceramide|panthenol|glycerin|betaine', 'barrier|dryness', 'dry|sensitive|normal'),
  p('z122', '일리윤', '하이알루로닉 산 수분 크림', '일리윤 히알루론산 크림', '크림', 'hyaluronic-acid|panthenol|glycerin|ceramide', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 아토팜 (라인 보강) ──────────────────────────────────────────────────────
  p('z125', '아토팜', '토피 케어 집중 보습 크림', '아토팜 토피케어', '크림', 'ceramide|petrolatum|panthenol|shea-butter', 'barrier|dryness', 'dry|sensitive'),
  p('z126', '아토팜', 'MLE 페이셜 로션', '아토팜 페이셜로션', '로션', 'ceramide|cholesterol|fatty-acids|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),

  // ── 라보에이치 (라인 보강) ──────────────────────────────────────────────────
  p('z127', '라보에이치', '세라마이드 스킨 배리어 크림', '라보에이치 세라마이드 크림', '크림', 'ceramide|panthenol|glycerin|shea-butter', 'barrier|dryness', 'dry|sensitive|normal'),
  p('z128', '라보에이치', '프로바이오틱 진정 토너', '라보에이치 토너', '토너', 'lactobacillus|panthenol|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo'),

  // ── 케어존 ──────────────────────────────────────────────────────────────────
  p('z129', '케어존', '도첩 순 시카 크림', '케어존 시카크림|도첩 시카', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal|combo'),
  p('z130', '케어존', '도첩 순 시카 토너', '케어존 시카토너', '토너', 'centella|madecassoside|panthenol|allantoin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('z131', '케어존', '하이알룬 100 세럼', '케어존 히알루론 세럼', '세럼', 'hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),

  // ── 비욘드 ──────────────────────────────────────────────────────────────────
  p('z132', '비욘드', '엔젤 아쿠아 수분 크림', '비욘드 엔젤아쿠아 크림', '크림', 'hyaluronic-acid|glycerin|squalane|panthenol', 'dryness', 'dry|normal|combo'),
  p('z133', '비욘드', '프로페셔널 리페어 세라마이드 크림', '비욘드 세라마이드 크림', '크림', 'ceramide|shea-butter|panthenol|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),

  // ── 클리오 / 구달 (라인 보강) ───────────────────────────────────────────────
  p('z134', '구달', '청귤 비타C 잡티 세럼', '청귤세럼|구달 비타씨 세럼|green tangerine vita c serum', '세럼', 'ethyl-ascorbic-acid|yuja|niacinamide|tocopherol', 'pigmentation|dullness', 'normal|combo|oily|dry'),
  p('z137', '구달', '청귤 비타C 잡티 선크림', '청귤 선크림', '선크림', 'ethyl-ascorbic-acid|yuja|zinc-oxide|titanium-dioxide', 'pigmentation', 'normal|combo|oily'),

  // ── 티르티르 (라인 보강) ────────────────────────────────────────────────────
  p('z139', '티르티르', '밀크 스킨 토너', '티르티르 밀크 토너', '토너', 'niacinamide|glycerin|panthenol|betaine', 'dullness|dryness', 'normal|combo|dry'),
  p('z140', '티르티르', '밀크 스킨 세럼', '티르티르 밀크 세럼', '세럼', 'niacinamide|hyaluronic-acid|panthenol', 'dullness|dryness', 'normal|combo|dry'),

  // ── 하루하루원더 (라인 보강) ────────────────────────────────────────────────
  p('z142', '하루하루원더', '블랙 라이스 하이알루로닉 크림', '하루하루원더 흑미 크림', '크림', 'rice-extract|hyaluronic-acid|ceramide|shea-butter', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z143', '하루하루원더', '블랙 라이스 하이알루로닉 세럼', '하루하루원더 흑미 세럼', '세럼', 'rice-extract|hyaluronic-acid|niacinamide|panthenol', 'dryness|dullness', 'dry|normal|combo'),

  // ── 조선미녀 (라인 보강) ────────────────────────────────────────────────────
  p('z146', '조선미녀', '맑은쌀 클렌징 오일', '조선미녀 클렌징오일', '클렌징', 'rice-extract|sunflower-oil|tocopherol', 'dullness|barrier', 'dry|normal|combo'),
  p('z147', '조선미녀', '진정 미스트 어성초', '조선미녀 어성초 미스트', '미스트', 'houttuynia|panthenol|glycerin', 'barrier|breakout', 'sensitive|combo|oily|normal'),

  // ── 아크네스 / 아이소이 / 시드물 (라인 보강) ────────────────────────────────
  p('z148', '아크네스', '파워 크림', '아크네스 크림', '크림', 'salicylic-acid|allantoin|glycerin|panthenol', 'breakout|sebum|pores', 'oily|combo'),
  p('z149', '아크네스', '포 맨 클렌징 폼', '아크네스 남성 클렌징폼', '클렌징', 'salicylic-acid|glycerin|betaine', 'breakout|sebum', 'oily|combo'),
  p('z151', '아이소이', '불가리안 로즈 토너', '아이소이 로즈 토너', '토너', 'rose|glycerin|panthenol|betaine', 'dryness|barrier', 'dry|normal|sensitive'),
  p('z152', '시드물', '병풀 수분 진정 토너', '시드물 병풀 토너', '토너', 'centella|madecassoside|panthenol|glycerin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('z153', '시드물', '마데카소사이드 진정 크림', '시드물 마데카 크림', '크림', 'madecassoside|centella|ceramide|panthenol', 'barrier|dryness', 'sensitive|dry|normal'),

  // ── 원진효과 / 나인위시스 / 어노브 (라인 보강) ──────────────────────────────
  p('z154', '원진효과', '그린 리커버리 아티초크 토너', '원진효과 토너', '토너', 'centella|panthenol|glycerin|allantoin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('z155', '원진효과', '리제너레이팅 크림', '원진효과 크림', '크림', 'peptides|adenosine|ceramide|panthenol', 'firming|barrier|dryness', 'dry|normal|sensitive'),
  p('z156', '나인위시스', '하이드라 앰플 세럼', '나인위시스 세럼', '세럼', 'hyaluronic-acid|panthenol|beta-glucan', 'dryness|barrier', 'dry|normal|combo|sensitive'),

  // ── 셀랩 / 알리에 / 셀프뷰티 (라인 보강) ────────────────────────────────────
  p('z157', '셀랩', '시카 리페어 크림', '셀랩 시카크림', '크림', 'centella|madecassoside|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|normal'),
  p('z158', '셀랩', '히알루론산 수분 세럼', '셀랩 히알루론산 세럼', '세럼', 'hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
];
