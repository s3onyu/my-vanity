import { useMemo, useState } from 'react';
import type { RoutineType } from '@/types';
import { getIngredient } from '@/data';
import type { CompatibilityResult, InteractionHit } from '@/engine/compatibility';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

export function scoreTone(score: number): 'mint' | 'butter' | 'rose' | 'plum' {
  if (score >= 75) return 'mint';
  if (score >= 60) return 'butter';
  if (score >= 40) return 'rose';
  return 'plum';
}

const SEVERITY_LABEL = {
  good: '함께 쓰기 좋음',
  neutral: '무난',
  caution: '주의',
  high_caution: '특히 주의',
} as const;

const SEVERITY_COLOR = { good: 'mint', neutral: 'sky', caution: 'butter', high_caution: 'rose' } as const;

/** 점수 링 */
export function ScoreRing({ score, size = 96, max = 96 }: { score: number; size?: number; max?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  const tone = scoreTone(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="score-ring" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-soft)" strokeWidth="7" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`var(--${tone})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function InteractionCard({ hit }: { hit: InteractionHit }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  const { interaction: ix } = hit;
  const a = getIngredient(ix.ingredientA);
  const b = getIngredient(ix.ingredientB);
  return (
    <div className={`ix-card ix-card--${ix.severity}`}>
      <div className="row row--between">
        <div className="ix-card__pair">
          <button type="button" className="link-btn" onClick={() => openIngredient(ix.ingredientA)}>
            {a?.nameKo ?? ix.ingredientA}
          </button>
          <span className="muted"> × </span>
          <button type="button" className="link-btn" onClick={() => openIngredient(ix.ingredientB)}>
            {b?.nameKo ?? ix.ingredientB}
          </button>
        </div>
        <Badge color={SEVERITY_COLOR[ix.severity]}>{SEVERITY_LABEL[ix.severity]}</Badge>
      </div>
      <p className="ix-card__reason">{ix.reason}</p>
      <p className="ix-card__rec">→ {ix.recommendation}</p>
      <p className="tiny muted mt-1">
        {hit.productsA.slice(0, 2).join(', ')} · {hit.productsB.slice(0, 2).join(', ')}
      </p>
    </div>
  );
}

interface Props {
  result: CompatibilityResult;
  routineType: RoutineType;
  compact?: boolean;
}

/** 성분 궁합 분석 결과 카드 + "무엇을 근거로 계산했나요" */
export function ScoreCard({ result, routineType, compact = false }: Props) {
  const [showAll, setShowAll] = useState(false);
  const hits = useMemo(
    () => [...result.interactionHits].sort((x, y) => rank(y.interaction.severity) - rank(x.interaction.severity)),
    [result.interactionHits],
  );

  if (result.empty) {
    return (
      <div className="empty">
        <strong>루틴에 제품을 담으면 점수를 계산해요</strong>
        {routineType === 'AM' ? '아침' : '저녁'} 루틴의 성분 조합을 0~96점으로 읽어드려요.
      </div>
    );
  }

  const { stats } = result;
  const tone = scoreTone(result.score);

  return (
    <div className="card score-card">
      <div className="score-card__top">
        <div className="score-card__ring">
          <ScoreRing score={result.score} />
          <div className="score-card__num">
            <span className="serif">{result.score}</span>
            <span className="tiny muted">/96</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="eyebrow">{routineType === 'AM' ? 'Morning' : 'Evening'} routine</div>
          <div className={`score-card__summary score-card__summary--${tone}`}>{result.summary}</div>
          <div className="row row--wrap mt-2" style={{ gap: 5 }}>
            <Badge>제품 {stats.productCount}개</Badge>
            <Badge>성분 {stats.ingredientCount}종</Badge>
            <Badge color={stats.activeIds.length ? 'lilac' : 'none'}>활성 {stats.activeIds.length}종</Badge>
            <Badge color={stats.barrierIds.length ? 'mint' : 'none'}>장벽 지지 {stats.barrierIds.length}종</Badge>
            {stats.fragranceIds.length > 0 && <Badge color="butter">향료 {stats.fragranceIds.length}종</Badge>}
            {routineType === 'AM' && <Badge color={stats.hasSunscreen ? 'sky' : 'rose'}>{stats.hasSunscreen ? '선크림 ✓' : '선크림 없음'}</Badge>}
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="divider" />
          <div className="score-card__label">
            <Icon name="info" size={14} /> 무엇을 근거로 계산했나요
          </div>
          <ol className="reason-list">
            {(showAll ? result.reasons : result.reasons.slice(0, 6)).map((r, i) => (
              <li key={`${r.key}-${i}`} className="reason">
                <span className="reason__rule">{r.rule}</span>
                <div className="flex-1">
                  <div className="row row--between">
                    <span className="reason__label">{r.label}</span>
                    <span className={`reason__delta ${r.delta >= 0 ? 'is-plus' : 'is-minus'}`}>
                      {r.delta >= 0 ? '+' : ''}
                      {r.delta}
                    </span>
                  </div>
                  <p className="reason__detail">{r.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {result.reasons.length > 6 && (
            <button type="button" className="link-btn mt-1" onClick={() => setShowAll((v) => !v)}>
              {showAll ? '접기' : `근거 ${result.reasons.length - 6}개 더 보기`}
            </button>
          )}
          <p className="reason__base tiny muted">기본 점수 79에서 위 항목을 더하고 뺀 뒤 8~96 사이로 맞췄어요.</p>

          {hits.length > 0 && (
            <>
              <div className="score-card__label mt-3">성분 상호작용 {hits.length}건</div>
              <div className="stack stack--sm">
                {hits.map((h) => (
                  <InteractionCard key={h.interaction.id} hit={h} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <p className="fine-print score-card__disclaimer">
        이 점수는 참고용 근사치이며 의학적 진단이 아니에요. 성분 반응은 개인차가 있고, 자극이 심하거나 오래가면 전문의와 상담해주세요.
      </p>
    </div>
  );
}

const rank = (s: InteractionHit['interaction']['severity']) => ({ high_caution: 3, caution: 2, good: 1, neutral: 0 })[s];
