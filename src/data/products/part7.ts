import type { Product } from '@/types';
import { p } from './_helper';

/**
 * 국내 브랜드 라인업 보강 2/2 — 데모/미검증 데이터.
 *
 * part6 에 이어 올리브영·드럭스토어에서 많이 찾는 국내 브랜드와, 목록에 아예 없던
 * 브랜드(센텔리안24·네오젠·이츠스킨·닥터벨머·큐렐 등)를 채웠다.
 * 성분은 제품명·라인 대표 성분만 넣었고 전부 미검증이다.
 */
export const PRODUCTS_PART7: Product[] = [
  // ── 센텔리안24 ──────────────────────────────────────────────────────────────
  p('w001', '센텔리안24', '마데카 크림', '마데카크림|센텔리안 마데카|madeca cream', '크림', 'madecassoside|centella|panthenol|glycerin', 'barrier|breakout|texture', 'sensitive|dry|normal|combo'),
  p('w002', '센텔리안24', '마데카 크림 EX', '마데카크림ex|마데카 이엑스', '크림', 'madecassoside|centella|ceramide|panthenol', 'barrier|texture|firming', 'sensitive|dry|normal|combo'),
  p('w003', '센텔리안24', '마데카 토너', '센텔리안 마데카 토너', '토너', 'madecassoside|centella|panthenol|allantoin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('w004', '센텔리안24', '마데카 앰플', '센텔리안 마데카 앰플', '앰플', 'madecassoside|centella|panthenol|niacinamide', 'barrier|texture|breakout', 'sensitive|combo|normal|dry'),
  p('w005', '센텔리안24', '마데카 더마 셀 리페어 세럼', '마데카 리페어 세럼', '세럼', 'madecassoside|centella|peptides|adenosine', 'barrier|firming|texture', 'sensitive|dry|normal|combo'),
  p('w006', '센텔리안24', '마데카 클렌징 폼', '센텔리안 클렌징폼', '클렌징', 'madecassoside|centella|glycerin|betaine', 'barrier|breakout', 'sensitive|normal|combo|oily'),
  p('w007', '센텔리안24', '마데카 선크림', '센텔리안 선크림|마데카 썬크림', '선크림', 'madecassoside|centella|zinc-oxide|titanium-dioxide', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('w008', '센텔리안24', '마데카 아이 크림', '센텔리안 아이크림', '아이크림', 'madecassoside|centella|adenosine|peptides', 'firming|barrier', 'sensitive|dry|normal'),

  // ── 네오젠 ──────────────────────────────────────────────────────────────────
  p('w009', '네오젠', '더마로지 바이오 페르 가모트 리얼 퍼미스 클리어링 패드', '네오젠 와인패드|바이오페르가모트 패드|neogen bio peel gauze peeling', '패드', 'lactic-acid|glycolic-acid|resveratrol|panthenol', 'texture|dullness|pores', 'normal|combo|oily'),
  p('w010', '네오젠', '더마로지 레몬 브라이트닝 패드', '네오젠 레몬패드', '패드', 'lactic-acid|ethyl-ascorbic-acid|niacinamide', 'dullness|pigmentation|texture', 'normal|combo|oily'),
  p('w011', '네오젠', '더마로지 그린티 릴리프 패드', '네오젠 그린티패드', '패드', 'green-tea|lactic-acid|panthenol|allantoin', 'sebum|texture|barrier', 'combo|oily|sensitive|normal'),
  p('w012', '네오젠', '데이-라이트 프로텍션 선 스크린', '네오젠 선크림', '선크림', 'uvinul-a-plus|tinosorb-s|uvinul-t150|niacinamide', 'pigmentation', 'normal|combo|oily|dry'),
  p('w013', '네오젠', '더마로지 리얼 비타민 C 세럼', '네오젠 비타민C 세럼', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol', 'pigmentation|dullness', 'normal|combo|oily'),
  p('w014', '네오젠', '더마로지 시카 판테놀 크림', '네오젠 시카크림', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal'),

  // ── 이츠스킨 ────────────────────────────────────────────────────────────────
  p('w015', '이츠스킨', '파워 10 포뮬라 VC 이펙터', '파워10 VC|이츠스킨 VC이펙터|power 10 formula vc effector', '앰플', 'ascorbyl-glucoside|niacinamide|tocopherol', 'pigmentation|dullness', 'normal|combo|oily|dry'),
  p('w016', '이츠스킨', '파워 10 포뮬라 LI 이펙터', '파워10 LI|이츠스킨 LI이펙터', '앰플', 'hyaluronic-acid|glycerin|panthenol', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w017', '이츠스킨', '파워 10 포뮬라 GF 이펙터', '파워10 GF|이츠스킨 GF이펙터', '앰플', 'egf|peptides|adenosine|panthenol', 'firming|texture', 'dry|normal|combo'),
  p('w018', '이츠스킨', '파워 10 포뮬라 PO 이펙터', '파워10 PO|이츠스킨 PO이펙터', '앰플', 'salicylic-acid|niacinamide|silica', 'pores|sebum|texture', 'oily|combo'),
  p('w019', '이츠스킨', '파워 10 포뮬라 YE 이펙터', '파워10 YE|이츠스킨 YE이펙터', '앰플', 'yeast-extract|galactomyces|panthenol', 'texture|dullness', 'normal|combo|dry'),
  p('w020', '이츠스킨', '파워 10 포뮬라 WH 이펙터', '파워10 WH|이츠스킨 WH이펙터', '앰플', 'niacinamide|alpha-arbutin|ethyl-ascorbic-acid', 'pigmentation|dullness', 'normal|combo|dry'),
  p('w021', '이츠스킨', '파워 10 포뮬라 Q10 이펙터', '파워10 Q10|이츠스킨 Q10이펙터', '앰플', 'ubiquinone|tocopherol|adenosine', 'firming|dullness', 'dry|normal|combo'),
  p('w022', '이츠스킨', '파워 10 포뮬라 AC 이펙터', '파워10 AC|이츠스킨 AC이펙터', '앰플', 'tea-tree|salicylic-acid|allantoin', 'breakout|sebum|pores', 'oily|combo'),
  p('w023', '이츠스킨', '파워 10 포뮬라 프로폴리스 앰플', '이츠스킨 프로폴리스 앰플', '앰플', 'propolis|honey|panthenol|niacinamide', 'barrier|dryness|dullness', 'dry|normal|sensitive'),
  p('w024', '이츠스킨', '허니 모이스처 크림', '이츠스킨 허니크림', '크림', 'honey|propolis|shea-butter|glycerin', 'dryness|barrier', 'dry|normal'),

  // ── 닥터벨머 ────────────────────────────────────────────────────────────────
  p('w025', '닥터벨머', '시카톡신 리커버리 크림', '닥터벨머 시카톡신|시카톡신 크림', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal'),
  p('w026', '닥터벨머', '클라리파잉 B5 앰플', '닥터벨머 b5 앰플', '앰플', 'panthenol|niacinamide|allantoin', 'barrier|breakout|sebum', 'sensitive|combo|oily|normal'),
  p('w027', '닥터벨머', '데일리 리페어 모이스처라이징 크림', '닥터벨머 데일리리페어 크림', '크림', 'ceramide|panthenol|shea-butter|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w028', '닥터벨머', '마일드 클렌징 폼', '닥터벨머 클렌징폼', '클렌징', 'panthenol|glycerin|betaine', 'barrier', 'sensitive|dry|normal|combo'),

  // ── 큐렐 ────────────────────────────────────────────────────────────────────
  p('w029', '큐렐', '인텐시브 모이스처 페이스 크림', '큐렐 페이스크림|curel face cream', '크림', 'ceramide|glycerin|panthenol|allantoin', 'barrier|dryness', 'dry|sensitive'),
  p('w030', '큐렐', '인텐시브 모이스처 페이스 로션', '큐렐 페이스로션', '로션', 'ceramide|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w031', '큐렐', '인텐시브 모이스처 페이스 토너', '큐렐 토너', '토너', 'ceramide|glycerin|allantoin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w032', '큐렐', '포밍 페이셜 워시', '큐렐 클렌징폼', '클렌징', 'glycerin|betaine|allantoin', 'barrier', 'dry|sensitive|normal'),

  // ── 미논 ────────────────────────────────────────────────────────────────────
  p('w033', '미논', '아미노 모이스트 모이스처 차지 밀크', '미논 밀크|minon amino moist', '로션', 'betaine|glycerin|ceramide|panthenol', 'barrier|dryness', 'dry|sensitive'),
  p('w034', '미논', '아미노 모이스트 모이스처 차지 로션', '미논 로션', '토너', 'betaine|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w035', '미논', '아미노 모이스트 모이스처 차지 크림', '미논 크림', '크림', 'betaine|ceramide|shea-butter|glycerin', 'barrier|dryness', 'dry|sensitive'),

  // ── 더마비 ──────────────────────────────────────────────────────────────────
  p('w036', '더마비', '데일리 모이스처 크림', '더마비 크림', '크림', 'ceramide|glycerin|panthenol|shea-butter', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w037', '더마비', '약산성 클렌징 폼', '더마비 클렌징폼', '클렌징', 'glycerin|panthenol|betaine', 'barrier', 'dry|sensitive|normal|combo'),

  // ── 멜릭서 ──────────────────────────────────────────────────────────────────
  p('w038', '멜릭서', '비건 리페어 크림', '멜릭서 크림|melixir vegan cream', '크림', 'squalane|ceramide|panthenol|beta-glucan', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w039', '멜릭서', '비건 리페어 세럼', '멜릭서 세럼', '세럼', 'panthenol|beta-glucan|hyaluronic-acid', 'barrier|dryness', 'sensitive|dry|normal|combo'),

  // ── 닥터오라클 ──────────────────────────────────────────────────────────────
  p('w040', '닥터오라클', '21;스테이 A-THERA 필링 스틱', '닥터오라클 필링스틱|아테라 필링스틱', '필링', 'salicylic-acid|lactic-acid|tea-tree|allantoin', 'breakout|pores|texture', 'oily|combo|normal'),
  p('w041', '닥터오라클', '21;스테이 A-THERA 토너', '닥터오라클 아테라 토너', '토너', 'salicylic-acid|tea-tree|panthenol|allantoin', 'breakout|sebum|pores', 'oily|combo|normal'),
  p('w042', '닥터오라클', '레티노-A 솔루션 앰플', '닥터오라클 레티놀 앰플', '앰플', 'retinol|panthenol|ceramide|tocopherol', 'texture|firming|pores', 'normal|combo|oily'),

  // ── 더랩바이블랑두 ──────────────────────────────────────────────────────────
  p('w043', '더랩바이블랑두', '올 데이 비타민 토너', '더랩 비타민 토너|블랑두 비타민 토너', '토너', 'ethyl-ascorbic-acid|niacinamide|panthenol', 'dullness|pigmentation', 'normal|combo|oily|dry'),
  p('w044', '더랩바이블랑두', '올 데이 비타민 세럼', '더랩 비타민 세럼', '세럼', 'ethyl-ascorbic-acid|niacinamide|tocopherol|ferulic-acid', 'pigmentation|dullness', 'normal|combo|dry'),
  p('w045', '더랩바이블랑두', '시카 리페어 크림', '더랩 시카크림', '크림', 'centella|madecassoside|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|normal'),

  // ── 초초스랩 ────────────────────────────────────────────────────────────────
  p('w046', '초초스랩', '세라마이드 배리어 크림', '초초스랩 크림', '크림', 'ceramide|cholesterol|fatty-acids|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w047', '초초스랩', 'PDRN 리페어 앰플', '초초스랩 pdrn 앰플', '앰플', 'pdrn|peptides|panthenol|adenosine', 'firming|barrier|texture', 'dry|normal|combo|sensitive'),

  // ── 참존 / 엔프라니 ────────────────────────────────────────────────────────
  p('w048', '참존', '컨트롤 크림', '참존 컨트롤크림', '크림', 'niacinamide|adenosine|glycerin|shea-butter', 'dullness|firming|dryness', 'dry|normal|combo'),
  p('w049', '참존', '디어 콜라겐 탄력 크림', '참존 콜라겐 크림', '크림', 'collagen|adenosine|peptides|shea-butter', 'firming|dryness', 'dry|normal'),
  p('w050', '엔프라니', '히든 랩 시카 수딩 크림', '엔프라니 시카크림', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal'),
  p('w051', '엔프라니', '슈퍼 콜라겐 앰플', '엔프라니 콜라겐 앰플', '앰플', 'collagen|adenosine|peptides|hyaluronic-acid', 'firming|dryness', 'dry|normal|combo'),

  // ── 퓨리토 (라인 보강) ──────────────────────────────────────────────────────
  p('w052', '퓨리토', '센텔라 그린 레벨 버퍼 에센스', '퓨리토 센텔라 에센스', '에센스', 'centella|madecassoside|panthenol|niacinamide', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('w053', '퓨리토', '센텔라 그린 레벨 안전 쿠션 선크림', '퓨리토 센텔라 선크림', '선크림', 'centella|zinc-oxide|titanium-dioxide|panthenol', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('w055', '퓨리토', '데일리 고 투 토너', '퓨리토 데일리 토너', '토너', 'panthenol|glycerin|beta-glucan', 'barrier|dryness', 'sensitive|dry|normal|combo'),

  // ── 헉슬리 (라인 보강) ──────────────────────────────────────────────────────
  p('w057', '헉슬리', '토너 익스트랙트 잇', '헉슬리 토너', '토너', 'squalane|glycerin|panthenol|betaine', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w058', '헉슬리', '크림 안티그라비티', '헉슬리 안티그라비티 크림', '크림', 'squalane|peptides|adenosine|tocopherol', 'firming|dryness', 'dry|normal'),
  p('w059', '헉슬리', '오일 에센스 라이트 앤 모어', '헉슬리 오일 에센스', '오일', 'squalane|jojoba-oil|tocopherol', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 이즈앤트리 (라인 보강) ──────────────────────────────────────────────────
  p('w060', '이즈앤트리', '하이알루로닉 애씨드 워터 뱅크 블루 토너', '이즈앤트리 히알루론산 토너', '토너', 'hyaluronic-acid|panthenol|glycerin|beta-glucan', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w061', '이즈앤트리', '하이알루로닉 애씨드 토너 플러스', '이즈앤트리 토너 플러스', '토너', 'hyaluronic-acid|panthenol|betaine', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w062', '이즈앤트리', '어니언 뉴페어 세럼', '이즈앤트리 어니언 세럼', '세럼', 'niacinamide|allantoin|panthenol|licorice', 'pigmentation|texture|dullness', 'normal|combo|oily'),
  p('w063', '이즈앤트리', '티트리 따나카 미라클 세럼', '이즈앤트리 티트리 세럼', '세럼', 'tea-tree|salicylic-acid|panthenol|centella', 'breakout|sebum|pores', 'oily|combo|sensitive'),

  // ── 아이유니크 / 에센허브 / 웰라쥬 (라인 보강) ──────────────────────────────
  p('w064', '아이유니크', '아이 플랜트 비타민 토너', '아이유니크 비타민 토너', '토너', 'ethyl-ascorbic-acid|niacinamide|glycerin', 'dullness|pigmentation', 'normal|combo|oily'),
  p('w065', '에센허브', '티트리 컨트롤 토너', '에센허브 티트리 토너', '토너', 'tea-tree|salicylic-acid|allantoin|panthenol', 'breakout|sebum|pores', 'oily|combo'),
  p('w066', '에센허브', '티트리 컨트롤 세럼', '에센허브 티트리 세럼', '세럼', 'tea-tree|salicylic-acid|niacinamide', 'breakout|sebum|pores', 'oily|combo'),
  p('w068', '웰라쥬', '리얼 히알루로닉 블루 100 토너', '웰라쥬 히알루론산 토너', '토너', 'hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),

  // ── 하다라보 / 센카 / 비오레 (라인 보강) ────────────────────────────────────
  p('w069', '하다라보', '고쿠쥰 하이알루론산 로션', '하다라보 고쿠쥰 로션|고쿠쥰 토너', '토너', 'hyaluronic-acid|glycerin|betaine', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w070', '하다라보', '고쿠쥰 하이알루론산 크림', '하다라보 고쿠쥰 크림', '크림', 'hyaluronic-acid|squalane|glycerin|ceramide', 'dryness|barrier', 'dry|normal'),
  p('w071', '하다라보', '고쿠쥰 하이알루론산 폼 클렌저', '하다라보 클렌징폼', '클렌징', 'hyaluronic-acid|glycerin|betaine', 'barrier|dryness', 'dry|normal|sensitive|combo'),
  p('w073', '센카', '퍼펙트 휩 아크네 케어', '센카 아크네 휩', '클렌징', 'salicylic-acid|glycerin|betaine', 'breakout|sebum', 'oily|combo'),
  p('w074', '비오레', '메이크업 리무버 클렌징 워터', '비오레 클렌징워터', '클렌징', 'glycerin|betaine', 'barrier', 'normal|combo|oily|dry'),

  // ── 헤이미쉬 / 파넬 / 반트36.5 (라인 보강) ──────────────────────────────────
  p('w075', '헤이미쉬', '마치아토 팟 블랙 클렌징 밤', '헤이미쉬 클렌징밤', '클렌징', 'mineral-oil|shea-butter|tocopherol', 'barrier', 'dry|normal|combo|sensitive'),
  p('w077', '파넬', '비타 C 25 세럼', '파넬 비타민 세럼', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol', 'pigmentation|dullness', 'normal|combo|oily'),
  p('w078', '반트36.5', '비타민 토닝 앰플', '반트 비타민 앰플', '앰플', 'ethyl-ascorbic-acid|niacinamide|panthenol', 'pigmentation|dullness', 'normal|combo|dry'),

  // ── 스킨앤랩 / 닥터디퍼런트 / 큐어 (라인 보강) ──────────────────────────────
  p('w079', '스킨앤랩', '리얼 배리어 익스트림 크림', '스킨앤랩 익스트림 크림', '크림', 'ceramide|cholesterol|fatty-acids|panthenol', 'barrier|dryness', 'dry|sensitive'),
  p('w080', '닥터디퍼런트', '2% 살리실릭 애씨드 토너', '닥터디퍼런트 bha 토너', '토너', 'salicylic-acid|panthenol|allantoin', 'breakout|pores|sebum', 'oily|combo'),
  p('w081', '닥터디퍼런트', '시카 리페어 크림', '닥터디퍼런트 시카크림', '크림', 'centella|madecassoside|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|normal'),

  // ── 셀리맥스 / 비플레인 / 넘버즈인 (라인 보강) ──────────────────────────────
  p('w083', '셀리맥스', '노니 에너지 패드', '셀리맥스 노니패드', '패드', 'niacinamide|lactic-acid|panthenol|allantoin', 'texture|dullness|pores', 'normal|combo|oily'),
  p('w084', '셀리맥스', '더블 베리어 크림', '셀리맥스 베리어 크림', '크림', 'ceramide|panthenol|shea-butter|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('w086', '비플레인', '녹두 수분 진정 토너', '비플레인 녹두 토너', '토너', 'mung-bean|panthenol|glycerin|allantoin', 'sebum|barrier|pores', 'oily|combo|normal|sensitive'),
  p('w087', '넘버즈인', '1번 시트러스 비타 브라이트닝 토너', '넘버즈인 1번 토너', '토너', 'ethyl-ascorbic-acid|yuja|niacinamide', 'dullness|pigmentation', 'normal|combo|oily'),
  p('w088', '넘버즈인', '7번 흰찌르기 잡티 세럼', '넘버즈인 7번 세럼', '세럼', 'niacinamide|tranexamic-acid|alpha-arbutin|panthenol', 'pigmentation|dullness', 'normal|combo|dry'),

  // ── 마스크마스터 / 프롬리에 / 풀리 / 블랑네이처 (라인 보강) ──────────────────
  p('w089', '프롬리에', '시카 수분 진정 크림', '프롬리에 시카크림', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal'),
  p('w090', '풀리', '약산성 수분 토너', '풀리 토너', '토너', 'panthenol|glycerin|beta-glucan', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('w091', '블랑네이처', '히알루론산 수분 앰플', '블랑네이처 앰플', '앰플', 'hyaluronic-acid|panthenol|beta-glucan', 'dryness|barrier', 'dry|normal|combo|sensitive'),

  // ── 메디필 / 메노킨 / 닥터엘시아 (라인 보강) ────────────────────────────────
  p('w092', '메디필', '콜라겐 리프팅 밴드', '메디필 콜라겐 밴드', '마스크', 'collagen|adenosine|peptides', 'firming', 'dry|normal|combo'),
  p('w094', '메노킨', '피지 지우개 패드', '메노킨 피지패드', '패드', 'salicylic-acid|lactic-acid|panthenol|niacinamide', 'sebum|pores|texture', 'oily|combo'),
  p('w095', '닥터엘시아', '프로 시카 수딩 앰플', '닥터엘시아 시카 앰플', '앰플', 'centella|madecassoside|panthenol|niacinamide', 'barrier|breakout', 'sensitive|combo|oily|normal'),

  // ── 레이어랩 / 더마팩토리 / 파티온 (라인 보강) ──────────────────────────────
  p('w096', '레이어랩', '시카 수딩 앰플 토너', '레이어랩 시카 토너', '토너', 'centella|madecassoside|panthenol|allantoin', 'barrier|breakout', 'sensitive|combo|oily|normal'),
  p('w098', '더마팩토리', '히알루론산 100% 앰플', '더마팩토리 히알루론산', '앰플', 'hyaluronic-acid|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('w099', '파티온', '노스카나인 흔적 세럼', '파티온 노스카나인|노스카나인 세럼', '세럼', 'niacinamide|allantoin|panthenol|madecassoside', 'texture|breakout|pigmentation', 'combo|oily|normal|sensitive'),
  p('w100', '파티온', '노스카나인 수분 진정 크림', '파티온 노스카나인 크림', '크림', 'madecassoside|centella|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|normal'),

  // ── 차앤박 (라인 보강) ──────────────────────────────────────────────────────
  p('w101', '차앤박', '프로폴리스 에너지 앰플', 'cnp 프로폴리스 앰플|차앤박 프로폴리스', '앰플', 'propolis|honey|panthenol|niacinamide', 'barrier|dryness|dullness', 'dry|normal|sensitive'),
  p('w102', '차앤박', '인빈시블 비타 C 앰플', 'cnp 비타민 앰플', '앰플', 'ascorbic-acid|ferulic-acid|tocopherol', 'pigmentation|dullness', 'normal|combo|oily'),
  p('w103', '차앤박', '안티 포어 블랙헤드 클리어 키트', 'cnp 블랙헤드 키트|차앤박 코팩', '필링', 'salicylic-acid|papain|kaolin', 'pores|sebum|texture', 'oily|combo'),
  p('w104', '차앤박', '마이크로 필 소프트 패드', 'cnp 마이크로필 패드', '패드', 'lactic-acid|gluconolactone|panthenol', 'texture|pores|dullness', 'normal|combo|oily'),

  // ── 연작 / 어바웃톤 / 더샘 / 에이프릴스킨 (라인 보강) ────────────────────────
  p('w105', '연작', '소월 윤 에센스', '연작 에센스', '에센스', 'ginseng|adenosine|peony|niacinamide', 'firming|dullness|dryness', 'dry|normal|combo'),
  p('w106', '더샘', '칵테일 세럼 비타민', '더샘 비타민 세럼', '세럼', 'ethyl-ascorbic-acid|niacinamide|panthenol', 'dullness|pigmentation', 'normal|combo|oily'),
  p('w107', '에이프릴스킨', '리얼 카렌듈라 토너', '에이프릴스킨 카렌듈라 토너', '토너', 'calendula|panthenol|glycerin|allantoin', 'barrier|breakout', 'sensitive|combo|normal|dry'),
  p('w108', '에이프릴스킨', '리얼 카렌듈라 크림', '에이프릴스킨 카렌듈라 크림', '크림', 'calendula|panthenol|ceramide|shea-butter', 'barrier|dryness', 'sensitive|dry|normal'),

  // ── 이지듀 / 도미나스 / 오브제 / 일소 (라인 보강) ───────────────────────────
  p('w109', '이지듀', 'EGF 리페어 크림', '이지듀 egf 크림', '크림', 'egf|peptides|adenosine|ceramide', 'firming|barrier|texture', 'dry|normal|sensitive'),
  p('w110', '이지듀', 'DW-EGF 에센스', '이지듀 egf 에센스', '에센스', 'egf|peptides|panthenol|hyaluronic-acid', 'firming|barrier', 'dry|normal|combo|sensitive'),
  p('w111', '도미나스', '트리플 리프팅 앰플', '도미나스 앰플', '앰플', 'peptides|adenosine|pdrn|niacinamide', 'firming|texture', 'dry|normal|combo'),
  p('w112', '오브제', '약산성 진정 토너', '오브제 토너', '토너', 'panthenol|centella|glycerin', 'barrier|breakout', 'sensitive|combo|normal|oily'),

  // ── 트로이아르케 / 아이디얼포맨 / 체이싱래빗 / 테라로직 (라인 보강) ──────────
  p('w113', '트로이아르케', '리바이탈라이징 앰플', '트로이아르케 앰플', '앰플', 'peptides|adenosine|niacinamide|panthenol', 'firming|texture', 'dry|normal|combo'),
  p('w114', '아이디얼포맨', '올인원 스킨 로션', '아이디얼포맨 올인원', '로션', 'glycerin|panthenol|niacinamide|hyaluronic-acid', 'dryness|sebum', 'normal|combo|oily'),
  p('w115', '체이싱래빗', '진정 수분 크림', '체이싱래빗 크림', '크림', 'centella|panthenol|ceramide|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('w116', '테라로직', '시카 밸런싱 토너', '테라로직 시카 토너', '토너', 'centella|madecassoside|panthenol', 'barrier|breakout', 'sensitive|combo|oily|normal'),

  // ── 쥬베룩 / 하우스오브비 / 유이크 / 아떼 (라인 보강) ───────────────────────
  p('w117', '쥬베룩', '리제너레이션 앰플', '쥬베룩 앰플', '앰플', 'pdrn|peptides|adenosine|panthenol', 'firming|texture|barrier', 'dry|normal|combo'),
  p('w118', '하우스오브비', '글래스 스킨 세럼', '하우스오브비 세럼', '세럼', 'niacinamide|hyaluronic-acid|panthenol', 'dullness|dryness', 'normal|combo|dry'),
  p('w119', '유이크', '바쿠치올 리뉴 세럼', '유이크 바쿠치올 세럼', '세럼', 'bakuchiol|niacinamide|panthenol|squalane', 'texture|firming', 'sensitive|normal|combo|dry'),
  p('w120', '아떼', '비건 시카 선크림', '아떼 선크림', '선크림', 'centella|zinc-oxide|titanium-dioxide|panthenol', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),

  // ── 셀퓨전씨 / 셀라딕스 / 아렌시아 (라인 보강) ──────────────────────────────
  p('w121', '셀퓨전씨', '레이저 썬스크린 100', '셀퓨전씨 선크림|레이저선스크린', '선크림', 'zinc-oxide|titanium-dioxide|panthenol|glycerin', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('w122', '셀퓨전씨', '포스트 알파 리턴 에센스', '셀퓨전씨 알파리턴 에센스', '에센스', 'panthenol|madecassoside|beta-glucan|peptides', 'barrier|texture', 'sensitive|dry|normal|combo'),
  p('w123', '셀라딕스', '세라마이드 리페어 크림', '셀라딕스 크림', '크림', 'ceramide|cholesterol|fatty-acids|panthenol', 'barrier|dryness', 'dry|sensitive'),
  p('w124', '아렌시아', '리얼 시카 수딩 패드', '아렌시아 시카 패드', '패드', 'centella|madecassoside|panthenol|lactic-acid', 'barrier|texture|breakout', 'sensitive|combo|oily|normal'),

  // ── 비오힐보 / 바이오던스 / 듀이트리 (라인 보강) ────────────────────────────
  p('w126', '바이오던스', '바이오 콜라겐 펩타이드 앰플', '바이오던스 앰플', '앰플', 'collagen|peptides|adenosine|panthenol', 'firming|dryness', 'dry|normal|combo'),
  p('w127', '듀이트리', '울트라 바이탈라이징 아이 패치', '듀이트리 아이패치', '마스크', 'adenosine|peptides|hyaluronic-acid', 'firming|dryness', 'dry|normal|combo'),

  // ── 정샘물 / 에스쁘아 / VDL / 비디비치 (베이스 보강) ────────────────────────
  p('w129', '에스쁘아', '프로 테일러 비 글로우 쿠션', '에스쁘아 쿠션', '베이스', 'niacinamide|glycerin|titanium-dioxide|dimethicone', 'dullness', 'normal|combo|dry'),
  p('w130', 'VDL', '퍼펙팅 라스트 쿠션', 'vdl 쿠션', '베이스', 'niacinamide|glycerin|titanium-dioxide|dimethicone', 'dullness', 'normal|combo|oily'),

  // ── 라운드랩 (라인 보강) ────────────────────────────────────────────────────

  // ── 토리든 (라인 보강) ──────────────────────────────────────────────────────
  p('w135', '토리든', '셀메이징 저분자 콜라겐 크림', '토리든 셀메이징 크림|토리든 콜라겐 크림', '크림', 'collagen|peptides|adenosine|ceramide', 'firming|dryness|barrier', 'dry|normal|combo'),
];
