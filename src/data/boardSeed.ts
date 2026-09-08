import type { BoardPost } from '@/types';

/**
 * 커뮤니티 게시판 데모 게시글.
 * 실제 서비스에서는 Supabase board_posts 테이블에서 불러오며, 이 목록은 첫 화면이 비어 보이지 않게 하는 용도다.
 * 개인 후기이며 효과를 보장하지 않는다.
 */
const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 12, 0, 0);
  return d.toISOString();
};

export const BOARD_SEED: BoardPost[] = [
  {
    id: 'seed-01',
    authorNickname: '민감이',
    concernCategory: 'barrier',
    title: '따가운 시기엔 이것만 남겼어요',
    body: '환절기마다 볼이 붉어져서 루틴을 토너-크림 두 단계로 줄였어요. 판테놀이랑 세라마이드 들어간 크림만 남기고 나머지는 2주 쉬었더니 따가움이 덜해진 느낌이었어요. 개인차가 있을 테니 참고만 해주세요.',
    productName: '에스트라 아토베리어365 크림',
    verdict: 'good',
    imageUrl: null,
    likes: 24,
    createdAt: daysAgo(1, 21),
  },
  {
    id: 'seed-02',
    authorNickname: '지성러',
    concernCategory: 'sebum',
    title: 'BHA 패드 격일로 바꿨더니',
    body: '매일 쓰다가 턱 쪽이 각질처럼 일어나서 격일로 줄였어요. 번들거림은 비슷한데 따가운 게 사라져서 이 정도가 저한테 맞는 것 같아요. 저녁에만 쓰고 아침엔 선크림 꼭 챙기고 있어요.',
    productName: '코스알엑스 원스텝 오리지널 클리어 패드',
    verdict: 'soso',
    imageUrl: null,
    likes: 11,
    createdAt: daysAgo(2, 9),
  },
  {
    id: 'seed-03',
    authorNickname: '잡티고민중',
    concernCategory: 'pigmentation',
    title: '비타민C 세럼 3주차 솔직 후기',
    body: '아침에 비타민C, 저녁에 나이아신아마이드로 나눠 썼어요. 잡티가 드라마틱하게 없어지진 않았지만 전체 톤이 조금 균일해진 느낌. 처음 며칠은 살짝 따끔했는데 지금은 괜찮아요. 개인 후기예요.',
    productName: '클레어스 프레시리 쥬스드 비타민 드롭',
    verdict: 'good',
    imageUrl: null,
    likes: 37,
    createdAt: daysAgo(3, 14),
  },
  {
    id: 'seed-04',
    authorNickname: '건조사막',
    concernCategory: 'dryness',
    title: '히알루론산 세럼만으론 부족했어요',
    body: '수분 세럼을 세 겹 발라도 당김이 계속됐는데, 마지막에 오일 한두 방울 섞어 크림을 바르니 아침까지 촉촉했어요. 여러 겹보다 마무리 한 단계가 저한텐 중요했나 봐요.',
    productName: '토리든 다이브인 세럼',
    verdict: 'soso',
    imageUrl: null,
    likes: 15,
    createdAt: daysAgo(4, 22),
  },
  {
    id: 'seed-05',
    authorNickname: '레티놀초보',
    concernCategory: 'firming',
    title: '레티놀 시작하고 각질 폭발… 이렇게 버텼어요',
    body: '주 2회부터 시작했는데도 2주째 각질이 심했어요. AHA 토너를 같이 쓰고 있었던 게 문제였던 것 같아서 토너를 빼고 세라마이드 크림을 두껍게 발랐더니 3주차부터 안정됐어요. 심하면 꼭 전문가와 상담하세요.',
    productName: '조선미녀 레티놀 크림 젤',
    verdict: 'bad',
    imageUrl: null,
    likes: 42,
    createdAt: daysAgo(6, 19),
  },
  {
    id: 'seed-06',
    authorNickname: '결고민',
    concernCategory: 'texture',
    title: 'PHA 토너로 갈아탄 이유',
    body: 'AHA 는 저한테 너무 따가워서 PHA 로 바꿨어요. 확실히 순한 대신 변화도 천천히 오는 느낌. 한 달 정도 쓰니 코 옆 결이 살짝 매끈해진 것 같아요.',
    productName: '아이소이 PHA 토너',
    verdict: 'good',
    imageUrl: null,
    likes: 8,
    createdAt: daysAgo(8, 11),
  },
  {
    id: 'seed-07',
    authorNickname: '칙칙탈출',
    concernCategory: 'dullness',
    title: '갈락토미세스 에센스 한 달',
    body: '아침 세안 후 첫 단계로 썼어요. 화장이 좀 더 잘 먹는 느낌은 있는데 톤 자체가 밝아졌는지는 잘 모르겠어요. 향이 발효 냄새라 호불호 있을 듯.',
    productName: '코스알엑스 갈락토미세스 95 톤 밸런싱 에센스',
    verdict: 'soso',
    imageUrl: null,
    likes: 6,
    createdAt: daysAgo(10, 8),
  },
  {
    id: 'seed-08',
    authorNickname: '트러블졸업희망',
    concernCategory: 'breakout',
    title: '어성초 토너 + 시카 크림 조합',
    body: '트러블 올라올 때 자극 없이 진정시키는 용도로만 써요. 없애주는 느낌은 아니고 덜 붉어지는 정도. 티트리 제품은 저한텐 너무 건조해서 뺐어요.',
    productName: '아누아 어성초 77 수분 진정 토너',
    verdict: 'good',
    imageUrl: null,
    likes: 19,
    createdAt: daysAgo(13, 17),
  },
];
