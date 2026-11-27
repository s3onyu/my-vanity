import type { ConcernId, SkinType } from '@/types';

/**
 * 피부 유형 검사 (요청 2번).
 *
 * 네 가지 축으로 나눠 네 글자 코드를 만든다 — Baumann 의 피부 유형 분류(2006)에서 쓰는 축과 같은 방식이에요.
 *   유분  D(건성) ↔ O(지성)
 *   민감  S(민감) ↔ R(견고)
 *   색소  P(색소 반응) ↔ N(균일)
 *   주름  W(주름 신경) ↔ T(탄탄)
 *
 * 검사 결과는 진단이 아니라 "어떤 성분부터 보면 좋을지" 고르기 위한 참고용 분류예요.
 */

export type Axis = 'oil' | 'sensitivity' | 'pigment' | 'wrinkle';

export interface QuizOption {
  label: string;
  /** 축별 점수 — 유분은 +가 지성, 민감/색소/주름은 +가 "신경 쓰임" */
  scores: Partial<Record<Axis, number>>;
  /** T존에 유분이 올라온다는 신호 (복합성 판정용) */
  tzoneOil?: number;
  /** 볼이 건조하다는 신호 (복합성 판정용) */
  cheekDry?: number;
  /** 이 답에서 읽히는 고민 */
  concerns?: ConcernId[];
}

