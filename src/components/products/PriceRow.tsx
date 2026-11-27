import { useState } from 'react';
import type { Product } from '@/types';
import { formatWon, pricePerUnit, shopLinks } from '@/lib/shopLink';
import { Icon } from '@/components/ui/Icon';
import { selectPriceOf, useAppStore } from '@/store/useAppStore';

/**
 * 제품 가격 (요청 2번) + 쇼핑몰 링크 (요청 10번).
 *
 * 가격은 수시로 바뀌고 쇼핑몰마다 달라서 앱이 직접 들고 있지 않다.
 * 그래서 두 가지를 같이 둔다 — ① 내가 산 가격을 적어 두면 루틴 합계·1ml 당 가격을 계산해 주고,
 * ② 오늘 가격은 올리브영·네이버 쇼핑 검색으로 바로 넘어가 확인한다.
 */
export function PriceRow({ product, compact = false }: { product: Product; compact?: boolean }) {
  const saved = useAppStore(selectPriceOf(product.id));
  const setProductPrice = useAppStore((s) => s.setProductPrice);
  const removeProductPrice = useAppStore((s) => s.removeProductPrice);
  const showToast = useAppStore((s) => s.showToast);

  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(saved ? String(saved.price) : '');
  const [volume, setVolume] = useState(saved?.volume ? String(saved.volume) : product.volume ? String(product.volume) : '');
  const [error, setError] = useState<string | null>(null);
  const links = compact ? [] : shopLinks(product);

  const save = async () => {
    const won = Number(price.replace(/[^\d]/g, ''));
    if (!won || won <= 0) {
      setError('가격을 숫자로 적어주세요.');
      return;
    }
    if (won > 10_000_000) {
      setError('가격이 너무 커요. 원 단위로 적어주세요.');
      return;
    }
    const ml = volume.trim() ? Number(volume.replace(/[^\d.]/g, '')) : null;
    setError(null);
    await setProductPrice(product.id, won, ml);
    setEditing(false);
    showToast('가격을 적어 뒀어요');
  };

  const perUnit = saved ? pricePerUnit(saved.price, saved.volume) : null;

  return (
    <div className={`price-row${compact ? ' price-row--compact' : ''}`}>
      {!editing ? (
        <div className="row row--between">
          {saved ? (
            <span className="price-row__value">
              💰 <strong>{formatWon(saved.price)}</strong>
              {perUnit && <span className="tiny muted"> · {perUnit}</span>}
            </span>
          ) : (
            <span className="tiny muted">{compact ? '가격 미입력' : '내가 산 가격을 적어 두면 루틴 전체 금액을 계산해 드려요'}</span>
          )}
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="link-btn" onClick={() => setEditing(true)}>
              {saved ? '수정' : '가격 적기'}
            </button>
            {saved && (
              <button
                type="button"
                className="icon-btn"
                aria-label="가격 지우기"
                onClick={async () => {
                  await removeProductPrice(product.id);
                  setPrice('');
                  showToast('가격을 지웠어요');
                }}
              >
                <Icon name="trash" size={13} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="price-edit">
          <div className="row" style={{ gap: 6 }}>
            <input
              className="input"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.slice(0, 9))}
              placeholder="가격 (원)"
              aria-label="가격 (원)"
            />
            <input
              className="input"
              inputMode="decimal"
              value={volume}
              onChange={(e) => setVolume(e.target.value.slice(0, 6))}
              placeholder="용량 (ml·g, 선택)"
              aria-label="용량 (ml 또는 g)"
            />
          </div>
          {error && <span className="field-error">{error}</span>}
          <div className="row mt-1" style={{ gap: 6 }}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>
              취소
            </button>
            <button type="button" className="btn btn--sm flex-1" onClick={save}>
              저장
            </button>
          </div>
          <p className="tiny muted mt-1">용량까지 적으면 1ml 당 가격으로 다른 제품과 비교할 수 있어요.</p>
        </div>
      )}

      {links.length > 0 && (
      <div className="shop-links">
        {links.map((l) => (
          <a key={l.id} className="shop-link" href={l.url} target="_blank" rel="noopener noreferrer" title={l.hint}>
            {l.icon} {l.label} ↗
          </a>
        ))}
      </div>
      )}
    </div>
  );
}

/** 루틴 전체 금액 — 가격을 적어 둔 제품만 더한다 */
export function RoutineTotal({ productIds }: { productIds: string[] }) {
  const prices = useAppStore((s) => s.prices);
  const known = prices.filter((p) => productIds.includes(p.productId));
  if (known.length === 0) return null;
  const total = known.reduce((s, p) => s + p.price, 0);
  const missing = productIds.length - known.length;
  return (
    <p className="small muted routine-total">
      💰 이 루틴에 적어 둔 가격 합계 <strong>{formatWon(total)}</strong> ({known.length}개)
      {missing > 0 && ` · 가격을 안 적은 제품 ${missing}개`}
    </p>
  );
}
