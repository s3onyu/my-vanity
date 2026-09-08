import type { ColorTag, ConcernId, IngredientCategory, SkinType } from '@/types';

export interface ConcernMeta {
  id: ConcernId;
  title: string;
  icon: string;
  colorTag: ColorTag;
  desc: string;
}

export const CONCERNS: ConcernMeta[] = [
  { id: 'pigmentation', title: '잡티·흔적', icon: '✨', colorTag: 'rose', desc: '멜라닌 관련 흔적, 트러블 뒤에 남은 자국이 신경 쓰이는 시기에 살펴볼 성분들이에요.' },
  { id: 'dryness', title: '건조함', icon: '💧', colorTag: 'sky', desc: '세안 후 당김이 있거나 계절이 바뀔 때 챙기고 싶은 성분들.' },
  { id: 'sebum', title: '피지', icon: '🫧', colorTag: 'butter', desc: '번들거림과 모공이 신경 쓰일 때 자주 언급되는 성분들이에요.' },
  { id: 'texture', title: '피부결', icon: '🌾', colorTag: 'lilac', desc: '거칠거나 울퉁불퉁한 결이 고민일 때 각질 관리 계열을 살펴봐요.' },
  { id: 'barrier', title: '장벽', icon: '🛡️', colorTag: 'mint', desc: '쉽게 붉어지고 따가운 시기에는 장벽 지지 성분부터 채워요.' },
  { id: 'dullness', title: '칙칙함', icon: '🌤️', colorTag: 'gold', desc: '피부 톤이 어둡고 생기가 없어 보일 때 항산화·톤 케어 성분을 살펴봐요.' },
  { id: 'breakout', title: '트러블 경향', icon: '🌱', colorTag: 'mint', desc: '반복되는 트러블에는 진정과 피지 조절 성분을 함께 보는 편이에요.' },
  { id: 'firming', title: '탄력·노화 징후', icon: '🌙', colorTag: 'plum', desc: '잔주름과 탄력 저하가 신경 쓰이기 시작할 때 살펴볼 성분들.' },
];

export const CONCERN_MAP = Object.fromEntries(CONCERNS.map((c) => [c.id, c])) as Record<ConcernId, ConcernMeta>;

export const SKIN_TYPES: { id: SkinType; label: string; desc: string }[] = [
  { id: 'dry', label: '건성', desc: '세안 후 금방 당기고 각질이 잘 일어나요' },
  { id: 'oily', label: '지성', desc: '오후가 되면 전체적으로 번들거려요' },
  { id: 'combo', label: '복합성', desc: 'T존은 번들, 볼은 건조해요' },
  { id: 'normal', label: '중성', desc: '특별히 건조하거나 번들거리지 않아요' },
  { id: 'sensitive', label: '민감성 경향', desc: '새 제품에 쉽게 붉어지거나 따가워요' },
];

export const SKIN_TYPE_LABEL = Object.fromEntries(SKIN_TYPES.map((s) => [s.id, s.label])) as Record<SkinType, string>;

export const CATEGORY_LABEL: Record<IngredientCategory, string> = {
  tone: '톤',
  hydration: '보습',
  barrier: '장벽',
  soothing: '진정',
  sebum: '피지',
  exfoliation: '각질',
  antioxidant: '항산화',
  firming: '탄력',
  renewal: '리뉴얼',
  sunscreen: '자외선차단',
};

/** 성분 카테고리 → 7색 팔레트 매핑 */
export const CATEGORY_COLOR: Record<IngredientCategory, ColorTag> = {
  tone: 'rose',
  hydration: 'sky',
  barrier: 'mint',
  soothing: 'mint',
  sebum: 'butter',
  sunscreen: 'butter',
  exfoliation: 'lilac',
  renewal: 'lilac',
  antioxidant: 'gold',
  firming: 'plum',
};

export const COLOR_HEX: Record<ColorTag, { base: string; soft: string; ink: string }> = {
  rose: { base: '#F4C2C2', soft: '#FCE4E4', ink: '#8A3B4A' },
  mint: { base: '#B8DFD1', soft: '#E1F1EB', ink: '#2F6B58' },
  sky: { base: '#C8DFEE', soft: '#E7F1F8', ink: '#2F5C7E' },
  butter: { base: '#F0E4C1', soft: '#F9F1D8', ink: '#7A5C1E' },
  lilac: { base: '#DDD3E8', soft: '#EFEAF5', ink: '#5B4A7A' },
  gold: { base: '#E8D5A0', soft: '#F5ECD3', ink: '#7A5A14' },
  plum: { base: '#D8C1D6', soft: '#EEE3EC', ink: '#6B3E66' },
};
