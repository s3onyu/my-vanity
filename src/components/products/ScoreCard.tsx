import { useMemo, useState } from 'react';
import type { RoutineType } from '@/types';
import { getIngredient } from '@/data';
import type { CompatibilityResult, InteractionHit, ScoreReason } from '@/engine/compatibility';
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
  good: '같이 쓰기 좋아요',
  neutral: '무난해요',
  caution: '주의',
  high_caution: '특히 주의',
} as const;

const SEVERITY_COLOR = { good: 'mint', neutral: 'sky', caution: 'butter', high_caution: 'rose' } as const;

const IMPACT_LABEL = { big: '크게', medium: '조금', small: '살짝' } as const;

const GLOSSARY: { term: string; desc: string }[] = [
  { term: '효과가 센 성분(활성 성분)', desc: '레티놀, 비타민C, AHA·BHA처럼 피부에 뚜렷하게 작용하는 성분. 좋지만 많이 겹치면 자극이 될 수 있어요.' },
  { term: '달래주는 성분(장벽 지지)', desc: '세라마이드, 판테놀, 병풀처럼 피부를 보호하고 진정시키는 성분. 센 성분의 부담을 덜어줘요.' },
  { term: '각질을 벗겨내는 성분', desc: '레티놀 계열, AHA, BHA, PHA. 결을 정리해주지만 두 종류 이상 겹치면 따갑기 쉬워요.' },
  { term: '향료·오일', desc: '향을 내는 성분과 에센셜오일. 쌓이면 어느 날 갑자기 붉어지거나 따가울 수 있어요.' },
];

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

function ReasonItem({ reason }: { reason: ScoreReason }) {
  const negative = reason.delta < 0;
  return (
    <li className={`reason-plain reason-plain--${negative ? 'minus' : 'plus'}`}>
      <span className="reason-plain__emoji" aria-hidden="true">
        {reason.emoji}
      </span>
      <div className="flex-1">
        <div className="row row--between" style={{ alignItems: 'flex-start' }}>
          <span className="reason-plain__title">{reason.title}</span>
          <span className={`reason-plain__delta ${negative ? 'is-minus' : 'is-plus'}`}>
            {negative ? '' : '+'}
            {reason.delta}점 · {IMPACT_LABEL[reason.impact]} {negative ? '깎임' : '더함'}
          </span>
        </div>
        <p className="reason-plain__why">{reason.why}</p>
        {reason.tip && <p className="reason-plain__tip">💡 {reason.tip}</p>}
      </div>
    </li>
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
          <span className="muted"> + </span>
          <button type="button" className="link-btn" onClick={() => openIngredient(ix.ingredientB)}>
            {b?.nameKo ?? ix.ingredientB}
          </button>
        </div>
        <Badge color={SEVERITY_COLOR[ix.severity]}>{SEVERITY_LABEL[ix.severity]}</Badge>
      </div>
      <p className="ix-card__reason">{ix.reason}</p>
      <p className="ix-card__rec">💡 {ix.recommendation}</p>
      <p className="tiny muted mt-1">
        어느 제품에: {hit.productsA.slice(0, 2).join(', ')} · {hit.productsB.slice(0, 2).join(', ')}
      </p>
    </div>
  );
}

interface Props {
  result: CompatibilityResult;
  routineType: RoutineType;
  compact?: boolean;
}