export interface QuizQuestion {
  id: string;
  axis: Axis;
  question: string;
  hint?: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    axis: 'oil',
    question: '세안하고 아무것도 바르지 않은 채 30분이 지나면 어떤가요?',
    hint: '가장 기본이 되는 질문이에요.',
    options: [
      { label: '얼굴 전체가 당기고 각질이 보여요', scores: { oil: -2 }, cheekDry: 1, concerns: ['dryness'] },
      { label: '볼은 당기는데 코·이마는 괜찮아요', scores: { oil: -1 }, cheekDry: 2, concerns: ['dryness'] },
      { label: '특별히 당기지도 번들거리지도 않아요', scores: { oil: 0 } },
      { label: '코와 이마가 금방 번들거려요', scores: { oil: 2 }, tzoneOil: 2, concerns: ['sebum'] },
    ],
  },
  {
    id: 'q2',
    axis: 'oil',
    question: '오후 3시쯤 거울을 보면 T존(이마·코)은 어떤가요?',
    options: [
      { label: '아침 그대로예요', scores: { oil: -1 } },
      { label: '살짝 윤기가 돌아요', scores: { oil: 0 } },
      { label: '번들거려요', scores: { oil: 1 }, tzoneOil: 1, concerns: ['sebum'] },
      { label: '기름종이가 필요해요', scores: { oil: 2 }, tzoneOil: 2, concerns: ['sebum', 'pores'] },
    ],
  },
  {
    id: 'q3',
    axis: 'oil',
    question: '같은 시간, 볼은 어떤가요?',
    hint: 'T존과 볼이 다르면 복합성으로 봐요.',
    options: [
      { label: '건조하고 당겨요', scores: { oil: -2 }, cheekDry: 2, concerns: ['dryness'] },
      { label: '멀쩡해요', scores: { oil: 0 } },
      { label: '볼도 번들거려요', scores: { oil: 1 }, cheekDry: -2, concerns: ['sebum'] },
    ],
  },
  {
    id: 'q4',
    axis: 'oil',
    question: '모공과 피부결은 어떤가요?',
    options: [
      { label: '모공은 거의 안 보이고 결이 고와요', scores: { oil: -1 } },
      { label: '코 주변 모공이 조금 보여요', scores: { oil: 1 }, concerns: ['pores'] },
      { label: '볼까지 모공이 넓어 보여요', scores: { oil: 2 }, concerns: ['pores', 'texture'] },
      { label: '모공보다 거친 결·각질이 신경 써요', scores: { oil: -1 }, concerns: ['texture'] },
    ],
  },
  {
    id: 'q5',
    axis: 'sensitivity',
    question: '새 화장품을 처음 바를 때 보통 어떤가요?',
    options: [
      { label: '아무 느낌 없이 잘 맞아요', scores: { sensitivity: -2 } },
      { label: '가끔 따끔하지만 금방 가라앉아요', scores: { sensitivity: 0 } },
      { label: '자주 따갑거나 붉어져요', scores: { sensitivity: 2 }, concerns: ['barrier'] },
      { label: '거의 매번 반응이 와서 새 제품이 무서워요', scores: { sensitivity: 3 }, concerns: ['barrier'] },
    ],
  },
  {
    id: 'q6',
    axis: 'sensitivity',
    question: '향이 강한 제품(향수 느낌의 크림 등)은 어떤가요?',
    options: [
      { label: '아무 문제 없어요', scores: { sensitivity: -1 } },
      { label: '잘 모르겠어요', scores: { sensitivity: 0 } },
      { label: '따끔하거나 붉어진 적이 있어요', scores: { sensitivity: 2 }, concerns: ['barrier'] },
    ],
  },
  {
    id: 'q7',
    axis: 'sensitivity',
    question: '각질 제품(토너패드, AHA·BHA, 레티놀)을 쓰면 어떤가요?',
    options: [
      { label: '써본 적 없어요', scores: { sensitivity: 0 } },
      { label: '매일 써도 괜찮아요', scores: { sensitivity: -2 } },
      { label: '주 2~3회면 괜찮아요', scores: { sensitivity: 0 } },
      { label: '한 번만 써도 벗겨지거나 따가워요', scores: { sensitivity: 3 }, concerns: ['barrier'] },
    ],
  },
  {
    id: 'q8',
    axis: 'sensitivity',
    question: '얼굴이 붉어지는 일이 얼마나 잦나요?',
    hint: '찬바람, 뜨거운 음식, 운동 뒤 등을 떠올려보세요.',
    options: [
      { label: '거의 없어요', scores: { sensitivity: -2 } },
      { label: '아주 더울 때만요', scores: { sensitivity: 0 } },
      { label: '자주 붉어지고 오래 가라앉지 않아요', scores: { sensitivity: 2 }, concerns: ['barrier'] },
    ],
  },
  {
    id: 'q9',
    axis: 'pigment',
    question: '여드름이나 상처가 나으면 자국이 어떻게 되나요?',
    options: [
      { label: '흔적 없이 사라져요', scores: { pigment: -2 } },
      { label: '몇 주 안에 옅어져요', scores: { pigment: 0 } },
      { label: '갈색 자국이 몇 달 남아요', scores: { pigment: 2 }, concerns: ['pigmentation'] },
    ],
  },
  {
    id: 'q10',
    axis: 'pigment',
    question: '햇볕을 오래 쬐면 피부가 어떻게 되나요?',
    options: [
      { label: '빨개지다가 원래대로 돌아와요', scores: { pigment: -1, sensitivity: 1 } },
      { label: '조금 그을려요', scores: { pigment: 0 } },
      { label: '잘 타고 잡티·기미가 늘어요', scores: { pigment: 2 }, concerns: ['pigmentation', 'dullness'] },
    ],
  },
  {
    id: 'q11',
    axis: 'pigment',
    question: '요즘 피부 톤은 어떤가요?',
    options: [
      { label: '고르고 환한 편이에요', scores: { pigment: -1 } },
      { label: '부분적으로 칙칙해요', scores: { pigment: 1 }, concerns: ['dullness'] },
      { label: '잡티·기미가 눈에 들어와요', scores: { pigment: 2 }, concerns: ['pigmentation'] },
    ],
  },
  {
    id: 'q12',
    axis: 'wrinkle',
    question: '표정을 풀었을 때 잔주름이 보이나요?',
    options: [
      { label: '아직 안 보여요', scores: { wrinkle: -2 } },
      { label: '웃을 때만 생기고 금방 펴져요', scores: { wrinkle: 0 } },
      { label: '눈가·입가에 자리를 잡았어요', scores: { wrinkle: 2 }, concerns: ['firming'] },
    ],
  },
  {
    id: 'q13',
    axis: 'wrinkle',
    question: '피부 탄력은 어떤가요?',
    options: [
      { label: '탱탱한 편이에요', scores: { wrinkle: -1 } },
      { label: '예전보다 처진 느낌이에요', scores: { wrinkle: 2 }, concerns: ['firming'] },
      { label: '잘 모르겠어요', scores: { wrinkle: 0 } },
    ],
  },
  {
    id: 'q14',
    axis: 'wrinkle',
    question: '자외선 차단제를 얼마나 쓰나요?',
    hint: '주름·잡티에 가장 크게 영향을 주는 습관이에요.',
    options: [
      { label: '매일 아침 발라요', scores: { wrinkle: -1 } },
      { label: '외출할 때만요', scores: { wrinkle: 0 } },
      { label: '거의 안 발라요', scores: { wrinkle: 2, pigment: 1 }, concerns: ['pigmentation', 'firming'] },
    ],
  },
  {
    id: 'q15',
    axis: 'sensitivity',
    question: '트러블(여드름·좁쌀)은 얼마나 자주 생기나요?',
    options: [
      { label: '거의 없어요', scores: { sensitivity: -1 } },
      { label: '달에 한두 개요', scores: { sensitivity: 0 } },
      { label: '늘 몇 개는 있어요', scores: { sensitivity: 1, oil: 1 }, concerns: ['breakout'] },
      { label: '넓게 올라와 가라앉지 않아요', scores: { sensitivity: 2, oil: 1 }, concerns: ['breakout', 'barrier'] },
    ],
  },
];

