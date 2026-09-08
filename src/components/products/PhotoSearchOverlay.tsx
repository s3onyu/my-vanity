import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types';
import { PRODUCTS, getIngredient } from '@/data';
import { analyzePhotoText, type PhotoMatch } from '@/engine/photoMatch';
import { resizeImage } from '@/lib/image';
import { ocrStatusKo, recognizeProductText, warmUpOcr, type OcrProgress } from '@/lib/ocr';
import { Overlay } from '@/components/layout/Overlay';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { ProductCard } from './ProductCard';
import { CustomProductForm } from './CustomProductForm';

type Stage = 'pick' | 'recognizing' | 'results' | 'register';

interface Props {
  /** true 면 사진 없이 바로 직접 등록 폼으로 */
  registerOnly?: boolean;
}

function BrandProductRow({ match }: { match: PhotoMatch }) {
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const showToast = useAppStore((s) => s.showToast);
  const p = match.product;
  return (
    <div className="product-mini">
      <div className="flex-1">
        <div className="product-mini__brand">
          {p.category}
          {match.hits.length > 1 ? ` · 일치 ${match.hits.slice(1, 3).join(', ')}` : ''}
        </div>
        <div className="product-mini__name">{p.name}</div>
      </div>
      <button
        type="button"
        className="btn btn--sm"
        onClick={async () => {
          const r = await addToRoutine(p.id);
          showToast(r === 'added' ? `${activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 담았어요` : '이미 담겨 있어요');
        }}
      >
        담기
      </button>
    </div>
  );
}

/**
 * 사진으로 제품 찾기 / 등록.
 * 1) 사진 선택 → 2) 기기 안에서 전처리 + 다중 패스 OCR → 3) 브랜드·제품명·성분 키워드로 대조
 *    → 이름까지 맞는 제품 / 브랜드 제품 목록에서 담기, 또는 4) 읽어낸 정보로 미리 채운 직접 등록.
 */
