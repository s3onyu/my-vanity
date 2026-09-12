import { useMemo, useState } from 'react';
import type { SkinLog, SkinMetrics } from '@/types';
import { analyzeSkinPhoto, describeMetricChange, METRIC_META, photoConditionNote } from '@/engine/skinPhoto';
import { formatKoDate } from '@/lib/date';
import { resizeImage } from '@/lib/image';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { Overlay, Sheet } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

const PERIOD_ICON = { AM: '☀️', PM: '🌙' } as const;

/** 지표 칩 — 이전 사진과의 차이를 함께 보여준다 */
export function MetricChips({ metrics, prev }: { metrics: SkinMetrics; prev?: SkinMetrics | null }) {
  return (
    <div className="metric-chips">
      {METRIC_META.map((m) => {
        const d = prev ? metrics[m.key] - prev[m.key] : 0;
        const better = m.higherIsBetter ? d > 0 : d < 0;
        return (
          <span key={m.key} className="metric-chip" title={m.desc}>
            {m.emoji} {m.label} <span className="serif">{metrics[m.key]}</span>
            {prev && Math.abs(d) >= 3 && (
              <span className={`metric-chip__delta ${better ? 'is-better' : 'is-worse'}`}>
                {d > 0 ? '▲' : '▼'}
                {Math.abs(d)}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/** 사진 data URL 을 리사이즈해 저장용 크기로 만들고 지표를 계산한다 */
async function prepareSkinPhoto(dataUrl: string): Promise<{ photo: string; metrics: SkinMetrics }> {
  const blob = await (await fetch(dataUrl)).blob();
  const photo = await resizeImage(new File([blob], 'skin.jpg', { type: blob.type || 'image/jpeg' }), 720, 0.82);
  const metrics = await analyzeSkinPhoto(photo);
  return { photo, metrics };
}

interface SectionProps {
  photo: string | null;
  metrics: SkinMetrics | null;
  /** 비교 기준이 되는 직전 사진 기록 */
  previous: SkinLog | null;
  onChange: (photo: string | null, metrics: SkinMetrics | null) => void;
}

/** 기록 폼의 "오늘 피부 사진" 섹션 */
export function SkinPhotoSection({ photo, metrics, previous, onChange }: SectionProps) {
  const showToast = useAppStore((s) => s.showToast);
  const [camera, setCamera] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState(false);
  const note = metrics ? photoConditionNote(metrics) : null;
  const changes = useMemo(() => (metrics && previous?.skinMetrics ? describeMetricChange(previous.skinMetrics, metrics) : []), [metrics, previous]);

  const onCapture = async (dataUrl: string) => {
    setCamera(false);
    setBusy(true);
    try {
      const { photo: p, metrics: m } = await prepareSkinPhoto(dataUrl);
      onChange(p, m);
    } catch (err) {
      showToast((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field mt-3">
      <label>📷 피부 사진 (선택)</label>
      <div className="skin-photo">
        {photo ? (
          <button type="button" className="product-thumb-wrap" onClick={() => setViewer(true)} aria-label="사진 크게 보기">
            <img src={photo} alt="오늘 피부 사진" className="skin-photo__img" />
          </button>
        ) : (
          <div className="skin-photo__empty">
            <Icon name="camera" size={22} />
          </div>
        )}
        <div className="flex-1 stack stack--sm">
          {metrics ? (
            <>
              <MetricChips metrics={metrics} prev={previous?.skinMetrics ?? null} />
              {note && <p className={`tiny ${note.level === 'warn' ? 'tone-butter' : 'muted'}`}>{note.text}</p>}
              {changes.length > 0 && previous && (
                <p className="tiny muted">
                  {formatKoDate(previous.date, false)} {PERIOD_ICON[previous.period]} 사진과 비교: {changes.join(' · ')}
                </p>
              )}
            </>
          ) : (
            <p className="small muted">같은 조명·거리에서 꾸준히 찍으면 홍조·광택·균일도 변화를 날짜별로 비교할 수 있어요. 진단이 아닌 참고 지표예요.</p>
          )}
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="btn btn--sm" onClick={() => setCamera(true)} disabled={busy}>
              <Icon name="camera" size={14} /> {busy ? '분석 중…' : photo ? '다시 찍기' : '찍기'}
            </button>
            {photo && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange(null, null)}>
                지우기
              </button>
            )}
          </div>
        </div>
      </div>
      {camera && <CameraCapture guide="face" title="오늘 피부 사진" onCapture={onCapture} onClose={() => setCamera(false)} />}
      {viewer && photo && (
        <Sheet onClose={() => setViewer(false)} label="피부 사진">
          <img src={photo} alt="피부 사진" className="photo-full" />
          {metrics && (
            <div className="mt-2">
              <MetricChips metrics={metrics} prev={previous?.skinMetrics ?? null} />
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}

/** 타임라인 항목의 사진 썸네일 → 크게 보기 */
export function LogPhotoThumb({ log }: { log: SkinLog }) {
  const [open, setOpen] = useState(false);
  if (!log.photoUrl) return null;
  return (
    <>
      <button type="button" className="product-thumb-wrap" onClick={() => setOpen(true)} aria-label="피부 사진 보기">
        <img src={log.photoUrl} alt="" className="log-photo-thumb" loading="lazy" />
      </button>
      {open && (
        <Sheet onClose={() => setOpen(false)} label="피부 사진">
          <div className="h3 mb-2">
            {formatKoDate(log.date)} {PERIOD_ICON[log.period]}
          </div>
          <img src={log.photoUrl} alt="피부 사진" className="photo-full" />
          {log.skinMetrics && (
            <div className="mt-2">
              <MetricChips metrics={log.skinMetrics} />
            </div>
          )}
        </Sheet>
      )}
    </>
  );
}

/** 두 날짜의 사진을 나란히 비교 */
export function SkinPhotoCompare({ onClose }: { onClose: () => void }) {
  const logs = useAppStore((s) => s.logs);
  const withPhoto = useMemo(() => logs.filter((l) => l.photoUrl).sort((a, b) => a.date.localeCompare(b.date) || a.period.localeCompare(b.period)), [logs]);
  const [a, setA] = useState<string | null>(withPhoto[0]?.id ?? null);
  const [b, setB] = useState<string | null>(withPhoto[withPhoto.length - 1]?.id ?? null);
  const la = withPhoto.find((l) => l.id === a) ?? null;
  const lb = withPhoto.find((l) => l.id === b) ?? null;
  const changes = la?.skinMetrics && lb?.skinMetrics ? describeMetricChange(la.skinMetrics, lb.skinMetrics) : [];

  const pick = (id: string) => {
    if (a === id) return setA(null);
    if (b === id) return setB(null);
    if (!a) return setA(id);
    if (!b) return setB(id);
    setA(b);
    setB(id);
    return undefined;
  };

  return (
    <Overlay title="피부 사진 비교" onClose={onClose}>
      {withPhoto.length < 2 ? (
        <div className="empty">
          <strong>비교할 사진이 2장 이상 필요해요</strong>
          기록할 때 피부 사진을 찍어두면 여기서 날짜별로 나란히 볼 수 있어요.
        </div>
      ) : (
        <div className="stack">
          <p className="small muted">사진을 눌러 두 장을 고르세요. 파란 테두리(A)가 이전, 붉은 테두리(B)가 이후예요.</p>
          {la && lb && (
            <div className="card">
              <div className="photo-compare">
                {[la, lb].map((l, i) => (
                  <div key={l.id}>
                    <img src={l.photoUrl!} alt="" className="photo-compare__img" />
                    <div className="row mt-1" style={{ gap: 6 }}>
                      <Badge color={i === 0 ? 'sky' : 'rose'}>{i === 0 ? 'A' : 'B'}</Badge>
                      <span className="small">
                        {formatKoDate(l.date, false)} {PERIOD_ICON[l.period]}
                      </span>
                    </div>
                    {l.skinMetrics && (
                      <div className="mt-1">
                        <MetricChips metrics={l.skinMetrics} prev={i === 1 ? la.skinMetrics : null} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {changes.length > 0 && (
                <div className="notice mt-2">
                  {changes.map((c) => (
                    <div key={c}>{c}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="photo-pick-grid">
            {withPhoto.map((l) => (
              <button key={l.id} type="button" className={`photo-pick${a === l.id ? ' is-a' : b === l.id ? ' is-b' : ''}`} onClick={() => pick(l.id)}>
                <img src={l.photoUrl!} alt="" loading="lazy" />
                <span className="photo-pick__label">
                  {l.date.slice(5).replace('-', '/')} {PERIOD_ICON[l.period]}
                </span>
                {(a === l.id || b === l.id) && <span className={`photo-pick__tag ${a === l.id ? 'is-a' : 'is-b'}`}>{a === l.id ? 'A' : 'B'}</span>}
              </button>
            ))}
          </div>
          <p className="fine-print">지표는 조명·거리·화장 여부에 따라 달라지는 참고값이에요. 상관관계가 인과관계는 아니며, 피부 상태가 걱정되면 전문의와 상담해주세요.</p>
        </div>
      )}
    </Overlay>
  );
}

/** 인사이트 — 최근 사진 지표 추이 (홍조·광택·균일도) */
export function SkinPhotoTrend() {
  const logs = useAppStore((s) => s.logs);
  const series = useMemo(
    () =>
      logs
        .filter((l) => l.skinMetrics && l.photoUrl)
        .sort((a, b) => a.date.localeCompare(b.date) || a.period.localeCompare(b.period))
        .slice(-14),
    [logs],
  );
  if (series.length < 3) {
    return (
      <div className="card card--soft">
        <div className="h3">피부 사진 추이</div>
        <p className="small muted mt-1">사진이 있는 기록이 3건 이상 쌓이면 홍조·광택·균일도 변화를 그래프로 보여드려요. (지금 {series.length}건)</p>
      </div>
    );
  }
  const W = 320;
  const H = 110;
  const pad = 14;
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(1, series.length - 1);
  const y = (v: number) => H - pad - (v / 100) * (H - pad * 2);
  const colors = { redness: 'var(--rose-ink)', shine: 'var(--butter-ink)', evenness: 'var(--mint-ink)' } as const;
  const first = series[0].skinMetrics!;
  const last = series[series.length - 1].skinMetrics!;
  const summary = describeMetricChange(first, last);

  return (
    <div className="card">
      <div className="h3">피부 사진 추이 · 최근 {series.length}장</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="trend mt-2" role="img" aria-label="피부 사진 지표 추이">
        {[0, 50, 100].map((v) => (
          <line key={v} x1={pad} x2={W - pad} y1={y(v)} y2={y(v)} stroke="var(--line-soft)" strokeWidth="1" />
        ))}
        {METRIC_META.map((m) => (
          <polyline
            key={m.key}
            fill="none"
            stroke={colors[m.key]}
            strokeWidth="2"
            strokeLinejoin="round"
            points={series.map((l, i) => `${x(i)},${y(l.skinMetrics![m.key])}`).join(' ')}
          />
        ))}
        {series.map((l, i) => (
          <text key={l.id} x={x(i)} y={H - 2} textAnchor="middle" fontSize="8" fill="var(--muted)">
            {l.date.slice(5).replace('-', '/')}
          </text>
        ))}
      </svg>
      <div className="row row--wrap" style={{ gap: 8 }}>
        {METRIC_META.map((m) => (
          <span key={m.key} className="tiny" style={{ color: colors[m.key] }}>
            ● {m.label}
          </span>
        ))}
      </div>
      <p className="small mt-2">
        {summary.length ? `첫 사진(${formatKoDate(series[0].date, false)})과 비교하면 ${summary.join(', ')}.` : '첫 사진과 비교해 큰 변화는 없어요.'}
      </p>
      <p className="tiny muted mt-1">조명과 거리가 비슷한 사진끼리만 의미 있는 비교예요. 참고용이며 진단이 아니에요.</p>
    </div>
  );
}