export type Answers = Record<string, number>;

export interface AxisScore {
  axis: Axis;
  /** 원점수 합 */
  raw: number;
  /** 0~100 으로 바꾼 값 — 50 이 가운데 */
  percent: number;
  letter: string;
  label: string;
  /** 축 설명 한 줄 */
  desc: string;
}

export interface QuizResult {
  /** 네 글자 코드 — 예 'OSPT' */
  code: string;
  /** 유형 이름 */
  title: string;
  /** 한 줄 설명 */
  lead: string;
  axes: AxisScore[];
  /** 프로필에 저장할 피부 타입 */
  skinType: SkinType;
  /** 프로필에 저장할 고민 (많이 나온 순, 최대 4개) */
  concerns: ConcernId[];
  /** 먼저 챙기면 좋은 성분 id */
  focusIngredients: string[];
  /** 당장은 천천히 접근할 성분 id */
  careful: string[];
  /** 검사에서 고른 답의 개수 */
  answered: number;
}

const AXIS_META: Record<Axis, { plus: string; minus: string; plusLabel: string; minusLabel: string; plusDesc: string; minusDesc: string }> = {
  oil: {
    plus: 'O',
    minus: 'D',
    plusLabel: '지성 쪽',
    minusLabel: '건성 쪽',
    plusDesc: '유분이 잘 올라오는 편이에요. 가벼운 제형과 피지 조절 성분이 맞는 경우가 많아요.',
    minusDesc: '수분·유분이 모두 부족해지기 쉬워요. 보습과 장벽 성분을 먼저 채우는 게 좋아요.',
  },
  sensitivity: {
    plus: 'S',
    minus: 'R',
    plusLabel: '민감 쪽',
    minusLabel: '견고 쪽',
    plusDesc: '자극에 쉽게 반응해요. 새 제품은 하나씩, 센 성분은 저농도부터가 안전해요.',
    minusDesc: '자극에 비교적 잘 버텨요. 그래도 센 성분을 여러 개 겹치는 건 피하는 게 좋아요.',
  },
  pigment: {
    plus: 'P',
    minus: 'N',
    plusLabel: '색소 반응 쪽',
    minusLabel: '균일한 쪽',
    plusDesc: '자극이나 자외선 뒤에 색이 남기 쉬워요. 자외선 차단과 톤 케어 성분이 중요해요.',
    minusDesc: '색이 잘 남지 않는 편이에요. 톤 케어보다 다른 고민에 힘을 실어도 괜찮아요.',
  },
  wrinkle: {
    plus: 'W',
    minus: 'T',
    plusLabel: '주름 신경 쪽',
    minusLabel: '탄탄한 쪽',
    plusDesc: '잔주름·탄력이 신경 쓰이는 시기예요. 항산화와 리뉴얼 성분을 천천히 들여보세요.',
    minusDesc: '아직 탄력이 좋은 편이에요. 자외선 차단으로 지금 상태를 지키는 게 가장 효율적이에요.',
  },
};

const TYPE_TITLE: Record<string, string> = {
  DRNT: '담담한 기본형',
  DRNW: '건조한 주름 경계형',
  DRPT: '건조한 잡티 관리형',
  DRPW: '건조한 안티에이징형',
  DSNT: '예민한 건성형',
  DSNW: '예민한 건성 주름형',
  DSPT: '예민한 건성 잡티형',
  DSPW: '가장 섬세한 관리형',
  ORNT: '튼튼한 지성형',
  ORNW: '지성 주름 경계형',
  ORPT: '지성 잡티형',
  ORPW: '지성 안티에이징형',
  OSNT: '예민한 지성형',
  OSNW: '예민한 지성 주름형',
  OSPT: '예민한 지성 잡티형',
  OSPW: '복합 관리가 필요한 형',
};

/** 축별 최대 점수 — 퍼센트 환산에 쓴다 */
function axisRange(axis: Axis): { min: number; max: number } {
  let min = 0;
  let max = 0;
  QUIZ.forEach((q) => {
    const vals = q.options.map((o) => o.scores[axis] ?? 0);
    min += Math.min(...vals, 0);
    max += Math.max(...vals, 0);
  });
  return { min, max };
}

const RANGES: Record<Axis, { min: number; max: number }> = {
  oil: axisRange('oil'),
  sensitivity: axisRange('sensitivity'),
  pigment: axisRange('pigment'),
  wrinkle: axisRange('wrinkle'),
};

