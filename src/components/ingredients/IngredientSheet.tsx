import { useEffect, useState } from 'react';
import { getIngredient, productsWithIngredient } from '@/data';
import { COLOR_HEX, CONCERN_MAP } from '@/data/concerns';
import { Sheet } from '@/components/layout/Overlay';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { CategoryBadges } from './IngredientCard';

const EVIDENCE_LABEL = { high: '근거 수준 높음', moderate: '근거 수준 보통', limited: '근거 제한적' } as const;

/**
 * 성분 상세 (하단 시트).
 * 쉬운 한 줄 설명 → "자세히 보기" 를 눌러야 과학적 설명이 나온다 (progressive disclosure).
 */
export function IngredientSheet() {
  const id = useAppStore((s) => s.ingredientSheet);
  const close = useAppStore((s) => s.closeIngredient);
  const open = useAppStore((s) => s.openIngredient);
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const showToast = useAppStore((s) => s.showToast);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setExpanded(false), [id]);

  if (!id) return null;
  const ing = getIngredient(id);
  if (!ing) return null;
  const color = COLOR_HEX[ing.colorTag];
  const examples = productsWithIngredient(ing.id, 5);

  return (
    <Sheet onClose={close} label={`${ing.nameKo} 상세`}>
      <div className="ing-detail__head">
        <span className="ing-detail__swatch" style={{ background: color.base }} />
        <div className="flex-1">
          <div className="ing-detail__title">{ing.nameKo}</div>
          <div className="ing-detail__inci">{ing.nameInci}</div>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label="닫기">
          <Icon name="close" />
        </button>
      </div>

      <div className="row row--wrap mt-2" style={{ gap: 4 }}>
        <CategoryBadges ingredient={ing} max={4} />
        {ing.tags?.includes('fragrance') && <Badge color="butter">향료 계열</Badge>}
        {ing.tags?.includes('active') && <Badge color="lilac">활성 성분</Badge>}
      </div>

      <p className="ing-detail__short">{ing.shortDesc}</p>

      <button type="button" className="btn btn--soft btn--sm mt-2" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        {expanded ? '간단히 보기' : '자세히 보기'} <Icon name={expanded ? 'up' : 'down'} size={14} />
      </button>
      {expanded && <div className="ing-detail__long">{ing.longDesc}</div>}

      {ing.relatedConcerns.length > 0 && (
        <>
          <div className="ing-detail__label">관련 고민</div>
          <div className="chip-row">
            {ing.relatedConcerns.map((c) => (
              <Badge key={c} color={CONCERN_MAP[c].colorTag}>
                {CONCERN_MAP[c].icon} {CONCERN_MAP[c].title}
              </Badge>
            ))}
          </div>
        </>
      )}

      {ing.pairsWell.length > 0 && (
        <>
          <div className="ing-detail__label">함께 쓰기 좋은 성분</div>
          <div className="chip-row">
            {ing.pairsWell.map((pid) => {
              const p = getIngredient(pid);
              return p ? (
                <Chip key={pid} small onClick={() => open(pid)}>
                  ✓ {p.nameKo}
                </Chip>
              ) : null;
            })}
          </div>
        </>
      )}

      {ing.pairCaution.length > 0 && (
        <>
          <div className="ing-detail__label">함께 쓸 때 주의할 성분</div>
          <div className="chip-row">
            {ing.pairCaution.map((pid) => {
              const p = getIngredient(pid);
              return p ? (
                <Chip key={pid} small onClick={() => open(pid)}>
                  ! {p.nameKo}
                </Chip>
              ) : null;
            })}
          </div>
        </>
      )}

      {examples.length > 0 && (
        <>
          <div className="ing-detail__label">이 성분이 든 제품 예시</div>
          <div className="stack stack--sm">
            {examples.map((p) => (
              <div key={p.id} className="product-mini">
                <div className="flex-1">
                  <div className="product-mini__brand">
                    {p.brand} · {p.category}
                  </div>
                  <div className="product-mini__name ellipsis">{p.name}</div>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={async () => {
                    const r = await addToRoutine(p.id);
                    showToast(r === 'added' ? `${activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 담았어요` : '이미 담겨 있어요');
                  }}
                >
                  담기
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="ing-detail__label">출처 · 검토</div>
      <dl className="ing-detail__meta">
        <dt>출처</dt>
        <dd>{ing.source}</dd>
        <dt>근거</dt>
        <dd>{EVIDENCE_LABEL[ing.evidenceLevel]}</dd>
        <dt>최종 검토일</dt>
        <dd>{ing.lastReviewed}</dd>
      </dl>
      <p className="fine-print">
        일반적으로 화장품에 사용되는 성분에 대한 교육용 설명이에요. 반응은 개인차가 있을 수 있고, 의학적 조언이 아니에요. 심한 자극이나
        트러블이 지속되면 전문의와 상담해주세요.
      </p>
    </Sheet>
  );
}
