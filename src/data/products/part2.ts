import type { Product } from '@/types';
import { p } from './_helper';

/** 올리브영·로드숍 브랜드 확장 라인업 — 데모/미검증 데이터 */
export const PRODUCTS_PART2: Product[] = [
  // ── 크림 (14) ──────────────────────────────────────────────
  p('n001', '토리든', '다이브인 저분자 히알루론산 수딩 크림', '다이브인크림|torriden dive-in cream', '크림', 'hyaluronic-acid|panthenol|allantoin|ceramide', 'dryness|barrier', 'dry|combo|sensitive'),
  p('n002', '아이오페', '레티놀 엑스퍼트 크림', '레티놀크림|iope retinol expert cream', '크림', 'retinol|adenosine|ceramide|panthenol', 'firming|texture', 'dry|normal|combo'),
  p('n003', '메디큐브', '콜라겐 젤리 크림', '콜라겐젤리크림|medicube collagen jelly', '크림', 'collagen|hyaluronic-acid|niacinamide|peptides', 'firming|dryness', 'dry|normal|combo|oily'),
  p('n004', '메디큐브', '레드 이레이징 크림', '레드이레이징|medicube red erasing cream', '크림', 'salicylic-acid|centella|tea-tree|zinc-pca', 'breakout|sebum', 'oily|combo'),
  p('n005', '어퓨', '글리콜릭 애씨드 크림', '글리콜릭크림|apieu glycolic acid cream|AHA크림', '크림', 'glycolic-acid|hyaluronic-acid|panthenol', 'texture|dullness', 'normal|combo|oily'),
  p('n006', '셀리맥스', '더 리얼 노니 에너지 리페어 크림', '노니크림|celimax noni repair cream', '크림', 'ceramide|squalane|shea-butter|tocopherol', 'dryness|barrier', 'dry|normal|sensitive'),
  p('n007', '아이소이', '블레미쉬 케어 업 크림', '블레미쉬크림|isoi blemish care up', '크림', 'rose|centella|niacinamide|lavender-oil', 'breakout|pigmentation', 'combo|oily|normal'),
  p('n008', '구달', '어성초 진정 수분 크림', '어성초크림|goodal heartleaf calming cream', '크림', 'houttuynia|panthenol|hyaluronic-acid|centella', 'breakout|dryness|barrier', 'dry|combo|oily|sensitive'),
  p('n009', '달바', '화이트 트러플 안티링클 크림', '트러플크림|dalba white truffle cream', '크림', 'peptides|adenosine|bakuchiol|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('n010', '퓨리토', '센텔라 언센티드 리커버리 크림', '센텔라리커버리크림|purito centella unscented', '크림', 'centella|madecassoside|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|combo|normal'),
  p('n011', '비욘드', '엔젤 아쿠아 수분 진정 크림', '엔젤아쿠아크림|beyond angel aqua', '크림', 'aloe|hyaluronic-acid|ceramide|panthenol', 'dryness|barrier', 'dry|combo|normal|sensitive'),
  p('n012', '마몽드', '로즈 워터 젤 크림', '로즈워터젤크림|mamonde rose water gel cream', '크림', 'rose|hyaluronic-acid|glycerin', 'dryness|dullness', 'normal|combo|oily'),
  p('n013', '에뛰드', '순정 2x 배리어 인텐시브 크림', '순정크림|etude soonjung 2x barrier', '크림', 'panthenol|madecassoside|ceramide|shea-butter', 'barrier|dryness', 'sensitive|dry|normal'),
  p('n014', '홀리카홀리카', '굿 세라 슈퍼 세라마이드 크림', '굿세라크림|holika good cera cream', '크림', 'ceramide|cholesterol|fatty-acids|shea-butter', 'barrier|dryness', 'dry|sensitive|normal'),

  // ── 선크림 (14) ────────────────────────────────────────────
  p('n015', '토리든', '솔리드인 세라마이드 선크림', '솔리드인선크림|torriden solid-in sunscreen', '선크림', 'uvinul-a-plus|uvinul-t150|ceramide|panthenol', 'barrier|pigmentation', 'dry|normal|sensitive'),
  p('n016', '스킨1004', '마다가스카르 센텔라 에어핏 선크림 라이트', '에어핏선크림|skin1004 air-fit sun|센텔라선크림', '선크림', 'uvinul-a-plus|tinosorb-s|centella|hyaluronic-acid', 'pigmentation|breakout', 'oily|combo|normal'),
  p('n017', '라운드랩', '자작나무 수분 선크림', '자작나무선크림|round lab birch sun', '선크림', 'uvinul-a-plus|uvinul-t150|birch-sap|hyaluronic-acid', 'pigmentation|dryness', 'dry|normal|combo|sensitive'),
  p('n018', '조선미녀', '맑은쌀 선스틱', '맑은쌀선스틱|beauty of joseon rice sun stick|선스틱', '선크림', 'uvinul-a-plus|tinosorb-s|rice-extract|niacinamide', 'pigmentation|dullness', 'normal|combo|oily|dry'),
  p('n019', '이니스프리', '데일리 UV 디펜스 선크림', '데일리UV|innisfree daily uv defense', '선크림', 'uvinul-a-plus|uvinul-t150|green-tea|hyaluronic-acid', 'pigmentation|sebum', 'oily|combo|normal'),
  p('n020', '닥터지', '브라이트닝 업 선 플러스', '브라이트닝업선|dr.g brightening up sun', '선크림', 'titanium-dioxide|zinc-oxide|niacinamide|centella', 'pigmentation|dullness', 'sensitive|dry|normal|combo'),
  p('n021', '티르티르', '마일드 데일리 선크림', '티르티르선크림|tirtir mild daily sun', '선크림', 'zinc-oxide|titanium-dioxide|centella|allantoin', 'pigmentation|barrier', 'sensitive|dry|combo|normal'),
  p('n022', '라네즈', '워터뱅크 블루 히알루로닉 선세럼', '워터뱅크선세럼|laneige water bank sun serum', '선크림', 'uvinul-a-plus|tinosorb-s|hyaluronic-acid|algae', 'pigmentation|dryness', 'dry|normal|combo'),
  p('n023', '미샤', '올 어라운드 세이프 블록 워터프루프 선 밀크', '워터프루프선밀크|missha safe block waterproof', '선크림', 'uvinul-t150|avobenzone|tinosorb-s|fragrance', 'pigmentation|sebum', 'oily|combo|normal'),
  p('n024', '아이오페', 'UV 쉴드 선 프로텍터', 'UV쉴드|iope uv shield', '선크림', 'uvinul-a-plus|uvinul-t150|adenosine|fragrance', 'pigmentation|firming', 'normal|combo|dry'),
  p('n025', '더페이스샵', '내추럴 선 에코 파워 롱라스팅 선크림', '내추럴선에코|faceshop natural sun eco|파워롱라스팅', '선크림', 'avobenzone|uvinul-t150|tocopherol|fragrance', 'pigmentation', 'normal|combo|oily'),
  p('n026', '비플레인', '시카 진정 선크림', '비플레인선크림|beplain cica sunscreen', '선크림', 'zinc-oxide|titanium-dioxide|centella|panthenol', 'pigmentation|barrier|breakout', 'sensitive|combo|oily|normal'),
  p('n027', '에스네이처', '아쿠아 스쿠알란 선크림', '스쿠알란선크림|snature aqua squalane sun', '선크림', 'uvinul-a-plus|tinosorb-s|squalane|glycerin', 'pigmentation|dryness', 'dry|normal|sensitive'),
  p('n028', '마몽드', '에브리데이 워터리 선크림', '에브리데이선크림|mamonde everyday watery sun', '선크림', 'uvinul-a-plus|uvinul-t150|rose|glycerin', 'pigmentation|dryness', 'normal|combo|dry'),

  // ── 클렌징 (10) ────────────────────────────────────────────
  p('n029', '아누아', '어성초 퀘르세티놀 포어 딥 클렌징폼', '어성초클렌징폼|anua heartleaf cleansing foam|퀘르세티놀', '클렌징', 'houttuynia|salicylic-acid|betaine|glycerin', 'breakout|sebum', 'oily|combo|normal'),
  p('n030', '마녀공장', '허브 그린 클렌징 오일', '허브그린오일|manyo herb green cleansing oil', '클렌징', 'olive-oil|tea-tree|rosemary|jojoba-oil', 'sebum|breakout', 'oily|combo|normal'),
  p('n031', '코스알엑스', '약산성 굿모닝 젤 클렌저', '굿모닝클렌저|cosrx low ph good morning', '클렌징', 'tea-tree|betaine|salicylic-acid|allantoin', 'sebum|breakout', 'oily|combo|normal'),
  p('n032', '이니스프리', '그린티 아미노 클렌징폼', '그린티클렌징폼|innisfree green tea amino cleanser', '클렌징', 'green-tea|glycerin|betaine', 'dryness|sebum', 'dry|normal|combo|sensitive'),
  p('n033', '스킨1004', '마다가스카르 센텔라 앰플 폼', '센텔라앰플폼|skin1004 ampoule foam', '클렌징', 'centella|glycerin|hyaluronic-acid', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('n034', '헤이미쉬', '올 클린 그린 폼', '올클린그린폼|heimish all clean green foam', '클렌징', 'green-tea|glycerin|betaine|tea-tree', 'sebum|breakout', 'oily|combo|normal'),
  p('n035', '바닐라코', '클린 잇 제로 클렌징 밤 포어 클래리파잉', '클린잇제로포어|banila clean it zero pore clarifying', '클렌징', 'salicylic-acid|zinc-pca|jojoba-oil|glycerin', 'sebum|breakout', 'oily|combo'),
  p('n036', '라운드랩', '1025 독도 클렌저', '독도클렌저|round lab dokdo cleanser', '클렌징', 'glycerin|betaine|panthenol|allantoin', 'barrier|dryness', 'dry|normal|combo|oily|sensitive'),
  p('n037', '에스트라', '아토배리어 365 버블 클렌저', '아토배리어클렌저|aestura atobarrier bubble cleanser', '클렌징', 'ceramide|glycerin|betaine', 'barrier|dryness', 'sensitive|dry|normal'),
  p('n038', '아크네스', '약산성 클렌징 폼', '아크네스클렌저|acnes cleansing foam', '클렌징', 'salicylic-acid|tea-tree|glycerin|zinc-pca', 'breakout|sebum', 'oily|combo'),

  // ── 로션 (8) ───────────────────────────────────────────────
  p('n039', '일리윤', '프로바이오틱스 스킨 배리어 로션', '프로바이오틱스로션|illiyoon probiotics lotion', '로션', 'lactobacillus|ceramide|panthenol|glycerin', 'barrier|dryness', 'dry|sensitive|normal|combo'),
  p('n040', '토리든', '다이브인 저분자 히알루론산 수딩 로션', '다이브인로션|torriden dive-in lotion', '로션', 'hyaluronic-acid|panthenol|allantoin|beta-glucan', 'dryness|barrier', 'dry|combo|normal|sensitive'),
  p('n041', '스킨1004', '마다가스카르 센텔라 프로바이오 시카 로션', '프로바이오시카로션|skin1004 probio cica lotion', '로션', 'centella|lactobacillus|ceramide|squalane', 'barrier|breakout', 'sensitive|dry|combo|normal'),
  p('n042', '아토팜', '수딩 젤 로션', '아토팜젤로션|atopalm soothing gel lotion', '로션', 'ceramide|panthenol|allantoin|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('n043', '제로이드', '수딩 로션', '제로이드로션|zeroid soothing lotion', '로션', 'ceramide|cholesterol|fatty-acids|panthenol', 'barrier|dryness', 'sensitive|dry|normal'),
  p('n044', '리얼베리어', '익스트림 로션', '익스트림로션|real barrier extreme lotion', '로션', 'ceramide|cholesterol|fatty-acids|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('n045', '프리메라', '알파인 베리 워터리 로션', '알파인베리로션|primera alpine berry lotion', '로션', 'hyaluronic-acid|glycerin|fragrance|tocopherol', 'dryness|dullness', 'normal|combo|oily'),
  p('n046', '더페이스샵', '라이스 앤 세라마이드 모이스처 에멀전', '라이스세라마이드에멀전|faceshop rice ceramide emulsion', '로션', 'rice-extract|ceramide|glycerin|fragrance', 'dryness|dullness', 'dry|normal|combo'),

  // ── 토너 (10) ──────────────────────────────────────────────
  p('n047', '아누아', '쌀 70 글로우 밀키 토너', '쌀토너|anua rice 70 milky toner', '토너', 'rice-extract|niacinamide|hyaluronic-acid|panthenol', 'dullness|dryness', 'dry|normal|combo|sensitive'),
  p('n048', '넘버즈인', '3번 광 채우는 에센스 토너', '3번토너|numbuzin no.3 glowing essence toner', '토너', 'galactomyces|niacinamide|hyaluronic-acid|bifida', 'dullness|texture', 'normal|combo|dry|oily'),
  p('n049', '코스알엑스', 'AHA/BHA 클라리파잉 트리트먼트 토너', 'AHA BHA토너|cosrx aha bha toner', '토너', 'glycolic-acid|salicylic-acid|allantoin|panthenol', 'texture|sebum|breakout', 'oily|combo|normal'),
  p('n050', '이즈앤트리', '히알루로닉 애씨드 토너', '히알루론산토너|isntree hyaluronic acid toner', '토너', 'hyaluronic-acid|betaine|glycerin|trehalose', 'dryness', 'dry|normal|combo|oily|sensitive'),
  p('n051', '하루하루원더', '허니 그린 카밍 토너', '허니그린토너|haruharu honey green toner', '토너', 'honey|green-tea|centella|panthenol', 'breakout|dryness', 'combo|oily|normal|sensitive'),
  p('n052', '아비브', '어성초 카밍 토너', '아비브어성초토너|abib heartleaf calming toner', '토너', 'houttuynia|panthenol|betaine|allantoin', 'breakout|barrier', 'sensitive|combo|oily|normal'),
  p('n053', '에스네이처', '아쿠아 오아시스 토너', '아쿠아오아시스토너|snature aqua oasis toner', '토너', 'squalane|hyaluronic-acid|glycerin|trehalose', 'dryness|barrier', 'dry|normal|sensitive|combo'),
  p('n054', '마녀공장', '비피다 바이옴 아쿠아 토너', '비피다토너|manyo bifida biome toner', '토너', 'bifida|galactomyces|hyaluronic-acid|panthenol', 'barrier|dullness', 'normal|dry|combo'),
  p('n055', '브링그린', '티트리 시카 수딩 토너', '티트리시카토너|bring green tea tree cica toner', '토너', 'tea-tree|centella|houttuynia|panthenol', 'breakout|sebum', 'oily|combo'),
  p('n056', '네이처리퍼블릭', '알로에 베라 92% 수딩 토너', '알로에토너|nature republic aloe toner', '토너', 'aloe|glycerin|betaine|fragrance', 'dryness|breakout', 'normal|combo|oily|dry'),

  // ── 세럼 (12) ──────────────────────────────────────────────
  p('n057', '아누아', 'PDRN 히알루론산 캡슐 100 세럼', 'PDRN세럼|anua pdrn serum|캡슐100', '세럼', 'pdrn|hyaluronic-acid|niacinamide|peptides', 'firming|texture|dryness', 'dry|normal|combo'),
  p('n058', '넘버즈인', '3번 결광 스킨 소프닝 세럼', '3번세럼|numbuzin no.3 skin softening serum', '세럼', 'galactomyces|niacinamide|hyaluronic-acid|gluconolactone', 'texture|dullness', 'normal|combo|oily|dry'),
  p('n059', '코스알엑스', '더 비타민 C 13 세럼', '비타민C13|cosrx vitamin c 13', '세럼', 'ascorbic-acid|tocopherol|hyaluronic-acid|allantoin', 'pigmentation|dullness', 'normal|combo|oily'),
  p('n060', '에스트라', '에이시카 365 세럼', '에이시카세럼|aestura a-cica 365 serum', '세럼', 'centella|madecassoside|ceramide|panthenol', 'barrier|breakout', 'sensitive|dry|combo|normal'),
  p('n061', '스킨앤랩', '비타민 C 브라이트닝 세럼', '스킨앤랩비타민C|skin and lab vitamin c serum', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol|niacinamide', 'pigmentation|dullness', 'normal|combo|oily'),
  p('n062', '이니스프리', '비타 C 그린티 엔자임 브라이트 세럼', '비타C그린티세럼|innisfree vitamin c green tea enzyme serum', '세럼', 'ascorbic-acid|green-tea|papain|niacinamide', 'dullness|pigmentation|texture', 'normal|combo|oily'),
  p('n063', '마녀공장', '레티놀 부스팅 세럼', '마녀공장레티놀|manyo retinol boosting serum', '세럼', 'retinol|bakuchiol|panthenol|squalane', 'firming|texture', 'normal|combo|dry'),
  p('n064', '아이오페', '레티놀 슈퍼 바운스 세럼', '레티놀슈퍼바운스|iope retinol super bounce', '세럼', 'retinol|hpr|adenosine|panthenol', 'firming|texture|pigmentation', 'normal|dry|combo'),
  p('n065', '헉슬리', '세럼 그랩 워터', '그랩워터|huxley grab water serum', '세럼', 'hyaluronic-acid|glycerin|sodium-pca|fragrance', 'dryness|dullness', 'dry|normal|combo|oily'),
  p('n066', '시드물', '만델릭 애씨드 5% 세럼', '만델릭세럼|sidmool mandelic acid serum', '세럼', 'mandelic-acid|hyaluronic-acid|panthenol', 'texture|breakout', 'oily|combo|normal'),
  p('n067', '브링그린', '징크 티트리 세럼', '징크티트리|bring green zinc tea tree serum', '세럼', 'zinc-pca|tea-tree|centella|niacinamide', 'breakout|sebum', 'oily|combo'),
  p('n068', '더마토리', '하이포알러제닉 시카 레스큐 세럼', '더마토리시카세럼|dermatory cica rescue serum', '세럼', 'centella|madecassoside|panthenol|beta-glucan', 'barrier|breakout', 'sensitive|dry|combo|normal'),

  // ── 앰플 (10) ──────────────────────────────────────────────
  p('n069', '웰라쥬', '리얼 히알루로닉 원데이 키트', '원데이키트|wellage one day kit|히알루로닉키트', '앰플', 'hyaluronic-acid|collagen|glycerin', 'dryness|texture', 'dry|normal|combo|oily|sensitive'),
  p('n070', '메디큐브', '제로 모공 앰플', '제로모공앰플|medicube zero pore ampoule', '앰플', 'niacinamide|salicylic-acid|zinc-pca|lha', 'sebum|texture|breakout', 'oily|combo'),
  p('n071', '메디필', '펩타이드 9 볼륨 앰플', '펩타이드9|medi-peel peptide 9 ampoule', '앰플', 'peptides|adenosine|hyaluronic-acid|collagen', 'firming|dryness', 'dry|normal|combo'),
  p('n072', '에센허브', '티트리 90 진정 앰플', '티트리90|essenherb tea tree 90', '앰플', 'tea-tree|centella|panthenol|zinc-pca', 'breakout|sebum', 'oily|combo'),
  p('n073', '스킨1004', '마다가스카르 센텔라 포어마이징 프레시 앰플', '포어마이징앰플|skin1004 poremizing ampoule', '앰플', 'houttuynia|salicylic-acid|centella|zinc-pca', 'sebum|breakout|texture', 'oily|combo'),
  p('n074', '셀리맥스', '듀얼 배리어 스킨 웨어러블 앰플', '듀얼배리어앰플|celimax dual barrier ampoule', '앰플', 'ceramide|panthenol|hyaluronic-acid|beta-glucan', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('n075', 'VT', '리들샷 100', '리들샷|vt reedle shot 100|리들샷100', '앰플', 'cellulose|centella|madecassoside|hyaluronic-acid', 'texture|firming', 'normal|combo|oily'),
  p('n076', '닥터지', '레드 블레미쉬 클리어 수딩 앰플', '레드블레미쉬앰플|dr.g red blemish ampoule', '앰플', 'centella|madecassoside|panthenol|houttuynia', 'breakout|barrier', 'sensitive|combo|oily|normal'),
  p('n077', '토리든', '셀메이징 저분자 콜라겐 앰플', '셀메이징앰플|torriden cellmazing collagen ampoule', '앰플', 'collagen|peptides|adenosine|hyaluronic-acid', 'firming|dryness', 'dry|normal|combo|sensitive'),
  p('n078', '아누아', '아젤라익 애씨드 10 하이알루론 앰플', '아젤라익앰플|anua azelaic acid 10', '앰플', 'azelaic-acid|hyaluronic-acid|panthenol|allantoin', 'breakout|pigmentation|sebum', 'oily|combo|normal'),

  // ── 에센스 (6) ─────────────────────────────────────────────
  p('n079', '미샤', '타임 레볼루션 아르테미시아 트리트먼트 에센스', '아르테미시아에센스|missha artemisia essence|쑥에센스', '에센스', 'mugwort|panthenol|allantoin', 'breakout|barrier', 'sensitive|combo|dry|normal'),
  p('n080', '마녀공장', '갈락 나이아신 2.0 에센스', '갈락나이아신|manyo galac niacin 2.0', '에센스', 'galactomyces|niacinamide|hyaluronic-acid|adenosine', 'dullness|texture|pigmentation', 'normal|combo|oily|dry'),
  p('n081', '프리메라', '미라클 씨드 에센스', '미라클씨드|primera miracle seed essence', '에센스', 'yeast-extract|hyaluronic-acid|glycerin|fragrance', 'dullness|dryness', 'normal|dry|combo'),
  p('n082', '헉슬리', '에센스 브라이틀리 에버 애프터', '브라이틀리에버애프터|huxley brightly ever after', '에센스', 'niacinamide|tocopherol|hyaluronic-acid|fragrance', 'dullness|pigmentation', 'normal|combo|oily'),
  p('n083', '아비브', '어성초 에센스 카밍 펌프', '어성초에센스|abib heartleaf essence calming pump', '에센스', 'houttuynia|panthenol|hyaluronic-acid|centella', 'breakout|barrier|dryness', 'sensitive|combo|oily|normal'),
  p('n084', '하루하루원더', '블랙라이스 하이알루로닉 에센스', '블랙라이스에센스|haruharu black rice essence', '에센스', 'rice-extract|hyaluronic-acid|panthenol|yeast-extract', 'dryness|dullness', 'dry|normal|combo|sensitive'),

  // ── 패드 (6) ───────────────────────────────────────────────
  p('n085', '넘버즈인', '5번 비타민 나이아신 농축 패드', '5번패드|numbuzin no.5 vitamin niacinamide pad', '패드', 'niacinamide|ascorbyl-glucoside|gluconolactone|hyaluronic-acid', 'dullness|pigmentation|texture', 'normal|combo|oily'),
  p('n086', '아비브', '어성초 스팟 패드 카밍 터치', '어성초패드|abib heartleaf spot pad', '패드', 'houttuynia|panthenol|allantoin|hyaluronic-acid', 'breakout|barrier', 'sensitive|combo|oily|normal'),
  p('n087', '라운드랩', '1025 독도 토너 패드', '독도패드|round lab dokdo toner pad', '패드', 'panthenol|betaine|allantoin|hyaluronic-acid', 'barrier|dryness', 'dry|normal|combo|oily|sensitive'),
  p('n088', '메디힐', '티트리 트러블 패드', '티트리패드|mediheal tea tree trouble pad', '패드', 'tea-tree|salicylic-acid|centella|panthenol', 'breakout|sebum', 'oily|combo'),
  p('n089', '에스네이처', '아쿠아 오아시스 토너 패드', '아쿠아오아시스패드|snature aqua oasis toner pad', '패드', 'squalane|hyaluronic-acid|glycerin|panthenol', 'dryness|barrier', 'dry|normal|sensitive|combo'),
  p('n090', '스킨푸드', '라이스 데일리 브라이트닝 패드', '라이스패드|skinfood rice brightening pad', '패드', 'rice-extract|niacinamide|gluconolactone|glycerin', 'dullness|texture', 'normal|combo|dry|oily'),

  // ── 마스크 (6) ─────────────────────────────────────────────
  p('n091', '바이오던스', '바이오 콜라겐 리얼 딥 마스크', '바이오던스마스크|biodance collagen mask|콜라겐마스크', '마스크', 'collagen|hyaluronic-acid|niacinamide|peptides', 'firming|dryness|dullness', 'dry|normal|combo|oily'),
  p('n092', '마스크마스터', '시카 수딩 데일리 마스크', '시카데일리마스크|mask master cica daily mask', '마스크', 'centella|madecassoside|panthenol|hyaluronic-acid', 'breakout|barrier', 'sensitive|combo|oily|normal'),
  p('n093', '원진효과', '워터 셀 마스크', '워터셀마스크|wonjin effect water cell mask', '마스크', 'hyaluronic-acid|glycerin|trehalose|panthenol', 'dryness', 'dry|normal|combo|oily|sensitive'),
  p('n094', 'VT', '시카 데일리 수딩 마스크', 'VT시카마스크|vt cica daily soothing mask', '마스크', 'centella|madecassoside|allantoin|hyaluronic-acid', 'breakout|barrier|dryness', 'sensitive|combo|oily|normal'),
  p('n095', '듀이트리', '티트리 AC 컨트롤 마스크', '듀이트리티트리|dewytree tea tree ac control mask', '마스크', 'tea-tree|salicylic-acid|centella|panthenol', 'breakout|sebum', 'oily|combo'),
  p('n096', '에뛰드', '0.2 테라피 에어 마스크 티트리', '에어마스크|etude 0.2 therapy air mask tea tree', '마스크', 'tea-tree|centella|hyaluronic-acid', 'breakout|sebum|dryness', 'oily|combo|normal'),

  // ── 아이크림 (4) ───────────────────────────────────────────
  p('n097', '코스알엑스', '어드밴스드 스네일 펩타이드 아이크림', '스네일아이크림|cosrx snail peptide eye cream', '아이크림', 'snail-mucin|peptides|niacinamide|adenosine', 'firming|dryness', 'dry|normal|combo|oily|sensitive'),
  p('n098', '아이소이', '불가리안 로즈 아이크림', '로즈아이크림|isoi bulgarian rose eye cream', '아이크림', 'rose|peptides|adenosine|squalane', 'firming|dryness', 'dry|normal|combo'),
  p('n099', '미샤', '미사 초공진 아이크림', '초공진아이크림|missha cho gong jin eye cream', '아이크림', 'ginseng|peptides|adenosine|fragrance', 'firming|dullness', 'dry|normal|combo'),
  p('n100', '라네즈', '워터뱅크 블루 히알루로닉 아이크림', '워터뱅크아이크림|laneige water bank eye cream', '아이크림', 'hyaluronic-acid|algae|caffeine|adenosine', 'dryness|firming', 'dry|normal|combo|oily'),

  // ── 오일 (3) ───────────────────────────────────────────────
  p('n101', '헉슬리', '오일 라이트 앤 모어', '헉슬리오일|huxley oil light and more', '오일', 'jojoba-oil|squalane|tocopherol|fragrance', 'dryness|dullness', 'dry|normal|combo'),
  p('n102', '이니스프리', '그린티 씨드 오일', '그린티씨드오일|innisfree green tea seed oil', '오일', 'green-tea|tocopherol|squalane|camellia-oil', 'dryness|barrier', 'dry|normal|combo'),
  p('n103', '시드물', '골든 호호바 오일', '호호바오일|sidmool golden jojoba oil', '오일', 'jojoba-oil|tocopherol', 'dryness|barrier', 'dry|normal|combo|sensitive|oily'),

  // ── 미스트 (4) ─────────────────────────────────────────────
  p('n104', '에스트라', '아토배리어 365 미스트', '아토배리어미스트|aestura atobarrier mist', '미스트', 'ceramide|panthenol|hyaluronic-acid|glycerin', 'barrier|dryness', 'sensitive|dry|normal|combo'),
  p('n105', '라보에이치', '두피 쿨링 미스트', '두피미스트|labo-h scalp cooling mist', '미스트', 'tea-tree|rosemary|panthenol|salicylic-acid', 'sebum|breakout', 'oily|combo'),
  p('n106', '토니모리', '더 촉촉 그린티 워터리 미스트', '촉촉미스트|tonymoly chok chok green tea mist', '미스트', 'green-tea|hyaluronic-acid|glycerin|fragrance', 'dryness|sebum', 'normal|combo|oily|dry'),
  p('n107', '네이처리퍼블릭', '수딩 앤 모이스처 알로에 베라 92% 미스트', '알로에미스트|nature republic aloe mist', '미스트', 'aloe|glycerin|panthenol|fragrance', 'dryness|breakout', 'normal|combo|oily|dry'),

  // ── 필링 (4) ───────────────────────────────────────────────
  p('n108', '셀프뷰티', '딥 클린 필링 젤', '셀프뷰티필링젤|selfbeauty deep clean peeling gel', '필링', 'cellulose|papain|salicylic-acid|glycerin', 'texture|sebum', 'oily|combo|normal'),
  p('n109', '이즈앤트리', '클리어 스킨 8% AHA 에센스', '8%AHA|isntree clear skin aha essence|AHA에센스', '필링', 'glycolic-acid|lactic-acid|hyaluronic-acid|allantoin', 'texture|dullness|breakout', 'oily|combo|normal'),
  p('n110', '조선미녀', '살구꽃 필링 젤', '살구꽃필링젤|beauty of joseon apricot blossom peeling gel', '필링', 'cellulose|papain|gluconolactone|rice-extract', 'texture|dullness', 'normal|combo|oily|dry'),
  p('n111', '스킨푸드', '블랙슈가 마스크 워시오프', '블랙슈가마스크|skinfood black sugar mask wash off', '필링', 'cellulose|shea-butter|glycerin|honey', 'texture|dryness', 'normal|dry|combo'),

  // ── 베이스 (4) ─────────────────────────────────────────────
  p('n112', '클리오', '킬커버 파운웨어 쿠션', '킬커버쿠션|clio kill cover founwear cushion', '베이스', 'titanium-dioxide|dimethicone|silica|niacinamide', 'pigmentation|sebum', 'oily|combo|normal'),
  p('n113', '티르티르', '마스크핏 레드 쿠션', '레드쿠션|tirtir mask fit red cushion', '베이스', 'titanium-dioxide|dimethicone|hyaluronic-acid|silica', 'pigmentation|dullness', 'normal|combo|dry|oily'),
  p('n114', '롬앤', '베어 워터 쿠션', '롬앤쿠션|romand bare water cushion', '베이스', 'titanium-dioxide|hyaluronic-acid|dimethicone|glycerin', 'dryness|dullness', 'dry|normal|combo'),
  p('n115', '어뮤즈', '듀 파워 비건 쿠션', '듀파워쿠션|amuse dew power vegan cushion', '베이스', 'titanium-dioxide|hyaluronic-acid|squalane|dimethicone', 'dryness|dullness', 'dry|normal|combo'),
];
