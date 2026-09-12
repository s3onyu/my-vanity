import { useEffect, useMemo, useState } from 'react';
import type { RoutineType, SkinLog, SkinMetrics } from '@/types';
import { analyzeLogs, METRIC_HIGHER_IS_BETTER, type Metric } from '@/engine/insights';
import { formatKoDate, todayISO } from '@/lib/date';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { findProduct, useCatalog } from '@/store/catalog';
import { LogPhotoThumb, SkinPhotoCompare, SkinPhotoSection, SkinPhotoTrend } from '@/components/diary/SkinPhoto';

const METRICS: { key: Metric; label: string; low: string; high: string }[] = [
  { key: 'comfort', label: '편안함', low: '불편', high: '편안' },
  { key: 'dryness', label: '건조함', low: '촉촉', high: '건조' },
  { key: 'oiliness', label: '번들거림', low: '보송', high: '번들' },
  { key: 'irritation', label: '자극감', low: '없음', high: '심함' },
];

const MEMO_MAX = 300;
const PERIOD_LABEL: Record<RoutineType, string> = { AM: '아침', PM: '저녁' };
const PERIOD_ICON: Record<RoutineType, string> = { AM: '☀️', PM: '🌙' };
const DEFAULT_VALUES: Record<Metric, number> = { comfort: 3, dryness: 3, oiliness: 3, irritation: 1 };

/** 루틴에 담긴 제품 id 목록 (아침/저녁) */
function useRoutineProductIds(): Record<RoutineType, string[]> {
  const routines = useAppStore((s) => s.routines);
  return useMemo(() => {
    const pick = (t: RoutineType) =>
      routines
        .filter((r) => r.routineType === t)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((r) => r.productId)
        .filter((v, i, a) => a.indexOf(v) === i);
    return { AM: pick('AM'), PM: pick('PM') };
  }, [routines]);
}

function PeriodSegment({ value, onChange, done }: { value: RoutineType; onChange: (p: RoutineType) => void; done: Record<RoutineType, boolean> }) {
  return (
    <div className="segment" role="tablist" aria-label="기록 시간대">
      {(['AM', 'PM'] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={value === p}
          className={`segment__btn${value === p ? ' is-active' : ''}`}
          onClick={() => onChange(p)}
        >
          {PERIOD_ICON[p]} {PERIOD_LABEL[p]}
          {done[p] ? ' ✓' : ''}
        </button>
      ))}
    </div>
  );
}