export function PhotoSearchOverlay({ registerOnly = false }: Props) {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const showToast = useAppStore((s) => s.showToast);
  const customProducts = useAppStore((s) => s.customProducts);
  const activeRoutine = useAppStore((s) => s.activeRoutine);

  const [stage, setStage] = useState<Stage>(registerOnly ? 'register' : 'pick');
  const [preview, setPreview] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [progress, setProgress] = useState<OcrProgress>({ status: '', progress: 0, pass: 0, passes: 0 });
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAllBrand, setShowAllBrand] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!registerOnly) warmUpOcr();
  }, [registerOnly]);

  const allProducts = useMemo<Product[]>(() => [...customProducts, ...PRODUCTS], [customProducts]);
  const analysis = useMemo(() => analyzePhotoText(text, allProducts), [text, allProducts]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const [big, small] = await Promise.all([resizeImage(file, 1600, 0.92), resizeImage(file, 420, 0.8)]);
      setPreview(big);
      setThumb(small);
      setStage('recognizing');
      setProgress({ status: 'preparing', progress: 0, pass: 0, passes: 0 });
      const recognized = await recognizeProductText(big, setProgress);
      setText(recognized.trim());
      setShowAllBrand(false);
      setStage('results');
    } catch (err) {
      setError((err as Error).message || '사진을 인식하지 못했어요.');
      setStage(preview ? 'results' : 'pick');
    }
  };

  const reset = () => {
    setStage('pick');
    setPreview(null);
    setThumb(null);
    setText('');
    setError(null);
  };

  const brandList = showAllBrand ? analysis.brandProducts : analysis.brandProducts.slice(0, 6);

  return (
    <Overlay title={registerOnly ? '내 제품 직접 등록' : '사진으로 제품 찾기'} onClose={popOverlay}>
      {stage === 'pick' && (
        <div className="stack">
          <p className="small muted">
            브랜드와 제품명이 보이는 앞면을 밝은 곳에서 정면으로 찍어주세요. 사진은 서버로 보내지 않고 이 기기 안에서 글자만 읽어내요.
          </p>
          <button type="button" className="photo-pick" onClick={() => cameraRef.current?.click()}>
            <Icon name="camera" size={28} />
            <span>카메라로 찍기</span>
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => fileRef.current?.click()}>
            앨범에서 사진 고르기
          </button>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          {error && <div className="notice notice--danger">{error}</div>}
          <div className="divider" />
          <button type="button" className="link-btn" onClick={() => setStage('register')}>
            사진 없이 직접 등록하기 →
          </button>
        </div>
      )}

      {stage === 'recognizing' && (
        <div className="stack">
          {preview && <img src={preview} alt="선택한 제품 사진" className="photo-preview" />}
          <div className="card card--soft">
            <div className="h3">
              {ocrStatusKo(progress.status)}
              {progress.passes > 0 && ` (${progress.pass}/${progress.passes})`}
            </div>
            <div className="progress mt-2">
              <div className="progress__bar" style={{ width: `${Math.round(progress.progress * 100)}%` }} />
            </div>
            <p className="tiny muted mt-1">
              {progress.status.includes('recognizing')
                ? `사진을 세 번 다르게 읽어 합쳐요 · ${Math.round(progress.progress * 100)}%`
                : '처음 실행 시 언어 데이터를 내려받아 시간이 걸릴 수 있어요.'}
            </p>
          </div>
        </div>
      )}

      {stage === 'results' && (
        <div className="stack">
          <div className="row">
            {preview && <img src={preview} alt="선택한 제품 사진" className="product-thumb product-thumb--lg" />}
            <div className="flex-1">
              <div className="h3">사진에서 읽은 글자</div>
              <p className="tiny muted">잘못 읽힌 글자는 고쳐서 다시 대조할 수 있어요.</p>
            </div>
            <button type="button" className="icon-btn" onClick={reset} aria-label="다른 사진">
              <Icon name="camera" size={16} />
            </button>
          </div>
          <textarea
            className="textarea"
            style={{ minHeight: 64 }}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 600))}
            placeholder="읽어낸 글자가 없어요. 브랜드나 제품명을 직접 입력해 대조해보세요."
          />
          {error && <div className="notice notice--danger">{error}</div>}

          <div className="row row--wrap" style={{ gap: 6 }}>
            {analysis.brand ? (
              <Badge color="mint">
                브랜드 {analysis.brand.name} ({analysis.brand.matched})
              </Badge>
            ) : (
              <Badge color="butter">브랜드 미인식</Badge>
            )}
            {analysis.guess.category && <Badge color="sky">{analysis.guess.category}</Badge>}
            {analysis.guess.ingredientIds.slice(0, 4).map((id) => (
              <Badge key={id} color="lilac">
                {getIngredient(id)?.nameKo ?? id}
              </Badge>
            ))}
          </div>

          {analysis.nameMatches.length > 0 && (
            <>
              <div className="row row--between">
                <span className="h3">이름까지 맞는 제품 {analysis.nameMatches.length}개</span>
                <Badge>{activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 담기</Badge>
              </div>
              <div className="stack stack--sm">
                {analysis.nameMatches.map((m) => (
                  <ProductCard
                    key={m.product.id}
                    product={m.product}
                    footer={
                      <p className="tiny muted">
                        일치: {m.hits.slice(0, 4).join(', ')} · 점수 {Math.round(m.score)}
                      </p>
                    }
                  />
                ))}
              </div>
            </>
          )}

          {analysis.brand && analysis.brandProducts.length > 0 && (
            <>
              <div className="row row--between mt-1">
                <span className="h3">
                  {analysis.brand.name} 제품 중에서 고르기 <span className="muted small">{analysis.brandProducts.length}</span>
                </span>
              </div>
              <p className="tiny muted">
                {analysis.nameMatches.length ? '위 목록에 없으면 여기서 골라 담아주세요.' : '제품명이 흐릿하게 읽혀 브랜드 제품을 모두 보여드려요. 맞는 제품을 골라 담아주세요.'}
              </p>
              <div className="stack stack--sm">
                {brandList.map((m) => (
                  <BrandProductRow key={m.product.id} match={m} />
                ))}
              </div>
              {analysis.brandProducts.length > 6 && (
                <button type="button" className="link-btn" onClick={() => setShowAllBrand((v) => !v)}>
                  {showAllBrand ? '접기' : `${analysis.brandProducts.length - 6}개 더 보기`}
                </button>
              )}
            </>
          )}

          {analysis.nameMatches.length === 0 && analysis.brandProducts.length === 0 && (
            <div className="empty">
              <strong>일치하는 제품을 찾지 못했어요</strong>
              글자를 고쳐 다시 대조하거나, 아래 버튼으로 읽어낸 정보를 바탕으로 바로 등록해주세요.
            </div>
          )}

          <div className="divider" />
          <button type="button" className="btn btn--soft btn--block" onClick={() => setStage('register')}>
            찾는 제품이 없나요? 읽어낸 정보로 바로 등록
          </button>
          <p className="tiny muted text-center">브랜드·카테고리·성분이 자동으로 채워진 폼이 열려요. 확인만 하면 돼요.</p>
        </div>
      )}

      {stage === 'register' && (
        <>
          {!registerOnly && (
            <div className="row row--wrap mb-2" style={{ gap: 6 }}>
              <Chip small>사진에서 읽은 정보로 미리 채웠어요</Chip>
            </div>
          )}
          <CustomProductForm
            initialBrand={analysis.guess.brand}
            initialName={analysis.guess.name}
            initialCategory={analysis.guess.category}
            initialIngredientIds={analysis.guess.ingredientIds}
            imageUrl={thumb}
            onCancel={registerOnly ? popOverlay : () => setStage(preview ? 'results' : 'pick')}
            onSaved={(product, added) => {
              showToast(added ? `${product.name}을(를) 등록하고 루틴에 담았어요` : `${product.name}을(를) 등록했어요`);
              popOverlay();
            }}
          />
        </>
      )}
    </Overlay>
  );
}
