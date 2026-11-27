import type { Product } from '@/types';
import { p } from './_helper';

/**
 * 올리브영에서 많이 팔리는 제품 보강 — 데모/미검증 데이터.
 *
 * "검색해도 안 나오는 제품이 너무 많다" 는 의견을 받아, 2026년 11월 기준 올리브영
 * 카테고리별 랭킹(스킨케어·선케어·클렌징·마스크팩·더모 코스메틱)과 브랜드관에 올라와 있는
 * 제품을 기준으로 채웠다. 제품명은 쇼핑몰 표기를 그대로 쓰고, 기획/용량 표기는 뺐다.
 *
 * 성분(keyIngredients)은 제품명에 적힌 성분과 라인의 대표 성분만 넣었다.
 * 전성분을 직접 확인한 제품만 verified = true 로 두고, 나머지는 '데모·미검증' 배지가 붙는다.
 * 정확한 전성분이 필요하면 제품 등록 화면에서 전성분을 붙여넣어 보완할 수 있다.
 */
export const PRODUCTS_PART5: Product[] = [
  // ── 제로이드 (네오팜) ───────────────────────────────────────────────────────
  p('y001', '제로이드', '핌프로브 레드 컨트롤 크림 pH4', '핌프로브|핌프로브 레드|레드컨트롤크림|제로이드 빨간|zeroid pimprove red control cream', '크림', 'jojoba-oil|hyaluronic-acid|dimethicone|tocopherol', 'breakout|barrier', 'sensitive|oily|combo|normal', true),
  p('y002', '제로이드', '핌프로브 카밍 앰플', '핌프로브앰플|zeroid pimprove calming ampoule', '앰플', 'madecassoside|allantoin|hyaluronic-acid|licorice', 'breakout|barrier', 'sensitive|oily|combo|normal'),
  p('y003', '제로이드', '핌프로브 토너', '핌프로브토너|zeroid pimprove toner', '토너', 'panthenol|allantoin|hyaluronic-acid', 'breakout|barrier|sebum|pores', 'sensitive|oily|combo|normal'),
  p('y004', '제로이드', '핌프로브 젤 클렌저', '핌프로브클렌저|zeroid pimprove gel cleanser', '클렌징', 'glycerin|panthenol', 'breakout|sebum|pores', 'sensitive|oily|combo'),
  p('y005', '제로이드', '인텐시브 오인트 크림', '오인트크림|제로이드 오인트|zeroid intensive oint cream', '크림', 'ceramide|cholesterol|fatty-acids|petrolatum', 'barrier|dryness', 'dry|sensitive'),
  p('y006', '제로이드', '인텐시브 크림 토너', '제로이드 크림토너|zeroid intensive cream toner', '토너', 'ceramide|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y007', '제로이드', '인텐시브 크림 미스트', '제로이드 미스트|zeroid intensive cream mist', '미스트', 'ceramide|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y008', '제로이드', '인텐시브 하이드레이팅 앰플', '제로이드 앰플|zeroid intensive hydrating ampoule', '앰플', 'hyaluronic-acid|panthenol|ceramide', 'dryness|barrier', 'dry|sensitive|normal'),
  p('y009', '제로이드', '포밍 클렌저', '제로이드 폼클렌저|zeroid foaming cleanser', '클렌징', 'glycerin|panthenol|betaine', 'barrier', 'dry|sensitive|normal|combo'),
  p('y010', '제로이드', '더마뉴얼 클렌징젤', '더마뉴얼|zeroid dermanual cleansing gel', '클렌징', 'glycerin|panthenol', 'barrier|sebum', 'combo|oily|sensitive|normal'),
  p('y011', '제로이드', '데일리 선크림', '제로이드 선크림|zeroid daily sun cream', '선크림', 'zinc-oxide|titanium-dioxide|ceramide|glycerin', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y012', '제로이드', '이지워시 마일드 선크림', '이지워시|zeroid easy wash mild sun cream', '선크림', 'zinc-oxide|titanium-dioxide|glycerin', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y013', '제로이드', '수딩 세럼 마스크', '제로이드 수딩마스크|zeroid soothing serum mask', '마스크', 'ceramide|panthenol|allantoin|madecassoside', 'barrier|dryness', 'sensitive|dry|normal'),
  p('y014', '제로이드', '인텐시브 크림 마스크', '제로이드 크림마스크|zeroid intensive cream mask', '마스크', 'ceramide|cholesterol|fatty-acids|glycerin', 'barrier|dryness', 'dry|sensitive'),

  // ── 오드로이 ───────────────────────────────────────────────────────────────
  p('y015', '오드로이', '모공수축 크림 폴리아 콜라겐', '오드로이 모공수축크림|모공수축크림|폴리아 콜라겐|audroi pore cream', '크림', 'squalane|sunflower-oil|allantoin|houttuynia|collagen|adenosine|tocopherol|fragrance', 'pores|sebum|firming', 'oily|combo|normal|dry', true),
  p('y016', '오드로이', '블랙체리 모공수축크림 로프디', '블랙체리 모공수축크림|로프디', '크림', 'squalane|allantoin|houttuynia|collagen|adenosine', 'pores|sebum|firming', 'oily|combo|normal'),
  p('y017', '오드로이', '모공수축크림 로프디 모공타이트닝', '모공타이트닝 크림|오드로이 로프디 크림', '크림', 'squalane|allantoin|collagen|adenosine', 'pores|sebum|firming', 'oily|combo|normal'),
  p('y018', '오드로이', '카르노신 콜라겐수 78만ppm 세럼', '카르노신 세럼|콜라겐수 세럼', '세럼', 'collagen|adenosine|hyaluronic-acid', 'firming|pores|dryness', 'dry|oily|combo|normal'),
  p('y019', '오드로이', '75퍼센트 시카 앰플 로프디', '오드로이 시카앰플|75 시카 앰플', '앰플', 'centella|madecassoside|panthenol', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y020', '오드로이', '76퍼센트 캑터스 세럼 로프디', '캑터스 세럼|오드로이 선인장 세럼', '세럼', 'hyaluronic-acid|panthenol|allantoin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('y021', '오드로이', '74퍼센트 블랙빈 앰플 로프디', '블랙빈 앰플|오드로이 검은콩 앰플', '앰플', 'niacinamide|adenosine|panthenol', 'pores|sebum|firming', 'oily|combo|normal'),
  p('y022', '오드로이', '레티놀 0.03퍼센트 피어니 앰플 필리디', '오드로이 레티놀 앰플|피어니 앰플', '앰플', 'retinol|peony|panthenol', 'firming|texture|pores', 'normal|combo|oily'),
  p('y023', '오드로이', '판테놀 잡티 젤크림 나이아신아마이드', '오드로이 잡티크림|판테놀 젤크림', '크림', 'panthenol|niacinamide|allantoin', 'pigmentation|barrier|pores', 'dry|oily|combo|normal|sensitive'),
  p('y024', '오드로이', '모공수축 시카 83.7 콜라겐 미스트 앰플 로프디', '오드로이 미스트|시카 콜라겐 미스트', '미스트', 'centella|collagen|hyaluronic-acid|allantoin', 'pores|barrier|dryness', 'dry|oily|combo|normal|sensitive'),
  p('y025', '오드로이', '모공축소 톤업 선크림 블리미 필리디', '오드로이 선크림|블리미 톤업 선크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|pores|dullness', 'normal|combo|oily'),

  // ── 에스트라 (아토베리어365 · 에이시카365 · 테라크네365 · 더마UV365) ────────
  p('y026', '에스트라', '아토베리어365 하이드로 수딩크림', '아토베리어 수딩크림|하이드로 수딩크림|aestura atobarrier365 hydro soothing cream', '크림', 'ceramide|panthenol|madecassoside|glycerin', 'barrier|dryness|breakout', 'sensitive|dry|normal|combo'),
  p('y027', '에스트라', '아토베리어365 세라-히알 속수분 앰플', '세라히알 앰플|아토베리어 앰플', '앰플', 'ceramide|hyaluronic-acid|panthenol', 'dryness|barrier', 'dry|sensitive|normal|combo'),
  p('y028', '에스트라', '아토베리어365 캡슐토너', '아토베리어 캡슐토너|아토베리어 토너', '토너', 'ceramide|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y029', '에스트라', '아토베리어365 하이드로 에센스', '아토베리어 하이드로에센스', '에센스', 'ceramide|hyaluronic-acid|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y030', '에스트라', '아토베리어365 크림미스트', '아토베리어 크림미스트', '미스트', 'ceramide|panthenol|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y031', '에스트라', '아토베리어365 포밍 클렌저', '아토베리어 포밍클렌저|아토베리어 클렌징폼', '클렌징', 'glycerin|panthenol|betaine', 'barrier', 'dry|sensitive|normal'),
  p('y032', '에스트라', '아토베리어365 클렌징밀크', '아토베리어 클렌징밀크', '클렌징', 'glycerin|squalane|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y033', '에스트라', '에이시카365 흔적진정세럼 pH4.5', '에이시카 흔적세럼|에이시카365 세럼', '세럼', 'centella|madecassoside|panthenol|niacinamide', 'breakout|barrier|pigmentation', 'sensitive|oily|combo|normal'),
  p('y034', '에스트라', '에이시카365 리페어 크림 pH4.5', '에이시카 리페어크림|에이시카365 크림', '크림', 'centella|madecassoside|ceramide|panthenol', 'breakout|barrier', 'sensitive|oily|combo|normal'),
  p('y035', '에스트라', '테라크네365 클리어 딥 클렌징 폼', '테라크네 클렌징폼|테라크네365', '클렌징', 'salicylic-acid|glycerin|zinc-pca', 'breakout|sebum|pores', 'oily|combo'),
  p('y036', '에스트라', '더마UV365 장벽수분 무기자차 선크림', '더마UV365 무기자차|에스트라 무기자차 선크림', '선크림', 'zinc-oxide|titanium-dioxide|ceramide|panthenol', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y037', '에스트라', '더마UV365 레드진정 톤업 선크림', '더마UV365 레드진정|에스트라 톤업 선크림', '선크림', 'zinc-oxide|titanium-dioxide|madecassoside|panthenol', 'barrier|pigmentation|dullness', 'sensitive|dry|normal|combo'),
  p('y038', '에스트라', '더마UV365 비타C 광채수분 선크림', '더마UV365 비타C', '선크림', 'zinc-oxide|titanium-dioxide|ascorbyl-glucoside|niacinamide', 'pigmentation|dullness', 'normal|combo|dry'),

  // ── 라로슈포제 ─────────────────────────────────────────────────────────────
  p('y039', '라로슈포제', '시카플라스트 밤 B5+', '시카플라스트 밤|시카밤|cicaplast baume b5', '크림', 'panthenol|madecassoside|thermal-water|shea-butter', 'barrier|dryness', 'sensitive|dry|normal'),
  p('y040', '라로슈포제', '시카플라스트 멀티 리페어 크림', '시카플라스트 멀티리페어|cicaplast multi repair cream', '크림', 'panthenol|madecassoside|thermal-water|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('y041', '라로슈포제', '시카플라스트 리페어 에센스', '시카 에센스|cicaplast repair essence', '에센스', 'panthenol|madecassoside|thermal-water', 'barrier', 'sensitive|dry|normal|combo'),
  p('y042', '라로슈포제', '히알루 B5 수분탄력 세럼', '히알루B5 세럼|hyalu b5 serum', '세럼', 'hyaluronic-acid|panthenol|madecassoside|thermal-water', 'dryness|firming|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y043', '라로슈포제', '히알루 B5 수분탄력 크림', '히알루B5 크림|hyalu b5 cream', '크림', 'hyaluronic-acid|panthenol|shea-butter|thermal-water', 'dryness|firming|barrier', 'dry|normal|combo|sensitive'),
  p('y044', '라로슈포제', '멜라B3 세럼', '멜라비3 세럼|mela b3 serum', '세럼', 'thiamidol|niacinamide|thermal-water', 'pigmentation|dullness', 'dry|oily|combo|normal|sensitive'),
  p('y045', '라로슈포제', '유비데아 안뗄리오스 멜트인 크림', '안뗄리오스 멜트인|유비데아 멜트인', '선크림', 'uvinul-t150|tinosorb-s|thermal-water|glycerin', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('y046', '라로슈포제', '유비데아 안뗄리오스 톤업 라이트 크림', '안뗄리오스 톤업|유비데아 톤업', '선크림', 'uvinul-t150|tinosorb-s|thermal-water', 'pigmentation|dullness', 'sensitive|normal|combo|dry'),
  p('y047', '라로슈포제', '똘러리앙 포밍 클렌저', '똘러리앙 클렌저|toleriane foaming cleanser', '클렌징', 'thermal-water|glycerin', 'barrier', 'sensitive|dry|normal'),
  p('y048', '라로슈포제', '에빠끌라 딥 클렌징 포밍 크림', '에빠끌라 클렌징|effaclar deep cleansing foaming cream', '클렌징', 'salicylic-acid|zinc-pca|thermal-water', 'breakout|sebum|pores', 'oily|combo'),

  // ── 바이오더마 ─────────────────────────────────────────────────────────────
  p('y049', '비오더마', '시카비오 포마드', '시카비오|cicabio pommade', '크림', 'panthenol|madecassoside|zinc-pca|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('y050', '비오더마', '하이드라비오 토너', '하이드라비오 토너|hydrabio tonique', '토너', 'hyaluronic-acid|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('y051', '비오더마', '하이드라비오 에센스 로션', '하이드라비오 에센스|hydrabio essence lotion', '에센스', 'hyaluronic-acid|glycerin|squalane', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('y052', '비오더마', '아토덤 울트라 크림', '아토덤 울트라|atoderm ultra creme', '크림', 'glycerin|shea-butter|fatty-acids|niacinamide', 'barrier|dryness', 'dry|sensitive'),

  // ── 피지오겔 ───────────────────────────────────────────────────────────────
  p('y053', '피지오겔', '사이언수티컬즈 데일리뮨 앰플 세럼', '데일리뮨 앰플|피지오겔 앰플세럼', '앰플', 'beta-glucan|panthenol|hyaluronic-acid', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('y055', '피지오겔', '레드수딩 AI 리페어 크림', '레드수딩 리페어크림|피지오겔 레드수딩', '크림', 'licochalcone|panthenol|squalane', 'barrier|breakout', 'sensitive|dry|normal'),

  // ── 유세린 ─────────────────────────────────────────────────────────────────
  p('y056', '유세린', '하이알루론 3X 나이트크림', '하이알루론 나이트크림|eucerin hyaluron 3x night', '크림', 'hyaluronic-acid|glycerin|shea-butter', 'dryness|firming', 'dry|normal|combo'),
  p('y057', '유세린', '하이알루론 3X 아이크림', '하이알루론 아이크림|eucerin hyaluron 3x eye', '아이크림', 'hyaluronic-acid|glycerin|peptides', 'dryness|firming', 'dry|oily|combo|normal|sensitive'),
  p('y058', '유세린', '이븐래디언스 브라이트닝 부스터 세럼', '이븐래디언스 세럼|eucerin even radiance', '세럼', 'thiamidol|licochalcone|glycerin', 'pigmentation|dullness', 'dry|oily|combo|normal|sensitive'),
  p('y059', '유세린', '하이알루론 에피셀린 세럼', '에피셀린 세럼|eucerin hyaluron epicelline', '세럼', 'hyaluronic-acid|peptides|glycerin', 'dryness|firming', 'dry|normal|combo|sensitive'),
  p('y060', '유세린', '아쿠아퍼 오인트먼트', '아쿠아퍼|eucerin aquaphor ointment', '크림', 'petrolatum|mineral-oil|glycerin|panthenol', 'barrier|dryness', 'dry|sensitive'),

  // ── 아벤느 · 유리아쥬 ──────────────────────────────────────────────────────
  p('y061', '아벤느', '시칼파트 플러스 SOS 리페어 크림', '시칼파트 플러스|시칼파트 SOS|cicalfate+ sos repair', '크림', 'panthenol|thermal-water|zinc-oxide|shea-butter', 'barrier|dryness', 'sensitive|dry'),
  p('y062', '아벤느', '히알루론 액티브 B3 탄력 세럼', '히알루론 액티브 B3|avene hyaluron activ b3', '세럼', 'hyaluronic-acid|niacinamide|thermal-water', 'dryness|firming', 'dry|oily|combo|normal|sensitive'),
  p('y063', '아벤느', '이드랑스 수분 에센스-인-로션', '이드랑스 로션|avene hydrance essence in lotion', '로션', 'hyaluronic-acid|thermal-water|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('y064', '아벤느', '클리낭스 클렌징 젤', '클리낭스 젤|avene cleanance cleansing gel', '클렌징', 'thermal-water|glycerin', 'sebum|breakout|pores', 'oily|combo'),
  p('y065', '유리아쥬', '진피 마일드 젤', '진피 젤|uriage gyn phy', '클렌징', 'thermal-water|glycerin', 'barrier', 'sensitive|dry|normal'),

  // ── 메디큐브 · 메디힐 ─────────────────────────────────────────────────────
  p('y066', '메디큐브', 'PDRN 핑크 콜라겐 글로우 젤리 미스트', 'PDRN 젤리미스트|핑크 콜라겐 미스트', '미스트', 'pdrn|collagen|hyaluronic-acid', 'dryness|firming|dullness', 'dry|oily|combo|normal|sensitive'),
  p('y067', '메디큐브', 'PDRN 핑크 앰플', 'PDRN 핑크앰플|메디큐브 핑크앰플', '앰플', 'pdrn|niacinamide|hyaluronic-acid', 'pigmentation|firming|dullness', 'dry|oily|combo|normal'),
  p('y068', '메디큐브', 'PDRN 핑크 콜라겐 캡슐크림', 'PDRN 캡슐크림|핑크 콜라겐 크림', '크림', 'pdrn|collagen|peptides|squalane', 'firming|dryness', 'dry|normal|combo'),
  p('y069', '메디큐브', '앰플 마스크', '메디큐브 앰플마스크', '마스크', 'hyaluronic-acid|panthenol|niacinamide', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y070', '메디힐', '마데카소사이드 더마 세럼', '마데카소사이드 세럼|메디힐 더마세럼', '세럼', 'madecassoside|centella|panthenol', 'barrier|breakout', 'sensitive|dry|normal|combo'),
  p('y071', '메디힐', '더마 토너패드', '메디힐 토너패드|메디힐 더마패드', '패드', 'panthenol|allantoin|niacinamide', 'barrier|texture|pores', 'dry|oily|combo|normal|sensitive'),
  p('y072', '메디힐', '콜라겐 캡슐 패치', '메디힐 콜라겐패치', '마스크', 'collagen|peptides|adenosine', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y073', '메디힐', '랩핑 세럼 마스크', '메디힐 랩핑마스크', '마스크', 'hyaluronic-acid|panthenol|niacinamide', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y074', '메디힐', '하이퍼 겔마스크', '메디힐 겔마스크', '마스크', 'hyaluronic-acid|panthenol|madecassoside', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y075', '메디힐', 'PDRN 수분 선세럼 매끈 톤업', '메디힐 선세럼|PDRN 선세럼', '선크림', 'pdrn|uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'pigmentation|dryness', 'dry|oily|combo|normal'),

  // ── 넘버즈인 ───────────────────────────────────────────────────────────────
  p('y076', '넘버즈인', '1번 판토텐산 액티브업 수딩세럼', '1번 수딩세럼|판토텐산 수딩세럼', '세럼', 'panthenol|allantoin|centella', 'breakout|barrier', 'sensitive|oily|combo|normal'),
  p('y077', '넘버즈인', '1번 판토텐산 스킨케어100 블러파우더', '넘버즈인 블러파우더', '베이스', 'panthenol|silica|kaolin', 'sebum|pores', 'oily|combo'),
  p('y078', '넘버즈인', '3번 보들보들 모공결 세럼', '3번 모공결 세럼', '세럼', 'niacinamide|panthenol|hyaluronic-acid', 'pores|texture|sebum', 'oily|combo|normal'),
  p('y079', '넘버즈인', '5번 글루타치온C 흔적 앰플', '5번 글루타치온 앰플|글루타치온C 앰플', '앰플', 'glutathione|ascorbyl-glucoside|niacinamide', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y080', '넘버즈인', '3번 매끈결 PHA 화잘먹 버블팩', '3번 버블팩|PHA 버블팩', '마스크', 'gluconolactone|lactobionic-acid|panthenol', 'texture|pores|sebum', 'oily|combo|normal'),
  p('y081', '넘버즈인', '3번 모공제로 화잘먹 패드', '3번 모공패드|넘버즈인 모공제로 패드', '패드', 'niacinamide|gluconolactone|panthenol', 'pores|sebum|texture', 'oily|combo|normal'),
  p('y082', '넘버즈인', '1번 말끔 순삭 클렌징 오일', '넘버즈인 클렌징오일', '클렌징', 'sunflower-oil|jojoba-oil|glycerin', 'sebum|pores', 'dry|oily|combo|normal'),
  p('y083', '넘버즈인', '3번 도자기결 톤업베이지 선크림', '3번 톤업베이지 선크림|도자기결 선크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide|panthenol', 'pigmentation|dullness|pores', 'dry|normal|combo|oily'),
  p('y084', '넘버즈인', '1번 청초 진정맑은 물막선크림', '1번 물막선크림|청초 선크림', '선크림', 'uvinul-a-plus|uvinul-t150|panthenol|centella', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),

  // ── 아누아 ─────────────────────────────────────────────────────────────────
  p('y085', '아누아', 'TXA 나이아신 흔적 세럼', 'TXA 흔적세럼|트라넥삼산 세럼|anua txa niacin serum', '세럼', 'tranexamic-acid|niacinamide|hyaluronic-acid', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y086', '아누아', 'PDRN 히알루론산 100 수분 크림', 'PDRN 수분크림|아누아 피디알엔 크림', '크림', 'pdrn|hyaluronic-acid|ceramide|panthenol', 'dryness|barrier|firming', 'dry|oily|combo|normal|sensitive'),
  p('y087', '아누아', 'PDRN 히알루론산 수분 캡슐 미스트', 'PDRN 캡슐미스트|아누아 미스트', '미스트', 'pdrn|hyaluronic-acid|panthenol', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y088', '아누아', '어성초 77 히알루론산 수분 진정 토너', '어성초 히알루론산 토너|어성초 77 토너', '토너', 'houttuynia|hyaluronic-acid|panthenol', 'barrier|dryness|breakout', 'dry|oily|combo|normal|sensitive'),
  p('y089', '아누아', '어성초 피지쏙 모공 폼', '어성초 피지쏙|아누아 모공폼', '클렌징', 'houttuynia|salicylic-acid|glycerin', 'sebum|pores|breakout', 'oily|combo'),
  p('y090', '아누아', '매트벗글로우 커버 베이지 선크림', '아누아 커버 베이지 선크림|매트벗글로우', '선크림', 'uvinul-a-plus|uvinul-t150|niacinamide', 'pigmentation|sebum|pores', 'oily|combo|normal'),

  // ── 토리든 ─────────────────────────────────────────────────────────────────
  p('y091', '토리든', '다이브인 저분자 히알루론산 인텐시브 크림', '다이브인 인텐시브크림', '크림', 'hyaluronic-acid|ceramide|squalane|panthenol', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('y092', '토리든', '다이브인 모이스처 선크림', '다이브인 선크림|토리든 모이스처 선크림', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid|panthenol', 'dryness|pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y093', '토리든', '다이브인 무기자차 마일드 선크림', '다이브인 무기자차|토리든 무기자차', '선크림', 'zinc-oxide|titanium-dioxide|hyaluronic-acid', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y094', '토리든', '밸런스풀 시카 컨트롤 마스크', '밸런스풀 시카마스크', '마스크', 'centella|madecassoside|panthenol', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y095', '토리든', '밸런스풀 포맨 시카 오일 컨트롤 선스틱', '토리든 선스틱|밸런스풀 선스틱', '선크림', 'zinc-oxide|titanium-dioxide|centella', 'sebum|pigmentation|pores', 'oily|combo'),
  p('y096', '토리든', '다이브인 저분자 히알루론산 토너 패드', '다이브인 토너패드|토리든 패드', '패드', 'hyaluronic-acid|panthenol|beta-glucan', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),

  // ── 셀리맥스 ───────────────────────────────────────────────────────────────
  p('y097', '셀리맥스', '더 비타 A 레티날 샷 타이트닝 듀얼 크림', '레티날 샷 듀얼크림|비타A 레티날 크림', '크림', 'retinal|niacinamide|panthenol|ceramide', 'firming|texture|pores', 'normal|combo|oily'),
  p('y098', '셀리맥스', '더 비타 A 레티날 샷 타이트닝 부스터', '레티날 샷 부스터', '세럼', 'retinal|panthenol|niacinamide', 'firming|texture|pores', 'normal|combo|oily'),
  p('y099', '셀리맥스', '트라넥삼산 잡티 크림', '트라넥삼산 크림|셀리맥스 잡티크림', '크림', 'tranexamic-acid|niacinamide|panthenol', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y100', '셀리맥스', '트라넥삼산 브라이트닝 잡티 선크림', '트라넥삼산 선크림', '선크림', 'tranexamic-acid|uvinul-a-plus|uvinul-t150|niacinamide', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y101', '셀리맥스', '어성초 바하 지우개 필링 패드', '어성초 필링패드|지우개 필링패드', '패드', 'houttuynia|salicylic-acid|panthenol', 'sebum|texture|pores|breakout', 'oily|combo'),
  p('y102', '셀리맥스', '지우개 시카 바하 블레미쉬 토너 패드', '지우개 시카패드|셀리맥스 바하패드', '패드', 'centella|salicylic-acid|panthenol', 'breakout|sebum|pores', 'oily|combo'),

  // ── 달바 ───────────────────────────────────────────────────────────────────
  p('y103', '달바', '퍼스트 스프레이 세럼 펩타이드', '달바 펩타이드 미스트|퍼스트 스프레이 펩타이드', '미스트', 'peptides|hyaluronic-acid|squalane', 'dryness|firming', 'dry|oily|combo|normal|sensitive'),
  p('y104', '달바', '비타 캡슐 크림 나이아신아마이드 5퍼센트', '달바 비타 캡슐크림', '크림', 'niacinamide|squalane|tocopherol', 'pigmentation|dullness|dryness', 'dry|oily|combo|normal'),
  p('y105', '달바', '비타 캡슐 세럼 나이아신아마이드 5퍼센트', '달바 비타 캡슐세럼', '세럼', 'niacinamide|ascorbyl-glucoside|hyaluronic-acid', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y106', '달바', '핑크 톤업 선크림', '달바 핑크 선크림', '선크림', 'titanium-dioxide|zinc-oxide|squalane', 'pigmentation|dullness', 'dry|normal|combo'),
  p('y107', '달바', '퍼플 톤업 선크림', '달바 퍼플 선크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|dullness', 'dry|normal|combo'),
  p('y108', '달바', '그린 톤업 선크림', '달바 그린 선크림', '선크림', 'titanium-dioxide|zinc-oxide|centella', 'pigmentation|dullness|breakout', 'combo|oily|normal'),
  p('y109', '달바', '판테놀 리퀴드 선세럼', '달바 판테놀 선세럼', '선크림', 'panthenol|uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y110', '달바', '워터풀 블루 톤업 선크림', '달바 블루 톤업 선크림', '선크림', 'titanium-dioxide|zinc-oxide|hyaluronic-acid', 'pigmentation|dryness', 'dry|normal|combo'),

  // ── 구달 ───────────────────────────────────────────────────────────────────
  p('y111', '구달', '청귤 비타C 잡티케어 세럼 알파', '청귤 비타C 세럼|구달 잡티 세럼', '세럼', 'ascorbic-acid|niacinamide|yuja', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y112', '구달', '청귤 비타C 잡티케어 패드 알파', '청귤 비타C 패드', '패드', 'ascorbyl-glucoside|niacinamide|yuja', 'pigmentation|dullness|texture', 'dry|oily|combo|normal'),
  p('y113', '구달', '맑은 어성초 진정 수분 선크림', '구달 어성초 선크림', '선크림', 'houttuynia|uvinul-a-plus|uvinul-t150|panthenol', 'barrier|pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y114', '구달', '맑은 어성초 진정 무기자차 선크림', '구달 어성초 무기자차', '선크림', 'houttuynia|zinc-oxide|titanium-dioxide|panthenol', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y115', '구달', '어성초 진정 블레미쉬 커버 선비비', '구달 선비비', '베이스', 'houttuynia|zinc-oxide|titanium-dioxide|niacinamide', 'pigmentation|breakout|pores', 'combo|oily|normal'),

  // ── 닥터지 ─────────────────────────────────────────────────────────────────
  p('y116', '닥터지', '레드 블레미쉬 클리어 수딩크림 EX', '레드블레미쉬 수딩크림 EX|닥터지 수딩크림 EX', '크림', 'centella|madecassoside|panthenol|ceramide', 'barrier|breakout', 'sensitive|dry|normal|combo'),
  p('y117', '닥터지', '레드 블레미쉬 클리어 모이스처 크림', '닥터지 모이스처크림', '크림', 'centella|panthenol|ceramide|hyaluronic-acid', 'barrier|dryness|breakout', 'dry|sensitive|normal|combo'),
  p('y118', '닥터지', '그린딥 포어 클렌징밤', '닥터지 클렌징밤|그린딥 클렌징밤', '클렌징', 'kaolin|jojoba-oil|salicylic-acid', 'pores|sebum', 'oily|combo'),
  p('y119', '닥터지', '약산성 클렌징 젤 폼', '닥터지 약산성 클렌징폼', '클렌징', 'glycerin|panthenol', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y120', '닥터지', '레드 블레미쉬 수딩 업 선', '닥터지 수딩업선|레드블레미쉬 선크림', '선크림', 'centella|panthenol|uvinul-a-plus|uvinul-t150', 'barrier|pigmentation|breakout', 'sensitive|combo|oily|normal'),
  p('y121', '닥터지', '스킨부스트 PDRN 선세럼', '닥터지 PDRN 선세럼', '선크림', 'pdrn|uvinul-a-plus|uvinul-t150|panthenol', 'pigmentation|firming', 'dry|oily|combo|normal'),

  // ── 브링그린 · 비플레인 ───────────────────────────────────────────────────
  p('y122', '브링그린', '징크테카 트러블 세럼', '징크테카 세럼|브링그린 트러블세럼', '세럼', 'zinc-pca|centella|madecassoside|niacinamide', 'breakout|sebum|pores', 'oily|combo|sensitive'),
  p('y123', '브링그린', '티트리 시카 수딩 크림 플러스', '티트리 시카 수딩크림', '크림', 'tea-tree|centella|panthenol|niacinamide', 'breakout|barrier|sebum', 'oily|combo|sensitive|normal'),
  p('y124', '브링그린', '티트리 시카 딥클렌징폼', '브링그린 딥클렌징폼', '클렌징', 'tea-tree|centella|glycerin', 'breakout|sebum|pores', 'oily|combo'),
  p('y125', '브링그린', '징크테카 파이토 선젤', '징크테카 선젤', '선크림', 'zinc-pca|centella|uvinul-a-plus|uvinul-t150', 'breakout|sebum|pigmentation', 'oily|combo'),
  p('y126', '브링그린', '알로에 97% 수딩젤', '브링그린 알로에젤', '크림', 'aloe|glycerin|panthenol', 'barrier|dryness', 'dry|oily|combo|normal|sensitive'),
  p('y127', '비플레인', '녹두 모공 클렌징 밀크밤', '녹두 밀크밤|비플레인 클렌징밤', '클렌징', 'mung-bean|kaolin|jojoba-oil', 'pores|sebum', 'oily|combo|normal'),
  p('y128', '비플레인', '녹두 클렌징 오일', '녹두 클렌징오일', '클렌징', 'mung-bean|sunflower-oil|jojoba-oil', 'sebum|pores', 'dry|oily|combo|normal'),
  p('y129', '비플레인', '녹두 밀크 필링 젤', '녹두 필링젤', '필링', 'mung-bean|cellulose|panthenol', 'texture|pores', 'normal|combo|oily'),
  p('y130', '비플레인', '녹두 모공 클레이 팩', '녹두 클레이팩', '마스크', 'kaolin|mung-bean|centella', 'pores|sebum', 'oily|combo'),
  p('y131', '비플레인', '선뮤즈 톤업 앤 코렉팅 선크림', '선뮤즈 톤업 선크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide|mung-bean', 'pigmentation|dullness|pores', 'normal|combo|oily'),
  p('y132', '비플레인', '녹두 쿨링 수분 선크림', '녹두 쿨링 선크림', '선크림', 'mung-bean|uvinul-a-plus|uvinul-t150|panthenol', 'barrier|sebum|pigmentation', 'oily|combo|normal'),

  // ── 라운드랩 · 코스알엑스 ─────────────────────────────────────────────────
  p('y133', '라운드랩', '자작나무 수분 톤업 선크림', '자작나무 톤업 선크림', '선크림', 'birch-sap|titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|dullness|dryness', 'dry|normal|combo'),
  p('y134', '라운드랩', '자작나무 무기자차 선크림', '자작나무 무기자차', '선크림', 'birch-sap|zinc-oxide|titanium-dioxide|panthenol', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y135', '라운드랩', '자작나무 수분 선스틱', '자작나무 선스틱', '선크림', 'birch-sap|zinc-oxide|titanium-dioxide', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y136', '라운드랩', '자작나무 수분 클렌저', '자작나무 클렌저', '클렌징', 'birch-sap|glycerin|betaine', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y137', '라운드랩', '1025 독도 클렌징 워터', '독도 클렌징워터', '클렌징', 'panthenol|betaine|allantoin', 'barrier', 'dry|oily|combo|normal|sensitive'),
  p('y138', '코스알엑스', '더 6 펩타이드 스킨 부스터 세럼', '6 펩타이드 세럼|cosrx the 6 peptide', '세럼', 'peptides|hyaluronic-acid|panthenol', 'firming|dryness', 'dry|oily|combo|normal|sensitive'),
  p('y139', '코스알엑스', '울트라 라이트 물막 수분 선세럼', '코스알엑스 선세럼|물막 선세럼', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid|panthenol', 'dryness|pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y140', '코스알엑스', '원스텝 오리지널 클리어 패드', '원스텝 패드|코스알엑스 패드', '패드', 'salicylic-acid|betaine|panthenol', 'breakout|sebum|pores', 'oily|combo'),

  // ── 아이오페 · 바이오힐보 · 리쥬란 · VT ───────────────────────────────────
  p('y141', '아이오페', '레티젝션 세럼', '아이오페 레티젝션|레티젝션', '세럼', 'retinol|peptides|panthenol', 'firming|texture', 'normal|combo|dry'),
  p('y142', '아이오페', 'XMD 스템3 클리니컬 리커버리 세럼', 'XMD 스템3 세럼', '세럼', 'peptides|adenosine|hyaluronic-acid', 'firming|dryness', 'dry|normal|combo'),
  p('y143', '아이오페', '레티놀 세럼 인 겔마스크', '아이오페 레티놀 겔마스크', '마스크', 'retinol|panthenol|hyaluronic-acid', 'firming|texture', 'normal|combo'),
  p('y144', '아이오페', '맨 올데이 퍼펙트 올인원', '아이오페 맨 올인원', '로션', 'glycerin|panthenol|adenosine', 'dryness|barrier', 'dry|oily|combo|normal'),
  p('y145', '바이오힐보', '프로바이오덤 3D 리프팅 크림', '프로바이오덤 리프팅크림|3D 리프팅 크림', '크림', 'lactobacillus|peptides|adenosine|collagen', 'firming|dryness', 'dry|normal|combo'),
  p('y146', '바이오힐보', '프로바이오덤 콜라겐 리모델링 세럼', '콜라겐 리모델링 세럼', '세럼', 'collagen|peptides|lactobacillus', 'firming|pores', 'dry|oily|combo|normal'),
  p('y147', '바이오힐보', '판테셀 리페어시카 크림미스트', '판테셀 크림미스트', '미스트', 'panthenol|centella|ceramide', 'barrier|dryness', 'sensitive|dry|normal'),
  p('y148', '바이오힐보', '판테셀 리페어 시카좀 겔링패드', '판테셀 겔링패드', '패드', 'panthenol|centella|allantoin', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y149', '바이오힐보', '프로바이오덤 콜라겐 선크림', '바이오힐보 콜라겐 선크림', '선크림', 'collagen|uvinul-a-plus|uvinul-t150|lactobacillus', 'pigmentation|firming', 'dry|oily|combo|normal'),
  p('y150', '리쥬란', '힐러 턴오버 앰플 듀얼 이펙트', '턴오버 앰플 듀얼이펙트', '앰플', 'pdrn|hyaluronic-acid|panthenol', 'firming|texture|dryness', 'dry|oily|combo|normal|sensitive'),
  p('y151', '리쥬란', '힐러 턴오버 액티브 크림', '턴오버 액티브크림', '크림', 'pdrn|hyaluronic-acid|ceramide|panthenol', 'firming|dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y152', '리쥬란', '포어 타이트닝 토너 패드', '리쥬란 토너패드', '패드', 'pdrn|niacinamide|gluconolactone', 'pores|texture|sebum', 'oily|combo|normal'),
  p('y153', '리쥬란', '힐러 스킨 프로텍션 마스크', '리쥬란 마스크', '마스크', 'pdrn|hyaluronic-acid|panthenol', 'barrier|dryness', 'dry|oily|combo|normal|sensitive'),
  p('y154', 'VT', '피디알엔 에센스 100', 'PDRN 에센스 100|VT 피디알엔 에센스', '에센스', 'pdrn|hyaluronic-acid|niacinamide', 'firming|dullness|dryness', 'dry|oily|combo|normal'),
  p('y155', 'VT', '피디알엔 리들샷 아이 리프터', '리들샷 아이리프터', '아이크림', 'pdrn|peptides|adenosine', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y156', 'VT', '피디알엔 에어 클라우드 선스크린', 'VT 에어클라우드 선크림', '선크림', 'pdrn|uvinul-a-plus|uvinul-t150', 'pigmentation|dryness', 'dry|oily|combo|normal'),

  // ── 더오디너리 · 스트라이덱스 · 폴라초이스 계열 ───────────────────────────
  p('y157', '더오디너리', '나이아신아마이드 10% + 징크 1%', '나이아신아마이드 10|디오디너리 나이아신아마이드', '세럼', 'niacinamide|zinc-pca', 'sebum|pores|pigmentation', 'oily|combo|normal'),
  p('y158', '스트라이덱스', '맥스플러스 패드', '스트라이덱스 맥스패드', '패드', 'salicylic-acid|glycerin', 'breakout|sebum|pores', 'oily|combo'),
  p('y159', '스트라이덱스', '센시티브 패드', '스트라이덱스 센시티브', '패드', 'salicylic-acid|aloe|panthenol', 'breakout|sebum|pores', 'combo|oily|sensitive'),
  p('y160', '스트라이덱스', '시카 히알루론산 약알칼리성 클렌징폼', '스트라이덱스 클렌징폼', '클렌징', 'centella|hyaluronic-acid|glycerin', 'barrier|breakout', 'sensitive|oily|combo'),

  // ── 아렌시아 · 파티온 · 더마팩토리 · 셀라딕스 ─────────────────────────────
  p('y161', '아렌시아', '떡솝 프레시 클렌저', '아렌시아 떡솝|떡솝 클렌저', '클렌징', 'rice-extract|glycerin|panthenol', 'barrier|texture', 'dry|normal|combo|sensitive'),
  p('y162', '아렌시아', '그린티 LHA 딥 포어 떡솝 클렌저', '그린티 LHA 떡솝', '클렌징', 'lha|green-tea|rice-extract', 'pores|sebum|texture', 'oily|combo'),
  p('y163', '아렌시아', '비타민 C 부스터 샷', '아렌시아 비타민C 부스터', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol', 'pigmentation|dullness', 'dry|normal|combo|oily'),
  p('y164', '아렌시아', '찹쌀떡솝 클렌저', '찹쌀떡솝', '클렌징', 'rice-extract|glycerin|betaine', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y165', '파티온', '노스카나인 트러블 세럼', '노스카나인 세럼|파티온 트러블세럼', '세럼', 'centella|niacinamide|panthenol|allantoin', 'breakout|pigmentation|pores', 'oily|combo|sensitive|normal'),
  p('y166', '파티온', '노스카나인 트러블 크림', '노스카나인 크림', '크림', 'centella|panthenol|ceramide|niacinamide', 'breakout|barrier', 'oily|combo|sensitive|normal'),
  p('y167', '더마팩토리', '나이아신아마이드 20% 세럼', '더마팩토리 나이아신 20', '세럼', 'niacinamide|hyaluronic-acid', 'pigmentation|sebum|pores', 'oily|combo|normal'),
  p('y168', '셀라딕스', '트러블 세범 밸런싱 131 앰플', '셀라딕스 131 앰플', '앰플', 'zinc-pca|niacinamide|centella', 'breakout|sebum|pores', 'oily|combo'),
  p('y169', '셀라딕스', '트러블 클리어 약산성 131 젤클렌저', '셀라딕스 젤클렌저', '클렌징', 'salicylic-acid|centella|glycerin', 'breakout|sebum|pores', 'oily|combo'),
  p('y170', '셀라딕스', '트리플 레티놀 워시필', '셀라딕스 워시필', '필링', 'retinol|cellulose|panthenol', 'texture|pores|firming', 'normal|combo|oily'),

  // ── 레이어랩 · 닥터엘시아 · 차앤박 · 메노킨 · 클레어스 ────────────────────
  p('y171', '레이어랩', '판테놀 인텐시브 크림 플러스', '레이어랩 판테놀 크림', '크림', 'panthenol|ceramide|squalane|allantoin', 'barrier|dryness', 'dry|sensitive|normal|combo'),
  p('y172', '닥터엘시아', '345 릴리프 크림', '닥터엘시아 릴리프크림|345 크림', '크림', 'panthenol|ceramide|madecassoside|allantoin', 'barrier|dryness|breakout', 'sensitive|dry|normal|combo'),
  p('y173', '닥터엘시아', '345 릴리프 데일리 젤 클렌저', '닥터엘시아 젤클렌저', '클렌징', 'panthenol|glycerin|allantoin', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y174', '차앤박', '프로폴리스 에너지 액티브 앰플', 'CNP 프로폴리스 앰플|프로폴리스 앰플', '앰플', 'propolis|niacinamide|panthenol', 'dullness|dryness|barrier', 'dry|oily|combo|normal'),
  p('y175', '차앤박', '프로폴리스 에너지 앰플 미스트', 'CNP 프로폴리스 미스트', '미스트', 'propolis|hyaluronic-acid|panthenol', 'dryness|dullness', 'dry|oily|combo|normal'),
  p('y176', '차앤박', '애프터레이 톤업 프로텍션 선', 'CNP 애프터레이 선크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|dullness', 'normal|combo|dry'),
  p('y177', '메노킨', '30초 퀵 글로우 버블 캡슐 미스트 하이드라 리프트', '메노킨 캡슐미스트', '미스트', 'hyaluronic-acid|panthenol|peptides', 'dryness|firming', 'dry|oily|combo|normal'),
  p('y178', '메노킨', '30초 퀵 버블 마스크', '메노킨 버블마스크', '마스크', 'papain|cellulose|panthenol', 'texture|pores|dullness', 'normal|combo|oily'),
  p('y179', '디어클레어스', '블루 유스 액티베이팅 드롭', '클레어스 블루드롭|blue youth activating drop', '세럼', 'egf|peptides|panthenol', 'barrier|firming', 'sensitive|dry|normal|combo'),
  p('y180', '디어클레어스', '서플 프레퍼레이션 언센티드 토너', '클레어스 토너|서플 프레퍼레이션 토너', '토너', 'hyaluronic-acid|panthenol|centella', 'dryness|barrier', 'sensitive|dry|normal|combo'),

  // ── 라곰 · 메이크프렘 · 식물나라 · 바닐라코 ───────────────────────────────
  p('y181', '라곰', '셀럽 마이크로 폼 클렌저', '라곰 폼클렌저|셀럽 마이크로폼', '클렌징', 'glycerin|panthenol|betaine', 'barrier', 'dry|oily|combo|normal|sensitive'),
  p('y182', '라곰', '셀럽 젤 투 워터 클렌저', '라곰 젤투워터', '클렌징', 'glycerin|betaine', 'barrier|sebum', 'dry|oily|combo|normal'),
  p('y183', '라곰', '오트 미셀라 클렌징밀크', '라곰 오트 클렌징밀크', '클렌징', 'colloidal-oatmeal|glycerin|squalane', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y184', '메이크프렘', '세이프 미 릴리프 모이스처 클렌징폼', '메이크프렘 클렌징폼|세이프미 클렌징폼', '클렌징', 'centella|panthenol|glycerin', 'barrier|breakout', 'sensitive|dry|normal|combo'),
  p('y185', '메이크프렘', '세이프 미 릴리프 모이스처 클렌징밀크', '메이크프렘 클렌징밀크', '클렌징', 'centella|squalane|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('y186', '메이크프렘', '유브이 디펜스 미 노세범 선크림', '메이크프렘 노세범 선크림', '선크림', 'zinc-oxide|titanium-dioxide|silica|centella', 'sebum|pigmentation|pores', 'oily|combo'),
  p('y187', '메이크프렘', '수딩 핑크 톤업 선크림', '메이크프렘 핑크 톤업', '선크림', 'zinc-oxide|titanium-dioxide|centella|panthenol', 'pigmentation|dullness|barrier', 'sensitive|dry|normal|combo'),
  p('y188', '식물나라', '뽀얀쌀 톤업 수분 선크림', '식물나라 뽀얀쌀 선크림', '선크림', 'rice-extract|titanium-dioxide|zinc-oxide', 'pigmentation|dullness|dryness', 'dry|oily|combo|normal'),
  p('y189', '식물나라', '가벼운 수분 선 젤', '식물나라 선젤', '선크림', 'uvinul-a-plus|uvinul-t150|glycerin', 'pigmentation', 'oily|combo|normal'),
  p('y190', '식물나라', '제주알로에 쿨링 선 스틱', '식물나라 알로에 선스틱', '선크림', 'aloe|zinc-oxide|titanium-dioxide', 'pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y191', '식물나라', '페이스 앤 바디 저자극 선 크림', '식물나라 저자극 선크림', '선크림', 'zinc-oxide|titanium-dioxide|glycerin', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('y192', '바닐라코', '클린잇제로 오리지널 클렌징밤', '클린잇제로|클렌징밤 핑크', '클렌징', 'sunflower-oil|jojoba-oil|tocopherol', 'dryness|texture', 'dry|oily|combo|normal'),
  p('y193', '바닐라코', '클린잇제로 말차 클렌징밤', '클린잇제로 말차', '클렌징', 'green-tea|sunflower-oil|jojoba-oil', 'sebum|pores', 'oily|combo'),
  p('y194', '바닐라코', '프라임 프라이머 피니쉬 파우더', '바닐라코 피니쉬 파우더', '베이스', 'silica|kaolin', 'sebum|pores', 'oily|combo'),

  // ── 마녀공장 · 에스네이처 · 이즈앤트리 · 아비브 ───────────────────────────
  p('y195', '마녀공장', '퓨어 소이빈 클렌징폼', '퓨어 소이빈 폼|마녀공장 클렌징폼', '클렌징', 'glycerin|betaine|panthenol', 'barrier', 'dry|oily|combo|normal|sensitive'),
  p('y196', '마녀공장', '퓨어 소이빈 클렌징밀크', '퓨어 소이빈 밀크', '클렌징', 'squalane|glycerin|sunflower-oil', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y197', '에스네이처', '아쿠아 스쿠알란 수분크림', '에스네이처 수분크림|아쿠아 스쿠알란 크림', '크림', 'squalane|hyaluronic-acid|panthenol', 'dryness|barrier|pores', 'dry|oily|combo|normal|sensitive'),
  p('y198', '에스네이처', '아쿠아 라이스 클렌징폼', '아쿠아 라이스 폼', '클렌징', 'rice-extract|glycerin|betaine', 'barrier|dullness', 'dry|oily|combo|normal'),
  p('y199', '에스네이처', '아쿠아 라이스 클렌징오일', '아쿠아 라이스 오일', '클렌징', 'rice-extract|sunflower-oil|jojoba-oil', 'dryness|texture', 'dry|oily|combo|normal'),
  p('y200', '에스네이처', '아쿠아 라이스 클렌징밀크', '아쿠아 라이스 밀크', '클렌징', 'rice-extract|squalane|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y201', '에스네이처', '아쿠아 365 유브이 선크림', '에스네이처 유브이 선크림', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid|squalane', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y202', '이즈앤트리', '어니언 뉴페어 겔크림 플러스', '어니언 겔크림|이즈앤트리 어니언 크림', '크림', 'niacinamide|allantoin|panthenol', 'pigmentation|pores|barrier', 'combo|oily|normal'),
  p('y203', '이즈앤트리', '참마 비건 밀크 클렌저', '참마 밀크 클렌저', '클렌징', 'glycerin|squalane|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y204', '아비브', '어성초 테카 캡슐 세럼 카밍 드롭', '아비브 카밍드롭|어성초 테카 세럼', '세럼', 'houttuynia|centella|madecassoside|panthenol', 'breakout|barrier', 'sensitive|oily|combo|normal'),
  p('y205', '아비브', '약산성 pH 시트 마스크 핏', '아비브 약산성 마스크', '마스크', 'panthenol|allantoin|centella', 'barrier|breakout', 'sensitive|dry|oily|combo|normal'),
  p('y206', '아비브', '콜라겐 겔 마스크', '아비브 콜라겐 마스크', '마스크', 'collagen|peptides|hyaluronic-acid', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y207', '아비브', '껌딱지 시트 마스크 어성초 스티커', '아비브 껌딱지 마스크', '마스크', 'houttuynia|panthenol|allantoin', 'breakout|barrier', 'sensitive|oily|combo|normal'),

  // ── 바이오던스 · 듀이트리 · 프리메라 · 한율 ───────────────────────────────
  p('y208', '바이오던스', '바이오 겔 토너 패드', '바이오던스 토너패드', '패드', 'hyaluronic-acid|panthenol|collagen', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y209', '바이오던스', '캐비어 PDRN 마스크', '바이오던스 캐비어 마스크', '마스크', 'pdrn|collagen|peptides', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y210', '바이오던스', '아이패치', '바이오던스 아이패치', '아이크림', 'collagen|peptides|adenosine', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y211', '듀이트리', '하이아미노 올 클렌징밀크', '듀이트리 클렌징밀크', '클렌징', 'glycerin|squalane|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y212', '듀이트리', 'AC 딥 진정 모공 패드', '듀이트리 AC 패드', '패드', 'tea-tree|salicylic-acid|centella', 'breakout|sebum|pores', 'oily|combo'),
  p('y213', '듀이트리', 'AC 딥 진정 마스크', '듀이트리 AC 마스크', '마스크', 'tea-tree|centella|panthenol', 'breakout|barrier', 'oily|combo|sensitive'),
  p('y214', '프리메라', '비타티놀 바운시 리프트 세럼', '비타티놀 세럼', '세럼', 'retinol|ascorbyl-glucoside|peptides', 'firming|texture|dullness', 'normal|combo|dry'),
  p('y215', '프리메라', '마일드 앤 퍼펙트 클렌징 오일 투 폼', '프리메라 오일투폼', '클렌징', 'sunflower-oil|jojoba-oil|glycerin', 'dryness|texture', 'dry|oily|combo|normal'),
  p('y216', '프리메라', '마일드 앤 퍼펙트 페이셜 필링', '프리메라 페이셜 필링', '필링', 'cellulose|papain|panthenol', 'texture|pores', 'normal|combo|dry'),
  p('y217', '프리메라', '비타티놀 메가-샷 겔마스크', '비타티놀 겔마스크', '마스크', 'retinol|ascorbyl-glucoside|panthenol', 'firming|texture', 'normal|combo'),
  p('y218', '한율', '피지흡착 쑥떡팩폼', '한율 쑥떡팩폼', '클렌징', 'mugwort|kaolin|rice-extract', 'sebum|pores|texture', 'oily|combo'),
  p('y219', '한율', '쑥시카 진정 패드', '한율 쑥시카 패드', '패드', 'mugwort|centella|panthenol', 'barrier|breakout', 'sensitive|oily|combo|normal'),

  // ── 센카 · 파파레서피 · 한스킨 · 스킨푸드 · 더마토리 ─────────────────────
  p('y220', '센카', '퍼펙트 휩 페이셜 워시', '퍼펙트 휩|senka perfect whip', '클렌징', 'glycerin|betaine', 'barrier', 'dry|oily|combo|normal'),
  p('y221', '센카', '퍼펙트 휩 콜라겐 인', '퍼펙트 휩 콜라겐', '클렌징', 'collagen|glycerin|betaine', 'barrier|firming', 'dry|oily|combo|normal'),
  p('y222', '파파레서피', '블레미쉬 효소 파우더 클렌저', '파파레서피 효소 파우더', '클렌징', 'papain|rice-extract|kaolin', 'texture|pores|sebum', 'oily|combo|normal'),
  p('y223', '파파레서피', '봄비 꿀 마스크팩', '봄비 꿀마스크', '마스크', 'honey|propolis|panthenol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('y224', '한스킨', '클렌징오일 블랙헤드 PHA', '한스킨 블랙헤드 클렌징오일', '클렌징', 'gluconolactone|jojoba-oil|sunflower-oil', 'pores|sebum|texture', 'oily|combo|normal'),
  p('y225', '스킨푸드', '당근 PDRN 속수분 패드', '스킨푸드 당근 패드', '패드', 'pdrn|hyaluronic-acid|panthenol', 'dryness|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y226', '더마토리', '나이아샷 플러스 IPMP 트러블 블랙 마스크', '더마토리 트러블 마스크', '마스크', 'niacinamide|salicylic-acid|centella', 'breakout|sebum|pores', 'oily|combo'),
  p('y227', '더마토리', '살리시닉 포어 클리어 블랙 모공 토너패드', '더마토리 모공 토너패드', '패드', 'salicylic-acid|niacinamide|panthenol', 'pores|sebum|texture', 'oily|combo'),

  // ── 셀퓨전씨 · 이니스프리 · 에뛰드 · AHC · 리얼베리어 ────────────────────
  p('y228', '셀퓨전씨', '잡티 토닝 썬스크린', '셀퓨전씨 잡티 선크림', '선크림', 'zinc-oxide|titanium-dioxide|niacinamide|tranexamic-acid', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y229', '셀퓨전씨', '포스트 알파 쿨링 패드', '셀퓨전씨 쿨링패드', '패드', 'centella|panthenol|allantoin', 'barrier|breakout', 'sensitive|oily|combo|normal'),
  p('y230', '셀퓨전씨', '스킨 블레미쉬 밤 인텐시브', '셀퓨전씨 블레미쉬 밤', '베이스', 'zinc-oxide|titanium-dioxide|niacinamide', 'pigmentation|pores', 'normal|combo|oily'),
  p('y231', '이니스프리', '레티놀 시카 모공 흔적 앰플', '레티놀 시카 모공앰플', '앰플', 'retinol|centella|niacinamide|panthenol', 'pores|texture|breakout|firming', 'normal|combo|oily'),
  p('y232', '이니스프리', '화산송이 바하 모공 클렌징폼', '화산송이 클렌징폼', '클렌징', 'salicylic-acid|kaolin|silica', 'pores|sebum', 'oily|combo'),
  p('y233', '이니스프리', '데일리 유브이 톤업 노세범 선크림', '이니스프리 노세범 선크림', '선크림', 'titanium-dioxide|zinc-oxide|silica|green-tea', 'sebum|pigmentation|pores', 'oily|combo'),
  p('y234', '이니스프리', '데일리 유브이 수분 장벽 선세럼', '이니스프리 장벽 선세럼', '선크림', 'uvinul-a-plus|uvinul-t150|ceramide|panthenol', 'barrier|dryness|pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y235', '에뛰드', '순정 디렉터 수분 선크림', '에뛰드 순정 선크림', '선크림', 'uvinul-a-plus|uvinul-t150|panthenol|glycerin', 'barrier|pigmentation', 'sensitive|dry|normal|combo'),
  p('y236', 'AHC', '텐 레볼루션 리얼 아이크림 포 페이스', 'AHC 텐 레볼루션 아이크림', '아이크림', 'peptides|adenosine|hyaluronic-acid', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y237', 'AHC', '마스터즈 아쿠아리치 선크림', 'AHC 아쿠아리치 선크림', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y238', 'AHC', '마스터즈 에어리치 선스틱', 'AHC 에어리치 선스틱', '선크림', 'uvinul-a-plus|uvinul-t150|glycerin', 'pigmentation', 'dry|oily|combo|normal'),
  p('y239', '리얼베리어', '익스트림 프로세라 크림', '프로세라 크림|리얼베리어 프로세라', '크림', 'ceramide|cholesterol|fatty-acids|panthenol', 'barrier|dryness', 'dry|sensitive|normal'),
  p('y240', '리얼베리어', '세라 수분 장벽 선크림', '리얼베리어 선크림', '선크림', 'ceramide|uvinul-a-plus|uvinul-t150|panthenol', 'barrier|dryness|pigmentation', 'dry|sensitive|normal|combo'),

  // ── 빌리프 · 쥬베룩 · 하우스오브비 · 풀리 · 블랑네이처 · 일소 ────────────
  p('y241', '빌리프', '슈퍼나이츠 리제너레이팅 나이트 마스크', '빌리프 슈퍼나이츠', '마스크', 'peptides|hyaluronic-acid|glycerin', 'dryness|firming', 'dry|oily|combo|normal'),
  p('y242', '빌리프', '더 트루 크림 모이스춰라이징 밤', '빌리프 모이스춰라이징 밤', '크림', 'glycerin|squalane|hyaluronic-acid', 'dryness|barrier', 'dry|normal|combo'),
  p('y243', '쥬베룩', 'PDLLA 콜라겐 부스팅 마스크', '쥬베룩 콜라겐 마스크', '마스크', 'collagen|peptides|hyaluronic-acid', 'firming|dryness', 'dry|oily|combo|normal'),
  p('y244', '하우스오브비', '글루타치온 페이스필름', '하우스오브비 페이스필름', '마스크', 'glutathione|niacinamide|hyaluronic-acid', 'dullness|pigmentation', 'dry|oily|combo|normal'),
  p('y245', '풀리', '쌀 세라 수분 선크림', '풀리 쌀세라 선크림', '선크림', 'rice-extract|ceramide|uvinul-a-plus|uvinul-t150', 'barrier|dryness|pigmentation', 'dry|normal|combo|sensitive'),
  p('y246', '풀리', '멜팅크림 투오일', '풀리 멜팅크림', '클렌징', 'sunflower-oil|jojoba-oil|squalane', 'dryness|texture', 'dry|normal|combo'),
  p('y247', '블랑네이처', '아크네 클렌징 폼', '블랑네이처 아크네 폼', '클렌징', 'salicylic-acid|tea-tree|centella', 'breakout|sebum|pores', 'oily|combo'),
  p('y248', '블랑네이처', '9배 어성초 버블클렌징 밀크', '블랑네이처 어성초 클렌징밀크', '클렌징', 'houttuynia|glycerin|panthenol', 'breakout|barrier', 'oily|combo|sensitive'),
  p('y249', '일소', '슈퍼 멜팅 세범 소프트너', '일소 세범 소프트너', '필링', 'salicylic-acid|papain|kaolin', 'pores|sebum|texture', 'oily|combo'),
  p('y250', '아리얼', '더 퍼펙트 클렌징 티슈 플러스', '아리얼 클렌징티슈', '클렌징', 'glycerin|panthenol', 'barrier', 'dry|oily|combo|normal|sensitive'),

  // ── 트로이아르케 · 아떼 · 유이크 · 체이싱래빗 · 테라로직 · 프롬리에 ──────
  p('y251', '트로이아르케', '서울 엑토인 톤업 선세럼', '트로이아르케 엑토인 선세럼', '선크림', 'ectoin|titanium-dioxide|zinc-oxide|panthenol', 'barrier|pigmentation|dullness', 'sensitive|dry|normal|combo'),
  p('y252', '아떼', '무기자차 선크림', '아떼 무기자차', '선크림', 'zinc-oxide|titanium-dioxide|glycerin', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('y253', '아떼', '선에센스 EX', '아떼 선에센스', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y254', '유이크', '바이옴 레미디 톤업 선크림 보라', '유이크 톤업 선크림', '선크림', 'lactobacillus|titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|dullness|barrier', 'dry|oily|combo|normal'),
  p('y255', '체이싱래빗', '올어바웃 글로우 커버크림', '체이싱래빗 커버크림', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide|hyaluronic-acid', 'pigmentation|dullness|pores', 'normal|combo|dry'),
  p('y256', '테라로직', '레티날 주름탄력 크림', '테라로직 레티날 크림', '크림', 'retinal|peptides|ceramide|panthenol', 'firming|texture', 'normal|combo|dry'),
  p('y257', '프롬리에', 'EGF 워터 화잘먹 선앰플', '프롬리에 선앰플', '선크림', 'egf|uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y258', '프롬리에', 'EGF 피지팩 하이퍼 액티브 모공 피지 마스크', '프롬리에 피지팩', '마스크', 'egf|salicylic-acid|kaolin', 'pores|sebum', 'oily|combo'),
  p('y259', '아이디얼포맨', '프레시 선 올인원', '아이디얼포맨 선 올인원', '선크림', 'uvinul-a-plus|uvinul-t150|glycerin', 'pigmentation|sebum', 'oily|combo|normal'),

  // ── 베이스·쿠션 (성분 궁합에 영향을 주는 자외선차단·피지 조절 성분만 표기) ─
  p('y260', '정샘물', '에센셜 스킨 누더 쿠션', '정샘물 누더쿠션', '베이스', 'titanium-dioxide|zinc-oxide|hyaluronic-acid', 'pigmentation|dryness', 'dry|oily|combo|normal'),
  p('y261', '정샘물', '에센셜 스킨 누더 리커버 BB', '정샘물 누더 BB', '베이스', 'titanium-dioxide|zinc-oxide|panthenol', 'pigmentation|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y262', '정샘물', '에센셜 물 마이크로 피팅 미스트', '정샘물 피팅 미스트', '미스트', 'glycerin|hyaluronic-acid', 'dryness', 'dry|oily|combo|normal'),
  p('y263', '에스쁘아', '비벨벳 커버쿠션', '에스쁘아 비벨벳 쿠션', '베이스', 'titanium-dioxide|zinc-oxide|silica', 'pigmentation|sebum|pores', 'oily|combo|normal'),
  p('y264', '에스쁘아', '비글로우 파운데이션', '에스쁘아 비글로우', '베이스', 'titanium-dioxide|hyaluronic-acid|squalane', 'pigmentation|dryness', 'dry|normal|combo'),
  p('y265', '에스쁘아', '워터 스플래쉬 선크림 세라마이드', '에스쁘아 워터 스플래쉬 선크림', '선크림', 'ceramide|uvinul-a-plus|uvinul-t150|panthenol', 'barrier|dryness|pigmentation', 'dry|oily|combo|normal|sensitive'),
  p('y266', 'VDL', '커버 스테인 퍼펙팅 쿠션', 'VDL 커버스테인 쿠션', '베이스', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|pores', 'normal|combo|oily'),
  p('y267', 'VDL', '로즈 PDRN 프렙 베이스', 'VDL PDRN 베이스', '베이스', 'pdrn|glycerin|hyaluronic-acid', 'dullness|dryness', 'dry|oily|combo|normal'),
  p('y268', '연작', '스킨 퍼펙팅 프로텍티브 베이스 프렙', '연작 프로텍티브 베이스', '베이스', 'ginseng|titanium-dioxide|zinc-oxide', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y269', '연작', '스킨 퍼펙팅 글로우 프렙 베이스', '연작 글로우 베이스', '베이스', 'ginseng|glycerin|hyaluronic-acid', 'dullness|dryness', 'dry|normal|combo'),
  p('y270', '어바웃톤', '스킨 레이어 핏 파운데이션', '어바웃톤 파운데이션', '베이스', 'titanium-dioxide|glycerin|hyaluronic-acid', 'pigmentation', 'dry|oily|combo|normal'),
  p('y271', '어바웃톤', '블러 파우더 팩트', '어바웃톤 블러 파우더', '베이스', 'silica|kaolin', 'sebum|pores', 'oily|combo'),
  p('y272', '더샘', '커버 퍼펙션 팁컨실러', '더샘 팁컨실러', '베이스', 'titanium-dioxide|glycerin', 'pigmentation', 'dry|oily|combo|normal'),
  p('y273', '에이프릴스킨', '당근클렌징밤', '에이프릴스킨 당근 클렌징밤', '클렌징', 'jojoba-oil|sunflower-oil|tocopherol', 'dryness|texture', 'dry|oily|combo|normal'),
  p('y274', '에이프릴스킨', '히어로쿠션', '에이프릴스킨 히어로 쿠션', '베이스', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|pores', 'normal|combo|oily'),
  p('y275', '이지듀', '기미 앰플 쿠션', '이지듀 기미쿠션', '베이스', 'egf|niacinamide|titanium-dioxide|zinc-oxide', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y276', '도미나스', '기미쿠션 Rx', '도미나스 기미쿠션', '베이스', 'niacinamide|titanium-dioxide|zinc-oxide|tranexamic-acid', 'pigmentation|dullness', 'dry|oily|combo|normal'),
  p('y277', '도미나스', '크림 Rx', '도미나스 크림', '크림', 'niacinamide|ceramide|panthenol', 'pigmentation|barrier', 'dry|oily|combo|normal|sensitive'),
  p('y278', '오브제', '포어 제로 오일 컨트롤 선스틱', '오브제 선스틱', '선크림', 'silica|zinc-oxide|titanium-dioxide', 'sebum|pores|pigmentation', 'oily|combo'),

  // ── 그 밖의 인기 라인업 ───────────────────────────────────────────────────
  p('y279', '메디필', '레드 락토 콜라겐 클리어 폼 2.0', '메디필 레드 락토 클렌징폼', '클렌징', 'lactobacillus|collagen|glycerin', 'barrier|dullness', 'dry|oily|combo|normal'),
  p('y280', '메디필', '그린 시카 콜라겐 클리어 젤 클렌저 2.0', '메디필 그린 시카 클렌저', '클렌징', 'centella|collagen|glycerin', 'barrier|breakout', 'oily|combo|sensitive|normal'),
  p('y281', '아크네스', '클리어&화이트 포밍워시', '아크네스 포밍워시', '클렌징', 'salicylic-acid|glycerin', 'breakout|sebum|pores', 'oily|combo'),
  p('y282', '라네즈', '크림 스킨 세라펩타이드 리파이너', '라네즈 크림스킨 세라펩타이드', '토너', 'ceramide|peptides|glycerin', 'barrier|dryness', 'dry|normal|combo|sensitive'),

  // ── 쿠션·BB (색조 브랜드 중 베이스 제품만) ───────────────────────────────
  p('y286', '퓌', '올데이 커버 블랙 쿠션', '퓌 블랙쿠션|fwee all day cover cushion', '베이스', 'titanium-dioxide|zinc-oxide|silica', 'pigmentation|sebum|pores', 'oily|combo|normal'),
  p('y287', '힌스', '누 글로우 화이트 쿠션', '힌스 화이트쿠션|hince new glow cushion', '베이스', 'titanium-dioxide|zinc-oxide|hyaluronic-acid', 'pigmentation|dryness', 'dry|normal|combo'),
  p('y288', '네이밍', '레이어드 핏 쿠션', '네이밍 쿠션|naming layered fit cushion', '베이스', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|pores', 'dry|oily|combo|normal'),
  p('y289', '비디비치', '블랙 퍼펙션 커버 핏 쿠션', '비디비치 쿠션', '베이스', 'titanium-dioxide|zinc-oxide|peptides', 'pigmentation|firming', 'dry|normal|combo'),
  p('y290', '디어달리아', '데일리 디펜스 PDRN BB크림', '디어달리아 BB크림', '베이스', 'pdrn|titanium-dioxide|zinc-oxide|panthenol', 'pigmentation|barrier', 'dry|oily|combo|normal|sensitive'),
];