/** 아침/저녁 기록 폼 — (날짜, 시간대) 조합마다 하나의 기록 */
function DiaryForm() {
  const logs = useAppStore((s) => s.logs);
  const saveLog = useAppStore((s) => s.saveLog);
  const showToast = useAppStore((s) => s.showToast);
  const routineIds = useRoutineProductIds();
  const today = todayISO();

  const [date, setDate] = useState(today);
  const [period, setPeriod] = useState<RoutineType>(() => (new Date().getHours() < 15 ? 'AM' : 'PM'));
  const [products, setProducts] = useState<string[]>([]);
  const [values, setValues] = useState<Record<Metric, number>>(DEFAULT_VALUES);
  const [memo, setMemo] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SkinMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existing = logs.find((l) => l.date === date && l.period === period);
  // 비교 기준: 이 기록보다 앞선 사진 기록 중 가장 최근 것
  const previousWithPhoto = useMemo(
    () =>
      logs
        .filter((l) => l.photoUrl && l.skinMetrics && (l.date < date || (l.date === date && l.period === 'AM' && period === 'PM')))
        .sort((a, b) => b.date.localeCompare(a.date) || b.period.localeCompare(a.period))[0] ?? null,
    [logs, date, period],
  );
  const done: Record<RoutineType, boolean> = {
    AM: logs.some((l) => l.date === date && l.period === 'AM'),
    PM: logs.some((l) => l.date === date && l.period === 'PM'),
  };

  // 날짜·시간대를 바꾸면 그 기록을 불러오고, 없으면 해당 루틴 제품을 기본 체크한다
  useEffect(() => {
    if (existing) {
      setProducts(existing.products);
      setValues({ comfort: existing.comfort, dryness: existing.dryness, oiliness: existing.oiliness, irritation: existing.irritation });
      setMemo(existing.memo);
      setPhoto(existing.photoUrl ?? null);
      setMetrics(existing.skinMetrics ?? null);
    } else {
      setProducts(routineIds[period]);
      setValues(DEFAULT_VALUES);
      setMemo('');
      setPhoto(null);
      setMetrics(null);
    }
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, period]);

  const candidates = [...routineIds[period], ...products.filter((id) => !routineIds[period].includes(id))];

  const submit = async () => {
    if (!date) return setError('날짜를 골라주세요.');
    if (date > today) return setError('미래 날짜는 기록할 수 없어요.');
    if (memo.length > MEMO_MAX) return setError(`메모는 ${MEMO_MAX}자 이하로 써주세요.`);
    setError(null);
    await saveLog({ date, period, products, memo: memo.trim(), photoUrl: photo, skinMetrics: metrics, ...values });
    showToast(existing ? `${PERIOD_LABEL[period]} 기록을 업데이트했어요` : `${PERIOD_LABEL[period]} 기록을 남겼어요`);
    // 아침을 막 남겼고 저녁이 아직이면 저녁 탭으로 안내
    if (!existing && period === 'AM' && !done.PM && date === today) {
      setTimeout(() => showToast('저녁에 다시 와서 🌙 저녁 기록도 남겨주세요'), 2700);
    }
  };

  return (
    <div className="card">
      <div className="row row--between">
        <label htmlFor="log-date" className="h3">
          {date === today ? '오늘' : formatKoDate(date)}
        </label>
        <input
          id="log-date"
          type="date"
          className="input"
          style={{ width: 'auto', padding: '6px 10px' }}
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <PeriodSegment value={period} onChange={setPeriod} done={done} />
      </div>
      <p className="small muted mt-1">
        {existing
          ? `${PERIOD_ICON[period]} ${PERIOD_LABEL[period]} 기록이 있어요. 저장하면 덮어써요.`
          : `${PERIOD_ICON[period]} ${PERIOD_LABEL[period]} 루틴을 마친 뒤의 피부 상태를 남겨요.`}
      </p>

      <div className="field mt-3">
        <label>
          {PERIOD_ICON[period]} {PERIOD_LABEL[period]}에 쓴 제품
        </label>
        {candidates.length === 0 ? (
          <span className="field-hint">{PERIOD_LABEL[period]} 루틴에 제품을 담으면 여기서 체크할 수 있어요.</span>
        ) : (
          <div className="chip-row">
            {candidates.map((id) => {
              const p = findProduct(id);
              if (!p) return null;
              const on = products.includes(id);
              return (
                <Chip
                  key={id}
                  small
                  active={on}
                  onClick={() => setProducts((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))}
                >
                  {on ? '✓ ' : ''}
                  {p.name}
                </Chip>
              );
            })}
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
            aria-label={`${PERIOD_LABEL[period]} ${m.label}`}
          />
          <div className="slider__ends">
            <span>{m.low}</span>
            <span>{m.high}</span>
          </div>
        </div>
      ))}

      <SkinPhotoSection
        photo={photo}
        metrics={metrics}
        previous={previousWithPhoto}
        onChange={(p, m) => {
          setPhoto(p);
          setMetrics(m);
        }}
      />

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
        <span className="field-hint">
          {memo.length}/{MEMO_MAX}
        </span>
      </div>
      {error && <p className="field-error mb-2">{error}</p>}
      <button type="button" className="btn btn--block" onClick={submit}>
        {PERIOD_ICON[period]} {PERIOD_LABEL[period]} 기록 {existing ? '업데이트' : '남기기'}
      </button>
    </div>
  );
}

