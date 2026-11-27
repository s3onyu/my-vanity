import { useMemo, useState } from 'react';
import { formatKoDate } from '@/lib/date';
import { METRIC_LABEL } from '@/engine/insights';
import { buildProductHistories, compareHistories, sortHistories, type ProductHistory, type SortKey } from '@/engine/productHistory';

import { ProductThumb } from '@/components/products/ProductThumb';
import { useAppStore } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'logs', label: '기록 많은 순' },
  { key: 'comfort', label: '편안함 높은 순' },
  { key: 'irritation', label: '자극감 높은 순' },
  { key: 'started', label: '최근 담은 순' },
];

const num = (v: number | null) => (v === null ? '–' : v.toFixed(1));

function HistoryRow({
  h,
  checked,
  onToggle,
}: {
  h: ProductHistory;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className={`ph-row${checked ? ' is-checked' : ''}`}>
      <label className="ph-row__pick">
        <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`${h.product.name} 비교에 넣기`} />
      </label>
      <ProductThumb product={h.product} size={38} />
      <div className="flex-1">
        <div className="product-card__brand">{h.product.brand}</div>
        <div className="product-card__name ellipsis">{h.product.name}</div>
        <div className="ph-row__meta">
          {h.startedAt ? (
            <span>
              {formatKoDate(h.startedAt, false)} 시작 · {h.usageDays}일째
            </span>
          ) : (
            <span>루틴에 없는 제품</span>
          )}
          <span>· 기록 {h.logCount}건</span>
          {h.routineTypes.map((t) => (
            <span key={t}>· {t === 'AM' ? '☀️' : '🌙'}</span>
          ))}
        </div>
      </div>
      <div className="ph-row__stats">
        <span className="ph-stat">
          <span className="tiny muted">편안함</span>
          <strong>{num(h.averages.comfort)}</strong>
        </span>
        <span className="ph-stat">
          <span className="tiny muted">자극감</span>
          <strong className={h.averages.irritation !== null && h.averages.irritation >= 3.5 ? 'tone-rose' : ''}>
            {num(h.averages.irritation)}
          </strong>
        </span>
      </div>
    </li>
  );
}

/**
 * 제품별 사용 기록과 비교 (요청 3번).
 * 제품마다 언제부터 썼는지·기록이 몇 건인지·그 기록의 피부 반응 평균을 보여주고,
 * 체크한 제품들을 지표별로 나란히 비교한다.
 */
