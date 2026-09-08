import type { Tutorial } from '@/types';

// ---------------------------------------------------------------------------
//  메이크업 튜토리얼 콘텐츠
//  - 각 step 의 layers 는 이전 단계와 누적되어 그려지므로 새로 추가되는 레이어만 기재
//  - 눈화장: 베이스 → 중간톤 → 아우터/언더 → 아이라인 → 속눈썹 (5단계 고정)
//  - 블러셔/코쉐딩: 3단계 고정
// ---------------------------------------------------------------------------

export const TUTORIALS: Tutorial[] = [
  // =========================================================================
  //  눈화장
  // =========================================================================
  {
    id: 'eye-summer-lavender',
    category: 'eye',
    title: '여쿨 라벤더',
    subtitle: '맑은 라벤더로 투명한 눈매',
    tags: ['여름쿨톤', '데일리', '퍼플'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '넓은 브러시에 연한 라벤더를 묻혀 눈두덩 전체에 살살 쓸어 올려요. 한 번에 진하게 바르기보다 두세 번 가볍게 겹쳐 톤을 고르게 만들어 주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#D9CDE8', opacity: 0.6 }],
      },
      {
        title: '쌍꺼풀 라인에 중간톤',
        tip: '중간 크기 블렌딩 브러시로 그레이시 퍼플을 쌍꺼풀 라인 위에 얹어요. 눈을 떴을 때 살짝 보이는 정도로 좌우로 흔들며 경계를 풀어주세요.',
        layers: [{ kind: 'crease', color: '#B9A6D6', opacity: 0.55 }],
      },
      {
        title: '눈꼬리 포인트와 언더',
        tip: '작은 브러시에 딥 퍼플을 소량 묻혀 눈꼬리 바깥쪽에 세모 모양으로 콕 찍어요. 남은 양으로 언더 눈꼬리 1/3 지점까지 살짝 이어 그리면 눈매가 깊어져요.',
        layers: [
          { kind: 'outerV', color: '#8E7BB5', opacity: 0.6 },
          { kind: 'underline', region: 'outer', color: '#B9A6D6', opacity: 0.5 },
        ],
      },
      {
        title: '얇은 아이라인 그리기',
        tip: '그레이 브라운 펜슬로 속눈썹 사이를 메우듯 얇게 라인을 그려요. 눈꼬리는 눈매 각도 그대로 2mm 정도만 자연스럽게 빼주세요.',
        layers: [{ kind: 'liner', style: 'thin', color: '#5A4E6B' }],
      },
      {
        title: '속눈썹 컬링 마무리',
        tip: '뷰러로 뿌리부터 세 단계로 나눠 집어 올려요. 브라운 마스카라를 지그재그로 한 번만 발라 청초한 느낌을 살려주세요.',
        layers: [{ kind: 'lashes', style: 'curl', color: '#4A3F52' }],
      },
    ],
  },
  {
    id: 'eye-summer-rosepink',
    category: 'eye',
    title: '여쿨 로즈핑크',
    subtitle: '로즈빛 은은한 혈색 눈매',
    tags: ['여름쿨톤', '로즈핑크', '러블리'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '연한 로즈 베이지를 넓은 브러시에 묻혀 눈두덩 전체에 펴 발라요. 붉게 뜨지 않도록 손가락으로 가볍게 두드려 밀착시켜 주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#F3D4DA', opacity: 0.6 }],
      },
      {
        title: '중간톤 로즈 쌓기',
        tip: '로즈핑크를 눈두덩 바깥 2/3 지점에 얹고 안쪽으로 그라데이션해요. 브러시를 눕혀 좌우로 살살 흔들며 경계선이 남지 않게 풀어주세요.',
        layers: [
          { kind: 'lid', region: 'outer', color: '#E4A9B8', opacity: 0.6 },
          { kind: 'crease', color: '#E4A9B8', opacity: 0.45 },
        ],
      },
      {
        title: '모브로 눈꼬리 포인트',
        tip: '모브 컬러를 작은 브러시에 소량 묻혀 눈꼬리 끝에 콕 찍고 바깥으로 풀어요. 언더라인 눈꼬리 쪽에도 얇게 이어주면 눈이 더 커 보여요.',
        layers: [
          { kind: 'outerV', color: '#B77D95', opacity: 0.55 },
          { kind: 'underline', region: 'outer', color: '#E4A9B8', opacity: 0.5 },
        ],
      },
      {
        title: '로즈 브라운 아이라인',
        tip: '로즈 브라운 펜슬로 점막을 채우듯 중간 굵기로 라인을 그려요. 눈꼬리는 살짝만 빼고 끝을 손가락으로 톡톡 두드려 번지듯 마무리해요.',
        layers: [{ kind: 'liner', style: 'medium', color: '#6E4A55' }],
      },
      {
        title: '속눈썹 컬링 마무리',
        tip: '뷰러로 뿌리부터 집어 올린 뒤 컬링 마스카라를 발라요. 언더 속눈썹에도 살짝 묻혀주면 로즈 컬러와 어우러져 또렷해 보여요.',
        layers: [{ kind: 'lashes', style: 'curl', color: '#4A3A40' }],
      },
    ],
  },
  {
    id: 'eye-cat',
    category: 'eye',
    title: '고양이상(캣아이)',
    subtitle: '눈꼬리를 살짝 올려 또렷하게',
    tags: ['캣아이', '브라운', '윙라이너'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '연한 베이지 브라운을 넓은 브러시로 눈두덩 전체에 쓸어 올려요. 눈꼬리 쪽은 사선으로 살짝 더 위까지 펴 발라 올라간 눈매의 틀을 잡아주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#EAD3BF', opacity: 0.6 }],
      },
      {
        title: '아우터 브라운 쌓기',
        tip: '미디엄 브라운을 눈두덩 바깥 절반에서 눈꼬리 방향으로 사선으로 올려 발라요. 쌍꺼풀 라인에도 같은 색을 얹어 안쪽으로 그라데이션해 주세요.',
        layers: [
          { kind: 'lid', region: 'outer', color: '#C79A78', opacity: 0.65 },
          { kind: 'crease', color: '#C79A78', opacity: 0.5 },
        ],
      },
      {
        title: '눈꼬리 딥 브라운 포인트',
        tip: '딥 브라운을 작은 브러시에 묻혀 눈꼬리에 뾰족한 세모로 강하게 찍어요. 언더 눈꼬리 1/3까지 연결하고 눈머리는 밝게 비워두면 대비가 살아요.',
        layers: [
          { kind: 'outerV', color: '#7A4E36', opacity: 0.7 },
          { kind: 'underline', region: 'outer', color: '#A97756', opacity: 0.55 },
        ],
      },
      {
        title: '윙 라이너 그리기',
        tip: '리퀴드 라이너로 눈꼬리에서 눈썹 꼬리 방향으로 짧은 윙을 먼저 그려요. 그다음 눈머리에서 눈꼬리로 이어 그리며 윙과 만나는 부분을 채워주세요.',
        layers: [{ kind: 'liner', style: 'wing', color: '#2B1C15' }],
      },
      {
        title: '아우터 볼륨 속눈썹',
        tip: '뷰러로 눈꼬리 쪽 속눈썹을 더 세게 집어 올려요. 볼륨 마스카라를 눈꼬리 방향으로 빗어 바르면 위로 뻗은 캣아이가 완성돼요.',
        layers: [{ kind: 'lashes', style: 'volume', color: '#1E1410' }],
      },
    ],
  },
  {
    id: 'eye-puppy',
    category: 'eye',
    title: '강아지상(다운턴 라이너)',
    subtitle: '눈꼬리를 내려 순한 인상',
    tags: ['강아지상', '코랄브라운', '애교살'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '연한 코랄 베이지를 넓은 브러시로 눈두덩 전체에 펴 발라요. 눈꼬리 쪽은 살짝 아래로 향하게 쓸어 순한 눈매의 바탕을 잡아주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#F2D3C2', opacity: 0.6 }],
      },
      {
        title: '코랄 브라운 중간톤',
        tip: '코랄 브라운을 눈두덩 중앙에서 바깥으로 둥글게 펴 발라요. 쌍꺼풀 라인에는 브러시를 눕혀 부드럽게 얹고 눈꼬리 아래로 살짝 내려 마무리해요.',
        layers: [
          { kind: 'lid', region: 'mid', color: '#E0A088', opacity: 0.6 },
          { kind: 'crease', color: '#D89A80', opacity: 0.45 },
        ],
      },
      {
        title: '애교살과 언더 포인트',
        tip: '밝은 코랄 베이지를 손가락으로 애교살 위에 통통하게 얹어요. 그 아래 언더 눈꼬리 1/3에 브라운을 얇게 그리고 눈꼬리 밑으로 살짝 내려 이어주세요.',
        layers: [
          { kind: 'aegyo', color: '#F5DCCB', opacity: 0.7 },
          { kind: 'underline', region: 'outer', color: '#B57A62', opacity: 0.55 },
        ],
      },
      {
        title: '다운턴 라이너 그리기',
        tip: '브라운 펜슬로 속눈썹 사이를 채우고 눈꼬리에서 3~4mm 아래로 내려 그려요. 끝은 뾰족하지 않게 손가락으로 한 번 눌러 부드럽게 풀어주세요.',
        layers: [{ kind: 'liner', style: 'downturn', color: '#5B3A2E' }],
      },
      {
        title: '내추럴 속눈썹 마무리',
        tip: '뷰러는 살짝만 집어 올려 눈꼬리가 처지는 느낌을 유지해요. 브라운 마스카라를 가볍게 한 번 발라 순한 분위기를 살려주세요.',
        layers: [{ kind: 'lashes', style: 'natural', color: '#4A3228' }],
      },
    ],
  },
  {
    id: 'eye-pure-daily',
    category: 'eye',
    title: '청순 데일리',
    subtitle: '피치 베이지로 맑은 데일리',
    tags: ['청순', '데일리', '피치'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '피치 베이지를 넓은 브러시에 소량 묻혀 눈두덩 전체에 톡톡 두드려요. 색이 도드라지지 않게 피부 톤을 살짝 밝히는 정도로만 발라주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#F6DDCB', opacity: 0.55 }],
      },
      {
        title: '연한 코랄 중간톤',
        tip: '연한 코랄을 쌍꺼풀 라인 바깥쪽 절반에 얹고 브러시를 좌우로 흔들며 안쪽으로 풀어요. 눈을 떴을 때 은은하게 비치는 정도가 딱 좋아요.',
        layers: [{ kind: 'crease', color: '#EEB9A4', opacity: 0.45 }],
      },
      {
        title: '눈머리 밝힘과 언더',
        tip: '펄 베이지를 손가락으로 눈머리에 콕 찍어 밝혀요. 언더라인 전체에는 연한 코랄을 얇게 깔아 맑은 혈색을 더해주세요.',
        layers: [
          { kind: 'innerCorner', color: '#FBEBDD' },
          { kind: 'underline', region: 'full', color: '#EEB9A4', opacity: 0.4 },
        ],
      },
      {
        title: '얇은 아이라인 그리기',
        tip: '브라운 펜슬로 속눈썹 뿌리 사이만 메우듯 아주 얇게 그려요. 눈꼬리는 따로 빼지 않고 눈 끝에서 자연스럽게 멈춰주세요.',
        layers: [{ kind: 'liner', style: 'thin', color: '#6B4A3A' }],
      },
      {
        title: '내추럴 속눈썹 마무리',
        tip: '뷰러로 뿌리를 가볍게 집어 올린 뒤 브라운 마스카라를 얇게 발라요. 뭉치지 않게 빗으로 한 번 정리하면 청순한 느낌이 완성돼요.',
        layers: [{ kind: 'lashes', style: 'natural', color: '#5A3E32' }],
      },
    ],
  },
  {
    id: 'eye-autumn-warm',
    category: 'eye',
    title: '가을웜 데일리',
    subtitle: '브릭과 카멜로 깊은 가을 눈매',
    tags: ['가을웜톤', '데일리', '브릭'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '따뜻한 카멜 베이지를 넓은 브러시에 묻혀 눈두덩 전체에 쓸어 올려요. 눈썹 아래까지 넓게 펴 발라 웜한 바탕을 고르게 만들어 주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#E9C9A8', opacity: 0.6 }],
      },
      {
        title: '테라코타 중간톤',
        tip: '테라코타를 블렌딩 브러시로 쌍꺼풀 라인과 눈두덩 바깥쪽에 얹어요. 안쪽으로 갈수록 연해지도록 좌우로 흔들며 그라데이션해 주세요.',
        layers: [
          { kind: 'crease', color: '#C98B63', opacity: 0.55 },
          { kind: 'lid', region: 'outer', color: '#C98B63', opacity: 0.5 },
        ],
      },
      {
        title: '브릭 브라운 포인트',
        tip: '브릭 브라운을 작은 브러시에 소량 묻혀 눈꼬리에 세모로 찍고 위로 풀어요. 언더 눈꼬리 1/3에도 얇게 이어 그려 눈매를 또렷하게 잡아주세요.',
        layers: [
          { kind: 'outerV', color: '#8F5535', opacity: 0.65 },
          { kind: 'underline', region: 'outer', color: '#B5734F', opacity: 0.5 },
        ],
      },
      {
        title: '브라운 아이라인',
        tip: '다크 브라운 펜슬로 점막을 메운 뒤 중간 굵기로 라인을 그려요. 눈꼬리는 눈매 각도 그대로 3mm 정도 빼서 부드럽게 마무리해 주세요.',
        layers: [{ kind: 'liner', style: 'medium', color: '#4A2E20' }],
      },
      {
        title: '속눈썹 컬링 마무리',
        tip: '뷰러로 뿌리부터 끝까지 세 번에 나눠 집어 올려요. 브라운 마스카라를 지그재그로 발라 웜한 컬러와 자연스럽게 이어주세요.',
        layers: [{ kind: 'lashes', style: 'curl', color: '#3A2418' }],
      },
    ],
  },
  {
    id: 'eye-smoky-glam',
    category: 'eye',
    title: '스모키 글램',
    subtitle: '차콜 그라데이션으로 깊은 눈매',
    tags: ['스모키', '글램', '파티'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '쿨한 그레이 베이지를 넓은 브러시로 눈두덩 전체에 펴 발라요. 어두운 색이 잘 올라가도록 손가락으로 두드려 밀착시켜 주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#CFC6C4', opacity: 0.55 }],
      },
      {
        title: '딥 브라운 중간톤',
        tip: '딥 브라운을 눈두덩 바깥 2/3 지점과 쌍꺼풀 라인 위에 넉넉히 얹어요. 위로 갈수록 연해지도록 브러시를 둥글게 굴리며 경계를 풀어주세요.',
        layers: [
          { kind: 'lid', region: 'outer', color: '#6B4A3F', opacity: 0.65 },
          { kind: 'crease', color: '#7A5A4E', opacity: 0.55 },
        ],
      },
      {
        title: '차콜 아우터와 언더',
        tip: '차콜을 작은 브러시에 묻혀 눈꼬리에서 눈두덩 중앙까지 진하게 쌓아요. 언더라인 전체에도 차콜을 깔고 눈머리로 갈수록 연하게 풀어주세요.',
        layers: [
          { kind: 'outerV', color: '#3B3235', opacity: 0.75 },
          { kind: 'underline', region: 'full', color: '#4E4346', opacity: 0.6 },
        ],
      },
      {
        title: '두꺼운 아이라인',
        tip: '블랙 젤 라이너로 점막을 꽉 채우고 눈꼬리로 갈수록 두껍게 그려요. 라인 위쪽 경계는 스머지 브러시로 살짝 뭉개 섀도우와 이어주세요.',
        layers: [{ kind: 'liner', style: 'thick', color: '#111111' }],
      },
      {
        title: '볼륨 속눈썹 마무리',
        tip: '뷰러로 뿌리부터 강하게 집어 올려요. 볼륨 마스카라를 두 번 덧발라 풍성하게 만들고 언더 속눈썹에도 꼼꼼히 발라 글램하게 마무리해요.',
        layers: [{ kind: 'lashes', style: 'volume', color: '#0E0B0B' }],
      },
    ],
  },
  {
    id: 'eye-glitter-party',
    category: 'eye',
    title: '글리터 파티',
    subtitle: '중앙 글리터로 반짝이는 눈',
    tags: ['글리터', '파티', '핑크골드'],
    illustration: 'eye',
    steps: [
      {
        title: '베이스 섀도우 깔기',
        tip: '샴페인 베이지를 넓은 브러시로 눈두덩 전체에 펴 발라요. 글리터가 잘 붙도록 프라이머 위에 얇고 고르게 깔아주세요.',
        layers: [{ kind: 'lid', region: 'full', color: '#F4E3CF', opacity: 0.6 }],
      },
      {
        title: '핑크골드 중간톤',
        tip: '핑크골드 섀도우를 쌍꺼풀 라인과 눈두덩 바깥쪽에 얹어요. 안쪽으로 갈수록 연해지게 브러시를 좌우로 흔들어 부드럽게 풀어주세요.',
        layers: [
          { kind: 'crease', color: '#E2B39A', opacity: 0.5 },
          { kind: 'lid', region: 'outer', color: '#DDA88E', opacity: 0.5 },
        ],
      },
      {
        title: '아우터 포인트와 언더',
        tip: '로즈 브라운을 작은 브러시에 묻혀 눈꼬리에 콕 찍고 위로 풀어요. 언더 눈꼬리 1/3에도 얇게 이어 그려 반짝임이 도드라질 바탕을 만들어요.',
        layers: [
          { kind: 'outerV', color: '#A86E5E', opacity: 0.6 },
          { kind: 'underline', region: 'outer', color: '#D8A48E', opacity: 0.5 },
        ],
      },
      {
        title: '브라운 아이라인',
        tip: '다크 브라운 펜슬로 속눈썹 사이를 메우며 중간 굵기로 라인을 그려요. 눈꼬리는 눈매 각도대로 살짝 빼서 화려함을 정돈해 주세요.',
        layers: [{ kind: 'liner', style: 'medium', color: '#4A3028' }],
      },
      {
        title: '글리터와 속눈썹',
        tip: '손가락 끝에 샴페인 글리터를 묻혀 눈두덩 중앙에 톡톡 얹어요. 뷰러로 속눈썹을 집어 올린 뒤 볼륨 마스카라를 발라 파티 눈매를 완성해요.',
        layers: [
          { kind: 'glitter', region: 'center', color: '#F7D9B9' },
          { kind: 'lashes', style: 'volume', color: '#2A1D18' },
        ],
      },
    ],
  },

  // =========================================================================
  //  블러셔
  // =========================================================================
  {
    id: 'blush-diagonal',
    category: 'blush',
    title: '사선 블러셔',
    subtitle: '광대에서 관자놀이로 갸름하게',
    tags: ['갸름', '사선', '윤곽'],
    illustration: 'face',
    steps: [
      {
        title: '사선 위치 잡기',
        tip: '광대뼈 가장 높은 지점에서 관자놀이 방향으로 사선을 그린다고 생각해요. 블러셔 브러시에 소량만 묻혀 아래에서 위로 한 번 쓸어 위치를 잡아주세요.',
        layers: [{ kind: 'blush', shape: 'diagonal', color: '#F0B0A8', opacity: 0.4 }],
      },
      {
        title: '색 쌓아 윤곽 살리기',
        tip: '같은 방향으로 한 번 더 겹쳐 발라 색을 쌓아요. 광대 쪽은 진하게, 관자놀이로 갈수록 연해지게 브러시 힘을 빼며 경계를 풀어주세요.',
        layers: [
          { kind: 'blush', shape: 'diagonal', color: '#E58E88', opacity: 0.5 },
          { kind: 'blend' },
        ],
      },
      {
        title: '광대 하이라이터',
        tip: '광대뼈 위 블러셔 경계 바로 위에 하이라이터를 얇게 얹어요. 손가락으로 톡톡 두드려 사선 라인을 따라 빛이 흐르게 마무리해 주세요.',
        layers: [{ kind: 'highlight', region: 'cheekbone', color: '#FFF3E6' }],
      },
    ],
  },
  {
    id: 'blush-apple',
    category: 'blush',
    title: '애플 블러셔',
    subtitle: '볼 중앙 동그랗게 동안 효과',
    tags: ['동안', '애플존', '러블리'],
    illustration: 'face',
    steps: [
      {
        title: '애플존 위치 잡기',
        tip: '살짝 웃었을 때 볼록 올라오는 볼 중앙이 애플존이에요. 크림 블러셔를 손가락에 소량 묻혀 그 중심에 콕 찍어 위치를 잡아주세요.',
        layers: [{ kind: 'blush', shape: 'apple', color: '#F5B8C0', opacity: 0.4 }],
      },
      {
        title: '동그랗게 색 쌓기',
        tip: '중심에서 바깥으로 동그란 원을 그리듯 손가락으로 톡톡 두드려요. 가운데가 가장 진하고 가장자리로 갈수록 연해지도록 경계를 풀어주세요.',
        layers: [
          { kind: 'blush', shape: 'apple', color: '#EE94A2', opacity: 0.5 },
          { kind: 'blend' },
        ],
      },
      {
        title: '큐피드 하이라이터',
        tip: '윗입술 큐피드 라인에 하이라이터를 살짝 얹어 입체감을 더해요. 손가락으로 한 번 두드려 밀착시키면 통통하고 사랑스러운 느낌이 완성돼요.',
        layers: [{ kind: 'highlight', region: 'cupid', color: '#FFF4EC' }],
      },
    ],
  },
  {
    id: 'blush-horizontal',
    category: 'blush',
    title: '가로 블러셔',
    subtitle: '눈 아래 가로로 중안부 축소',
    tags: ['중안부축소', '가로', '데일리'],
    illustration: 'face',
    steps: [
      {
        title: '눈 아래 위치 잡기',
        tip: '눈동자 바로 아래에서 시작해 귀 방향으로 가로선을 그린다고 생각해요. 브러시를 눕혀 소량으로 한 번 쓸어 높은 위치에 자리를 잡아주세요.',
        layers: [{ kind: 'blush', shape: 'horizontal', color: '#F3B9AE', opacity: 0.4 }],
      },
      {
        title: '가로로 색 쌓기',
        tip: '같은 높이에서 가로로 한 번 더 겹쳐 발라 색을 쌓아요. 아래로 번지지 않게 주의하고 코 쪽 시작점은 브러시 끝으로 살짝 연결해 주세요.',
        layers: [
          { kind: 'blush', shape: 'horizontal', color: '#EA9689', opacity: 0.5 },
          { kind: 'blend' },
        ],
      },
      {
        title: '광대 하이라이터',
        tip: '블러셔 위쪽, 광대뼈 가장 높은 곳에 하이라이터를 가로로 얇게 얹어요. 손가락으로 톡톡 두드려 눈 아래 공간이 짧아 보이게 마무리해요.',
        layers: [{ kind: 'highlight', region: 'cheekbone', color: '#FFF2E8' }],
      },
    ],
  },
  {
    id: 'blush-uzone',
    category: 'blush',
    title: 'U존 블러셔',
    subtitle: '볼을 감싸는 자연스러운 혈색',
    tags: ['혈색', 'U존', '내추럴'],
    illustration: 'face',
    steps: [
      {
        title: 'U존 위치 잡기',
        tip: '관자놀이에서 볼 아래를 지나 다시 광대로 올라오는 U자를 그린다고 생각해요. 큰 브러시에 소량 묻혀 U자 방향으로 한 번 쓸어 위치를 잡아주세요.',
        layers: [{ kind: 'blush', shape: 'uzone', color: '#F2C0B3', opacity: 0.4 }],
      },
      {
        title: 'U자로 색 쌓기',
        tip: 'U자 라인을 따라 한 번 더 겹쳐 발라 색을 쌓아요. 볼 중앙은 비워 두고 가장자리만 감싸듯 브러시를 굴려 경계를 부드럽게 풀어주세요.',
        layers: [
          { kind: 'blush', shape: 'uzone', color: '#E99E8E', opacity: 0.5 },
          { kind: 'blend' },
        ],
      },
      {
        title: '광대 하이라이터',
        tip: 'U자 안쪽, 광대뼈 위에 하이라이터를 살짝 얹어요. 손가락으로 톡톡 두드려 혈색과 광이 자연스럽게 이어지도록 마무리해 주세요.',
        layers: [{ kind: 'highlight', region: 'cheekbone', color: '#FFF3EA' }],
      },
    ],
  },

  // =========================================================================
  //  코 쉐딩
  // =========================================================================
  {
    id: 'nose-straight',
    category: 'nose',
    title: '콧대 스트레이트 쉐딩',
    subtitle: '눈썹 앞머리부터 곧게 이어서',
    tags: ['콧대', '스트레이트', '윤곽'],
    illustration: 'face',
    steps: [
      {
        title: '눈썹 앞머리에서 시작',
        tip: '작은 쉐딩 브러시에 연한 브라운을 묻혀 눈썹 앞머리 아래에서 시작해요. 눈머리 옆 움푹한 곳까지 짧게 쓸어 콧대의 시작점을 잡아주세요.',
        layers: [{ kind: 'noseShade', style: 'browStart', color: '#B99A83', opacity: 0.45 }],
      },
      {
        title: '콧대 양옆 곧게 잇기',
        tip: '시작점에서 코끝 방향으로 콧대 양옆을 일직선으로 내려 그려요. 브러시를 세워 얇게, 위에서 아래로 한 방향으로만 쓸어 경계를 깔끔하게 해주세요.',
        layers: [{ kind: 'noseShade', style: 'bridgeSides', color: '#A8836B', opacity: 0.5 }],
      },
      {
        title: '콧대 하이라이터',
        tip: '콧대 중앙에 하이라이터를 얇고 곧게 한 줄 얹어요. 쉐딩과 만나는 경계는 손가락으로 살짝 두드려 자연스럽게 이어주세요.',
        layers: [{ kind: 'highlight', region: 'noseBridge', color: '#FFF4EA' }],
      },
    ],
  },
  {
    id: 'nose-nostril',
    category: 'nose',
    title: '콧볼 축소 쉐딩',
    subtitle: '콧볼 옆을 감싸 코끝 슬림하게',
    tags: ['콧볼축소', '코끝', '윤곽'],
    illustration: 'face',
    steps: [
      {
        title: '콧대 옆 연하게 깔기',
        tip: '연한 브라운을 작은 브러시에 아주 소량만 묻혀 콧대 양옆에 얇게 깔아요. 코 전체가 어두워지지 않게 힘을 빼고 가볍게 한 번만 쓸어주세요.',
        layers: [{ kind: 'noseShade', style: 'bridgeSides', color: '#B99A83', opacity: 0.35 }],
      },
      {
        title: '콧볼 옆 감싸 쉐딩',
        tip: '조금 진한 브라운으로 콧볼이 볼과 만나는 옆면을 감싸듯 쉐딩해요. 브러시 끝으로 위에서 아래로 짧게 쓸고 콧볼 바깥쪽에서 안으로 풀어주세요.',
        layers: [{ kind: 'noseShade', style: 'nostril', color: '#9C785F', opacity: 0.55 }],
      },
      {
        title: '코끝 하이라이터',
        tip: '코끝 중앙에 하이라이터를 콕 찍어 손가락으로 톡톡 두드려요. 콧볼 쉐딩과 대비되어 코끝이 작고 오똑해 보이게 마무리돼요.',
        layers: [{ kind: 'highlight', region: 'noseTip', color: '#FFF4EA' }],
      },
    ],
  },
  {
    id: 'nose-bulbous',
    category: 'nose',
    title: '복코 전용(끊어주는) 쉐딩',
    subtitle: '콧대와 코끝을 끊어 작아 보이게',
    tags: ['복코', '코끝', '윤곽'],
    illustration: 'face',
    steps: [
      {
        title: '콧대 양옆 쉐딩',
        tip: '브라운을 작은 브러시에 묻혀 콧대 양옆을 위에서 아래로 쓸어 내려요. 코끝 직전까지만 그리고 콧볼까지 이어지지 않게 멈춰주세요.',
        layers: [{ kind: 'noseShade', style: 'bridgeSides', color: '#B08B73', opacity: 0.45 }],
      },
      {
        title: '코끝 끊어주는 쉐딩',
        tip: '콧대와 코끝이 만나는 지점에 가로로 짧게 쉐딩을 얹어 흐름을 끊어요. 코끝 아래쪽에도 살짝 쉐딩해 코끝이 퍼지지 않고 모아 보이게 해주세요.',
        layers: [
          { kind: 'noseShade', style: 'tipBreak', color: '#8F6E5A', opacity: 0.55 },
          { kind: 'noseShade', style: 'tipUnder', color: '#9C785F', opacity: 0.5 },
        ],
      },
      {
        title: '콧대만 하이라이터',
        tip: '콧대 중앙에만 하이라이터를 얇게 얹고 코끝에는 바르지 않아요. 끊어준 지점 위에서 멈춰야 코끝이 작아 보이는 효과가 유지돼요.',
        layers: [{ kind: 'highlight', region: 'noseBridge', color: '#FFF4EA' }],
      },
    ],
  },
];

export const TUTORIAL_MAP = Object.fromEntries(TUTORIALS.map((t) => [t.id, t])) as Record<string, Tutorial>;
