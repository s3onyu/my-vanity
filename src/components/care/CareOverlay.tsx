import type { ConcernId } from '@/types';
import { ingredientsForConcern } from '@/data';
import { CONCERN_MAP } from '@/data/concerns';
import { Overlay } from '@/components/layout/Overlay';
import { IngredientRow } from '@/components/ingredients/IngredientCard';
import { useAppStore } from '@/store/useAppStore';

/** 고민별 집중 관리 상세 — 관련 성분 리스트 → 성분 상세 시트 */
export function CareOverlay({ concernId }: { concernId: ConcernId }) {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const profile = useAppStore((s) => s.profile);
  const meta = CONCERN_MAP[concernId];
  const list = ingredientsForConcern(concernId);
  // 활성 성분은 뒤로, 보습·장벽·진정 계열을 앞에 두어 초보자가 먼저 보게 한다
  const sorted = [...list].sort((a, b) => Number(a.tags?.includes('active') ?? false) - Number(b.tags?.includes('active') ?? false));
  const mine = profile?.concerns.includes(concernId);

  return (
    <Overlay title={`${meta.title} 집중 관리`} onClose={popOverlay}>
      <div className={`care-hero bg-${meta.colorTag}-2`}>
        <div className="care-hero__icon">{meta.icon}</div>
        <div className="care-hero__title">{meta.title}</div>
        <p className="care-hero__desc">{meta.desc}</p>
        {mine && <div className="small mt-2">내 프로필에 설정된 고민이에요. 추천 탭에서 이 고민으로 필터할 수 있어요.</div>}
      </div>

      <div className="section-head">
        <div>
          <div className="eyebrow">Ingredients</div>
          <h2 className="h2">자주 언급되는 성분 {sorted.length}종</h2>
        </div>
      </div>
      <div className="ing-list">
        {sorted.map((ing) => (
          <IngredientRow key={ing.id} ingredient={ing} />
        ))}
      </div>
      <p className="fine-print">
        고민별 분류는 참고용이며 진단이 아니에요. 성분 반응은 개인차가 있으니 새 제품은 소량으로 시작해보세요. 증상이 심하거나 오래가면
        전문의 상담을 권해요.
      </p>
    </Overlay>
  );
}
