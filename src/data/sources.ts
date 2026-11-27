import type { SourceKind, SourceRef } from '@/types';

/**
 * 성분·조합 판단의 근거 자료 목록.
 *
 * 논문은 저자·학술지·연도를 PubMed 기록과 대조해 두었고, 바뀌지 않는 번호인 PMID 주소로 건다.
 * (2026-11 점검에서 저자·학술지가 틀린 항목 4건을 찾아 고쳤다 — 새 논문을 넣을 때는 반드시 PMID 로 확인할 것.)
 * 기관 자료는 공식 사이트 주소를 그대로 쓴다.
 */
export const SOURCE_KIND_META: Record<SourceKind, { label: string; icon: string }> = {
  paper: { label: '논문', icon: '📄' },
  authority: { label: '정부·공공기관', icon: '🏛️' },
  guideline: { label: '임상 가이드라인', icon: '🩺' },
  db: { label: '성분 데이터베이스', icon: '🗂️' },
};

const LIST: SourceRef[] = [
  // ------------------------------------------------------------- 기관 자료
  {
    id: 'mfds-safety',
    kind: 'authority',
    label: '화장품 안전기준 등에 관한 규정',
    detail: '배합 한도·금지 성분과 자외선 차단 성분의 최대 함량을 정한 식품의약품안전처 고시예요.',
    publisher: '식품의약품안전처',
    url: 'https://www.mfds.go.kr/brd/m_207/list.do',
  },
  {
    id: 'mfds-aha',
    kind: 'authority',
    label: 'AHA 함유 제품 표시·주의사항 기준',
    detail: 'AHA 함량이 일정 수준을 넘는 제품에는 자외선 차단제 병용 등 주의사항을 적게 한 규정이에요.',
    publisher: '식품의약품안전처',
    url: 'https://www.mfds.go.kr/brd/m_207/list.do',
  },
  {
    id: 'mfds-ad',
    kind: 'authority',
    label: '화장품 표시·광고 실증에 관한 규정',
    detail: '효능을 단정해 말할 수 있는 범위를 정한 규정이에요. 이 앱이 "~할 수 있어요"로 적는 이유예요.',
    publisher: '식품의약품안전처',
    url: 'https://www.mfds.go.kr/brd/m_207/list.do',
  },
  {
    id: 'kcia-dict',
    kind: 'db',
    label: '화장품 성분사전',
    detail: '국내에서 쓰는 성분 한글명과 INCI 명을 맞춰 보는 공식 사전이에요.',
    publisher: '대한화장품협회',
    url: 'https://kcia.or.kr/cid/',
  },
  {
    id: 'cir',
    kind: 'db',
    label: 'CIR 성분 안전성 평가',
    detail: '화장품 성분의 안전성을 전문가 패널이 검토해 공개하는 미국 자료예요.',
    publisher: 'Cosmetic Ingredient Review',
    url: 'https://www.cir-safety.org/ingredients',
  },
  {
    id: 'pubchem',
    kind: 'db',
    label: 'PubChem 화합물 정보',
    detail: '성분의 화학 구조·pH·용해도 같은 기본 물성을 확인할 수 있어요.',
    publisher: 'NCBI, 미국 국립의학도서관',
    url: 'https://pubchem.ncbi.nlm.nih.gov/',
  },
  {
    id: 'aad-acne',
    kind: 'guideline',
    label: '여드름 관리 임상 가이드라인',
    detail: '국소 레티노이드·과산화벤조일·살리실릭애씨드의 사용법과 자극 관리를 다룬 가이드라인이에요.',
    publisher: 'American Academy of Dermatology',
    year: 2024,
    url: 'https://www.aad.org/member/clinical-quality/guidelines/acne',
  },

  // ------------------------------------------------------------- 논문
  {
    id: 'pinnell-2001',
    kind: 'paper',
    label: '비타민C의 피부 흡수와 pH',
    detail: '순수 아스코빅애씨드는 pH 3.5 이하에서 안정적으로 흡수된다는 것을 보인 연구예요.',
    publisher: 'Pinnell SR et al., Dermatologic Surgery',
    year: 2001,
    url: 'https://pubmed.ncbi.nlm.nih.gov/11207686/',
  },
  {
    id: 'telang-2013',
    kind: 'paper',
    label: '피부과에서의 비타민C',
    detail: '비타민C의 항산화·멜라닌 생성 억제 작용과 제형 안정성 문제를 정리한 리뷰예요.',
    publisher: 'Telang PS, Indian Dermatology Online Journal',
    year: 2013,
    url: 'https://pubmed.ncbi.nlm.nih.gov/23741676/',
  },
  {
    id: 'mukherjee-2006',
    kind: 'paper',
    label: '레티노이드와 피부 노화',
    detail: '레티노이드의 효과와 함께 건조·홍조·벗겨짐 같은 자극 반응을 정리한 리뷰예요.',
    publisher: 'Mukherjee S et al., Clinical Interventions in Aging',
    year: 2006,
    url: 'https://pubmed.ncbi.nlm.nih.gov/18046911/',
  },
  {
    id: 'zasada-2019',
    kind: 'paper',
    label: '레티노이드의 작용과 부작용',
    detail: '레티놀 계열이 각질 턴오버를 올리는 기전과 농도별 자극을 다룬 리뷰예요.',
    publisher: 'Zasada M, Budzisz E, Postępy Dermatologii i Alergologii',
    year: 2019,
    url: 'https://pubmed.ncbi.nlm.nih.gov/31616211/',
  },
  {
    id: 'kornhauser-2010',
    kind: 'paper',
    label: 'AHA·BHA의 피부 작용',
    detail: '하이드록시애씨드가 각질 결합을 느슨하게 하는 기전과 농도·pH에 따른 자극을 다뤘어요.',
    publisher: 'Kornhauser A et al., Clinical, Cosmetic and Investigational Dermatology',
    year: 2010,
    url: 'https://pubmed.ncbi.nlm.nih.gov/21437068/',
  },
  {
    id: 'wohlrab-2014',
    kind: 'paper',
    label: '나이아신아마이드의 작용 기전',
    detail: '나이아신아마이드의 장벽·피지·톤 관련 작용과 제형 조건을 정리한 리뷰예요.',
    publisher: 'Wohlrab J, Kreft D, Skin Pharmacology and Physiology',
    year: 2014,
    url: 'https://pubmed.ncbi.nlm.nih.gov/24993939/',
  },
  {
    id: 'bissett-2005',
    kind: 'paper',
    label: '국소 나이아신아마이드 임상',
    detail: '나이아신아마이드를 바른 뒤 잡티·결·유분이 어떻게 달라졌는지 본 임상 연구예요.',
    publisher: 'Bissett DL et al., Dermatologic Surgery',
    year: 2005,
    url: 'https://pubmed.ncbi.nlm.nih.gov/16029679/',
  },
  {
    id: 'martin-1998',
    kind: 'paper',
    label: '레티노이드와 과산화벤조일의 안정성',
    detail: '두 성분을 같이 두면 레티노이드가 산화돼 분해된다는 것을 측정한 연구예요.',
    publisher: 'Martin B et al., British Journal of Dermatology',
    year: 1998,
    url: 'https://pubmed.ncbi.nlm.nih.gov/9990414/',
  },
  {
    id: 'johansen-2003',
    kind: 'paper',
    label: '향료 접촉 알레르기',
    detail: '향료 성분이 접촉 알레르기의 흔한 원인이며 누적 노출이 영향을 준다는 리뷰예요.',
    publisher: 'Johansen JD, American Journal of Clinical Dermatology',
    year: 2003,
    url: 'https://pubmed.ncbi.nlm.nih.gov/14572300/',
  },
  {
    id: 'degroot-2016',
    kind: 'paper',
    label: '에센셜오일의 접촉 알레르기',
    detail: '티트리·라벤더 등 에센셜오일이 산화되면서 감작을 일으킬 수 있다는 리뷰예요.',
    publisher: 'de Groot AC, Schmidt E, Dermatitis',
    year: 2016,
    url: 'https://pubmed.ncbi.nlm.nih.gov/27427818/',
  },
  {
    id: 'draelos-2005',
    kind: 'paper',
    label: '세안·보습과 피부 장벽 관리',
    detail: '세안제와 보습제를 어떻게 골라 쓰느냐가 피부 장벽 유지에 주는 영향을 정리한 리뷰예요.',
    publisher: 'Draelos ZD, Cutis',
    year: 2005,
    url: 'https://pubmed.ncbi.nlm.nih.gov/16869178/',
  },
  {
    id: 'lin-2005',
    kind: 'paper',
    label: '비타민C + 비타민E + 페룰릭의 광보호',
    detail: '세 성분을 함께 쓰면 각각보다 광보호 효과가 커진다는 것을 보인 연구예요.',
    publisher: 'Lin FH et al., Journal of Investigative Dermatology',
    year: 2005,
    url: 'https://pubmed.ncbi.nlm.nih.gov/16185284/',
  },
  {
    id: 'pullar-2017',
    kind: 'paper',
    label: '비타민C와 피부 건강',
    detail: '비타민C의 항산화 작용과 콜라겐 합성 관련 근거를 모은 리뷰예요.',
    publisher: 'Pullar JM et al., Nutrients',
    year: 2017,
    url: 'https://pubmed.ncbi.nlm.nih.gov/28805671/',
  },
  {
    id: 'coderch-2003',
    kind: 'paper',
    label: '세라마이드와 피부 장벽',
    detail: '세라마이드가 각질층 지질의 주성분으로 장벽과 수분 유지에 하는 역할을 정리한 리뷰예요.',
    publisher: 'Coderch L et al., American Journal of Clinical Dermatology',
    year: 2003,
    url: 'https://pubmed.ncbi.nlm.nih.gov/12553851/',
  },
  {
    id: 'bylka-2013',
    kind: 'paper',
    label: '병풀(센텔라)의 상처·진정 작용',
    detail: '센텔라아시아티카 추출물의 진정·재생 관련 근거를 모은 리뷰예요.',
    publisher: 'Bylka W et al., Postępy Dermatologii i Alergologii',
    year: 2013,
    url: 'https://pubmed.ncbi.nlm.nih.gov/24278045/',
  },
  {
    id: 'sccs-ttol',
    kind: 'authority',
    label: 'SCCS 티트리오일 안전성 의견서',
    detail: '티트리오일이 산화되면서 감작성이 올라가는 문제와 권고 농도를 다룬 의견서예요.',
    publisher: 'EU 소비자안전과학위원회(SCCS)',
    url: 'https://health.ec.europa.eu/scientific-committees/scientific-committee-consumer-safety-sccs_en',
  },
  {
    id: 'kligman-1986',
    kind: 'paper',
    label: '레티노이드 국소 도포의 피부 반응',
    detail: '레티노이드를 바를 때 나타나는 벗겨짐·홍조·따가움(이른바 레티노이드 반응)을 보고한 연구예요.',
    publisher: 'Kligman AM et al., Journal of the American Academy of Dermatology',
    year: 1986,
    url: 'https://pubmed.ncbi.nlm.nih.gov/3771853/',
  },
  {
    id: 'buettner-1996',
    kind: 'paper',
    label: '금속 이온과 아스코베이트의 산화',
    detail: '구리·철 같은 금속 이온이 아스코베이트의 산화를 촉진한다는 것을 다룬 연구예요.',
    publisher: 'Buettner GR, Jurkiewicz BA, Radiation Research',
    year: 1996,
    url: 'https://pubmed.ncbi.nlm.nih.gov/8619018/',
  },
  {
    id: 'ebner-2002',
    kind: 'paper',
    label: '판테놀의 보습·진정',
    detail: '덱스판테놀(프로비타민B5)의 보습·장벽 회복·자극 완화 작용을 정리한 리뷰예요.',
    publisher: 'Ebner F et al., American Journal of Clinical Dermatology',
    year: 2002,
    url: 'https://pubmed.ncbi.nlm.nih.gov/12113650/',
  },

  // ------------------------------------- 내 기록 기반 추천의 근거 (반복 반응·회피)
  // 저자·연도·수치는 PubMed 기록과 초록을 직접 대조했다. PMID 는 바뀌지 않는 번호라 주소에 그대로 쓴다.
  {
    id: 'nacdg-2023',
    kind: 'paper',
    label: '북미 접촉피부염 그룹 첩포검사 결과 2023–2024',
    detail:
      '환자 3,979명 중 70.3%가 한 가지 이상 양성이었어요. 금속(니켈·코발트)을 빼면 메틸아이소치아졸리논(보존제, 9.2%), 향료 믹스 I(8.7%), 리날룰 과산화물(향료, 8.7%), 페루발삼(7.6%) 순으로 흔했어요. 전문 병원에 의뢰된 환자 자료라 일반 인구 비율은 아니에요.',
    publisher: 'Reeder MJ et al., Dermatitis (North American Contact Dermatitis Group)',
    year: 2026,
    url: 'https://pubmed.ncbi.nlm.nih.gov/42817757/',
  },
  {
    id: 'roat-duration',
    kind: 'paper',
    label: '반복 개방 도포 시험(ROAT)은 며칠 해야 하나',
    detail:
      '프랑스 피부과·알레르기 그룹이 ROAT 328건(화장품 60%)을 모은 전향 연구예요. 양성 반응은 모두 10일 안에 나타났고 중앙값은 3일이어서, 최소 10일은 발라 봐야 한다고 결론 냈어요.',
    publisher: 'Amsler E et al., Contact Dermatitis',
    year: 2022,
    url: 'https://pubmed.ncbi.nlm.nih.gov/35383393/',
  },
  {
    id: 'roat-dermnet',
    kind: 'guideline',
    label: '개방 도포 시험(ROAT) 방법 안내',
    detail:
      '바르는 화장품은 첩포검사에서 음성이 나오기도 해서, 완제품을 팔 안쪽에 하루 두 번 열흘 이상 발라 보는 방법을 안내해요. 즉시형(두드러기) 반응 확인에는 쓰지 않아요.',
    publisher: 'DermNet (New Zealand Dermatological Society)',
    url: 'https://dermnetnz.org/topics/open-application-test',
  },
  {
    id: 'steuer-2018',
    kind: 'paper',
    label: '첩포검사와 회피 상담 뒤 환자가 느낀 호전',
    detail:
      '첩포검사에서 관련 성분을 찾고 회피 상담을 받은 환자의 81%가 2~3개월 뒤 호전을 보고했어요. 환자 보고에 기댄 후향 단면 분석이라 원인-결과로 단정하긴 어려워요.',
    publisher: 'Steuer MS, Botto NC, Dermatology and Therapy',
    year: 2018,
    url: 'https://pubmed.ncbi.nlm.nih.gov/29987683/',
  },
  {
    id: 'kist-2004',
    kind: 'paper',
    label: '알레르기 성분을 뺀 제품 목록의 효과 (무작위 비교)',
    detail:
      '자기 알레르기 성분이 없는 제품 목록을 받은 군과 일반 치료군을 비교한 무작위 연구예요. 29명 중 21명이 마쳤고 증상 점수에는 유의한 차이가 없었지만, 목록을 받은 환자의 91%가 도움이 됐다고 답했어요. 규모가 작은 연구예요.',
    publisher: 'Kist JM et al., Archives of Dermatology',
    year: 2004,
    url: 'https://pubmed.ncbi.nlm.nih.gov/15611421/',
  },
  {
    id: 'farage-2019',
    kind: 'paper',
    label: '민감성 피부의 자가 보고 비율',
    detail:
      '여러 나라 설문을 모아 보면 여성의 약 60~70%, 남성의 약 50~60%가 어느 정도 민감한 피부라고 답해요. 눈에 보이는 자극 징후가 없는 경우도 많아서, 자가 보고는 참고치로 봐야 해요.',
    publisher: 'Farage MA, Frontiers in Medicine',
    year: 2019,
    url: 'https://pubmed.ncbi.nlm.nih.gov/31157225/',
  },
];

export const SOURCES: Record<string, SourceRef> = Object.fromEntries(LIST.map((s) => [s.id, s]));

export const getSource = (id: string): SourceRef | undefined => SOURCES[id];

/** id 목록 → 실제 자료 (없는 id 는 조용히 건너뛴다) */
export function resolveSources(ids: string[] | undefined): SourceRef[] {
  if (!ids?.length) return [];
  return ids.map((id) => SOURCES[id]).filter((s): s is SourceRef => Boolean(s));
}

/** 출처 한 건을 한 줄로 — 논문 인용 형식에 가깝게 */
export function citation(s: SourceRef): string {
  return s.year ? `${s.publisher} (${s.year})` : s.publisher;
}
