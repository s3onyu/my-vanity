import { useRef, useState } from 'react';
import type { Product } from '@/types';
import { resizeImage } from '@/lib/image';
import { Sheet } from '@/components/layout/Overlay';
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

/**
 * 제품 썸네일 — 내가 붙인 사진 > 직접 등록 제품 사진 > 카테고리 일러스트 순으로 보여준다.
 * editable 이면 눌러서 사진을 찍거나 앨범에서 골라 붙이고, 지울 수도 있다.
 */
export function ProductThumb({ product, size = 44, editable = false, className = '' }: Props) {
  const photo = useAppStore((s) => s.productPhotos[product.id]) ?? product.imageUrl ?? null;
  const hasOwnPhoto = useAppStore((s) => Boolean(s.productPhotos[product.id]));
  const setProductPhoto = useAppStore((s) => s.setProductPhoto);
  const removeProductPhoto = useAppStore((s) => s.removeProductPhoto);
  const showToast = useAppStore((s) => s.showToast);
  const [open, setOpen] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const visual = photo ? (
    <img src={photo} alt={`${product.name} 사진`} className="product-thumb" style={{ width: size, height: size }} />
  ) : (
    <ProductArt product={product} size={size} className="product-thumb product-thumb--art" />
  );

  if (!editable) return <span className={`product-thumb-wrap ${className}`.trim()}>{visual}</span>;

  const onFile = async (file: File | undefined) => {
    setOpen(false);
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 420, 0.8);
      await setProductPhoto(product.id, dataUrl);
      showToast('제품 사진을 붙였어요');
    } catch (err) {
      showToast((err as Error).message);
    }
  };

  return (
    <>
      <button type="button" className={`product-thumb-wrap product-thumb-wrap--edit ${className}`.trim()} onClick={() => setOpen(true)} aria-label={`${product.name} 사진 바꾸기`}>
        {visual}
        <span className="product-thumb__badge">
          <Icon name="camera" size={10} />
        </span>
      </button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      {open && (
        <Sheet onClose={() => setOpen(false)} label="제품 사진">
          <div className="row mb-2">
            {visual}
            <div className="flex-1">
              <div className="product-card__brand">{product.brand}</div>
              <div className="h3">{product.name}</div>
            </div>
          </div>
          <p className="small muted mb-2">사진은 이 기기(또는 내 계정)에만 저장되고, 검색·루틴·기록 카드에 함께 표시돼요.</p>
          <div className="stack stack--sm">
            <button type="button" className="btn btn--block" onClick={() => cameraRef.current?.click()}>
              <Icon name="camera" size={16} /> 카메라로 찍기
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => fileRef.current?.click()}>
              앨범에서 고르기
            </button>
            {hasOwnPhoto && (
              <button
                type="button"
                className="btn btn--danger btn--block"
                onClick={async () => {
                  await removeProductPhoto(product.id);
                  setOpen(false);
                  showToast('제품 사진을 지웠어요');
                }}
              >
                사진 지우기
              </button>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}