function EntryBlock({ log }: { log: SkinLog }) {
  const deleteLog = useAppStore((s) => s.deleteLog);
  const showToast = useAppStore((s) => s.showToast);
  return (
    <div className="log-entry">
      <div className="row row--between">
        <span className="log-entry__period">
          {PERIOD_ICON[log.period]} {PERIOD_LABEL[log.period]}
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label={`${PERIOD_LABEL[log.period]} 기록 삭제`}
          onClick={async () => {
            if (window.confirm(`${formatKoDate(log.date, false)} ${PERIOD_LABEL[log.period]} 기록을 지울까요?`)) {
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
            <Badge key={id}>{findProduct(id)?.name ?? id}</Badge>
          ))}
        </div>
      )}
      {log.photoUrl && (
        <div className="row mt-1" style={{ gap: 10 }}>
          <LogPhotoThumb log={log} />
          {log.skinMetrics && (
            <span className="tiny muted">
              홍조 {log.skinMetrics.redness} · 광택 {log.skinMetrics.shine} · 균일도 {log.skinMetrics.evenness}
            </span>
          )}
        </div>
      )}
      {log.memo && <p className="small mt-1">{log.memo}</p>}
    </div>
  );
}

/** 타임라인 — 날짜별로 묶고 아침·저녁 기록을 나란히 */
function Timeline() {
  const logs = useAppStore((s) => s.logs);
  const [compare, setCompare] = useState(false);
  const photoCount = logs.filter((l) => l.photoUrl).length;
  const days = useMemo(() => {
    const map = new Map<string, SkinLog[]>();
    logs.forEach((l) => map.set(l.date, [...(map.get(l.date) ?? []), l]));
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, entries]) => ({ date, entries: entries.sort((a, b) => a.period.localeCompare(b.period)) }));
  }, [logs]);

  if (days.length === 0) {
    return (
      <div className="empty">
        <strong>아직 기록이 없어요</strong>오늘 기록 탭에서 아침 또는 저녁 컨디션을 남겨보세요.
      </div>
    );
  }

  return (
    <ol className="stack">
      {photoCount >= 1 && (
        <li className="row row--between" style={{ listStyle: 'none' }}>
          <span className="small muted">피부 사진 {photoCount}장</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setCompare(true)} disabled={photoCount < 2}>
            📷 날짜별 사진 비교
          </button>
        </li>
      )}
      {compare && <SkinPhotoCompare onClose={() => setCompare(false)} />}
      {days.map((d) => (
        <li key={d.date} className="log-row">
          <div className="row row--between">
            <span className="h3">{formatKoDate(d.date)}</span>
            <span className="tiny muted">
              {d.entries.map((e) => PERIOD_ICON[e.period]).join(' ')} {d.entries.length}건
            </span>
          </div>
          <div className="stack stack--sm mt-2">
            {d.entries.map((e) => (
              <EntryBlock key={e.id} log={e} />
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Insights() {
  const logs = useAppStore((s) => s.logs);
  const routines = useAppStore((s) => s.routines);
  const goToIngredients = useAppStore((s) => s.goToIngredients);
  const navigate = useAppStore((s) => s.navigate);
  const catalog = useCatalog();
  const ins = useMemo(() => analyzeLogs(logs, routines, catalog), [logs, routines, catalog]);

  if (!ins.enabled) {
    return (
      <div className="empty">
        <strong>기록이 3일 이상 쌓이면 인사이트가 열려요</strong>
        지금 {ins.dayCount}일({ins.entryCount}건) 기록됐어요. 최근 7일 비교, 편안함 추세, 자극이 있던 기록의 제품 패턴을 분석해드려요.
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
                  {c.delta === null
                    ? `이전 ${c.previous ?? '–'}`
                    : c.delta === 0
                      ? '변화 없음'
                      : `${c.delta > 0 ? '▲' : '▼'} ${Math.abs(c.delta)} (이전 ${c.previous})`}
                </div>
              </div>
            );
          })}
        </div>
        <p className="tiny muted mt-2">
          최근 {ins.comparisons[0].recentCount}건 · 이전 {ins.comparisons[0].previousCount}건의 아침·저녁 기록 평균이에요.
        </p>
      </div>

      <div className="card">
        <div className="h3">14일 편안함</div>
        <div className="bars mt-2" role="img" aria-label="14일 편안함 막대그래프">
          {ins.comfortBars.map((b) => (
            <div key={b.date} className="bars__col">
              <div
                className="bars__bar"
                style={{ height: b.value ? `${(b.value / max) * 100}%` : '2px', opacity: b.value ? 1 : 0.35 }}
                title={`${b.date}: 아침 ${b.am ?? '–'} · 저녁 ${b.pm ?? '–'}`}
              />
              <span className="bars__day">{b.date.slice(8)}</span>
            </div>
          ))}
        </div>
        <p className="tiny muted mt-1">막대는 그날 아침·저녁 기록의 평균이에요.</p>
      </div>

      <SkinPhotoTrend />

      {ins.irritationNote && (
        <div className="card card--soft">
          <div className="h3">자극감 평균 {ins.irritationNote.avg}점</div>
          <p className="small mt-1">
            루틴에 각질 관리 계열이 {ins.irritationNote.families.length}종
            {ins.irritationNote.familyLabels.length ? ` (${ins.irritationNote.familyLabels.join(', ')})` : ''} 있어요.
            {ins.irritationNote.families.length >= 2
              ? ' 서로 다른 계열이 겹치면 자극이 누적될 수 있어요. 한 가지만 남기고 격일로 써보는 방식이 자주 권장돼요.'
              : ' 각질 계열 자체는 많지 않아요. 새로 추가한 제품이나 향료, 사용 빈도를 함께 살펴보세요.'}
            {ins.irritationNote.worsePeriod &&
              ` 특히 ${PERIOD_LABEL[ins.irritationNote.worsePeriod]} 기록에서 자극감이 더 높았어요 — ${PERIOD_LABEL[ins.irritationNote.worsePeriod]} 루틴부터 살펴보세요.`}
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
          <div className="h3">자극이 있던 기록에 유독 많이 등장한 제품</div>
          <p className="tiny muted mt-1">
            자극감 4점 이상이던 {ins.suspectBasis.irritatedDays}건 vs 편안했던 {ins.suspectBasis.calmDays}건의 제품 등장 비율 차이예요.
          </p>
          <div className="stack stack--sm mt-2">
            {ins.suspects.map((s) => (
              <div key={s.product.id} className="suspect">
                <div className="flex-1">
                  <div className="product-card__brand">
                    {s.product.brand} · {s.periods.map((p) => `${PERIOD_ICON[p]} ${PERIOD_LABEL[p]}`).join(' · ')}
                  </div>
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
                  <div className="tiny muted">
                    {formatKoDate(e.startedAt, false)} 시작 · 이전 {e.beforeCount}건 / 이후 {e.afterCount}건
                  </div>
                </div>
                <div className="suspect__stat">
                  <span className="tiny muted">{e.before} → </span>
                  <span className={e.delta > 0 ? 'tone-mint' : e.delta < 0 ? 'tone-rose' : ''}>{e.after}</span>
                  <span className="tiny muted">
                    {' '}
                    ({e.delta > 0 ? '+' : ''}
                    {e.delta})
                  </span>
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
            {ins.weekday.best.day}요일(평균 {ins.weekday.best.avg})에 가장 편안했고, {ins.weekday.worst.day}요일(평균 {ins.weekday.worst.avg})에
            가장 불편했어요. 그 요일의 생활 패턴을 떠올려보세요.
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
  const dayCount = useMemo(() => new Set(logs.map((l) => l.date)).size, [logs]);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">Skin diary</div>
        <h1 className="h1">
          피부 <em>기록</em>
        </h1>
        <p>아침 루틴 뒤, 저녁 루틴 뒤 각각 컨디션을 남겨요. 기록이 쌓일수록 인사이트가 열려요.</p>
      </header>

      <div className="tabs" role="tablist">
        {(
          [
            ['today', '기록하기'],
            ['timeline', `타임라인 ${dayCount}일`],
            ['insights', '인사이트'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tabs__btn${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'today' && <DiaryForm />}
      {tab === 'timeline' && <Timeline />}
      {tab === 'insights' && <Insights />}
    </div>
  );
}
