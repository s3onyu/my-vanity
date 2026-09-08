import type { Product } from '@/types';
import { p } from './_helper';

/** 백화점·더모코스메틱·글로벌 브랜드 확장 라인업 — 데모/미검증 데이터 */
export const PRODUCTS_PART3: Product[] = [
  // ── 선크림 ──────────────────────────────────────────────────────────────
  p('m001', '아넷사', '퍼펙트 UV 선스크린 스킨케어 밀크', '아넷사 골드|anessa perfect uv milk|아넷사 밀크', '선크림', 'uvinul-a-plus|uvinul-t150|tinosorb-s|hyaluronic-acid', 'pigmentation|dryness', 'dry|normal|combo|oily'),
  p('m002', '비오레', 'UV 아쿠아리치 워터리 에센스', '아쿠아리치|biore uv aqua rich', '선크림', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid|glycerin', 'pigmentation', 'oily|combo|normal'),
  p('m003', '알리에', '크로노 뷰티 젤 UV EX', '알리에 젤|allie chrono beauty gel', '선크림', 'uvinul-a-plus|tinosorb-s|glycerin|hyaluronic-acid', 'pigmentation|dryness', 'dry|normal|combo'),
  p('m004', '라로슈포제', '안뗄리오스 UV 뮨 400 인비저블 플루이드', '안뗄리오스 400|anthelios uvmune 400|안뗄리오스 인비저블', '선크림', 'uvinul-t150|tinosorb-s|thermal-water|glycerin', 'pigmentation|barrier', 'sensitive|dry|normal|combo|oily'),
  p('m005', '아벤느', '베리 하이 프로텍션 플루이드', '아벤느 선플루이드|avene very high protection fluid', '선크림', 'tinosorb-s|uvinul-a-plus|thermal-water', 'pigmentation|barrier', 'sensitive|dry|normal|combo'),
  p('m006', '유세린', '선 오일 컨트롤 드라이 터치 젤 크림', '유세린 오일컨트롤 선|eucerin sun oil control', '선크림', 'uvinul-a-plus|uvinul-t150|licochalcone|glycerin', 'sebum|pigmentation', 'oily|combo'),
  p('m007', '비쉬', '캐피탈 솔레이 UV 에이지 데일리', '캐피탈 솔레이|capital soleil uv age daily', '선크림', 'tinosorb-s|uvinul-t150|thermal-water|peptides', 'pigmentation|firming', 'normal|combo|dry'),
  p('m008', '비오더마', '포토덤 아크네 마트', '포토덤|photoderm akn mat', '선크림', 'uvinul-t150|tinosorb-s|zinc-pca', 'sebum|breakout|pigmentation', 'oily|combo'),
  p('m009', '시세이도', '퍼펙트 UV 프로텍터', '시세이도 골드 선|shiseido perfect uv protector', '선크림', 'uvinul-a-plus|tinosorb-s|hyaluronic-acid|fragrance', 'pigmentation', 'normal|combo|oily|dry'),
  p('m010', '닥터지', '레드 블레미쉬 선 플러스 (톤업)', '닥터지 톤업선|dr.g red blemish sun plus', '선크림', 'zinc-oxide|titanium-dioxide|niacinamide|glycerin', 'pigmentation|dullness', 'sensitive|dry|normal|combo'),
  p('m011', '셀퓨전씨', '톤업 선스크린 100', '셀퓨전씨 톤업|cell fusion c toning sunscreen', '선크림', 'zinc-oxide|titanium-dioxide|niacinamide|hyaluronic-acid', 'pigmentation|dullness', 'dry|normal|combo|sensitive'),
  p('m012', 'AHC', '내추럴 퍼펙션 프레쉬 선 스틱', 'AHC 선스틱|ahc sun stick', '선크림', 'uvinul-a-plus|uvinul-t150|tinosorb-s|aloe', 'pigmentation', 'normal|combo|oily'),
  p('m013', '클라란스', 'UV 플러스 안티 폴루션 데이 스크린', 'UV플러스|clarins uv plus', '선크림', 'titanium-dioxide|uvinul-a-plus|algae|fragrance', 'pigmentation|dullness', 'normal|dry|combo'),
  p('m014', '뉴트로지나', '울트라 쉬어 드라이 터치 선크림', '울트라쉬어|neutrogena ultra sheer', '선크림', 'avobenzone|uvinul-a-plus|tocopherol', 'pigmentation|sebum', 'oily|combo|normal'),

  // ── 클렌징 ──────────────────────────────────────────────────────────────
  p('m015', '세타필', '젠틀 클리어 클렌저', '세타필 젠틀클리어|cetaphil gentle clear cleanser', '클렌징', 'salicylic-acid|glycerin|aloe', 'breakout|sebum', 'oily|combo|normal'),
  p('m016', '세라비', 'SA 스무딩 클렌저', '세라비 SA 클렌저|cerave sa smoothing cleanser', '클렌징', 'salicylic-acid|ceramide|hyaluronic-acid|niacinamide', 'texture|breakout|barrier', 'oily|combo|normal'),
  p('m017', '라로슈포제', '에팍라 마이크로 필링 퓨리파잉 젤', '에팍라 젤|effaclar micro peeling gel', '클렌징', 'salicylic-acid|lha|zinc-pca|thermal-water', 'sebum|breakout|texture', 'oily|combo'),
  p('m018', '비오더마', '세비엄 젤 무쌍 악티프', '세비엄 폼클렌저|sebium gel moussant actif', '클렌징', 'salicylic-acid|zinc-pca|glycerin', 'breakout|sebum', 'oily|combo'),
  p('m019', '이솝', '파슬리 씨드 페이셜 클렌징 오일', '이솝 클렌징오일|aesop parsley seed cleansing oil', '클렌징', 'sunflower-oil|olive-oil|citrus-oil|rosemary', 'dryness|texture', 'dry|normal|combo'),
  p('m020', '클리니크', '테이크 더 데이 오프 클렌징 밤', '테이크더데이오프|take the day off balm|TTDO', '클렌징', 'sunflower-oil|glycerin|tocopherol', 'dryness', 'dry|normal|combo|oily|sensitive'),
  p('m021', '파넬', '마일드 클렌징 오일', '판클 클렌징오일|fancl mild cleansing oil', '클렌징', 'sunflower-oil|squalane|glycerin', 'dryness|texture', 'dry|normal|combo|sensitive'),
  p('m022', '닥터브로너스', '퓨어 캐스틸 솝 티트리', '닥터브로너스 티트리|dr bronners tea tree castile soap', '클렌징', 'tea-tree|olive-oil|jojoba-oil', 'breakout|sebum', 'oily|combo'),
  p('m023', '프레쉬', '소이 페이스 클렌저', '소이 클렌저|fresh soy face cleanser', '클렌징', 'rose|aloe|glycerin|fragrance', 'dryness|barrier', 'dry|normal|combo'),
  p('m024', '뉴트로지나', '딥 클린 포밍 클렌저', '딥클린|neutrogena deep clean foaming', '클렌징', 'salicylic-acid|glycerin', 'sebum|breakout', 'oily|combo'),

  // ── 로션 ────────────────────────────────────────────────────────────────
  p('m025', '세타필', '데일리 어드밴스드 울트라 하이드레이팅 로션', '세타필 로션|cetaphil daily advance lotion', '로션', 'shea-butter|glycerin|panthenol|tocopherol', 'dryness|barrier', 'dry|sensitive|normal'),
  p('m026', '세라비', '모이스처라이징 로션', '세라비 로션|cerave moisturizing lotion', '로션', 'ceramide|hyaluronic-acid|glycerin', 'barrier|dryness', 'dry|normal|combo|sensitive'),
  p('m027', '피지오겔', 'DMT 페이셜 로션', '피지오겔 로션|physiogel dmt facial lotion', '로션', 'fatty-acids|squalane|shea-butter', 'barrier|dryness', 'dry|sensitive|normal'),
  p('m028', '하다라보', '고쿠쥰 히알루론산 유액', '고쿠쥰 유액|hada labo gokujyun milk', '로션', 'hyaluronic-acid|glycerin|squalane', 'dryness', 'dry|normal|combo|sensitive'),
  p('m029', '클리니크', '드라마티컬리 디퍼런트 모이스처라이징 로션+', 'DDML|노란로션|dramatically different lotion', '로션', 'glycerin|hyaluronic-acid|sunflower-oil', 'dryness|barrier', 'dry|normal|combo'),
  p('m030', '유세린', '더모퓨리파이어 오일 컨트롤 하이드레이팅 케어', '더모퓨리파이어 로션|eucerin dermopurifyer hydrating care', '로션', 'salicylic-acid|licochalcone|glycerin', 'sebum|breakout|dryness', 'oily|combo'),
  p('m031', '라로슈포제', '똘러리앙 센시티브 플루이드', '똘러리앙 플루이드|toleriane sensitive fluide', '로션', 'thermal-water|glycerin|niacinamide|ceramide', 'barrier|dryness', 'sensitive|combo|oily|normal'),
  p('m032', '한율', '어린쑥 수분진정 로션', '어린쑥 로션|hanyul artemisia lotion', '로션', 'mugwort|glycerin|betaine', 'barrier|dryness', 'dry|normal|combo'),

  // ── 크림 ────────────────────────────────────────────────────────────────
  p('m033', '설화수', '자음생크림', '자음생|sulwhasoo concentrated ginseng cream|자음생 크림', '크림', 'ginseng|squalane|peptides|fragrance', 'firming|dryness', 'dry|normal|combo'),
  p('m034', '후', '천기단 화현 크림', '천기단 크림|whoo cheongidan hwahyun cream', '크림', 'ginseng|peony|adenosine|fragrance', 'firming|dullness', 'dry|normal'),
  p('m035', '라프레리', '스킨 캐비어 럭스 크림', '캐비어 크림|la prairie skin caviar luxe cream', '크림', 'algae|peptides|glycerin|fragrance', 'firming|dryness', 'dry|normal'),
  p('m036', '라메르', '모이스처라이징 소프트 크림', '라메르 소프트크림|la mer soft cream', '크림', 'algae|petrolatum|glycerin|fragrance', 'dryness|barrier', 'dry|normal|combo'),
  p('m037', '에스티로더', '리바이탈라이징 슈프림+ 유스 파워 크림', '슈프림 크림|revitalizing supreme plus', '크림', 'peptides|hyaluronic-acid|black-tea|fragrance', 'firming|dryness', 'dry|normal|combo'),
  p('m038', '랑콤', '레네르지 H.P.N. 300 펩타이드 크림', '레네르지 크림|renergie hpn 300', '크림', 'peptides|niacinamide|hyaluronic-acid|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m039', '겔랑', '아베이 로얄 허니 트리트먼트 데이 크림', '아베이로얄 크림|abeille royale day cream', '크림', 'honey|peptides|glycerin|fragrance', 'firming|dryness', 'dry|normal'),
  p('m040', '헤라', '에이지 어웨이 콜라게닉 크림', '에이지어웨이|hera age away collagenic', '크림', 'collagen|peptides|adenosine|fragrance', 'firming|dryness', 'dry|normal|combo'),
  p('m041', '니베아', '니베아 크림', '니베아 틴|파란통|nivea creme', '크림', 'petrolatum|mineral-oil|glycerin|fragrance', 'dryness|barrier', 'dry|normal'),
  p('m042', '세라비', '모이스처라이징 크림', '세라비 크림|cerave moisturizing cream', '크림', 'ceramide|hyaluronic-acid|glycerin|petrolatum', 'barrier|dryness', 'dry|sensitive|normal'),
  p('m043', '유리아쥬', '제모스 크림', '제모스|uriage xemose creme', '크림', 'thermal-water|shea-butter|ceramide|cholesterol', 'barrier|dryness', 'dry|sensitive'),
  p('m044', '드렁크엘리펀트', '랄라 레트로 위핑 크림', '랄라레트로|lala retro whipped cream', '크림', 'ceramide|fatty-acids|squalane|glycerin', 'barrier|dryness', 'dry|normal|combo|sensitive'),
  p('m045', '닥터디퍼런트', '비타 A 나이트 크림', '비타A 나이트크림|dr different vita a night', '크림', 'retinol|niacinamide|hyaluronic-acid', 'firming|texture|breakout', 'oily|combo|normal'),
  p('m046', '록시땅', '이모르뗄 디바인 크림', '이모르뗄 크림|immortelle divine cream', '크림', 'peptides|shea-butter|fragrance', 'firming|dryness', 'dry|normal'),

  // ── 토너 ────────────────────────────────────────────────────────────────
  p('m047', '하다라보', '고쿠쥰 히알루론산 화장수', '고쿠쥰 로션|hada labo gokujyun lotion|고쿠쥰 토너', '토너', 'hyaluronic-acid|glycerin', 'dryness', 'dry|normal|combo|sensitive|oily'),
  p('m048', '무인양품', '민감피부용 화장수 고보습', '무지 화장수|muji toning water high moisture', '토너', 'glycerin|hyaluronic-acid|allantoin', 'dryness|barrier', 'sensitive|dry|normal'),
  p('m049', '더오디너리', '글라이콜릭 애씨드 7% 엑스폴리에이팅 토너', '글라이콜릭 토너|ordinary glycolic acid 7', '토너', 'glycolic-acid|aloe|ginseng', 'texture|dullness', 'oily|combo|normal'),
  p('m050', '코세', '세키세이 로션', '설기정|sekkisei lotion|세키세이 토너', '토너', 'rice-extract|pearl|glycerin|fragrance', 'dullness|dryness', 'dry|normal|combo'),
  p('m051', '폴라초이스', '스킨 퍼펙팅 2% BHA 리퀴드', '2% BHA|paulas choice bha liquid', '토너', 'salicylic-acid|green-tea', 'breakout|sebum|texture', 'oily|combo|normal'),
  p('m052', '프레쉬', '로즈 딥 하이드레이션 페이셜 토너', '로즈토너|fresh rose toner', '토너', 'rose|hyaluronic-acid|glycerin|fragrance', 'dryness|dullness', 'dry|normal|combo'),
  p('m053', '후', '공진향 인양 밸런서', '공진향 밸런서|whoo gongjinhyang balancer', '토너', 'ginseng|peony|fragrance', 'dullness|dryness', 'dry|normal|combo'),
  p('m054', '한율', '어린쑥 수분진정 토너', '어린쑥 토너|hanyul artemisia toner', '토너', 'mugwort|glycerin|betaine', 'barrier|dryness', 'dry|normal|combo'),
  p('m055', '숨37', '워터풀 스킨 리프레셔', '워터풀 토너|sum37 water-full refresher', '토너', 'yeast-extract|hyaluronic-acid|birch-sap|fragrance', 'dryness|dullness', 'dry|normal|combo'),
  p('m056', '아이유니크', '티트리 릴리프 토너', '티트리 토너|iunik tea tree relief toner', '토너', 'tea-tree|centella|hyaluronic-acid', 'breakout|sebum', 'oily|combo|normal'),

  // ── 세럼 ────────────────────────────────────────────────────────────────
  p('m057', '에스티로더', '퍼펙셔니스트 프로 래피드 브라이트닝 트리트먼트', '퍼펙셔니스트 프로|perfectionist pro brightening', '세럼', 'ascorbic-acid|ferulic-acid|niacinamide|fragrance', 'pigmentation|dullness', 'normal|combo|dry|oily'),
  p('m058', '랑콤', '레네르지 트리플 세럼', '트리플 세럼|renergie triple serum', '세럼', 'hyaluronic-acid|niacinamide|ferulic-acid|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m059', '시세이도', '바이탈 퍼펙션 리프트디파인 래디언스 세럼', '바이탈퍼펙션 세럼|vital perfection serum', '세럼', 'peptides|niacinamide|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m060', '키엘', '레티놀 스킨 리뉴잉 데일리 마이크로도즈 세럼', '마이크로도즈 레티놀|kiehls micro-dose retinol', '세럼', 'retinol|ceramide|peptides', 'firming|texture', 'normal|combo|dry|oily'),
  p('m061', '드렁크엘리펀트', 'C-퍼미 프레시 데이 세럼', 'C퍼미|drunk elephant c-firma', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol', 'pigmentation|dullness', 'normal|combo|dry'),
  p('m062', '더오디너리', '락틱 애씨드 10% + HA', '락틱애씨드 10|ordinary lactic acid 10', '세럼', 'lactic-acid|hyaluronic-acid', 'texture|dullness', 'dry|normal|combo'),
  p('m063', '더오디너리', '아젤라익 애씨드 서스펜션 10%', '아젤라익 10|ordinary azelaic acid', '세럼', 'azelaic-acid|dimethicone', 'pigmentation|breakout|texture', 'oily|combo|normal'),
  p('m064', '폴라초이스', '클리니컬 1% 레티놀 트리트먼트', '1% 레티놀|paulas choice clinical retinol', '세럼', 'retinol|peptides|licorice', 'firming|texture|pigmentation', 'normal|combo|dry'),
  p('m065', '리쥬란', '힐러 턴오버 세럼', '리쥬란 세럼|rejuran healer turnover serum', '세럼', 'pdrn|hyaluronic-acid|panthenol', 'firming|texture|barrier', 'dry|normal|combo|sensitive'),
  p('m066', '오휘', '에이지 리커버리 세럼', '에이지 리커버리|ohui age recovery serum', '세럼', 'adenosine|peptides|collagen|fragrance', 'firming|dryness', 'dry|normal|combo'),
  p('m067', '디올', '캡춰 토탈 르 세럼', '캡춰토탈 르 세럼|capture totale le serum', '세럼', 'peptides|hyaluronic-acid|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m068', '뉴트로지나', '래피드 링클 리페어 세럼', '래피드 링클 리페어|neutrogena rapid wrinkle repair', '세럼', 'retinol|hyaluronic-acid|glycerin', 'firming|texture', 'normal|combo|dry'),

  // ── 앰플 ────────────────────────────────────────────────────────────────
  p('m069', '아이오페', '스템3 앰플', '스템3|iope stem 3 ampoule|스템쓰리', '앰플', 'peptides|adenosine|hyaluronic-acid', 'firming|dullness', 'dry|normal|combo|oily'),
  p('m070', '바이오힐보', '프로바이오덤 리프팅 앰플', '프로바이오덤 앰플|probioderm lifting ampoule', '앰플', 'lactobacillus|collagen|peptides', 'firming|barrier', 'dry|normal|combo|sensitive'),
  p('m071', '셀랩', '티트리 진정 앰플', '셀랩 티트리|cellab tea tree ampoule', '앰플', 'tea-tree|centella|panthenol', 'breakout|sebum', 'oily|combo|normal'),
  p('m072', '제이엠솔루션', '액티브 핑크 스네일 브라이트닝 앰플', '핑크스네일 앰플|jm solution pink snail', '앰플', 'snail-mucin|niacinamide|hyaluronic-acid', 'texture|dullness|dryness', 'dry|normal|combo'),
  p('m073', '클리니크', '프레시 프레스드 오버나이트 부스터 위드 퓨어 레티놀', '프레시프레스드 레티놀|fresh pressed retinol booster', '앰플', 'retinol|glycerin|tocopherol', 'firming|texture', 'normal|combo|dry'),
  p('m074', '아모레퍼시픽', '타임 레스폰스 스킨 리저브 앰플', '타임레스폰스 앰플|amorepacific time response ampoule', '앰플', 'green-tea|peptides|adenosine|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m075', '숨37', '시크릿 리페어 컨센트레이티드 앰플', '시크릿 앰플|sum37 secret repair ampoule', '앰플', 'yeast-extract|lactobacillus|peptides|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m076', 'AHC', '프리미엄 하이드라 B5 앰플', 'B5 앰플|ahc hydra b5 ampoule', '앰플', 'panthenol|hyaluronic-acid|betaine', 'dryness|barrier', 'dry|normal|combo|sensitive|oily'),

  // ── 에센스 ──────────────────────────────────────────────────────────────
  p('m077', 'SK-II', '스킨파워 에센스', '스킨파워 에센스|sk2 skinpower essence', '에센스', 'galactomyces|niacinamide|hyaluronic-acid', 'firming|dullness', 'dry|normal|combo'),
  p('m078', '헤라', '셀 에센스', '셀에센스|hera cell essence', '에센스', 'bifida|hyaluronic-acid|fragrance', 'dryness|dullness', 'dry|normal|combo|oily'),
  p('m079', '아모레퍼시픽', '빈티지 싱글 익스트랙트 에센스', '빈티지 에센스|amorepacific vintage single extract', '에센스', 'green-tea|glycerin|fragrance', 'dullness|dryness', 'dry|normal|combo'),
  p('m080', '아스타리프트', '제리 아쿠아리스타', '제리|astalift jelly aquarysta|아스타리프트 젤리', '에센스', 'astaxanthin|ceramide|collagen', 'firming|dryness', 'dry|normal|combo'),
  p('m081', '파넬', '액티브 컨디셔닝 EX 에센스', '판클 에센스|fancl active conditioning ex', '에센스', 'collagen|hyaluronic-acid|glycerin', 'dryness|firming', 'dry|normal|sensitive|combo'),
  p('m082', '오휘', '더 퍼스트 제니츄어 심마이크로 에센스', '더퍼스트 에센스|ohui the first geniture', '에센스', 'peptides|adenosine|glycerin|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('m083', '비오템', '라이프 플랑크톤 엘릭서', '라이프플랑크톤|life plankton elixir', '에센스', 'yeast-extract|hyaluronic-acid|fragrance', 'barrier|dullness', 'dry|normal|combo|oily'),
  p('m084', '이솝', '루센트 페이셜 컨센트레이트', '루센트|aesop lucent facial concentrate', '에센스', 'ascorbyl-glucoside|hyaluronic-acid|glycerin|fragrance', 'dullness|dryness', 'dry|normal|combo'),

  // ── 패드 ────────────────────────────────────────────────────────────────
  p('m085', '뉴트로지나', '래피드 클리어 트리트먼트 패드', '래피드클리어 패드|neutrogena rapid clear pads', '패드', 'salicylic-acid|glycerin', 'breakout|sebum', 'oily|combo'),
  p('m086', '라운드어라운드', '그린티 PHA 토닝 패드', '라운드어라운드 패드|round around green tea pha pad', '패드', 'gluconolactone|green-tea|centella', 'texture|sebum', 'oily|combo|normal|sensitive'),
  p('m087', '바이오힐보', '프로바이오덤 필링 패드', '프로바이오덤 패드|probioderm peeling pad', '패드', 'lactic-acid|lactobacillus|panthenol', 'texture|barrier', 'dry|normal|combo'),

  // ── 마스크 ──────────────────────────────────────────────────────────────
  p('m088', '닥터자르트', '시카페어 슬리페어 인텐시브 마스크', '시카페어 슬리핑마스크|cicapair sleepair mask', '마스크', 'centella|madecassoside|panthenol', 'barrier|breakout', 'sensitive|dry|normal|combo'),
  p('m089', '오리진스', '아웃 오브 트러블 10 미닛 마스크', '아웃오브트러블|origins out of trouble mask', '마스크', 'sulfur|zinc-oxide|salicylic-acid|kaolin', 'breakout|sebum', 'oily|combo'),
  p('m090', '프레쉬', '로즈 페이스 마스크', '로즈마스크|fresh rose face mask', '마스크', 'rose|hyaluronic-acid|fragrance', 'dryness|dullness', 'dry|normal|combo'),
  p('m091', '아벤느', '클리낭스 마스크', '클리낭스 마스크|avene cleanance mask', '마스크', 'glycolic-acid|kaolin|thermal-water', 'texture|sebum', 'oily|combo'),
  p('m092', '드렁크엘리펀트', 'T.L.C. 베이비페이셜 25% AHA + 2% BHA 마스크', '베이비페이셜|drunk elephant babyfacial', '마스크', 'glycolic-acid|lactic-acid|salicylic-acid|chamomile', 'texture|dullness', 'oily|combo|normal'),
  p('m093', '코세', '클리어턴 에센스 마스크', '클리어턴|kose clear turn mask', '마스크', 'hyaluronic-acid|collagen|glycerin', 'dryness', 'dry|normal|combo|sensitive'),

  // ── 아이크림 ────────────────────────────────────────────────────────────
  p('m094', '설화수', '진설 아이크림', '진설 아이|sulwhasoo timetreasure eye', '아이크림', 'ginseng|peptides|adenosine|fragrance', 'firming|dryness', 'dry|normal|combo'),
  p('m095', '에스티로더', '어드밴스드 나이트 리페어 아이 슈퍼차지드 젤 크림', 'ANR 아이|갈색병 아이크림|anr eye gel cream', '아이크림', 'bifida|hyaluronic-acid|caffeine', 'firming|dullness', 'dry|normal|combo|oily'),
  p('m096', '키엘', '크리미 아이 트리트먼트 위드 아보카도', '아보카도 아이크림|kiehls avocado eye', '아이크림', 'shea-butter|glycerin|tocopherol', 'dryness', 'dry|normal|combo|sensitive'),
  p('m097', 'AHC', '에이지리스 리얼 아이크림 포 페이스', '에이지리스 아이크림|ahc ageless eye cream', '아이크림', 'peptides|adenosine|collagen|niacinamide', 'firming', 'dry|normal|combo|oily'),
  p('m098', '폴라초이스', '클리니컬 0.01% 레티놀 아이크림', '레티놀 아이크림|paulas choice retinol eye', '아이크림', 'retinol|peptides|shea-butter', 'firming', 'dry|normal|combo'),
  p('m099', '라로슈포제', '레더믹 R 아이', '레더믹 아이|redermic r eyes', '아이크림', 'retinol|caffeine|thermal-water', 'firming|texture', 'normal|combo|dry'),

  // ── 오일 ────────────────────────────────────────────────────────────────
  p('m100', '드렁크엘리펀트', '버진 마룰라 럭셔리 페이셜 오일', '마룰라 오일|drunk elephant marula oil', '오일', 'fatty-acids|tocopherol|squalane', 'dryness|barrier', 'dry|normal|combo'),
  p('m101', '클라란스', '로터스 페이스 트리트먼트 오일', '로터스 오일|clarins lotus face oil', '오일', 'jojoba-oil|rosemary|fragrance', 'sebum|dryness', 'combo|oily'),
  p('m102', '이솝', '페이블러스 페이스 오일', '페이블러스|aesop fabulous face oil', '오일', 'jojoba-oil|camellia-oil|lavender-oil', 'dryness', 'dry|normal|combo'),
  p('m103', '설화수', '윤조 페이셜 오일', '윤조 오일|sulwhasoo first care facial oil', '오일', 'camellia-oil|squalane|fragrance', 'dryness|dullness', 'dry|normal'),

  // ── 미스트 ──────────────────────────────────────────────────────────────
  p('m104', '산타마리아노벨라', '아쿠아 디 로즈', '아쿠아디로즈|santa maria novella acqua di rose|장미수', '미스트', 'rose|alcohol-denat|fragrance', 'dullness|dryness', 'normal|dry|combo'),
  p('m105', '유리아쥬', '오 떼르말 미스트', '유리아쥬 떼르말워터|uriage eau thermale', '미스트', 'thermal-water|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo|oily'),
  p('m106', '비쉬', '미네랄라이징 떼르말 워터', '비쉬 볼카닉 워터|vichy mineralizing thermal water', '미스트', 'thermal-water|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo|oily'),
  p('m107', '라운드어라운드', '그린티 수분 미스트', '라운드어라운드 미스트|round around green tea mist', '미스트', 'green-tea|hyaluronic-acid|glycerin', 'dryness|sebum', 'oily|combo|normal|sensitive'),

  // ── 필링 ────────────────────────────────────────────────────────────────
  p('m108', '큐어', '내추럴 아쿠아 젤', '큐어 필링젤|cure natural aqua gel', '필링', 'aloe|rosemary|glycerin', 'texture', 'dry|normal|combo|oily'),
  p('m109', '더오디너리', 'AHA 30% + BHA 2% 필링 솔루션', '피 마스크|ordinary aha bha peeling solution|빨간 필링', '필링', 'glycolic-acid|lactic-acid|salicylic-acid|hyaluronic-acid', 'texture|dullness', 'oily|combo|normal'),
  p('m110', '폴라초이스', '스킨 퍼펙팅 8% AHA 젤', '8% AHA|paulas choice aha gel', '필링', 'glycolic-acid|chamomile|green-tea', 'texture|dullness', 'normal|combo|dry'),
  p('m111', '비오더마', '세비엄 나이트 필', '세비엄 나이트필|sebium night peel', '필링', 'glycolic-acid|zinc-pca|glycerin', 'texture|sebum', 'oily|combo'),

  // ── 베이스 ──────────────────────────────────────────────────────────────
  p('m112', '정샘물', '뷰티 스킨 세팅 톤업 선 베이스', '톤업 선베이스|jungsaemmool tone up sun base', '베이스', 'titanium-dioxide|zinc-oxide|niacinamide', 'pigmentation|dullness', 'dry|normal|combo|oily'),
  p('m113', '닥터자르트', '프리미어 BB 뷰티 밤', '닥터자르트 BB|dr jart premium bb', '베이스', 'titanium-dioxide|uvinul-a-plus|adenosine|niacinamide', 'pigmentation|dullness', 'normal|combo|dry|oily'),
  p('m114', '디올', '포에버 스킨 베일', '스킨베일 프라이머|dior forever skin veil', '베이스', 'titanium-dioxide|glycerin|fragrance', 'pigmentation|dullness', 'normal|dry|combo'),
  p('m115', '비오레', 'UV 아쿠아리치 라이트업 에센스', '아쿠아리치 라이트업|biore uv aqua rich light up', '베이스', 'uvinul-a-plus|uvinul-t150|hyaluronic-acid', 'pigmentation|dullness', 'oily|combo|normal'),
];