/** 성분 궁합 분석 결과 카드 + "무엇을 근거로 계산했나요" (쉬운 말 우선, 자세한 계산은 접기) */
export function ScoreCard({ result, routineType, compact = false }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const hits = useMemo(
    () => [...result.interactionHits].sort((x, y) => rank(y.interaction.severity) - rank(x.interaction.severity)),
    [result.interactionHits],
  );

  if (result.empty) {
    return (
      <div className="empty">
        <strong>루틴에 제품을 담으면 점수를 계산해요</strong>
        {routineType === 'AM' ? '아침' : '저녁'} 루틴의 성분 조합을 8~96점으로 읽어드려요.
      </div>
    );
  }

  const { stats } = result;
  const tone = scoreTone(result.score);
  const minus = result.reasons.filter((r) => r.delta < 0).sort((a, b) => a.delta - b.delta);
  const plus = result.reasons.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta);
  const cautionHits = hits.filter((h) => h.interaction.severity === 'caution' || h.interaction.severity === 'high_caution');
  const goodHits = hits.filter((h) => h.interaction.severity === 'good' || h.interaction.severity === 'neutral');

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
            <Badge color={stats.activeIds.length ? 'lilac' : 'none'}>센 성분 {stats.activeIds.length}종</Badge>
            <Badge color={stats.barrierIds.length ? 'mint' : 'none'}>달래주는 성분 {stats.barrierIds.length}종</Badge>
            {stats.fragranceIds.length > 0 && <Badge color="butter">향료 {stats.fragranceIds.length}종</Badge>}
            {routineType === 'AM' && <Badge color={stats.hasSunscreen ? 'sky' : 'rose'}>{stats.hasSunscreen ? '선크림 ✓' : '선크림 없음'}</Badge>}
          </div>
        </div>
      </div>

      {!compact && (
        <>
          {result.headline.length > 0 && (
            <div className="score-headline">
              {result.headline.map((h) => (
                <div key={h} className="score-headline__line">
                  {h}
                </div>
              ))}
            </div>
          )}

          <div className="divider" />
          <div className="score-card__label">
            <Icon name="info" size={14} /> 무엇을 근거로 계산했나요
          </div>
          <p className="small muted mb-2">
            점수는 기본 79점에서 시작해, 주의할 점은 빼고 좋은 점은 더해서 8~96점 사이로 정해요. 아래에 실제로 반영된 이유만 적었어요.
          </p>

          {minus.length > 0 && (
            <>
              <div className="reason-group__title">
                <span>⚠️ 점수를 깎은 이유 {minus.length}가지</span>
              </div>
              <ol className="reason-plain-list">
                {minus.map((r, i) => (
                  <ReasonItem key={`${r.key}-${i}`} reason={r} />
                ))}
              </ol>
            </>
          )}
          {plus.length > 0 && (
            <>
              <div className="reason-group__title mt-2">
                <span>👍 점수를 올린 이유 {plus.length}가지</span>
              </div>
              <ol className="reason-plain-list">
                {plus.map((r, i) => (
                  <ReasonItem key={`${r.key}-${i}`} reason={r} />
                ))}
              </ol>
            </>
          )}

          <div className="row mt-2" style={{ gap: 12 }}>
            <button type="button" className="link-btn" onClick={() => setShowGlossary((v) => !v)}>
              {showGlossary ? '용어 풀이 접기' : '용어 풀이'}
            </button>
            <button type="button" className="link-btn" onClick={() => setShowDetail((v) => !v)}>
              {showDetail ? '자세한 계산 접기' : '자세한 계산 보기'}
            </button>
          </div>
          {showGlossary && (
            <dl className="glossary mt-2">
              {GLOSSARY.map((g) => (
                <div key={g.term} className="glossary__item">
                  <dt>{g.term}</dt>
                  <dd>{g.desc}</dd>
                </div>
              ))}
            </dl>
          )}
          {showDetail && (
            <ol className="reason-list mt-2">
              {result.reasons.map((r, i) => (
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
              <p className="reason__base tiny muted">
                번호는 계산 규칙 순서예요. 기본 79점 + 위 항목의 합 = {result.score}점 (8~96 사이로 맞춤).
              </p>
            </ol>
          )}

          {cautionHits.length > 0 && (
            <>
              <div className="score-card__label mt-3">같이 쓸 때 주의할 조합 {cautionHits.length}건</div>
              <p className="small muted mb-2">각 카드의 💡를 따라 아침/저녁으로 나누거나 격일로 쓰면 대부분 해결돼요.</p>
              <div className="stack stack--sm">
                {cautionHits.map((h) => (
                  <InteractionCard key={h.interaction.id} hit={h} />
                ))}
              </div>
            </>
          )}
          {goodHits.length > 0 && (
            <>
              <div className="score-card__label mt-3">같이 쓰기 좋은 조합 {goodHits.length}건</div>
              <div className="stack stack--sm">
                {goodHits.map((h) => (
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