export function ProductCompare() {
  const logs = useAppStore((s) => s.logs);
  const routines = useAppStore((s) => s.routines);
  const catalog = useCatalog();
  const [sort, setSort] = useState<SortKey>('logs');
  const [selected, setSelected] = useState<string[]>([]);

  const { histories, withLogs } = useMemo(() => buildProductHistories(logs, routines, catalog), [logs, routines, catalog]);
  const sorted = useMemo(() => sortHistories(histories, sort), [histories, sort]);
  const picked = useMemo(() => selected.map((id) => histories.find((h) => h.product.id === id)).filter((h): h is ProductHistory => Boolean(h)), [selected, histories]);
  const rows = useMemo(() => (picked.length >= 2 ? compareHistories(picked) : []), [picked]);

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? [...cur.slice(1), id] : [...cur, id]));

  if (histories.length === 0) {
    return (
      <div className="empty">
        <strong>아직 비교할 제품이 없어요</strong>
        내 화장대에 제품을 담고, 기록하기 탭에서 그 제품을 쓴 날의 피부 상태를 남기면 제품별로 모아 보여드려요.
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="card card--soft">
        <div className="h3">제품별로 모아 봤어요</div>
        <p className="small muted mt-1">
          제품 {histories.length}개 중 {withLogs}개에 기록이 있어요. 비교하고 싶은 제품을 <strong>2~3개</strong> 체크해 보세요.
        </p>
        <div className="chip-scroll mt-2" role="tablist" aria-label="정렬 기준">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={sort === s.key}
              className={`chip chip--sm${sort === s.key ? ' is-active' : ''}`}
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {picked.length >= 2 && (
        <div className="card">
          <div className="row row--between">
            <span className="h3">제품 {picked.length}개 비교</span>
            <button type="button" className="link-btn" onClick={() => setSelected([])}>
              비교 지우기
            </button>
          </div>
          <div className="ph-table-wrap mt-2">
            <table className="ph-table">
              <caption className="tiny muted">그 제품을 썼다고 체크한 기록의 평균이에요</caption>
              <thead>
                <tr>
                  <th scope="col">항목</th>
                  {picked.map((h) => (
                    <th key={h.product.id} scope="col">
                      {h.product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">기록 수</th>
                  {picked.map((h) => (
                    <td key={h.product.id}>{h.logCount}건</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">사용 기간</th>
                  {picked.map((h) => (
                    <td key={h.product.id}>{h.usageDays ? `${h.usageDays}일째` : '–'}</td>
                  ))}
                </tr>
                {rows.map((r) => (
                  <tr key={r.metric}>
                    <th scope="row">
                      {r.label}
                      <span className="tiny muted"> {r.higherIsBetter ? '(높을수록 좋음)' : '(낮을수록 좋음)'}</span>
                    </th>
                    {r.values.map((v, i) => (
                      <td key={picked[i].product.id} className={r.bestIndex === i ? 'is-best' : ''}>
                        {v === null ? '–' : v.toFixed(1)}
                        {r.bestIndex === i && ' 👍'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">자극 4점 이상</th>
                  {picked.map((h) => (
                    <td key={h.product.id}>{h.irritatedCount}건</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">
                    안 쓴 날과 편안함 차이
                  </th>
                  {picked.map((h) => (
                    <td key={h.product.id} className={h.comfortVsOthers !== null && h.comfortVsOthers > 0 ? 'tone-mint' : h.comfortVsOthers !== null && h.comfortVsOthers < 0 ? 'tone-rose' : ''}>
                      {h.comfortVsOthers === null ? '–' : `${h.comfortVsOthers > 0 ? '+' : ''}${h.comfortVsOthers}`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {picked.some((h) => h.beforeAfter) && (
            <div className="mt-2">
              <div className="h3">쓰기 시작한 뒤 편안함</div>
              {picked.map((h) =>
                h.beforeAfter ? (
                  <p key={h.product.id} className="small mt-1">
                    <strong>{h.product.name}</strong> — 담기 전 {h.beforeAfter.before} → 담은 뒤 {h.beforeAfter.after}{' '}
                    <span className={h.beforeAfter.delta > 0 ? 'tone-mint' : h.beforeAfter.delta < 0 ? 'tone-rose' : 'muted'}>
                      ({h.beforeAfter.delta > 0 ? '+' : ''}
                      {h.beforeAfter.delta})
                    </span>
                    <span className="tiny muted">
                      {' '}
                      · 이전 {h.beforeAfter.beforeCount}건 / 이후 {h.beforeAfter.afterCount}건
                    </span>
                  </p>
                ) : null,
              )}
            </div>
          )}
          <p className="fine-print">
            같은 날 여러 제품을 함께 쓰기 때문에 이 숫자만으로 어떤 제품이 원인이라고 말할 수는 없어요. 한 가지씩 바꿔 보면서 확인하는 게
            가장 정확해요.
          </p>
        </div>
      )}

      {picked.length === 1 && (
        <p className="small muted text-center">비교하려면 제품을 하나 더 골라주세요 (최대 3개).</p>
      )}

      <ul className="ph-list">
        {sorted.map((h) => (
          <HistoryRow key={h.product.id} h={h} checked={selected.includes(h.product.id)} onToggle={() => toggle(h.product.id)} />
        ))}
      </ul>
      <p className="tiny muted">
        지표는 {Object.values(METRIC_LABEL).join(' · ')} 네 가지예요. 기록이 없는 제품은 “–”로 표시돼요.
      </p>
    </div>
  );
}