/** 검사 결과 계산 — 답하지 않은 문항은 0점으로 둔다 */
export function scoreQuiz(answers: Answers): QuizResult {
  const raw: Record<Axis, number> = { oil: 0, sensitivity: 0, pigment: 0, wrinkle: 0 };
  const concernCount = new Map<ConcernId, number>();
  let tzoneOil = 0;
  let cheekDry = 0;
  let answered = 0;

  QUIZ.forEach((q) => {
    const idx = answers[q.id];
    if (idx === undefined || !q.options[idx]) return;
    answered += 1;
    const opt = q.options[idx];
    (Object.keys(opt.scores) as Axis[]).forEach((a) => {
      raw[a] += opt.scores[a] ?? 0;
    });
    tzoneOil += opt.tzoneOil ?? 0;
    cheekDry += opt.cheekDry ?? 0;
    opt.concerns?.forEach((c) => concernCount.set(c, (concernCount.get(c) ?? 0) + 1));
  });

  const axes: AxisScore[] = (['oil', 'sensitivity', 'pigment', 'wrinkle'] as Axis[]).map((axis) => {
    const { min, max } = RANGES[axis];
    const span = max - min || 1;
    const percent = Math.round(((raw[axis] - min) / span) * 100);
    const meta = AXIS_META[axis];
    const isPlus = raw[axis] > 0;
    return {
      axis,
      raw: raw[axis],
      percent,
      letter: isPlus ? meta.plus : meta.minus,
      label: isPlus ? meta.plusLabel : meta.minusLabel,
      desc: isPlus ? meta.plusDesc : meta.minusDesc,
    };
  });

  const code = axes.map((a) => a.letter).join('');

  // 프로필에 저장할 피부 타입 — 민감 신호가 뚜렷하면 민감성, 아니면 유분 축과 복합 신호로 정한다
  // 복합성은 "T존은 번들거리는데 볼은 건조하다"가 동시에 나올 때만 — 전체가 건조한 경우와 구분한다
  const isCombo = tzoneOil >= 2 && cheekDry >= 2;
  let skinType: SkinType;
  if (raw.sensitivity >= 4) skinType = 'sensitive';
  else if (isCombo) skinType = 'combo';
  else if (raw.oil >= 3) skinType = 'oily';
  else if (raw.oil <= -3) skinType = 'dry';
  else skinType = 'normal';

  // 축에서 읽히는 고민을 보강 (답에서 직접 나온 고민에 가중치를 더한다)
  const bump = (c: ConcernId, n: number) => concernCount.set(c, (concernCount.get(c) ?? 0) + n);
  if (raw.oil >= 3) bump('sebum', 1);
  if (raw.oil <= -3) bump('dryness', 1);
  if (raw.sensitivity >= 4) bump('barrier', 2);
  if (raw.pigment >= 3) bump('pigmentation', 2);
  if (raw.wrinkle >= 3) bump('firming', 2);

  const concerns = [...concernCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([c]) => c);
  if (concerns.length === 0) concerns.push('dryness');

  const focusIngredients: string[] = [];
  const careful: string[] = [];
  if (raw.oil <= 0) focusIngredients.push('hyaluronic-acid', 'ceramide', 'panthenol');
  else focusIngredients.push('niacinamide', 'zinc-pca', 'salicylic-acid');
  if (raw.sensitivity > 0) {
    focusIngredients.push('centella', 'madecassoside');
    careful.push('retinol', 'glycolic-acid', 'ascorbic-acid', 'fragrance');
  } else {
    careful.push('alcohol-denat');
  }
  if (raw.pigment > 0) focusIngredients.push('niacinamide', 'alpha-arbutin', 'zinc-oxide');
  if (raw.wrinkle > 0) focusIngredients.push(raw.sensitivity > 0 ? 'bakuchiol' : 'retinol', 'peptides', 'tocopherol');

  const title = TYPE_TITLE[code] ?? '내 피부 유형';
  const lead = `${axes[0].label} · ${axes[1].label} · ${axes[2].label} · ${axes[3].label}`;

  return {
    code,
    title,
    lead,
    axes,
    skinType,
    concerns,
    focusIngredients: [...new Set(focusIngredients)].slice(0, 6),
    careful: [...new Set(careful)].slice(0, 4),
    answered,
  };
}

/** 코드 한 글자씩 "무엇을 뜻하는지" — 결과 화면의 범례 */
export const CODE_LEGEND: { letter: string; meaning: string }[] = [
  { letter: 'D / O', meaning: '건성 ↔ 지성' },
  { letter: 'S / R', meaning: '민감 ↔ 견고' },
  { letter: 'P / N', meaning: '색소 반응 ↔ 균일' },
  { letter: 'W / T', meaning: '주름 신경 ↔ 탄탄' },
];
