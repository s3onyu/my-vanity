import { useState } from 'react';
import type { Product } from '@/types';
import { capturePhoto } from '@/lib/camera';
import { useExternalImage } from '@/lib/productImage';
import { Sheet } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { ProductArt } from './ProductArt';

interface Props {
  product: Product;
  size?: number;
  /** true 면 눌러서 사진을 찍거나 고를 수 있다 */
  editable?: boolean;
  className?: string;
}

type Source = 'mine' | 'custom' | 'shared' | 'external' | 'art';

/**
 * 제품 썸네일 — 내가 붙인 사진 > 직접 등록 제품 사진 > 다른 사용자가 공유한 사진 > 외부 상품 사진(네이버 쇼핑·Open Beauty Facts) > 일러스트.
 * editable 이면 눌러서 사진을 찍거나 앨범에서 골라 붙이고, 지우거나 다른 사용자와 공유할 수 있다.
 */
export function ProductThumb({ product, size = 44, editable = false, className = '' }: Props) {
  const mine = useAppStore((s) => s.productPhotos[product.id]) ?? null;
  const shared = useAppStore((s) => s.sharedPhotos[product.id]) ?? null;
  const isShared = useAppStore((s) => s.mySharedPhotoIds.includes(product.id));
  const storageKind = useAppStore((s) => s.storage.kind);
  const setProductPhoto = useAppStore((s) => s.setProductPhoto);
  const removeProductPhoto = useAppStore((s) => s.removeProductPhoto);
  const shareProductPhoto = useAppStore((s) => s.shareProductPhoto);
  const unshareProductPhoto = useAppStore((s) => s.unshareProductPhoto);
  const showToast = useAppStore((s) => s.showToast);
  const external = useExternalImage(mine || product.imageUrl || shared ? null : product);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState<string | null>(null);

  let source: Source = 'art';
  let url: string | null = null;
  if (mine) {
    source = 'mine';
    url = mine;
  } else if (product.imageUrl) {
    source = 'custom';
    url = product.imageUrl;
  } else if (shared) {
    source = 'shared';
    url = shared;
  } else if (external && external.url !== broken) {
    source = 'external';
    url = external.url;
  }

  const visual = url ? (
    <img
      src={url}
      alt={`${product.name} 사진`}
      className="product-thumb"
      style={{ width: size, height: size }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(url)}
    />
  ) : (
    <ProductArt product={product} size={size} className="product-thumb product-thumb--art" />
  );

  if (!editable) return <span className={`product-thumb-wrap ${className}`.trim()}>{visual}</span>;

  const take = async (sourceKind: 'camera' | 'gallery') => {
    setBusy(true);
    try {
      const dataUrl = await capturePhoto({ source: sourceKind, maxSide: 420, quality: 0.8 });
      if (dataUrl) {
        await setProductPhoto(product.id, dataUrl);
        showToast('제품 사진을 붙였어요');
        setOpen(false);
      }
    } catch (err) {
      showToast((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const toggleShare = async () => {
    setBusy(true);
    if (isShared) {
      await unshareProductPhoto(product.id);
      showToast('공유를 취소했어요');
    } else if (await shareProductPhoto(product.id)) {
      showToast('다른 사용자에게도 이 사진이 보여요');
    }
    setBusy(false);
  };

  return (
    <>
      <button type="button" className={`product-thumb-wrap product-thumb-wrap--edit ${className}`.trim()} onClick={() => setOpen(true)} aria-label={`${product.name} 사진 바꾸기`}>
        {visual}
        <span className="product-thumb__badge">
          <Icon name="camera" size={10} />
        </span>
      </button>
      {open && (
        <Sheet onClose={() => setOpen(false)} label="제품 사진">
          <div className="row mb-2">
            {visual}
            <div className="flex-1">
              <div className="product-card__brand">{product.brand}</div>
              <div className="h3">{product.name}</div>
              <div className="row row--wrap mt-1" style={{ gap: 4 }}>
                {source === 'mine' && <Badge color="mint">내 사진</Badge>}
                {source === 'custom' && <Badge color="mint">등록할 때 찍은 사진</Badge>}
                {source === 'shared' && <Badge color="sky">다른 사용자가 공유한 사진</Badge>}
                {source === 'external' && external && <Badge color="butter">{external.credit}</Badge>}
                {source === 'art' && <Badge>일러스트</Badge>}
              </div>
            </div>
          </div>
          {source === 'external' && external && (
            <p className="small muted mb-2">
              외부 상품 사진이에요. 실제 제품과 다를 수 있으니 직접 찍어 붙이면 더 정확해요.{' '}
              <a className="link-btn" href={external.link} target="_blank" rel="noopener noreferrer">
                원본 보기 ↗
              </a>
            </p>
          )}
          <p className="small muted mb-2">직접 찍은 사진은 이 기기(또는 내 계정)에 저장되고, 검색·루틴·기록 카드에 함께 표시돼요.</p>
          <div className="stack stack--sm">
            <button type="button" className="btn btn--block" onClick={() => take('camera')} disabled={busy}>
              <Icon name="camera" size={16} /> 카메라로 찍기
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => take('gallery')} disabled={busy}>
              앨범에서 고르기
            </button>
            {mine && (
              <>
                {storageKind === 'supabase' ? (
                  <label className="row small" style={{ gap: 8, padding: '6px 2px' }}>
                    <input type="checkbox" checked={isShared} onChange={toggleShare} disabled={busy} />
                    다른 사용자에게도 이 사진 보여주기 (제품 식별용으로만 쓰여요)
                  </label>
                ) : (
                  <p className="tiny muted">서버(Supabase)에 연결하면 내 사진을 다른 사용자와 공유할 수 있어요.</p>
                )}
                <button
                  type="button"
                  className="btn btn--danger btn--block"
                  onClick={async () => {
                    if (isShared) await unshareProductPhoto(product.id);
                    await removeProductPhoto(product.id);
                    setOpen(false);
                    showToast('제품 사진을 지웠어요');
                  }}
                  disabled={busy}
                >
                  사진 지우기
                </button>
              </>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}
