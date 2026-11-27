import type { Product } from '@/types';
import { p } from './_helper';

/**
 * 백화점·수입 브랜드 라인업 — 데모/미검증 데이터.
 *
 * "백화점에 있는 것도 넣어 달라" 는 의견을 받아, 백화점 1층 화장품 코너와 면세점에서
 * 파는 국내 프레스티지 브랜드(설화수·후·숨37·오휘·헤라·아모레퍼시픽)와 수입 브랜드의
 * 대표 라인을 채웠다. 색조는 성분 궁합 분석 대상이 아니라 쿠션·베이스만 일부 넣었다.
 *
 * 성분은 제품명·라인 대표 성분만 넣었고 전부 미검증이다. 고가 제품은 전성분이 길고
 * 추출물 비중이 커서, 정확한 분석이 필요하면 전성분을 붙여넣어 등록하는 쪽이 낫다.
 */
export const PRODUCTS_PART8: Product[] = [
  // ── 설화수 ──────────────────────────────────────────────────────────────────
  p('d005', '설화수', '자음생 아이크림', '설화수 아이크림', '아이크림', 'ginseng|adenosine|peptides|shea-butter', 'firming|dryness', 'dry|normal'),
  p('d007', '설화수', '순행 클렌징 폼', '설화수 순행클렌징폼', '클렌징', 'ginseng|glycerin|betaine', 'barrier|dullness', 'dry|normal|combo|sensitive'),
  p('d008', '설화수', '순행 클렌징 오일', '설화수 순행클렌징오일', '클렌징', 'ginseng|sunflower-oil|tocopherol', 'dullness|barrier', 'dry|normal|combo'),
  p('d009', '설화수', '자정 에센스', '설화수 자정에센스', '에센스', 'ginseng|niacinamide|adenosine|licorice', 'pigmentation|dullness', 'dry|normal|combo'),
  p('d010', '설화수', '퍼펙팅 쿠션', '설화수 쿠션', '베이스', 'ginseng|niacinamide|titanium-dioxide|dimethicone', 'dullness|pigmentation', 'dry|normal|combo'),

  // ── 더히스토리오브후 ────────────────────────────────────────────────────────
  p('d011', '더히스토리오브후', '비첩 자생 에센스', '비첩자생에센스|후 비첩|whoo bichup self-generating essence', '에센스', 'ginseng|peony|adenosine|peptides', 'firming|dullness|barrier', 'dry|normal|combo'),
  p('d012', '더히스토리오브후', '천기단 화현 크림', '천기단 크림|후 천기단', '크림', 'ginseng|adenosine|peptides|shea-butter', 'firming|dryness', 'dry|normal'),
  p('d013', '더히스토리오브후', '공진향 인양 크림', '공진향크림|후 공진향', '크림', 'ginseng|adenosine|peony|tocopherol', 'firming|dryness|dullness', 'dry|normal'),
  p('d014', '더히스토리오브후', '환유 크림', '후 환유고|환유고', '크림', 'ginseng|adenosine|peptides|squalane', 'firming|dryness', 'dry|normal'),
  p('d015', '더히스토리오브후', '비첩 순환 에센스', '후 비첩 순환에센스', '에센스', 'ginseng|adenosine|niacinamide|peony', 'firming|dullness', 'dry|normal|combo'),
  p('d016', '더히스토리오브후', '수연 밸런서', '후 수연 토너', '토너', 'ginseng|glycerin|betaine', 'dryness|firming', 'dry|normal'),

  // ── 숨37 (라인 보강) ────────────────────────────────────────────────────────
  p('d018', '숨37', '시크릿 리페어 크림', '숨37 리페어 크림', '크림', 'yeast-extract|adenosine|peptides|shea-butter', 'firming|dryness', 'dry|normal'),
  p('d019', '숨37', '워터풀 토너', '숨37 워터풀 토너', '토너', 'yeast-extract|hyaluronic-acid|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('d020', '숨37', '로시크 숨마 엘릭서 에센스', '숨37 로시크숨마', '에센스', 'yeast-extract|adenosine|peptides|niacinamide', 'firming|dullness', 'dry|normal'),

  // ── 오휘 / 아모레퍼시픽 / 리리코스 / 수려한 ─────────────────────────────────
  p('d021', '오휘', '더 퍼스트 제너츄어 에센스', '오휘 제너츄어|더퍼스트 에센스', '에센스', 'peptides|adenosine|niacinamide|beta-glucan', 'firming|texture|dullness', 'dry|normal|combo'),
  p('d022', '오휘', '프라임 어드밴서 앰플 세럼', '오휘 프라임어드밴서', '세럼', 'peptides|adenosine|hyaluronic-acid|niacinamide', 'firming|dryness', 'dry|normal|combo'),
  p('d023', '오휘', '데이 쉴드 퍼펙트 선 블록', '오휘 선크림', '선크림', 'uvinul-a-plus|tinosorb-s|uvinul-t150|niacinamide', 'pigmentation', 'normal|combo|dry'),
  p('d024', '아모레퍼시픽', '타임 리스폰스 스킨 리뉴얼 크림', '아모레퍼시픽 타임리스폰스 크림', '크림', 'green-tea|adenosine|peptides|shea-butter', 'firming|dryness|dullness', 'dry|normal'),
  p('d025', '아모레퍼시픽', '바이탈라이징 세럼', '아모레퍼시픽 바이탈라이징', '세럼', 'green-tea|adenosine|niacinamide|peptides', 'firming|dullness', 'dry|normal|combo'),
  p('d026', '리리코스', '마린 콜라겐 에센스', '리리코스 콜라겐 에센스', '에센스', 'collagen|algae|adenosine|hyaluronic-acid', 'firming|dryness', 'dry|normal|combo'),
  p('d027', '수려한', '효 진생 크림', '수려한 진생크림', '크림', 'ginseng|adenosine|shea-butter|peptides', 'firming|dryness', 'dry|normal'),

  // ── 헤라 (라인 보강) ────────────────────────────────────────────────────────
  p('d028', '헤라', '유스 액티베이팅 에센스', '헤라 에센스|유스액티베이팅', '에센스', 'peptides|adenosine|niacinamide|beta-glucan', 'firming|dullness|texture', 'dry|normal|combo'),
  p('d030', '헤라', '블랙 쿠션', '헤라 블랙쿠션', '베이스', 'niacinamide|titanium-dioxide|dimethicone|glycerin', 'dullness|pigmentation', 'normal|combo|dry'),
  p('d031', '헤라', '하이드로 어드밴스드 토너', '헤라 하이드로 토너', '토너', 'hyaluronic-acid|glycerin|panthenol', 'dryness|barrier', 'dry|normal|combo'),

  // ── 에스티로더 (라인 보강) ──────────────────────────────────────────────────
  p('d032', '에스티로더', '어드밴스드 나이트 리페어 세럼', '갈색병|에스티로더 갈색병|advanced night repair', '세럼', 'bifida|yeast-extract|hyaluronic-acid|tocopherol', 'texture|firming|dullness', 'dry|normal|combo|oily'),
  p('d033', '에스티로더', '마이크로 에센스 스킨 액티베이팅 트리트먼트 로션', '에스티로더 마이크로에센스', '에센스', 'bifida|yeast-extract|lactobacillus|glycerin', 'texture|dullness|barrier', 'dry|normal|combo|sensitive'),
  p('d034', '에스티로더', '퍼펙셔니스트 프로 멀티 디펜스 세럼', '에스티로더 퍼펙셔니스트', '세럼', 'niacinamide|peptides|ferulic-acid|tocopherol', 'firming|pigmentation|texture', 'normal|combo|dry'),
  p('d035', '에스티로더', '리뉴트리브 얼티메이트 리프트 크림', '에스티로더 리뉴트리브', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d036', '에스티로더', '어드밴스드 나이트 리페어 아이 크림', '갈색병 아이크림', '아이크림', 'bifida|peptides|hyaluronic-acid|caffeine', 'firming|texture', 'dry|normal|combo'),

  // ── 랑콤 (라인 보강) ────────────────────────────────────────────────────────
  p('d037', '랑콤', '아드바썽스 제니피끄 유스 액티베이팅 세럼', '제니피끄|랑콤 제니피끄|advanced genifique', '세럼', 'bifida|yeast-extract|hyaluronic-acid|adenosine', 'firming|texture|dullness', 'dry|normal|combo|oily'),
  p('d038', '랑콤', '클라리피끄 듀얼 에센스 로션', '랑콤 클라리피끄', '에센스', 'yeast-extract|niacinamide|gluconolactone|glycerin', 'dullness|texture|pigmentation', 'normal|combo|dry'),
  p('d039', '랑콤', '압솔뤼 수프렘 크림', '랑콤 압솔뤼 크림', '크림', 'rose|peptides|adenosine|shea-butter', 'firming|dryness', 'dry|normal'),
  p('d040', '랑콤', '레네르지 HPN 300 크림', '랑콤 레네르지 크림', '크림', 'peptides|niacinamide|adenosine|hyaluronic-acid', 'firming|texture', 'dry|normal|combo'),

  // ── 키엘 (라인 보강) ────────────────────────────────────────────────────────
  p('d042', '키엘', '울트라 훼이셜 토너', '키엘 울트라훼이셜 토너', '토너', 'squalane|glycerin|betaine', 'dryness|barrier', 'dry|normal|combo'),
  p('d044', '키엘', '카렌듈라 허벌 엑스트랙트 토너', '키엘 카렌듈라 토너|칼렌듈라 토너', '토너', 'calendula|allantoin|glycerin', 'barrier|sebum|breakout', 'oily|combo|sensitive|normal'),
  p('d047', '키엘', '아마존 화이트 클레이 마스크', '키엘 클레이 마스크', '마스크', 'kaolin|silica|aloe', 'pores|sebum|texture', 'oily|combo'),
  p('d048', '키엘', '울트라 훼이셜 클렌저', '키엘 클렌저', '클렌징', 'squalane|glycerin|betaine', 'barrier', 'dry|normal|combo|sensitive'),

  // ── 시세이도 / 끌레드뽀보떼 (라인 보강) ─────────────────────────────────────
  p('d049', '시세이도', '얼티뮨 파워 인퓨징 컨센트레이트', '시세이도 얼티뮨|ultimune', '세럼', 'yeast-extract|bifida|glycerin|tocopherol', 'firming|barrier|texture', 'dry|normal|combo|sensitive'),
  p('d050', '시세이도', '벤피크 와린클 스무딩 크림', '시세이도 벤피크', '크림', 'peptides|adenosine|shea-butter|niacinamide', 'firming|dryness', 'dry|normal'),
  p('d051', '시세이도', '에센셜 에너지 하이드레이팅 크림', '시세이도 에센셜에너지 크림', '크림', 'hyaluronic-acid|glycerin|squalane', 'dryness|barrier', 'dry|normal|combo'),
  p('d052', '끌레드뽀보떼', '르 세럼', '끌레드뽀 르세럼|cle de peau le serum', '세럼', 'peptides|yeast-extract|niacinamide|tocopherol', 'firming|texture|dullness', 'dry|normal|combo'),
  p('d053', '끌레드뽀보떼', '라 크렘', '끌레드뽀 라크렘', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d054', '끌레드뽀보떼', '신악티브 에센스', '끌레드뽀 신악티브', '에센스', 'yeast-extract|peptides|glycerin', 'firming|texture', 'dry|normal|combo'),

  // ── 라메르 (라인 보강) ──────────────────────────────────────────────────────
  p('d058', '라메르', '더 모이스처라이징 소프트 크림', '라메르 소프트크림', '크림', 'algae|squalane|glycerin|tocopherol', 'barrier|dryness', 'dry|normal|sensitive'),

  // ── SK-II (라인 보강) ───────────────────────────────────────────────────────
  p('d060', 'SK-II', '알엔에이 파워 래디컬 뉴 에이지 크림', 'sk2 rna 크림|알엔에이 파워 크림', '크림', 'galactomyces|niacinamide|peptides|glycerin', 'firming|dryness', 'dry|normal|combo'),
  p('d061', 'SK-II', '젠옵틱스 울트라 오라 에센스', 'sk2 젠옵틱스', '에센스', 'galactomyces|niacinamide|ethyl-ascorbic-acid', 'pigmentation|dullness', 'normal|combo|dry'),
  p('d062', 'SK-II', '페이셜 트리트먼트 클리어 로션', 'sk2 클리어로션', '토너', 'galactomyces|gluconolactone|glycerin', 'texture|pores|dullness', 'normal|combo|oily'),

  // ── 디올 / 샤넬 / 겔랑 / 시슬리 / 라프레리 ──────────────────────────────────
  p('d065', '디올', '캡춰 유스 글로우 부스터 세럼', '디올 캡춰유스', '세럼', 'niacinamide|peptides|hyaluronic-acid', 'dullness|firming', 'normal|combo|dry'),
  p('d067', '샤넬', '르 리프트 크렘', '샤넬 르리프트 크림', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d070', '겔랑', '아베이 로얄 세럼', '겔랑 아베이로얄', '세럼', 'honey|propolis|peptides|tocopherol', 'firming|barrier|dryness', 'dry|normal|sensitive'),
  p('d071', '겔랑', '오키데 임페리얼 크림', '겔랑 오키데 크림', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d073', '시슬리', '에꼴로지칼 콩파운드', '시슬리 에꼴로지칼', '에센스', 'ginseng|rosemary|glycerin|panthenol', 'barrier|dryness', 'dry|normal|sensitive|combo'),
  p('d074', '시슬리', '수프레미아 세럼', '시슬리 수프레미아', '세럼', 'peptides|adenosine|tocopherol|resveratrol', 'firming|texture', 'dry|normal'),
  p('d076', '라프레리', '화이트 캐비어 일루미네이팅 세럼', '라프레리 화이트캐비어', '세럼', 'algae|niacinamide|peptides|tocopherol', 'pigmentation|firming|dullness', 'dry|normal|combo'),

  // ── 클라란스 / 비오템 / 오리진스 / 프레쉬 / 클리니크 ────────────────────────
  p('d078', '클라란스', '하이드라 에센셜 수분 크림', '클라란스 하이드라에센셜', '크림', 'hyaluronic-acid|glycerin|shea-butter', 'dryness|barrier', 'dry|normal|combo'),
  p('d079', '클라란스', '수퍼 리스토러티브 크림', '클라란스 수퍼리스토러티브', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d080', '비오템', '아쿠아수스 젤', '비오템 아쿠아수스', '크림', 'thermal-water|hyaluronic-acid|glycerin', 'dryness|barrier', 'normal|combo|oily|dry'),
  p('d081', '비오템', '라이프 플랑크톤 에센스', '비오템 라이프플랑크톤', '에센스', 'thermal-water|yeast-extract|glycerin|panthenol', 'barrier|texture', 'sensitive|dry|normal|combo'),
  p('d082', '오리진스', '드링크 업 인텐시브 오버나이트 마스크', '오리진스 드링크업 마스크', '마스크', 'hyaluronic-acid|glycerin|algae|squalane', 'dryness|barrier', 'dry|normal|combo'),
  p('d083', '오리진스', '메가 머쉬룸 릴리프 세럼', '오리진스 메가머쉬룸', '세럼', 'chamomile|panthenol|beta-glucan|glycerin', 'barrier|dryness', 'sensitive|dry|normal'),
  p('d085', '프레쉬', '블랙 티 에이지 딜레이 크림', '프레쉬 블랙티 크림', '크림', 'black-tea|peptides|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d086', '프레쉬', '슈가 페이스 폴리쉬', '프레쉬 슈가 스크럽', '필링', 'glycerin|olive-oil|tocopherol', 'texture|dullness', 'normal|combo|dry'),
  p('d087', '클리니크', '모이스처 서지 100H 젤 크림', '클리니크 모이스처서지|moisture surge', '크림', 'hyaluronic-acid|glycerin|aloe|trehalose', 'dryness|barrier', 'normal|combo|oily|dry'),
  p('d088', '클리니크', '이븐 베터 클리니컬 래디컬 다크 스팟 세럼', '클리니크 이븐베터 세럼', '세럼', 'ascorbyl-glucoside|salicylic-acid|niacinamide|tocopherol', 'pigmentation|dullness', 'normal|combo|dry'),
  p('d089', '클리니크', '드라마티컬리 디퍼런트 모이스처라이징 젤', '클리니크 디디엠지|ddmg', '로션', 'glycerin|hyaluronic-acid|squalane', 'dryness|barrier', 'combo|oily|normal'),

  // ── 바비브라운 / 록시땅 / 발몽 / 나투라비세 / 아비노 ────────────────────────
  p('d090', '바비브라운', '비타민 인리치드 페이스 베이스', '바비브라운 비타민베이스|vitamin enriched face base', '크림', 'tocopherol|shea-butter|glycerin|ubiquinone', 'dryness|dullness', 'dry|normal|combo'),
  p('d091', '바비브라운', '인텐시브 세럼 파운데이션', '바비브라운 세럼 파운데이션', '베이스', 'hyaluronic-acid|glycerin|titanium-dioxide|dimethicone', 'dullness', 'dry|normal|combo'),
  p('d093', '발몽', '프라임 리뉴잉 팩', '발몽 리뉴잉팩|valmont renewing pack', '마스크', 'peptides|glycerin|shea-butter|panthenol', 'dullness|firming|dryness', 'dry|normal|combo'),
  p('d094', '나투라비세', '다이아몬드 익스트림 크림', '나투라비세 다이아몬드', '크림', 'peptides|adenosine|shea-butter|tocopherol', 'firming|dryness', 'dry|normal'),
  p('d095', '아비노', '데일리 모이스처라이징 로션', '아비노 로션|aveeno daily moisturizing', '로션', 'colloidal-oatmeal|glycerin|dimethicone', 'dryness|barrier', 'dry|sensitive|normal'),
  p('d096', '아비노', '캄 앤 리스토어 오트 젤 모이스처라이저', '아비노 오트 크림', '크림', 'colloidal-oatmeal|glycerin|panthenol|ceramide', 'barrier|dryness', 'sensitive|dry|normal'),

  // ── 더오디너리 (라인 보강) ──────────────────────────────────────────────────
  p('d098', '더오디너리', '하이알루로닉 애씨드 2% + B5', '오디너리 히알루론산', '세럼', 'hyaluronic-acid|panthenol|glycerin', 'dryness|barrier', 'dry|normal|combo|sensitive'),
  p('d099', '더오디너리', '글라이콜릭 애씨드 7% 토닝 솔루션', '오디너리 글라이콜릭|ordinary glycolic 7', '토너', 'glycolic-acid|aloe|ginseng', 'texture|dullness|pores', 'normal|combo|oily'),
  p('d100', '더오디너리', '레티놀 0.5% 인 스쿠알란', '오디너리 레티놀', '세럼', 'retinol|squalane|tocopherol', 'texture|firming|pores', 'normal|combo|dry'),
  p('d101', '더오디너리', '아스코빅 애씨드 8% + 알파 아르부틴 2%', '오디너리 비타민C', '세럼', 'ascorbic-acid|alpha-arbutin', 'pigmentation|dullness', 'normal|combo|oily'),
  p('d103', '더오디너리', '매트릭실 10% + HA', '오디너리 매트릭실', '세럼', 'peptides|hyaluronic-acid', 'firming|texture', 'dry|normal|combo'),
  p('d104', '더오디너리', '카페인 솔루션 5% + EGCG', '오디너리 카페인|오디너리 아이세럼', '세럼', 'caffeine|green-tea|glycerin', 'firming|dullness', 'normal|combo|dry|oily'),
  p('d105', '더오디너리', '아젤라익 애씨드 10% 수스펜션', '오디너리 아젤라익', '세럼', 'azelaic-acid|dimethicone', 'pigmentation|breakout|texture', 'oily|combo|normal'),
  p('d106', '더오디너리', '스쿠알란 클렌저', '오디너리 클렌저', '클렌징', 'squalane|glycerin', 'barrier', 'dry|normal|sensitive|combo'),

  // ── 폴라초이스 (라인 보강) ──────────────────────────────────────────────────
  p('d107', '폴라초이스', '2% BHA 리퀴드 엑스폴리언트', '폴라초이스 바하|bha 리퀴드|paula choice 2 bha', '토너', 'salicylic-acid|green-tea|panthenol', 'pores|sebum|breakout|texture', 'oily|combo|normal'),
  p('d108', '폴라초이스', '10% 나이아신아마이드 부스터', '폴라초이스 나이아신아마이드', '세럼', 'niacinamide|panthenol|licorice', 'pores|sebum|pigmentation', 'oily|combo|normal'),
  p('d109', '폴라초이스', 'C15 슈퍼 부스터', '폴라초이스 비타민C', '세럼', 'ascorbic-acid|tocopherol|ferulic-acid', 'pigmentation|dullness', 'normal|combo|dry'),
  p('d110', '폴라초이스', '1% 레티놀 트리트먼트', '폴라초이스 레티놀', '세럼', 'retinol|peptides|tocopherol|licorice', 'texture|firming|pores', 'normal|combo|dry'),
  p('d111', '폴라초이스', '스킨 밸런싱 포어 리듀싱 토너', '폴라초이스 토너', '토너', 'niacinamide|panthenol|glycerin', 'pores|sebum', 'oily|combo|normal'),

  // ── 세라비 / 세타필 / 뉴트로지나 / 니베아 / 비쉬 (라인 보강) ────────────────
  p('d114', '세라비', '하이드레이팅 페이셜 클렌저', '세라비 클렌저', '클렌징', 'ceramide|hyaluronic-acid|glycerin', 'barrier|dryness', 'dry|sensitive|normal'),
  p('d115', '세라비', '폼 페이셜 클렌저', '세라비 폼클렌저', '클렌징', 'ceramide|niacinamide|glycerin', 'barrier|sebum', 'oily|combo|normal'),
  p('d116', '세라비', '레티놀 세럼', '세라비 레티놀', '세럼', 'retinol|ceramide|niacinamide|hyaluronic-acid', 'texture|pores|barrier', 'normal|combo|oily'),
  p('d117', '세타필', '데일리 어드밴스 울트라 하이드레이팅 로션', '세타필 로션', '로션', 'glycerin|dimethicone|panthenol|urea', 'dryness|barrier', 'dry|sensitive|normal'),
  p('d120', '뉴트로지나', '하이드로 부스트 워터 젤', '뉴트로지나 하이드로부스트|워터젤', '크림', 'hyaluronic-acid|glycerin|dimethicone', 'dryness|barrier', 'combo|oily|normal|dry'),
  p('d122', '니베아', '크림 블루', '니베아 크림|니베아 블루', '크림', 'mineral-oil|petrolatum|glycerin|tocopherol', 'dryness|barrier', 'dry|normal'),
  p('d123', '니베아', '소프트 모이스처라이징 크림', '니베아 소프트크림', '크림', 'mineral-oil|glycerin|jojoba-oil|tocopherol', 'dryness|barrier', 'dry|normal'),
  p('d124', '비쉬', '미네랄 89 하이알루론산 부스터', '비쉬 미네랄89|mineral 89', '세럼', 'thermal-water|hyaluronic-acid|glycerin', 'dryness|barrier', 'sensitive|dry|normal|combo'),
  p('d125', '비쉬', '리프트액티브 수프림 크림', '비쉬 리프트액티브', '크림', 'thermal-water|peptides|adenosine|shea-butter', 'firming|dryness', 'dry|normal'),
  p('d126', '비쉬', '노르마덤 피토솔루션 세럼', '비쉬 노르마덤', '세럼', 'salicylic-acid|niacinamide|thermal-water', 'breakout|sebum|pores', 'oily|combo'),

  // ── 드렁크엘리펀트 / 파머시 / 이솝 / 록시땅 (라인 보강) ─────────────────────
  p('d127', '드렁크엘리펀트', '프로티니 폴리펩타이드 크림', '드렁크엘리펀트 프로티니|protini', '크림', 'peptides|glycerin|squalane|tocopherol', 'firming|barrier|dryness', 'dry|normal|combo'),
  p('d128', '드렁크엘리펀트', '티엘씨 프레임보스 글리콜릭 나이트 세럼', '드렁크엘리펀트 프레임보스', '세럼', 'glycolic-acid|lactic-acid|salicylic-acid|chamomile', 'texture|dullness|pores', 'normal|combo|oily'),
  p('d129', '드렁크엘리펀트', '씨 퍼밍 안티옥시던트 세럼', '드렁크엘리펀트 비타민C|c-firma', '세럼', 'ascorbic-acid|ferulic-acid|tocopherol|pea', 'pigmentation|dullness|firming', 'normal|combo|dry'),
  p('d130', '파머시', '그린 클린 메이크업 메팅 클렌징 밤', '파머시 클렌징밤|green clean balm', '클렌징', 'sunflower-oil|olive-oil|tocopherol|papain', 'barrier|texture', 'dry|normal|combo|sensitive'),
  p('d131', '이솝', '퍼페시브 페이셜 모이스처라이징 로션', '이솝 로션', '로션', 'panthenol|glycerin|tocopherol|rosemary', 'dryness|barrier', 'normal|combo|dry'),
  p('d132', '이솝', '퍼페시브 페이셜 클렌징 밤', '이솝 클렌징밤', '클렌징', 'olive-oil|tocopherol|rosemary', 'barrier', 'dry|normal|combo'),
  p('d133', '록시땅', '시어 리치 페이스 크림', '록시땅 시어크림', '크림', 'shea-butter|glycerin|tocopherol|squalane', 'dryness|barrier', 'dry|normal|sensitive'),

  // ── 유리아쥬 / 아벤느 / 비오더마 (라인 보강) ────────────────────────────────
  p('d134', '유리아쥬', '끄렘 도', '유리아쥬 크렘도|uriage creme d eau', '크림', 'thermal-water|glycerin|squalane|shea-butter', 'dryness|barrier', 'dry|sensitive|normal'),
  p('d135', '유리아쥬', '바리에데름 시카 크림', '유리아쥬 시카크림', '크림', 'thermal-water|centella|zinc-pca|panthenol', 'barrier|breakout', 'sensitive|dry|normal'),
  p('d136', '아벤느', '톨러랑스 컨트롤 크림', '아벤느 톨러랑스 크림', '크림', 'thermal-water|squalane|glycerin|shea-butter', 'barrier|dryness', 'sensitive|dry|normal'),
  p('d137', '아벤느', '시칼파트 플러스 크림', '아벤느 시칼파트', '크림', 'thermal-water|zinc-pca|panthenol|allantoin', 'barrier|texture', 'sensitive|dry|normal'),
  p('d140', '비오더마', '세비엄 H2O 클렌징 워터', '세비엄|비오더마 그린', '클렌징', 'zinc-pca|glycerin', 'sebum|pores|breakout', 'oily|combo'),
];
