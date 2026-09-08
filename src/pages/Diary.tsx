import { useEffect, useMemo, useState } from 'react';
import type { SkinLog } from '@/types';
import { CATALOG, getProduct } from '@/data';
import { analyzeLogs, METRIC_HIGHER_IS_BETTER, type Metric } from '@/engine/insights';
import { formatKoDate, todayISO } from '@/lib/date';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

const METRICS: { key: Metric; label: string; low: string; high: string }[] = [
  { key: 'comfort', label: '편안함', low: '불편', high: '편안' },
  { key: 'dryness', label: '건조함', low: '촉촉', high: '건조' },
  { key: 'oiliness', label: '번들거림', low: '보송', high: '번들' },
  { key: 'irritation', label: '자극감', low: '없음', high: '심함' },
];

const MEMO_MAX = 300;

function DiaryForm() {
  const routines = useAppStore((s) => s.routines);
  const logs = useAppStore((s) => s.logs);
  const saveLog = useAppStore((s) => s.saveLog);
  const showToast = useAppStore((s) => s.showToast);
  const today = todayISO();

  const routineProducts = useMemo(() => {
    const ids = [...new Set(routines.map((r) => r.productId))];
    return ids.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [routines]);

  const [date, setDate] = useState(today);
  const [products, setProducts] = useState<string[]>([]);
  const [values, setValues] = useState<Record<Metric, number>>({ comfort: 3, dryness: 3, oiliness: 3, irritation: 1 });
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 날짜를 바꾸면 그 날의 기록이 있을 때 불러온다
  useEffect(() => {
    const existing = logs.find((l) => l.date === date);
    if (existing) {
      setProducts(existing.products);
      setValues({ comfort: existing.comfort, dryness: existing.dryness, oiliness: existing.oiliness, irritation: existing.irritation });
      setMemo(existing.memo);
    } else {
      setProducts(routines.map((r) => r.productId).filter((v, i, a) => a.indexOf(v) === i));
      setValues({ comfort: 3, dryness: 3, oiliness: 3, irritation: 1 });
      setMemo('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const existing = logs.find((l) => l.date === date);

  const submit = async () => {
    if (!date) return setError('날짜를 골라주세요.');
    if (date > today) return setError('미래 날짜는 기록할 수 없어요.');
    if (memo.length > MEMO_MAX) return setError(`메모는 ${MEMO_MAX}자 이하로 써주세요.`);
    setError(null);
    await saveLog({ date, products, memo: memo.trim(), ...values });
    showToast(existing ? '기록을 업데이트했어요' : '오늘의 기록을 남겼어요');
  };

  return (
    <div className="card">
      <div className="row row--between">
        <label htmlFor="log-date" className="h3">
          {date === today ? '오늘' : formatKoDate(date)} 컨디션
        </label>
        <input id="log-date" type="date" className="input" style={{ width: 'auto', padding: '6px 10px' }} value={date} max={today} onChange={(e) => setDate(e.target.value)} />
      </div>
      {existing && <p className="small muted mt-1">이 날짜의 기록이 있어요. 저장하면 덮어써요.</p>}

      <div className="field mt-3">
        <label>오늘 사용한 제품</label>
        {routineProducts.length === 0 ? (
          <span className="field-hint">루틴에 제품을 담으면 여기서 체크할 수 있어요.</span>
        ) : (
          <div className="chip-row">
            {routineProducts.map((p) => (
              <Chip
                key={p.id}
                small
                active={products.includes(p.id)}
                onClick={() => setProducts((cur) => (cur.includes(p.id) ? cur.filter((x) => x !== p.id) : [...cur, p.id]))}
              >
                {products.includes(p.id) ? '✓ ' : ''}
                {p.name}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {METRICS.map((m) => (
        <div key={m.key} className="slider">
          <div className="row row--between">
            <span className="slider__label">{m.label}</span>
            <span className="slider__value serif">{values[m.key]}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={values[m.key]}
            onChange={(e) => setValues((v) => ({ ...v, [m.key]: Number(e.target.value) }))}
            aria-label={m.label}
          />
          <div className="slider__ends">
            <span>{m.low}</span>
            <span>{m.high}</span>
          </div>
        </div>
      ))}

      <div className="field mt-2">
        <label htmlFor="log-memo">메모</label>
        <textarea
          id="log-memo"
          className={`textarea${memo.length > MEMO_MAX ? ' is-invalid' : ''}`}
          style={{ minHeight: 72 }}
          placeholder="새로 쓴 제품, 날씨, 수면 등 짚어둘 것"
          value={memo}
          onChange={(e) => setMemo(e.target.value.slice(0, MEMO_MAX + 20))}
        />
        <span className="field-hint">{memo.length}/{MEMO_MAX}</span>
      </div>
      {error && <p className="field-error mb-2">{error}</p>}
      <button type="button" className="btn btn--block" onClick={submit}>
        {existing ? '기록 업데이트' : '기록 남기기'}
      </button>
    </div>
  );
}

function LogRow({ log }: { log: SkinLog }) {
  const deleteLog = useAppStore((s) => s.deleteLog);
  const showToast = useAppStore((s) => s.showToast);
  return (
    <li className="log-row">
      <div className="row row--between">
        <span className="h3">{formatKoDate(log.date)}</span>
        <button
          type="button"
          className="icon-btn"
          aria-label="기록 삭제"
          onClick={async () => {
            if (window.confirm('이 날의 기록을 지울까요?')) {
              await deleteLog(log.id);
              showToast('기록을 지웠어요');
            }
          }}
        >
          <Icon name="trash" size={14} />
        </button>
      </div>
      <div className="log-row__metrics">
        {METRICS.map((m) => (
          <div key={m.key} className="log-metric">
            <span className="tiny muted">{m.label}</span>
            <div className="log-metric__dots" aria-label={`${m.label} ${log[m.key]}점`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`dot${n <= log[m.key] ? ` is-on dot--${m.key}` : ''}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {log.products.length > 0 && (
        <div className="row row--wrap mt-1" style={{ gap: 4 }}>
          {log.products.map((id) => (
            <Badge key={id}>{getProduct(id)?.name ?? id}</Badge>
          ))}
        </div>
      )}
      {log.memo && <p className="small mt-1">{log.memo}</p>}
    </li>
  );
}

function Insights() {
  const logs = useAppStore((s) => s.logs);
  const routines = useAppStore((s) => s.routines);
  const goToIngredients = useAppStore((s) => s.goToIngredients);
  const navigate = useAppStore((s) => s.navigate);
  const ins = useMemo(() => analyzeLogs(logs, routines, CATALOG), [logs, routines]);

  if (!ins.enabled) {
    return (
      <div className="empty">
        <strong>기록이 3일 이상 쌓이면 인사이트가 열려요</strong>
        지금 {ins.logCount}일 기록됐어요. 최근 7일 비교, 편안함 추세, 자극이 있던 날의 제품 패턴을 분석해드려요.
      </div>
    );
  }

  const max = Math.max(1, ...ins.comfortBars.map((b) => b.value ?? 0));

  return (
    <div className="stack">
      <div className="card">
        <div className="h3">최근 7일 vs 이전 7일</div>
        <div className="compare-grid mt-2">
          {ins.comparisons.map((c) => {
            const better = c.delta === null ? null : METRIC_HIGHER_IS_BETTER[c.metric] ? c.delta > 0 : c.delta < 0;
            return (
              <div key={c.metric} className="compare">
                <div className="tiny muted">{c.label}</div>
                <div className="compare__value serif">{c.recent ?? '–'}</div>
                <div className={`tiny ${c.delta === null ? 'muted' : better ? 'tone-mint' : c.delta === 0 ? 'muted' : 'tone-rose'}`}>
                  {c.delta === null ? `이전 ${c.previous ?? '–'}` : c.delta === 0 ? '변화 없음' : `${c.delta > 0 ? '▲' : '▼'} ${Math.abs(c.delta)} (이전 ${c.previous})`}
                </div>
              </div>
            );
          })}
        </div>
        <p className="tiny muted mt-2">
          최근 {ins.comparisons[0].recentCount}일 · 이전 {ins.comparisons[0].previousCount}일 기록 기준 평균이에요.
        </p>
      </div>

      <div className="card">
        <div className="h3">14일 편안함</div>
        <div className="bars mt-2" role="img" aria-label="14일 편안함 막대그래프">
          {ins.comfortBars.map((b) => (
            <div key={b.date} className="bars__col">
              <div className="bars__bar" style={{ height: b.value ? `${(b.value / max) * 100}%` : '2px', opacity: b.value ? 1 : 0.35 }} title={`${b.date}: ${b.value ?? '기록 없음'}`} />
              <span className="bars__day">{b.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      {ins.irritationNote && (
        <div className="card card--soft">
          <div className="h3">자극감 평균 {ins.irritationNote.avg}점</div>
          <p className="small mt-1">
            루틴에 각질 관리 계열이 {ins.irritationNote.families.length}종
            {ins.irritationNote.familyLabels.length ? ` (${ins.irritationNote.familyLabels.join(', ')})` : ''} 있어요.
            {ins.irritationNote.families.length >= 2
              ? ' 서로 다른 계열이 겹치면 자극이 누적될 수 있어요. 한 가지만 남기고 격일로 써보는 방식이 자주 권장돼요.'
              : ' 각질 계열 자체는 많지 않아요. 새로 추가한 제품이나 향료, 사용 빈도를 함께 살펴보세요.'}
          </p>
          <button type="button" className="link-btn mt-1" onClick={() => navigate('products')}>
            루틴 궁합 근거 보기 →
          </button>
        </div>
      )}
      {ins.drynessNote && (
        <div className="card card--soft">
          <div className="h3">건조함 평균 {ins.drynessNote.avg}점</div>
          <p className="small mt-1">보습·장벽 성분(히알루론산, 세라마이드, 스쿠알란 등)을 마무리 단계에 더하는 방식이 자주 언급돼요.</p>
          <button type="button" className="link-btn mt-1" onClick={() => goToIngredients({ category: 'hydration' })}>
            보습 성분 보러 가기 →
          </button>
        </div>
      )}
      {ins.oilinessNote && (
        <div className="card card--soft">
          <div className="h3">번들거림 평균 {ins.oilinessNote.avg}점</div>
          <p className="small mt-1">가벼운 제형으로 바꾸거나 피지 조절 성분(나이아신아마이드, 징크PCA 등)을 살펴볼 만해요.</p>
          <button type="button" className="link-btn mt-1" onClick={() => goToIngredients({ category: 'sebum' })}>
            피지 성분 보러 가기 →
          </button>
        </div>
      )}

      {ins.suspects.length > 0 && (
        <div className="card">
          <div className="h3">자극이 있던 날에 유독 많이 등장한 제품</div>
          <p className="tiny muted mt-1">
            자극감 4점 이상이던 {ins.suspectBasis.irritatedDays}일 vs 편안했던 {ins.suspectBasis.calmDays}일의 제품 등장 비율 차이예요.
          </p>
          <div className="stack stack--sm mt-2">
            {ins.suspects.map((s) => (
              <div key={s.product.id} className="suspect">
                <div className="flex-1">
                  <div className="product-card__brand">{s.product.brand}</div>
                  <div className="product-card__name">{s.product.name}</div>
                </div>
                <div className="suspect__stat">
                  <span className="tone-rose">{Math.round(s.irritatedRate * 100)}%</span>
                  <span className="tiny muted"> vs {Math.round(s.calmRate * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="tiny muted mt-2">단순 상관관계이며 인과관계가 아니에요. 다른 요인(수면, 날씨, 새 제품)도 함께 살펴보세요.</p>
        </div>
      )}

      {ins.startEffects.length > 0 && (
        <div className="card">
          <div className="h3">제품 사용 시작 전후 편안함</div>
          <div className="stack stack--sm mt-2">
            {ins.startEffects.map((e) => (
              <div key={e.product.id} className="suspect">
                <div className="flex-1">
                  <div className="product-card__name">{e.product.name}</div>
                  <div className="tiny muted">{formatKoDate(e.startedAt, false)} 시작 · 이전 {e.beforeCount}일 / 이후 {e.afterCount}일</div>
                </div>
                <div className="suspect__stat">
                  <span className="tiny muted">{e.before} → </span>
                  <span className={e.delta > 0 ? 'tone-mint' : e.delta < 0 ? 'tone-rose' : ''}>{e.after}</span>
                  <span className="tiny muted"> ({e.delta > 0 ? '+' : ''}{e.delta})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ins.weekday && (
        <div className="card card--soft">
          <div className="h3">요일 패턴</div>
          <p className="small mt-1">
            {ins.weekday.best.day}요일(평균 {ins.weekday.best.avg})에 가장 편안했고, {ins.weekday.worst.day}요일(평균 {ins.weekday.worst.avg})에 가장
            불편했어요. 그 요일의 생활 패턴을 떠올려보세요.
          </p>
        </div>
      )}

      <p className="fine-print">
        인사이트는 내가 남긴 기록의 상관관계를 보여줄 뿐 인과관계가 아니에요. 자극이나 트러블이 심하거나 오래가면 전문의 상담을 권해요.
      </p>
    </div>
  );
}

export function DiaryPage() {
  const logs = useAppStore((s) => s.logs);
  const [tab, setTab] = useState<'today' | 'timeline' | 'insights'>('today');

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">Skin diary</div>
        <h1 className="h1">
          피부 <em>기록</em>
        </h1>
        <p>오늘의 컨디션을 남기면 기록이 쌓일수록 인사이트가 열려요.</p>
      </header>

      <div className="tabs" role="tablist">
        {(
          [
            ['today', '오늘 기록'],
            ['timeline', `타임라인 ${logs.length}`],
            ['insights', '인사이트'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`tabs__btn${tab === id ? ' is-active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'today' && <DiaryForm />}
      {tab === 'timeline' &&
        (logs.length === 0 ? (
          <div className="empty">
            <strong>아직 기록이 없어요</strong>오늘 기록 탭에서 첫 컨디션을 남겨보세요.
          </div>
        ) : (
          <ol className="stack">
            {logs.map((l) => (
              <LogRow key={l.id} log={l} />
            ))}
          </ol>
        ))}
      {tab === 'insights' && <Insights />}
    </div>
  );
}
