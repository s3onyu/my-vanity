import { useMemo, useState } from 'react';
import { resolveSources } from '@/data/sources';
import { buildProductHistories } from '@/engine/productHistory';
import {
  FIT_SOURCE_IDS,
  MIN_AVOIDED,
  MIN_GOOD,
  recommendByFit,
  type FitConfidence,
  type FitRecommendation,
  type IngredientSignal,
} from '@/engine/personalFit';
import { Badge } from '@/components/ui/Chip';
import { Foldable } from '@/components/ui/Foldable';
import { Icon } from '@/components/ui/Icon';
import { SourceList } from '@/components/evidence/SourceList';
import { useAppStore } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';
import { IngredientTags } from './ProductCard';
import { ProductThumb } from './ProductThumb';

const CONFIDENCE_LABEL: Record<FitConfidence, string> = {
  high: '기록 충분',
  medium: '기록 보통',
  low: '기록 적음',
};

/** 피부 기록에서 이 횟수 이상 자극감이 높았던 제품은 안 맞은 쪽으로 같이 센다 */
const IRRITATED_LOGS = 2;

function SignalChip({ signal, tone }: { signal: IngredientSignal; tone: 'favorite' | 'suspect' }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  const count = tone === 'favorite' ? `${signal.goodCount}/${signal.goodTotal}` : `${signal.avoidedCount}/${signal.avoidedTotal}`;
  // 자극 보고가 드문 성분이 안 맞은 쪽에 겹친 경우 — 흐리게 보여 우연일 수 있음을 드러낸다
  const weak = tone === 'suspect' && !signal.notable;
  return (
    <button
      type="button"
      className={`fit-chip fit-chip--${tone}${weak ? ' fit-chip--weak' : ''}`}
      onClick={() => openIngredient(signal.ingredientId)}
      title={`${CONFIDENCE_LABEL[signal.confidence]}${weak ? ' · 자극 보고가 드문 성분' : ''} · 눌러서 성분 설명 보기`}
    >
      <span className="fit-chip__name">{signal.name}</span>
      <span className="fit-chip__count">{count}</span>
    </button>
  );
}

