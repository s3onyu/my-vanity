import { useEffect, useMemo, useState } from 'react';
import type { ConcernId } from '@/types';
import { getIngredient } from '@/data';
import { CONCERN_MAP } from '@/data/concerns';
import { recommend, type Recommendation } from '@/engine/recommend';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore, useRoutine } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';
import { IngredientTags } from './ProductCard';
import { ProductThumb } from './ProductThumb';

function RecommendCard({ rec }: { rec: Recommendation }) {
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const openIngredient = useAppStore((s) => s.openIngredient);
  const showToast = useAppStore((s) => s.showToast);
  const [showIngredients, setShowIngredients] = useState(false);
  const p = rec.product;

  return (
    <article className={`rec-card${rec.warnings.length ? ' rec-card--warn' : ''}`}>
      <div className="row row--between">
        <div className="product-card__brand">{p.brand}</div>
        <div className="row" style={{ gap: 4 }}>
          {rec.fillsSunscreenGap && <Badge color="sky">빈칸 채움</Badge>}
          {rec.goodMatchIngredients.length > 0 && <Badge color="mint">잘 맞았던 성분</Badge>}
          <Badge>{p.category}</Badge>
        </div>
      </div>
      <div className="row">
        <ProductThumb product={p} size={40} />
        <div className="product-card__name flex-1">{p.name}</div>
      </div>
      <div className="row row--wrap" style={{ gap: 4 }}>
        {rec.matchedConcerns.map((c) => (
          <Badge key={c} color={CONCERN_MAP[c].colorTag}>
            {CONCERN_MAP[c].icon} {CONCERN_MAP[c].title}
          </Badge>
        ))}
      </div>
      <p className="rec-card__reason">{rec.reason}</p>
      {rec.warnings.map((w, i) => (
        <div key={i} className="notice notice--warn">
          ⚠ {w}
        </div>
      ))}
      {showIngredients && (
        <div className="rec-card__ings">
          {p.keyIngredients.map((id) => {
            const ing = getIngredient(id);
            if (!ing) return null;
            return (
              <button key={id} type="button" className="rec-card__ing" onClick={() => openIngredient(id)}>
                <span className={`ing-tag ing-tag--${ing.colorTag}`}>{ing.nameKo}</span>
                <span className="small muted flex-1 ellipsis">{ing.shortDesc}</span>
                <Icon name="chevron" size={14} />
              </button>
            );
          })}
        </div>
      )}
      {!showIngredients && <IngredientTags ids={p.keyIngredients} max={4} />}
      <div className="row mt-1">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowIngredients((v) => !v)}>
          {showIngredients ? '성분 접기' : '성분 보기'}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          style={{ marginLeft: 'auto' }}
          onClick={async () => {
            const r = await addToRoutine(p.id);
            showToast(r === 'added' ? `${activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 담았어요` : '이미 담겨 있어요');
          }}
        >
          <Icon name="plus" size={14} /> 루틴에 담기
        </button>
      </div>
    </article>
  );
}

/** FOR YOU — 고민 기반 추천 */
export function RecommendSection() {
  const profile = useAppStore((s) => s.profile);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const routines = useAppStore((s) => s.routines);
  const matches = useAppStore((s) => s.matches);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const openIngredient = useAppStore((s) => s.openIngredient);
  const current = useRoutine(activeRoutine);
  const catalog = useCatalog();

  const myConcerns = profile?.concerns ?? [];
  const [tab, setTab] = useState<ConcernId | 'all'>(myConcerns[0] ?? 'all');
  useEffect(() => {
    if (tab !== 'all' && !myConcerns.includes(tab)) setTab(myConcerns[0] ?? 'all');
  }, [myConcerns, tab]);

  const result = useMemo(
    () =>
      recommend(
        {
          routineType: activeRoutine,
          routineProductIds: current.map((r) => r.productId),
          ownedProductIds: routines.map((r) => r.productId),
          skinType: profile?.skinType ?? null,
          concerns: myConcerns,
          matches,
          concernFilter: tab,
        },
        catalog,
      ),
    [activeRoutine, current, routines, profile?.skinType, myConcerns, matches, tab, catalog],
  );

  if (myConcerns.length === 0) {
    return (
      <div className="empty">
        <strong>피부 고민을 먼저 설정해주세요</strong>
        고민과 피부 타입을 기준으로 다음 제품을 추천해요.
        <div className="mt-2">
          <button type="button" className="btn btn--sm" onClick={() => pushOverlay({ type: 'profile-edit' })}>
            프로필 설정
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="chip-scroll" role="tablist" aria-label="고민 필터">
        <Chip active={tab === 'all'} onClick={() => setTab('all')}>
          전체
        </Chip>
        {myConcerns.map((c) => (
          <Chip key={c} active={tab === c} onClick={() => setTab(c)}>
            {CONCERN_MAP[c].icon} {CONCERN_MAP[c].title}
          </Chip>
        ))}
      </div>

      {result.gaps.length > 0 && (
        <div className="stack stack--sm mt-2">
          {result.gaps.map((g) => (
            <div key={g.category} className="gap-card">
              <div className="gap-card__icon">{g.category === '선크림' ? '☀️' : '🫙'}</div>
              <div className="flex-1">
                <div className="h3">{g.title}</div>
                <p className="small muted mt-1">{g.desc}</p>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  const el = document.getElementById('product-search') as HTMLInputElement | null;
                  el?.focus();
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                검색
              </button>
            </div>
          ))}
        </div>
      )}

      {result.triggers.triggerIds.length > 0 && (
        <div className="notice notice--warn mt-2">
          기피한 제품들에{' '}
          {result.triggers.triggerIds.map((id, i) => (
            <span key={id}>
              {i > 0 && ', '}
              <button type="button" className="link-btn" onClick={() => openIngredient(id)}>
                {getIngredient(id)?.nameKo ?? id}
              </button>
            </span>
          ))}{' '}
          성분이 공통으로 들어 있어요. 이 성분이 든 제품은 추천 점수를 크게 낮췄어요. 확실한 원인은 아니니 참고만 해주세요.
        </div>
      )}

      {result.items.length === 0 ? (
        <div className="empty mt-2">
          <strong>추천할 제품이 없어요</strong>
          다른 고민 탭을 눌러보거나 기피 목록을 확인해보세요.
        </div>
      ) : (
        <div className="stack mt-2">
          {result.items.map((rec) => (
            <RecommendCard key={rec.product.id} rec={rec} />
          ))}
        </div>
      )}
      <p className="fine-print">
        추천은 설정한 고민·피부 타입·현재 루틴과의 성분 관계를 기준으로 한 참고용 순위예요. 한 브랜드에서 한 제품만 보여드려요. 효능을 보장하지
        않아요.
      </p>
    </div>
  );
}
