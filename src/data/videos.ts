/**
 * 영상으로 배우기 — 메이크업 종류별 YouTube 큐레이션.
 * 모든 영상 id 는 YouTube oEmbed 로 존재·임베드 가능 여부를 확인한 것(2026-09-09 기준)이며,
 * 크리에이터가 영상을 내리면 카드의 "YouTube에서 열기"로 대신 볼 수 있다.
 * VITE_YOUTUBE_API_KEY 가 있으면 `query` 로 실시간 검색한 결과가 이 목록보다 우선한다.
 */
export interface MakeupVideo {
  id: string;
  title: string;
  channel: string;
}

export interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  desc: string;
  /** 실시간 검색·"더 찾기" 링크에 쓰는 검색어 */
  query: string;
  /** 이 종류와 연결되는 일러스트 튜토리얼 id */
  tutorialIds: string[];
  videos: MakeupVideo[];
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'eye-basic',
    title: '눈화장 기초',
    icon: '👁️',
    desc: '아이섀도우 바르는 순서와 얼룩 수습, 초보자용 아이라인·애교살까지 기본기부터.',
    query: '초보 아이섀도우 바르는 법 눈화장 기초',
    tutorialIds: ['eye-pure-daily'],
    videos: [
      { id: 'z5WwAB1w40s', title: '기초부터 탄탄히 아이 섀도우 바르는 방법 + 얼룩 수습법', channel: 'Coco Riley (코코 라일리)' },
      { id: '-Gyv4F6Ivcc', title: '초보자 눈 화장 튜토리얼 | 아이섀도우 바르는 방법', channel: '99M EyeMakeup' },
      { id: 'EyCM6ufUF3U', title: '눈화장만 자세히! 초보자·입문자용 아이라인·애교살 그리는 법', channel: '아이 엠 베티 i am betty' },
    ],
  },
  {
    id: 'eye-cool',
    title: '여쿨·쿨톤 눈화장',
    icon: '💜',
    desc: '라벤더·로즈핑크처럼 맑은 쿨톤 컬러로 속쌍·데일리 눈화장을 완성하는 법.',
    query: '여쿨 눈화장 라벤더 로즈핑크 섀도우 튜토리얼',
    tutorialIds: ['eye-summer-lavender', 'eye-summer-rosepink'],
    videos: [
      { id: 'jYBx7oZUMcs', title: '필수 여쿨템으로 맑은 메이크업 · 속쌍 눈화장 꿀팁 | 여름 쿨톤 메이크업', channel: '리음 lieum' },
      { id: 'zJrszkG0l9g', title: '15분 퀵 청순 메이크업 쿨톤 버전 (왕초보·학생 메이크업)', channel: '오션 OCEAN' },
      { id: 'z5WwAB1w40s', title: '기초부터 탄탄히 아이 섀도우 바르는 방법 + 얼룩 수습법', channel: 'Coco Riley (코코 라일리)' },
    ],
  },
  {
    id: 'eye-warm',
    title: '가을웜·브라운 눈화장',
    icon: '🍂',
    desc: '브릭·카멜·테라코타 계열 섀도우 팔레트 활용과 브라운 데일리 음영.',
    query: '가을웜 브라운 섀도우 데일리 눈화장 튜토리얼',
    tutorialIds: ['eye-autumn-warm'],
    videos: [
      { id: 'GLnJoKtQRJo', title: '가을웜톤 메이크업 튜토리얼 vol1. 섀도우팔레트 색상 활용팁', channel: '쎄씰 Cécile' },
      { id: 'TEC00nVunr4', title: '[ENG CC] 브라운 데일리 메이크업 - Brown Dolly Eye Makeup', channel: '다또아Daddoa' },
      { id: 'Moz0yKQm4z0', title: '가을웜 섀도우 추천 BEST 1편 (가을소프트·뮤트·딥·라이트)', channel: '쎄씰 Cécile' },
      { id: 'KOTVwQFYsyo', title: '가을웜톤 필수시청! 가을 섀도우 & 블러셔 추천', channel: '먼지나방 스토그래피' },
    ],
  },
  {
    id: 'eye-cat',
    title: '고양이상·윙 라이너',
    icon: '🐱',
    desc: '눈꼬리를 올려 또렷하게. 캣츠아이 라인과 아우터 포인트로 만드는 고양이상.',
    query: '고양이상 메이크업 윙 아이라이너 튜토리얼',
    tutorialIds: ['eye-cat'],
    videos: [
      { id: '993SRc8byks', title: '고양이상 메이크업 🐱 Cat-Eye Makeup', channel: 'PONY Syndrome' },
      { id: 'YVXTvA6Gp9s', title: '고양이 되는 법 가르쳐 줄게 · 고양이상 메이크업', channel: '아로 aro' },
      { id: 'QMI6oE_BIww', title: '(ENG) 윤곽 바꿔버리는 힙+청순 고양이상 대변신 (캣츠아이라인)', channel: 'LeoJ Makeup' },
      { id: 'qM2R3wnRDCs', title: '고양이상 메이크업 (얼태기 극복까지)', channel: '츄르희' },
    ],
  },
  {
    id: 'eye-puppy',
    title: '강아지상·애교살',
    icon: '🐶',
    desc: '눈꼬리를 내려 그리는 다운턴 라이너와 애교살로 순하고 어려 보이는 눈매.',
    query: '강아지상 눈화장 애교살 다운턴 라이너 튜토리얼',
    tutorialIds: ['eye-puppy'],
    videos: [
      { id: '579VIy52ySc', title: '없는 애교살 메이크업 이렇게 하세요 (ft. 애교 필러 없이)', channel: '신지훈의 뷰티비 - make up' },
      { id: 'BhIwFyytgXw', title: '애교살 없는 사람도 쉽게 애교살 만드는 법 · 라이너·글리터 추천', channel: '하네 HANE' },
      { id: 'MREmla-Rhw4', title: '눈 2배 되는 초간단 애교살 그리는 법', channel: '오션 OCEAN' },
      { id: 'EyCM6ufUF3U', title: '눈화장만 자세히! 아이라인·애교살 그리는 법 풀영상', channel: '아이 엠 베티 i am betty' },
    ],
  },
  {
    id: 'eye-smoky',
    title: '스모키',
    icon: '🖤',
    desc: '차콜·딥브라운 그라데이션과 두꺼운 라인. 세미 스모키부터 아이돌 스모키까지.',
    query: '스모키 메이크업 튜토리얼',
    tutorialIds: ['eye-smoky-glam'],
    videos: [
      { id: 'sCkK1nqTDtQ', title: '핀터 감성 스모키 메이크업 Smokey Freckled Makeup', channel: 'PONY Syndrome' },
      { id: 'j4o5FAp7mwA', title: '지속력 보장 느좋 세미스모키 메이크업', channel: '하나HANA' },
      { id: 'RBm4rzufBV0', title: '다시 돌아온 스모키 메이크업은 이렇게 (아이돌 스모키·눈트임)', channel: '제이미포유 Jaymeeforyou' },
      { id: '93p8MExDhLs', title: '스모키 안 어울리는 분들 이렇게만 하면 성공합니다', channel: '조효진 Hyojin Cho' },
    ],
  },
  {
    id: 'eye-glitter',
    title: '글리터·파티',
    icon: '✨',
    desc: '중앙 글리터 포인트와 샴페인·핑크골드 반짝임으로 완성하는 파티 눈화장.',
    query: '글리터 눈화장 파티 메이크업 튜토리얼',
    tutorialIds: ['eye-glitter-party'],
    videos: [
      { id: 'N5BkzmJ8nP0', title: '반짝반짝 눈매 | 글리터를 활용한 아이 메이크업', channel: '길뷰티Gil Beauty' },
      { id: 'WwjUv4uuFn0', title: '초여름 햇살을 머금은 글리터 메이크업 (with Eng sub)', channel: 'PONY Syndrome' },
      { id: 'lk-iACb3UD0', title: 'Easy Glitter Eye Makeup ✨ Beginner Friendly Tutorial', channel: 'minahil princess makeup artist2626' },
    ],
  },
  {
    id: 'blush',
    title: '블러셔',
    icon: '🍑',
    desc: '사선·애플·가로·U존, 위치에 따라 달라지는 분위기와 얼굴형별 블러셔 방법.',
    query: '블러셔 바르는 법 위치 얼굴형별',
    tutorialIds: ['blush-diagonal', 'blush-apple', 'blush-horizontal', 'blush-uzone'],
    videos: [
      { id: 'P5bMk_LfZjE', title: '블러셔, 이 영상만 보세요 · 위치별 분위기 차이 / 얼굴형별 블러셔', channel: '10시엔 디붕' },
      { id: '-5WSqil6RMg', title: '[ENG] 얼굴형별 블러셔 방법 · 가장 많이 하는 3가지', channel: 'JUNGSAEMMOOL' },
      { id: 'QK2OMiO8GPE', title: '요즘 유행하는 블러셔 바르는 방법, 볼터치 위치 선정', channel: '지우비 JIU B' },
      { id: 'exeITltwyjM', title: '제형별 블러셔 바르는 법 & 블러셔 추천', channel: '민새롬의 오픈스튜디오' },
      { id: 'n33nFXgV7C0', title: '블러셔 이렇게 하면 빈티납니다 (ft. 꺼진볼 블러셔)', channel: '신지훈의 뷰티비 - make up' },
    ],
  },
  {
    id: 'nose',
    title: '코쉐딩·컨투어링',
    icon: '👃',
    desc: '복코·긴 코·낮은 코 등 유형별 코쉐딩과 콧볼을 갸름하게 보이는 조각 쉐딩.',
    query: '코쉐딩 하는 법 유형별 복코',
    tutorialIds: ['nose-straight', 'nose-nostril', 'nose-bulbous'],
    videos: [
      { id: 'qKl_3R_nx4o', title: '쉐딩에 따라 달라지는 코 모양 · 유형별 코쉐딩 (복코·긴코·낮은코)', channel: '제이시 JAYCEE' },
      { id: 'ZhLxJKxuV9Y', title: '복코 쉐딩하는 법 · 넓은 코 조각 쉐딩 꿀팁', channel: '쎄이 SSAY' },
      { id: 'T0SzDuV9oQw', title: '남자 코쉐딩 하는 법 쉽게 배워봅시다 (복코·화살코·매부리코)', channel: '스완SWAN_현실남자관리' },
    ],
  },
  {
    id: 'base',
    title: '베이스 메이크업',
    icon: '🧴',
    desc: '프라이머·파운데이션·쿠션 순서와 오래가는 베이스, 무너지지 않는 여름 베이스.',
    query: '베이스 메이크업 기초 초보 튜토리얼',
    tutorialIds: [],
    videos: [
      { id: 'eaHL8py-GTw', title: '[백투베이직] 1강 베이스 메이크업을 처음 시작하는 여러분에게', channel: 'RISABAE' },
      { id: '4ru9w13T6Lg', title: '메이크업 기초 Step 1. 베이스 메이크업', channel: 'BeautyEduLab' },
      { id: 'NEO5VGnu5aM', title: '오래 지속되는 베이스 메이크업 Tutorial', channel: 'JUNGSAEMMOOL' },
      { id: 'Lmz9J-PHCWg', title: '무결점 베이스 메이크업 총정리 NO FILTER FLAWLESS SKIN', channel: '심플리 수빈 simply subin' },
      { id: '-8oMVOQT4eQ', title: '초등학생도 따라 할 수 있는 왕초보 메이크업 (베이스부터 립까지)', channel: '오션 OCEAN' },
    ],
  },
  {
    id: 'lip',
    title: '립 메이크업',
    icon: '💋',
    desc: '그라데이션 립, 오버립, 립 하나로 톤 다르게 쓰는 법.',
    query: '그라데이션 립 오버립 바르는 법 튜토리얼',
    tutorialIds: [],
    videos: [
      { id: 'ijH3YcfSiJ0', title: '립그라데이션 메이크업 · One-tone, Two-tone Gradient Lip', channel: 'JUNGSAEMMOOL' },
      { id: 'UPEe82t2F7U', title: '1분 만에 배우는 자연스러운 그라데이션 립', channel: '헤메코-뷰티 전문가들의 이야기' },
      { id: 'n5xjsrdpAA4', title: '립 1개로 그라데이션 오버립 하는 법 · 입술산 커버', channel: '깨모ggemo' },
      { id: 'zLmLSTenu0k', title: '입술이 예뻐보이는 오버립 메이크업 튜토리얼', channel: '지우비 JIU B' },
    ],
  },
  {
    id: 'brow',
    title: '눈썹',
    icon: '🖌️',
    desc: '펜슬·섀도우로 결 살려 자연스럽게 그리는 눈썹과 정리하는 법.',
    query: '눈썹 그리는 법 초보 펜슬',
    tutorialIds: [],
    videos: [
      { id: 'pyosJeIq-g4', title: '[5분영상] 초보자도 쉽게 눈썹 그리는 법 (ft. 눈썹 정리)', channel: '신지훈의 뷰티비 - make up' },
      { id: 'QDkL7IrivUU', title: '초보자도 쉽게 깔끔한 눈썹 그리는 방법 (2가지만 알면 눈썹천재)', channel: 'You need 윤이든' },
      { id: 'skWr0CU33q8', title: '초보자를 위한 펜슬로 눈썹 그리는 법 · 숱 없는 눈썹', channel: "Syong's beauty 숑스뷰티" },
    ],
  },
  {
    id: 'daily',
    title: '청순 데일리·학생',
    icon: '🫧',
    desc: '15분 안에 끝내는 연한 데일리, 학생·면접 메이크업.',
    query: '청순 데일리 메이크업 학생 튜토리얼',
    tutorialIds: ['eye-pure-daily'],
    videos: [
      { id: 'YSJE8gxViaI', title: '청순 또렷 학생 메이크업 (왕초보 OK · 쿠션 바르는 법)', channel: '오션 OCEAN' },
      { id: 'sCNuAIigjJQ', title: '15분 퀵 청순 메이크업 (초간단 데일리)', channel: '오션 OCEAN' },
      { id: 'NmVgBavX8wc', title: '봄웜톤 청순 데일리 메이크업 3분 튜토리얼', channel: '제이시 JAYCEE' },
      { id: 'W1KH1kX5QhA', title: '90% 무편집 연한 메이크업 · 청순·면접·학생 메이크업', channel: '아이 엠 베티 i am betty' },
      { id: '9bOym16_bMg', title: '청순 학생메이크업 · 뽀얀 색조는 이렇게', channel: '고마난 gomanan' },
    ],
  },
];

export const VIDEO_CATEGORY_MAP = Object.fromEntries(VIDEO_CATEGORIES.map((c) => [c.id, c])) as Record<string, VideoCategory>;

/** 일러스트 튜토리얼 id → 연결된 영상 카테고리 */
export function videoCategoryForTutorial(tutorialId: string): VideoCategory | undefined {
  return VIDEO_CATEGORIES.find((c) => c.tutorialIds.includes(tutorialId));
}