function FitCard({ rec }: { rec: FitRecommendation }) {
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const showToast = useAppStore((s) => s.showToast);
  const p = rec.product;

  return (
    <article className={`rec-card${rec.cautions.length ? ' rec-card--warn' : ''}`}>
      <div className="row row--between">
        <div className="product-card__brand">{p.brand}</div>
        <div className="row" style={{ gap: 4 }}>
          {rec.favoriteHits.length > 0 && <Badge color="mint">잘 맞았던 성분 {rec.favoriteHits.length}</Badge>}
          <Badge>{p.category}</Badge>
        </div>
      </div>
      <div className="row">
        <ProductThumb product={p} size={40} />
        <div className="product-card__name flex-1">{p.name}</div>
      </div>
      <ul className="fit-reasons">
        {rec.reasons.map((r) => (
          <li key={r} className="fit-reasons__good">
            {r}
          </li>
        ))}
        {rec.cautions.map((c) => (
          <li key={c} className="fit-reasons__bad">
            {c}
          </li>
        ))}
      </ul>
      <IngredientTags ids={p.keyIngredients} max={4} />
      <div className="row mt-1">
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

/**
 * 내 기록 기반 추천 — 👍 잘 맞았어요 / 👎 트러블 있었어요 로 표시한 제품의 성분에서
 * 반복되는 패턴을 찾아 아직 안 써 본 제품을 고른다.
 */
export function PersonalFitSection() {
  const matches = useAppStore((s) => s.matches);
  const routines = useAppStore((s) => s.routines);
  const logs = useAppStore((s) => s.logs);
  const skinType = useAppStore((s) => s.profile?.skinType ?? null);
  const catalog = useCatalog();
  const [showAll, setShowAll] = useState(false);

  // 👎 를 누르지 않았어도 피부 기록에서 자극감이 반복해서 높았던 제품은 같이 반영한다
  const irritatingProductIds = useMemo(
    () =>
      buildProductHistories(logs, routines, catalog)
        .histories.filter((h) => h.irritatedCount >= IRRITATED_LOGS)
        .map((h) => h.product.id),
    [logs, routines, catalog],
  );

  const { profile, items } = useMemo(
    () =>
      recommendByFit(
        { matches, ownedProductIds: routines.map((r) => r.productId), skinType, irritatingProductIds, limit: 8 },
        catalog,
      ),
    [matches, routines, skinType, irritatingProductIds, catalog],
  );

  const sources = resolveSources(FIT_SOURCE_IDS);
  const fromLogs = irritatingProductIds.filter((id) => !matches.some((m) => m.productId === id)).length;

  if (!profile.ready) {
    return (
      <div className="empty">
        <strong>기록이 조금 더 필요해요</strong>
        써 본 제품을 검색해서 “👍 잘 맞았어요” 또는 “👎 트러블 있었어요” 를 {MIN_GOOD}개 이상 표시하면, 반복해서 나오는 성분을 찾아 안 써 본
        제품을 골라 드려요.
        <p className="small muted mt-1">
          지금 👍 {profile.goodTotal}개 · 👎 {profile.avoidedTotal}개 — 한 번 겹친 건 우연일 수 있어서 {MIN_GOOD}개부터 패턴으로 봐요.
        </p>
        <div className="mt-2">
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => {
              const el = document.getElementById('product-search') as HTMLInputElement | null;
              el?.focus();
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            써 본 제품 검색하기
          </button>
        </div>
        <SourceList sources={sources} label="이 추천이 기대는 근거" />
      </div>
    );
  }

  const visible = showAll ? items : items.slice(0, 4);

  return (
    <div>
      <div className="fit-profile">
        <p className="small muted">
          👍 {profile.goodTotal}개 · 👎 {profile.avoidedTotal}개 기록에서 찾은 패턴이에요
          {fromLogs > 0 ? ` (피부 기록에서 자극감이 ${IRRITATED_LOGS}번 이상 높았던 제품 ${fromLogs}개 포함)` : ''}.
        </p>

        <div className="fit-profile__group">
          <div className="fit-profile__title">💚 반복해서 잘 맞았던 성분</div>
          {profile.favorites.length > 0 ? (
            <div className="fit-chips">
              {profile.favorites.map((s) => (
                <SignalChip key={s.ingredientId} signal={s} tone="favorite" />
              ))}
            </div>
          ) : (
            <p className="small muted">
              {profile.goodTotal < MIN_GOOD
                ? `👍 를 ${profile.needMoreGood}개 더 표시하면 찾아 드려요.`
                : '잘 맞은 제품들 사이에 겹치는 성분이 아직 없어요.'}
            </p>
          )}
        </div>

        <div className="fit-profile__group">
          <div className="fit-profile__title">🚩 반복해서 걸렸던 성분</div>
          {profile.suspects.length > 0 ? (
            <>
              <div className="fit-chips">
                {profile.suspects.map((s) => (
                  <SignalChip key={s.ingredientId} signal={s} tone="suspect" />
                ))}
              </div>
              {profile.suspects.some((s) => !s.notable) && (
                <p className="tiny muted">
                  흐리게 표시된 성분은 자극·알레르기 보고가 드문 성분이에요. 다른 성분과 우연히 같이 들어 있었을 가능성이 커서 추천에는 약하게만
                  반영해요.
                </p>
              )}
            </>
          ) : (
            <p className="small muted">
              {profile.avoidedTotal < MIN_AVOIDED
                ? `👎 를 ${profile.needMoreAvoided}개 더 표시하면 찾아 드려요.`
                : '안 맞은 제품들 사이에 겹치는 성분이 아직 없어요.'}
            </p>
          )}
        </div>
        <p className="tiny muted">숫자는 “표시한 제품 중 몇 개에 들어 있었는지” 예요. 성분을 누르면 설명을 볼 수 있어요.</p>
      </div>

      {profile.suspects.length > 0 && (
        <Foldable
          tone="minus"
          title="🧪 걸렸던 성분, 정말 원인인지 확인하는 법"
          hint="팔 안쪽에 열흘 발라 보기 · 반복되면 피부과 첩포검사"
        >
          <ol className="fit-steps">
            <li>
              <strong>팔 안쪽에 먼저 발라 보세요.</strong> 새 제품을 팔꿈치 안쪽 동전 크기에 하루 두 번, 열흘쯤 발라 봐요. 328건을 본 연구에서
              반응은 모두 10일 안에 나타났고 절반은 3일 안에 나왔어요.
            </li>
            <li>
              <strong>한 번에 하나씩만 바꾸세요.</strong> 여러 제품을 같이 바꾸면 무엇 때문인지 알 수 없어요.
            </li>
            <li>
              <strong>같은 성분에서 계속 반응하면 피부과 첩포검사를 받아 보세요.</strong> 화장품 성분 중에서는 보존제와 향료가 첩포검사 양성으로
              가장 자주 나와요. 검사로 정확한 성분을 알면 피하기가 훨씬 쉬워져요.
            </li>
          </ol>
          <SourceList sources={resolveSources(['roat-duration', 'roat-dermnet', 'nacdg-2023'])} />
        </Foldable>
      )}

      {items.length === 0 ? (
        <div className="empty mt-2">
          <strong>아직 골라 드릴 제품이 없어요</strong>
          표시한 제품들 사이에 겹치는 성분이 생기면 추천이 나와요. 써 본 제품을 몇 개 더 표시해 보세요.
        </div>
      ) : (
        <>
          <div className="stack mt-2">
            {visible.map((rec) => (
              <FitCard key={rec.product.id} rec={rec} />
            ))}
          </div>
          {items.length > 4 && (
            <button type="button" className="btn btn--ghost btn--sm mt-2" onClick={() => setShowAll((v) => !v)}>
              {showAll ? '접기' : `${items.length - 4}개 더 보기`}
            </button>
          )}
        </>
      )}

      <SourceList sources={sources} label="이 추천이 기대는 근거" />
      <p className="fine-print">
        같이 나왔다는 것이지 원인이라는 뜻은 아니에요. 제품에는 수십 가지 성분이 들어 있고 이 앱은 그중 핵심 성분만 알고 있어서, 다른 성분이나
        농도·제형·바르는 순서가 진짜 이유일 수 있어요. 성분을 피하는 방법의 효과도 연구마다 달라요(검사 뒤 호전을 보고한 환자는 81%였지만,
        소규모 무작위 비교에서는 증상 점수 차이가 유의하지 않았어요). 붉어짐·가려움이 계속되면 피부과 진료를 받아 주세요.
      </p>
    </div>
  );
}
