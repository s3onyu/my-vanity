import type { IngredientInteraction } from '@/types';

/** 문헌 기반 성분 쌍 상호작용 — 참고용이며 개인차가 있을 수 있음 */
export const INTERACTIONS: IngredientInteraction[] = [
  // -------------------------------------------------------------------------
  //  프로토타입에서 변환 (ix01~ix32)
  // -------------------------------------------------------------------------
  {
    id: 'ix01',
    ingredientA: 'retinol',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      '레티놀은 각질 턴오버를 촉진하고 글라이콜릭애씨드는 각질세포 간 결합을 느슨하게 해요. 두 작용이 겹치면 장벽이 얇아진 상태에서 건조·홍조 같은 자극 부담이 함께 높아질 수 있어요.',
    recommendation:
      '아침·저녁으로 나누거나 요일을 번갈아 쓰는 방식이 자주 권장돼요. 처음엔 둘 다 저농도부터 시작하는 편이 무난해요.',
  },
  {
    id: 'ix02',
    ingredientA: 'retinol',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      '레티놀의 리뉴얼 작용과 살리실릭애씨드의 유용성 각질 용해가 같은 밤에 겹치면 건조와 벗겨짐이 누적될 수 있어요. 반응은 개인차가 커요.',
    recommendation:
      '초기에는 BHA 밤과 레티놀 밤을 나눠 쓰고, 피부가 적응한 뒤 조합을 시도하는 편이 무난해요.',
  },
  {
    id: 'ix03',
    ingredientA: 'retinol',
    ingredientB: 'lactic-acid',
    severity: 'caution',
    reason:
      '락틱애씨드는 AHA 중 순한 편이지만 각질층에 작용하는 건 같아서, 레티놀과 겹치면 자극 부담이 늘 수 있어요. 다만 글라이콜릭보다는 여지가 있는 조합이에요.',
    recommendation:
      '격일로 나누거나 시간대를 분리해 쓰는 방식이 자주 권장돼요. 저농도 락틱이라면 반응을 보며 조절해도 괜찮아요.',
  },
  {
    id: 'ix04',
    ingredientA: 'glycolic-acid',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      'AHA(수용성)와 BHA(유용성)는 작용 위치는 달라도 모두 각질 결합을 느슨하게 해요. 같은 단계에 겹치면 각질 관리 강도가 과해져 따가움과 건조가 누적될 수 있어요.',
    recommendation:
      '같은 시간대에 함께 쓰는 빈도를 낮추고, 진정·보습 케어를 더하는 방식이 자주 권장돼요. 하나만 골라 시작해도 충분해요.',
  },
  {
    id: 'ix05',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '순수 비타민C는 pH 3.5 이하에서 안정·흡수되는데, 이 낮은 pH 환경이 레티놀 자극과 겹치면 홍조·따끔함 부담이 커질 수 있어요 (Pinnell et al., 2001).',
    recommendation:
      '비타민C는 아침, 레티놀은 저녁으로 나누는 흐름이 대표적이에요. 아침 비타민C 뒤엔 자외선 차단제를 챙기면 좋아요.',
  },
  {
    id: 'ix06',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'niacinamide',
    severity: 'neutral',
    reason:
      '나이아신아마이드가 니코틴산으로 바뀌어 홍조를 낸다는 우려는 고온·장기 보관 조건의 이야기로, 현대 제형에선 거의 의미가 없어요. 다만 저pH 비타민C와 동시 도포 시 일시적 홍조는 개인차로 있을 수 있어요.',
    recommendation:
      '자극이 없다면 함께 써도 괜찮고, 예민한 편이면 비타민C 뒤 잠시 텀을 두거나 시간대를 나누는 방법도 있어요.',
  },
  {
    id: 'ix07',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'tocopherol',
    severity: 'good',
    reason:
      '수용성 비타민C와 지용성 비타민E는 서로를 재생시키는 항산화 네트워크를 이루며, 함께 배합하면 광보호 효과가 상승하는 것으로 보고돼요 (Lin et al., 2003).',
    recommendation:
      '같은 처방에 함께 든 제품이 흔해요. 아침 항산화 세럼으로 쓰고 위에 자외선 차단제를 덧바르는 흐름이 무난해요.',
  },
  {
    id: 'ix08',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'ferulic-acid',
    severity: 'good',
    reason:
      '페룰릭애씨드는 비타민C·E 제형의 안정성을 높이고, 세 성분 조합 시 광보호 효과가 단독 대비 크게 증가한 것으로 보고돼요 (Lin et al., 2005).',
    recommendation:
      'C+E+페룰릭 조합은 클래식한 아침 항산화 루틴이에요. 개봉 후엔 빛·열을 피해 보관하고 색이 짙어지면 교체하는 편이 좋아요.',
  },
  {
    id: 'ix09',
    ingredientA: 'hyaluronic-acid',
    ingredientB: 'ceramide',
    severity: 'good',
    reason:
      '히알루론산은 수분을 끌어당기는 휴멕턴트이고 세라마이드는 각질층 지질로 그 수분이 빠져나가지 않게 붙잡아요. 역할이 다르게 보완되는 대표 조합이에요.',
    recommendation:
      '히알루론산 세럼 위에 세라마이드 크림으로 마무리하는 순서가 무난해요. 건조한 환경일수록 위를 덮어주는 게 도움이 돼요.',
  },
  {
    id: 'ix10',
    ingredientA: 'niacinamide',
    ingredientB: 'hyaluronic-acid',
    severity: 'good',
    reason:
      '나이아신아마이드는 pH에 덜 민감하고 자극이 낮은 편이라 보습 성분과 부담 없이 어울려요. 장벽 지질 합성을 돕는 작용과 수분 공급이 겹쳐 시너지로 언급돼요.',
    recommendation:
      '거의 모든 루틴에서 함께 사용돼요. 순서는 크게 상관없지만 가벼운 제형을 먼저 바르는 편이 흔해요.',
  },
  {
    id: 'ix11',
    ingredientA: 'niacinamide',
    ingredientB: 'retinol',
    severity: 'good',
    reason:
      '나이아신아마이드가 장벽 기능을 지지해 레티노이드 초기 자극(홍조·건조)을 줄이는 데 도움이 될 수 있다는 임상 보고가 있어요 (Draelos, Ertel & Berge, 2006).',
    recommendation:
      '저녁 루틴에서 나이아신아마이드 세럼 뒤 레티놀을 올리거나, 함께 배합된 제품을 쓰는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix12',
    ingredientA: 'retinol',
    ingredientB: 'ceramide',
    severity: 'good',
    reason:
      '레티놀은 초기에 경표피수분손실(TEWL)을 늘릴 수 있는데, 세라마이드가 각질층 지질을 보충해 그 건조·자극 부담을 완충하는 것으로 알려져 있어요.',
    recommendation:
      "레티놀 위에 세라마이드 크림으로 마무리하는 순서가 흔해요. 예민한 시기엔 크림을 먼저 바르는 '버퍼링'도 방법이에요.",
  },
  {
    id: 'ix13',
    ingredientA: 'retinol',
    ingredientB: 'panthenol',
    severity: 'good',
    reason:
      '판테놀은 피부에서 판토텐산으로 전환돼 장벽 회복과 진정에 관여해요. 레티놀 적응기의 건조·따가움을 완화하는 보조 성분으로 자주 조합돼요.',
    recommendation:
      '레티놀 초기 A-반응기에 특히 유용해요. 레티놀 전후 어느 단계에 두어도 부담이 적어요.',
  },
  {
    id: 'ix14',
    ingredientA: 'retinol',
    ingredientB: 'peptides',
    severity: 'good',
    reason:
      '레티놀과 펩타이드는 탄력 접근 경로가 달라 겹쳐도 자극이 늘지 않는 편이에요. 펩타이드는 pH에 덜 예민해 레티놀 제형과도 무난하게 어울려요.',
    recommendation:
      '같은 저녁 루틴에 두어도 괜찮아요. 펩타이드 세럼 뒤 레티놀, 또는 함께 배합된 제품 모두 흔해요.',
  },
  {
    id: 'ix15',
    ingredientA: 'salicylic-acid',
    ingredientB: 'niacinamide',
    severity: 'good',
    reason:
      'BHA가 모공 속 피지·각질을 관리하고, 나이아신아마이드가 피지 분비 조절과 장벽 지지를 맡아 트러블 경향 루틴에서 역할이 보완돼요. 나이아신아마이드가 BHA 자극을 완충한다는 언급도 있어요.',
    recommendation:
      'BHA 토너 뒤 나이아신아마이드 세럼 순서가 흔해요. 따가움이 있으면 BHA 빈도부터 조절해보세요.',
  },
  {
    id: 'ix16',
    ingredientA: 'centella',
    ingredientB: 'panthenol',
    severity: 'good',
    reason:
      '병풀 추출물(마데카소사이드 등)과 판테놀은 모두 진정·장벽 지지 목적으로 쓰이며 자극이 낮아 함께 배합돼도 부담이 거의 없는 조합이에요.',
    recommendation:
      '거의 모든 순서에서 유연하게 배치할 수 있어요. 활성 성분 사용으로 예민해진 시기에 함께 두면 좋아요.',
  },
  {
    id: 'ix17',
    ingredientA: 'niacinamide',
    ingredientB: 'panthenol',
    severity: 'good',
    reason:
      '두 성분 모두 pH 의존성이 낮고 자극이 적은 편이에요. 나이아신아마이드의 장벽 지질 합성 지원과 판테놀의 보습·진정이 겹쳐 편안한 조합으로 알려져 있어요.',
    recommendation:
      '대부분의 루틴에서 함께 쓰기 좋아요. 순서 제약이 거의 없어 제형이 가벼운 순으로 바르면 돼요.',
  },
  {
    id: 'ix18',
    ingredientA: 'alpha-arbutin',
    ingredientB: 'niacinamide',
    severity: 'good',
    reason:
      '알파-알부틴은 티로시나아제 활성에, 나이아신아마이드는 멜라노좀 전달에 관여해 톤 케어 경로가 달라요. 서로 다른 단계를 맡아 함께 배합되는 경우가 흔해요 (Hakozaki et al., 2002).',
    recommendation:
      '함께 배합된 세럼도 많아요. 낮에는 자외선 차단제를 챙겨야 톤 케어 효과가 유지되는 편이에요.',
  },
  {
    id: 'ix19',
    ingredientA: 'tea-tree',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      '티트리오일은 항균 목적 정유로 그 자체가 건조·감작 가능성이 있고, 살리실릭애씨드는 피지·각질을 녹여요. 같은 트러블 루틴에서 겹치면 건조함과 따가움이 늘 수 있어요.',
    recommendation:
      '한쪽은 부분 사용(스팟)으로 두거나 사용 빈도를 낮추는 방식이 자주 권장돼요. 티트리는 희석된 제품이 무난해요.',
  },
  {
    id: 'ix20',
    ingredientA: 'tea-tree',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '레티놀로 장벽이 얇아진 상태에서 정유 성분이 겹치면 접촉 감작이나 자극 반응 확률이 높아질 수 있어요. 티트리오일은 산화되면 감작성이 더 커지는 것으로 알려져 있어요 (SCCS Opinion, 2008).',
    recommendation:
      '레티놀을 쓰는 날엔 티트리 제품을 스팟에만 쓰거나 아침으로 옮기는 방식이 있어요. 개봉한 지 오래된 티트리는 피하는 편이 좋아요.',
  },
  {
    id: 'ix21',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      '둘 다 pH 3~4 부근의 낮은 산성에서 작동하는 성분이라, 같은 단계에 겹치면 각질층에 산성 부하가 누적돼 따끔함과 홍조가 겹칠 수 있어요.',
    recommendation:
      '비타민C는 아침, 글라이콜릭은 저녁으로 나누는 구성이 흔해요. 둘 다 처음이라면 하나씩 적응한 뒤 조합해보세요.',
  },
  {
    id: 'ix22',
    ingredientA: 'retinol',
    ingredientB: 'bakuchiol',
    severity: 'caution',
    reason:
      '바쿠치올은 레티놀과 구조는 다르지만 유사한 유전자 발현 경로에 작용하는 것으로 보고돼요 (Chaudhuri & Bojanowski, 2014). 같은 방향의 성분을 겹치면 자극이 늘 수 있어요.',
    recommendation:
      '하나로 시작해 피부 반응을 본 뒤 조정하는 편이 무난해요. 바쿠치올을 레티놀 쉬는 날에 쓰는 방식도 있어요.',
  },
  {
    id: 'ix23',
    ingredientA: 'urea',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      '우레아는 10% 이상 고농도에서 각질 연화(케라톨리틱) 작용이 나타나고, 글라이콜릭애씨드도 각질 결합을 느슨하게 해요. 두 작용이 겹치면 따끔함이 생길 수 있어요.',
    recommendation:
      '고농도 제품끼리는 같은 루틴에 두지 않는 편이 좋아요. 저농도 우레아(5% 이하)는 보습 목적이라 부담이 적어요.',
  },
  {
    id: 'ix24',
    ingredientA: 'salicylic-acid',
    ingredientB: 'lactic-acid',
    severity: 'caution',
    reason:
      'BHA와 AHA는 작용 위치(모공 속 vs 표면)가 달라도 모두 각질 결합을 느슨하게 해요. 함께 쓰면 각질 관리가 과해져 건조·민감 부담이 커질 수 있어요.',
    recommendation:
      '하나로 시작해 주 1~2회부터 늘려가는 방식이 흔히 권장돼요. 둘 다 쓴다면 요일을 나누는 편이 무난해요.',
  },
  {
    id: 'ix25',
    ingredientA: 'azelaic-acid',
    ingredientB: 'niacinamide',
    severity: 'good',
    reason:
      '아젤라익애씨드는 티로시나아제 억제와 항염 작용, 나이아신아마이드는 멜라노좀 전달 억제와 피지 조절로 경로가 달라 톤·트러블 루틴에서 보완적으로 쓰여요.',
    recommendation:
      '함께 배합된 제품도 흔해요. 아젤라익 특유의 따끔함이 느껴지면 나이아신아마이드를 먼저 바르고 빈도를 조절해보세요.',
  },
  {
    id: 'ix26',
    ingredientA: 'tranexamic-acid',
    ingredientB: 'niacinamide',
    severity: 'good',
    reason:
      '트라넥사믹애씨드는 플라스민 경로를 통한 멜라닌 자극 신호를, 나이아신아마이드는 멜라노좀 전달을 줄이는 것으로 알려져 있어요. 색소 흔적 루틴의 대표 조합이에요.',
    recommendation:
      '아침·저녁 어느 쪽이든 무난하고, 낮에는 자외선 차단을 함께 챙기면 좋아요. 자극이 낮아 초보자도 접근하기 쉬워요.',
  },
  {
    id: 'ix27',
    ingredientA: 'ceramide',
    ingredientB: 'cholesterol',
    severity: 'good',
    reason:
      '각질층 지질은 세라마이드·콜레스테롤·지방산으로 이뤄지며, 세 가지를 함께 보충할 때 장벽 회복이 빨라진 것으로 보고돼요 (Man, Feingold & Elias, 1993).',
    recommendation:
      '건조하고 예민한 시기에 자주 선택돼요. 두 성분이 함께 배합된 장벽 크림을 마지막 단계에 두는 방식이 무난해요.',
  },
  {
    id: 'ix28',
    ingredientA: 'adenosine',
    ingredientB: 'peptides',
    severity: 'good',
    reason:
      '아데노신은 식약처 고시 주름 기능성 성분이고 펩타이드는 신호 전달로 탄력을 돕는 성분이에요. 둘 다 자극이 낮고 pH 제약이 적어 함께 쓰기 편해요.',
    recommendation:
      '탄력 루틴에서 아침·저녁 구분 없이 함께 두어도 괜찮아요. 함께 배합된 크림·앰플도 흔해요.',
  },
  {
    id: 'ix29',
    ingredientA: 'centella',
    ingredientB: 'retinol',
    severity: 'good',
    reason:
      '병풀의 마데카소사이드·아시아티코사이드는 염증 신호를 낮추고 장벽 회복을 돕는 것으로 보고돼, 레티놀 적응기의 홍조·건조 부담을 덜어주는 구성으로 자주 쓰여요.',
    recommendation:
      '레티놀 전에 병풀 토너·앰플로 바탕을 만들거나, 뒤에 시카 크림으로 덮는 방식 모두 흔해요.',
  },
  {
    id: 'ix30',
    ingredientA: 'squalane',
    ingredientB: 'retinol',
    severity: 'good',
    reason:
      '스쿠알란은 피부 피지 성분과 유사한 구조의 안정적인 오일로, 레티놀 사용 초기의 건조함과 벗겨짐을 완충해요. 산화 안정성이 높아 레티놀 제형 안정에도 유리해요.',
    recommendation:
      '레티놀 세럼 뒤 스쿠알란 오일로 마무리하거나, 예민한 날엔 스쿠알란에 레티놀을 섞어 희석하는 방식도 있어요.',
  },
  {
    id: 'ix31',
    ingredientA: 'panthenol',
    ingredientB: 'salicylic-acid',
    severity: 'good',
    reason:
      '살리실릭애씨드의 각질 용해로 생길 수 있는 건조·당김을 판테놀의 보습·진정이 보완해요. 판테놀은 pH 제약이 적어 BHA 제형과도 무난하게 어울려요.',
    recommendation:
      'BHA 뒤 판테놀 앰플이나 크림으로 마무리하는 순서가 흔해요. 트러블 루틴에서 건조함이 느껴질 때 특히 유용해요.',
  },
  {
    id: 'ix32',
    ingredientA: 'zinc-pca',
    ingredientB: 'niacinamide',
    severity: 'good',
    reason:
      '징크PCA의 수렴·피지 조절과 나이아신아마이드의 피지 분비 감소 작용이 겹쳐, 번들거림 관리 쪽에서 함께 배합되는 경우가 많아요 (Draelos et al., 2006).',
    recommendation:
      '함께 배합된 세럼이 흔해요. 지성·복합성 피부의 T존 관리에 아침 루틴으로 두는 방식이 무난해요.',
  },

  // -------------------------------------------------------------------------
  //  신규 추가 (ix33~)
  // -------------------------------------------------------------------------
  {
    id: 'ix33',
    ingredientA: 'retinol',
    ingredientB: 'benzoyl-peroxide',
    severity: 'high_caution',
    reason:
      '벤조일퍼옥사이드는 강한 산화제라 레티놀을 산화시켜 활성을 떨어뜨릴 수 있어요. 트레티노인이 BP와 접촉 시 수 시간 내 크게 분해된 보고가 있고(Martin et al., 1998), 두 성분의 자극도 누적돼요.',
    recommendation:
      '아침 BP, 저녁 레티놀로 시간대를 완전히 나누는 방식이 자주 권장돼요. 같은 날 쓰기 부담스러우면 격일로 나눠도 좋아요.',
  },
  {
    id: 'ix34',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'benzoyl-peroxide',
    severity: 'high_caution',
    reason:
      '순수 비타민C는 산화에 매우 취약한 환원제이고, 벤조일퍼옥사이드는 산화제예요. 같은 단계에 겹치면 비타민C가 빠르게 산화돼 항산화 효과를 기대하기 어려워요.',
    recommendation:
      '비타민C는 아침, BP는 저녁으로 완전히 나누거나 BP를 세안제 타입으로 바꾸는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix35',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'copper-peptide',
    severity: 'caution',
    reason:
      '구리 이온은 아스코빅애씨드의 산화를 촉매하는 전이금속으로 알려져 있어요 (Buettner & Jurkiewicz, 1996). 저pH 비타민C가 구리펩타이드 복합체를 불안정하게 할 가능성도 언급돼요.',
    recommendation:
      '비타민C는 아침, 구리펩타이드는 저녁으로 나누는 편이 무난해요. 비타민C 유도체(아스코빌글루코사이드 등)라면 부담이 덜해요.',
  },
  {
    id: 'ix36',
    ingredientA: 'retinal',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      '레티날은 레티놀보다 레티노산 전환이 빠르고 강해요. 글라이콜릭애씨드의 각질 용해가 겹치면 A-반응(건조·벗겨짐·홍조)이 더 뚜렷해질 수 있어요.',
    recommendation:
      '레티날 밤과 AHA 밤을 요일로 나누는 방식이 자주 권장돼요. 레티날은 0.05% 이하 저농도부터 시작하는 편이 무난해요.',
  },
  {
    id: 'ix37',
    ingredientA: 'retinal',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      '레티날의 강한 리뉴얼 작용과 BHA의 유용성 각질 용해가 겹치면 자극과 건조가 누적될 수 있어요. 트러블 루틴에서 흔히 겹치는 조합이라 특히 살펴볼 필요가 있어요.',
    recommendation:
      'BHA는 아침 또는 레티날 쉬는 날에 쓰는 방식이 흔해요. 스팟 사용이라면 부위를 겹치지 않게 두는 것도 방법이에요.',
  },
  {
    id: 'ix38',
    ingredientA: 'hpr',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      'HPR은 레티노산 수용체에 직접 결합하는 에스터로 레티놀보다 자극이 완만한 편이지만, 여전히 각질 턴오버를 촉진해요. AHA와 겹치면 건조·따가움이 늘 수 있어요.',
    recommendation:
      '레티놀보다 여지는 있지만 요일을 나누는 편이 무난해요. 함께 쓴다면 저농도 AHA(5% 이하)부터 시도해보세요.',
  },
  {
    id: 'ix39',
    ingredientA: 'glycolic-acid',
    ingredientB: 'lactic-acid',
    severity: 'caution',
    reason:
      '둘 다 AHA로 같은 방식(각질세포 간 결합 약화)으로 작용해요. 두 제품에 나눠 들어 있으면 총 산 농도가 의도치 않게 높아져 pH 부하와 자극이 누적될 수 있어요.',
    recommendation:
      'AHA는 한 종류만 고르는 편이 무난해요. 둘 다 쓰고 싶다면 이미 함께 배합된 단일 제품을 선택하는 방식이 있어요.',
  },
  {
    id: 'ix40',
    ingredientA: 'tea-tree',
    ingredientB: 'benzoyl-peroxide',
    severity: 'caution',
    reason:
      '두 성분 모두 여드름 균을 겨냥하지만 각각 건조·자극 부담이 있어요. 티트리오일 5%와 BP 5% 비교 연구에서 티트리도 자극 보고가 있었고(Bassett et al., 1990), 겹치면 부담이 누적돼요.',
    recommendation:
      '한 가지만 골라 쓰거나, BP는 세안제·티트리는 스팟으로 역할을 나누는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix41',
    ingredientA: 'azelaic-acid',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '아젤라익애씨드는 pH 4~5의 약산성 제형이 흔하고 초반 따끔함이 있어요. 레티놀 적응기와 겹치면 홍조·따가움이 함께 커질 수 있지만, 적응 후에는 함께 쓰이는 조합이기도 해요.',
    recommendation:
      '처음엔 아침 아젤라익·저녁 레티놀로 나누고, 두 성분에 각각 적응한 뒤 같은 저녁에 합치는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix42',
    ingredientA: 'alpha-arbutin',
    ingredientB: 'ascorbic-acid',
    severity: 'neutral',
    reason:
      '알파-알부틴은 넓은 pH 범위에서 안정적이라 저pH 비타민C와 함께 있어도 서로를 방해하지 않아요. 티로시나아제 억제와 멜라닌 환원으로 경로가 달라 함께 배합되기도 해요.',
    recommendation:
      '함께 써도 부담이 적고, 나눠 쓴다면 비타민C 아침·알부틴 저녁이 흔해요. 낮에는 자외선 차단제를 꼭 챙기세요.',
  },
  {
    id: 'ix43',
    ingredientA: 'gluconolactone',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '글루코노락톤(PHA)은 분자가 커서 AHA보다 천천히 작용하고 보습감도 있지만, 각질 결합을 느슨하게 하는 계열인 건 같아요. 레티놀과 겹치면 부담이 완만하게 누적될 수 있어요.',
    recommendation:
      'AHA보다 여지는 있어 적응된 피부라면 함께 쓰기도 해요. 처음엔 PHA를 아침, 레티놀을 저녁으로 나누는 편이 무난해요.',
  },
  {
    id: 'ix44',
    ingredientA: 'urea',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '우레아는 10% 이상에서 각질 연화 작용이 나타나 레티놀의 리뉴얼과 겹치면 벗겨짐·따가움이 늘 수 있어요. 반면 5% 이하 저농도 우레아는 보습 목적이라 레티놀 건조를 보완하기도 해요.',
    recommendation:
      '고농도 우레아는 레티놀과 다른 날에 쓰고, 저농도 우레아 크림은 레티놀 위에 보습용으로 얹는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix45',
    ingredientA: 'sulfur',
    ingredientB: 'benzoyl-peroxide',
    severity: 'caution',
    reason:
      '유황과 벤조일퍼옥사이드는 둘 다 트러블 루틴의 항균 성분이지만 각각 건조·벗겨짐 부담이 있어요. 겹치면 피지가 과도하게 줄어 장벽 건조가 누적될 수 있어요.',
    recommendation:
      '역할이 비슷하니 하나만 고르거나, 부위를 나눠 스팟으로 쓰는 편이 무난해요. 보습 크림으로 마무리하면 부담이 줄어요.',
  },
  {
    id: 'ix46',
    ingredientA: 'lavender-oil',
    ingredientB: 'tea-tree',
    severity: 'caution',
    reason:
      '라벤더오일의 리날룰과 티트리오일의 테르펜 성분은 공기 중 산화되면 접촉 감작 물질이 되는 것으로 알려져 있어요 (SCCS Opinion, 2012). 정유가 겹치면 감작 노출량이 누적돼요.',
    recommendation:
      '정유 함유 제품은 한 가지로 제한하고, 새 제품은 팔 안쪽에 패치 테스트 후 쓰는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix47',
    ingredientA: 'fragrance',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '레티놀 적응기엔 장벽이 일시적으로 얇아져 외부 물질 침투가 늘어요. 이 상태에서 향료(파르퓸)의 감작 성분에 노출되면 접촉 알레르기 확률이 높아질 수 있어요.',
    recommendation:
      '레티놀을 쓰는 동안엔 무향 제품으로 루틴을 구성하는 편이 무난해요. 향이 있는 제품은 아침이나 적응 후에 더하는 방식이 있어요.',
  },
  {
    id: 'ix48',
    ingredientA: 'alcohol-denat',
    ingredientB: 'retinol',
    severity: 'caution',
    reason:
      '변성알코올이 상위에 배합된 제형은 각질층 지질을 일부 녹여 장벽을 약화시킬 수 있어요. 레티놀로 이미 예민해진 상태에서 겹치면 건조·따가움이 커질 수 있어요.',
    recommendation:
      '레티놀 루틴에선 알코올이 앞쪽에 적힌 토너·미스트를 줄이는 편이 무난해요. 소량 배합(전성분 뒤쪽)이라면 부담은 적어요.',
  },
  {
    id: 'ix49',
    ingredientA: 'alcohol-denat',
    ingredientB: 'glycolic-acid',
    severity: 'caution',
    reason:
      '글라이콜릭애씨드가 각질층을 느슨하게 한 상태에서 고함량 알코올이 지질을 씻어내면 경표피수분손실이 함께 늘 수 있어요. AHA 토너에 알코올이 함께 든 경우도 있으니 전성분을 확인해보세요.',
    recommendation:
      'AHA를 쓰는 날엔 알코올 함량 높은 토너·수렴 제품을 빼고, 보습 단계를 하나 더하는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix50',
    ingredientA: 'ceramide',
    ingredientB: 'fatty-acids',
    severity: 'good',
    reason:
      '각질층 지질은 세라마이드·콜레스테롤·지방산이 약 3:1:1 비율을 이룰 때 장벽 회복에 가장 유리한 것으로 보고돼요 (Man et al., 1996). 리놀레익애씨드는 세라마이드 합성 재료이기도 해요.',
    recommendation:
      '함께 배합된 장벽 크림을 루틴 마지막에 두는 방식이 무난해요. 건조·예민한 시기에 특히 도움이 돼요.',
  },
  {
    id: 'ix51',
    ingredientA: 'hyaluronic-acid',
    ingredientB: 'glycerin',
    severity: 'good',
    reason:
      '글리세린은 각질층 깊이 스며드는 소분자 휴멕턴트, 히알루론산은 표면에서 수분막을 만드는 고분자 휴멕턴트예요. 층이 달라 함께 배합될 때 보습 지속성이 좋아져요.',
    recommendation:
      '거의 모든 보습 제품에 함께 들어 있어요. 건조한 환경이라면 위에 크림으로 덮어 수분 증발을 막는 편이 좋아요.',
  },
  {
    id: 'ix52',
    ingredientA: 'panthenol',
    ingredientB: 'madecassoside',
    severity: 'good',
    reason:
      '마데카소사이드는 병풀의 대표 진정 활성 성분으로 염증 신호를 낮추고, 판테놀은 장벽 회복과 수분 유지를 도와요. 둘 다 저자극이라 진정 라인에서 함께 배합되는 조합이에요.',
    recommendation:
      '활성 성분으로 예민해진 시기에 함께 두면 좋아요. 아침·저녁 구분 없이 어느 단계에 배치해도 부담이 적어요.',
  },
  {
    id: 'ix53',
    ingredientA: 'centella',
    ingredientB: 'salicylic-acid',
    severity: 'good',
    reason:
      'BHA의 각질 용해 뒤 생길 수 있는 홍조·따가움을 병풀 추출물의 진정 작용이 완충해요. 트러블 루틴에서 BHA와 시카가 짝으로 배합되는 이유예요.',
    recommendation:
      'BHA 토너 뒤 병풀 앰플·크림으로 마무리하는 순서가 흔해요. BHA가 따가운 날엔 시카 단계를 두껍게 얹어도 좋아요.',
  },
  {
    id: 'ix54',
    ingredientA: 'zinc-oxide',
    ingredientB: 'niacinamide',
    severity: 'neutral',
    reason:
      '징크옥사이드는 무기 자외선 차단제로 피부 표면에 머물고, 나이아신아마이드는 수용성 활성 성분이라 서로 화학적으로 간섭하지 않아요. 둘 다 진정 목적으로도 쓰여 함께 있어도 무난해요.',
    recommendation:
      '나이아신아마이드 세럼 뒤 징크옥사이드 선크림을 올리는 일반적인 아침 순서면 충분해요. 특별히 나눌 필요는 없어요.',
  },
  {
    id: 'ix55',
    ingredientA: 'retinal',
    ingredientB: 'benzoyl-peroxide',
    severity: 'high_caution',
    reason:
      '레티날은 알데하이드 구조라 산화에 특히 민감해요. 산화제인 벤조일퍼옥사이드와 겹치면 활성 저하가 빠르고, 레티날 자체의 강한 A-반응과 BP 자극이 동시에 누적될 수 있어요.',
    recommendation:
      '아침 BP, 저녁 레티날로 완전히 나누거나 BP를 세안제로 바꾸는 방식이 자주 권장돼요. 격일 사용도 방법이에요.',
  },
  {
    id: 'ix56',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'retinal',
    severity: 'high_caution',
    reason:
      '레티날은 레티노산까지 한 단계만 거치면 돼 레티놀보다 전환이 빠르고 작용이 뚜렷한 편이에요 (Sorg et al., 2006). 여기에 pH 3.5 이하 비타민C의 산성 부하가 겹치면 홍조·따가움이 크게 누적될 수 있어요.',
    recommendation:
      '비타민C 아침, 레티날 저녁으로 완전히 나누는 편이 무난해요. 둘 다 처음이라면 한 가지에 먼저 적응한 뒤 더해보세요.',
  },
  {
    id: 'ix57',
    ingredientA: 'benzoyl-peroxide',
    ingredientB: 'glycolic-acid',
    severity: 'high_caution',
    reason:
      '벤조일퍼옥사이드는 단독으로도 자극성 접촉피부염이 흔한 성분이에요. 글라이콜릭애씨드가 각질층을 느슨하게 만든 상태에선 BP 침투와 산화 스트레스가 커져 자극이 크게 누적될 수 있어요.',
    recommendation:
      '같은 날 겹치지 않게 요일을 나누는 방식이 자주 권장돼요. BP 사용 중이라면 AHA 대신 저농도 BHA나 PHA로 바꾸는 것도 방법이에요.',
  },
  {
    id: 'ix58',
    ingredientA: 'retinol',
    ingredientB: 'retinal',
    severity: 'high_caution',
    reason:
      '두 성분은 모두 피부에서 레티노산으로 전환되는 같은 경로의 레티노이드예요. 다른 제품으로 겹쳐 쓰면 의도치 않게 총 레티노이드 용량이 높아져 A-반응(건조·벗겨짐·홍조)이 강하게 올 수 있어요 (Kligman, 1986).',
    recommendation:
      '레티노이드는 한 종류만 고르는 편이 무난해요. 바꾸고 싶다면 하나를 완전히 끊고 다른 하나를 저농도부터 시작하는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix59',
    ingredientA: 'benzoyl-peroxide',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      '둘 다 트러블 루틴의 핵심 성분이지만 각각 건조·벗겨짐이 흔해요. 레이브온 제형으로 동시에 겹치면 자극 부담이 누적될 수 있어요. 다만 세안제와 레이브온으로 역할을 나누면 함께 쓰이기도 해요.',
    recommendation:
      'BP는 세안제, BHA는 레이브온처럼 노출 시간을 나누거나 아침·저녁으로 분리하는 방식이 자주 권장돼요.',
  },
  {
    id: 'ix60',
    ingredientA: 'ascorbic-acid',
    ingredientB: 'salicylic-acid',
    severity: 'caution',
    reason:
      '순수 비타민C(pH 3.5 이하)와 살리실릭애씨드(pH 3~4)는 둘 다 낮은 pH에서 작동해요. 같은 단계에 겹치면 산성 부하가 누적돼 따끔함과 홍조가 겹칠 수 있어요.',
    recommendation:
      '비타민C는 아침, BHA는 저녁으로 나누는 구성이 흔해요. 예민하다면 비타민C 유도체로 바꾸는 방법도 있어요.',
  },
  {
    id: 'ix61',
    ingredientA: 'avobenzone',
    ingredientB: 'zinc-oxide',
    severity: 'neutral',
    reason:
      '코팅되지 않은 산화아연·티타늄이 같은 제형 안에서 아보벤존 광분해를 촉진할 수 있다는 보고가 있지만, 시판 제품의 무기 필터는 대부분 코팅 처리돼 있어 별개 제품을 겹쳐 발라도 큰 의미는 없어요.',
    recommendation:
      '선크림을 두 겹 바르는 건 보통 괜찮아요. 다만 섞어 바르기보다 한 제품을 충분한 양(2mg/cm²)으로 바르는 편이 더 중요해요.',
  },
];
