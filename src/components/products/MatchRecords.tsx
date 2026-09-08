import { useMemo } from 'react';
import { CATALOG, getIngredient, getProduct } from '@/data';
import { extractTriggers } from '@/engine/triggers';
import { Chip } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';

/** 내 피부 궁합 기록 — 잘 맞음 / 기피 목록과 의심 성분 안내 */
export function MatchRecords() {
  const matches = useAppStore((s) => s.matches);
  const removeMatch = useAppStore((s) => s.removeMatch);
  const openIngredient = useAppStore((s) => s.openIngredient);
  const showToast = useAppStore((s) => s.showToast);

  const good = matches.filter((m) => m.matchType === 'good');
  const avoided = matches.filter((m) => m.matchType === 'avoided');
  const triggers = useMemo(() => extractTriggers(matches, CATALOG), [matches]);

  if (matches.length === 0) {
    return (
      <div className="empty">
        <strong>아직 기록이 없어요</strong>
        검색 결과의 “👍 잘 맞았어요 / 👎 트러블 있었어요” 버튼으로 내 피부 반응을 기록해요. 기피 제품은 추천에서 제외돼요.
      </div>
    );
  }

  const chipList = (list: typeof matches, tone: 'good' | 'avoided') =>
    list.map((m) => {
      const p = getProduct(m.productId);
      if (!p) return null;
      return (
        <Chip
          key={m.id}
          small
          onRemove={async () => {
            await removeMatch(m.id);
            showToast('기록에서 뺐어요');
          }}
          title={tone === 'good' ? '잘 맞았던 제품 (누르면 삭제)' : '기피 제품 (누르면 삭제)'}
        >
          {p.brand} {p.name}
        </Chip>
      );
    });

  return (
    <div>
      <div className="match-group">
        <div className="match-group__title">
          👍 잘 맞았어요 <span className="muted small">({good.length})</span>
        </div>
        {good.length ? <div className="chip-row">{chipList(good, 'good')}</div> : <p className="small muted">아직 없어요.</p>}
      </div>
      <div className="match-group">
        <div className="match-group__title">
          👎 트러블 있었어요 <span className="muted small">({avoided.length})</span>
        </div>
        {avoided.length ? <div className="chip-row">{chipList(avoided, 'avoided')}</div> : <p className="small muted">아직 없어요.</p>}
      </div>

      {triggers.triggerIds.length > 0 && (
        <div className="notice notice--warn mt-2">
          기피한 제품들에{' '}
          {triggers.triggerIds.map((id, i) => (
            <span key={id}>
              {i > 0 && ', '}
              <button type="button" className="link-btn" onClick={() => openIngredient(id)}>
                {getIngredient(id)?.nameKo ?? id}
              </button>
            </span>
          ))}{' '}
          성분이 공통으로 들어 있어요. 이 성분이 든 다른 제품은 추천 점수를 낮춰서 보여드려요. 확실한 원인이라고 단정할 수는 없으니 참고만
          해주세요.
        </div>
      )}
      {avoided.length === 1 && (
        <p className="fine-print">기피 제품이 2개 이상 쌓이면 공통 성분을 의심 성분으로 짚어드려요.</p>
      )}
    </div>
  );
}
