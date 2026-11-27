import { useMemo, useState } from 'react';
import { searchProductsDetailed, suggestBrands } from '@/data';
import { BRAND_ALIASES } from '@/data/brands';
import { shopSearchLinks } from '@/lib/shopLink';
import { useAppStore } from '@/store/useAppStore';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from './ProductCard';

const MAX_QUERY = 40;
const LIMIT = 60;

/** 검색어 검증 — 공백만, 길이 초과, 특수문자만 입력 방지 */
export function validateQuery(raw: string): { ok: boolean; message?: string; value: string } {
  const value = raw.trim();
  if (!value) return { ok: false, value };
  if (value.length > MAX_QUERY) return { ok: false, value, message: `검색어는 ${MAX_QUERY}자 이하로 입력해주세요.` };
  if (!/[\p{L}\p{N}]/u.test(value)) return { ok: false, value, message: '브랜드, 제품명, 별칭 또는 성분명을 입력해주세요.' };
  return { ok: true, value };
}

/**
 * 검색어를 브랜드 + 제품명으로 쪼갠다.
 * "제로이드 수딩 크림" 처럼 앞에 브랜드가 붙어 있으면 등록 폼에 나눠 채워 준다.
 */
export function splitBrandAndName(query: string): { brand: string; name: string } {
  const brands = Object.keys(BRAND_ALIASES);
  const flat = query.trim().replace(/\s+/g, '');
  const hit = brands
    .filter((b) => flat.toLowerCase().startsWith(b.toLowerCase().replace(/\s+/g, '')))
    .sort((a, b) => b.length - a.length)[0];
  if (!hit) return { brand: '', name: query.trim() };
  // 원문에서 브랜드만큼 잘라낸다 (공백이 섞여 있을 수 있어 글자 수로 센다)
  let left = hit.replace(/\s+/g, '').length;
  let i = 0;
  while (i < query.length && left > 0) {
    if (!/\s/.test(query[i])) left -= 1;
    i += 1;
  }
  return { brand: hit, name: query.slice(i).trim() };
}

interface Props {
  /** 검색 결과가 열려 있을 때 호출 (상단 섹션 접기 등에 사용) */
  onActiveChange?: (active: boolean) => void;
}

export function ProductSearch({ onActiveChange }: Props) {
  const [raw, setRaw] = useState('');
  const customProducts = useAppStore((s) => s.customProducts);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const validation = useMemo(() => validateQuery(raw), [raw]);
  const outcome = useMemo(
    () => (validation.ok ? searchProductsDetailed(validation.value, LIMIT, customProducts) : { products: [] }),
    [validation, customProducts],
  );
  const results = outcome.products;
  const brandHints = useMemo(() => (validation.ok && results.length === 0 ? suggestBrands(validation.value) : []), [validation, results.length]);

  const update = (v: string) => {
    setRaw(v.slice(0, MAX_QUERY + 5));
    onActiveChange?.(v.trim().length > 0);
  };

  /** 목록에 없는 제품 — 검색어를 그대로 등록 폼에 채워서 연다 */
  const registerFromQuery = () => {
    const { brand, name } = splitBrandAndName(validation.value);
    pushOverlay({ type: 'photo-search', registerOnly: true, prefillBrand: brand, prefillName: name });
  };

  const shopLinks = validation.ok ? shopSearchLinks(validation.value) : [];

  return (
    <div>
      <div className="search">
        <span className="search__icon">
          <Icon name="search" size={16} />
        </span>
        <input
          className={`input${validation.message ? ' is-invalid' : ''}`}
          type="search"
          inputMode="search"
          id="product-search"
          placeholder="브랜드·제품명·초성·성분으로 검색 (예: 제로이드, ㅈㄹㅇㄷ, 독도토너)"
          value={raw}
          onChange={(e) => update(e.target.value)}
          aria-label="제품 검색"
          aria-invalid={Boolean(validation.message)}
        />
      </div>
      {validation.message && <p className="field-error mt-1">{validation.message}</p>}
      <div className="search-tools">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => pushOverlay({ type: 'photo-search' })}>
          <Icon name="camera" size={15} /> 사진으로 찾기
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => pushOverlay({ type: 'photo-search', registerOnly: true })}>
          <Icon name="edit" size={15} /> 직접 등록
        </button>
      </div>

      {validation.ok && (
        <>
          <div className="search-meta">
            <span>
              {outcome.widenedBrand ? (
                <>
                  “{validation.value}” 은(는) 없어서 <strong>{outcome.widenedBrand}</strong> 제품 {results.length}개를 보여 드려요
                </>
              ) : (
                <>
                  “{validation.value}” 검색 결과 {results.length}개{results.length >= LIMIT ? ` (상위 ${LIMIT}개)` : ''}
                </>
              )}
            </span>
            <button type="button" className="link-btn" onClick={() => update('')}>
              닫기
            </button>
          </div>
          {results.length === 0 ? (
            <div className="empty mt-2">
              <strong>검색 결과가 없어요</strong>
              브랜드명 일부(예: 라운드랩), 초성(예: ㅈㄹㅇㄷ), 줄임말(예: 독도토너), 성분명(예: 세라마이드)으로도 찾을 수 있어요.
              {brandHints.length > 0 && (
                <div className="chip-row mt-2" style={{ justifyContent: 'center' }}>
                  <span className="tiny muted">혹시 이 브랜드?</span>
                  {brandHints.map((b) => (
                    <button key={b} type="button" className="ing-tag" onClick={() => update(b)}>
                      {b}
                    </button>
                  ))}
                </div>
              )}
              <div className="not-found-help mt-2">
                <p className="small">
                  <strong>목록에 없는 제품인가요?</strong> 올리브영 제품 페이지의 <em>상품정보 제공고시 → 화장품법에 따라 기재해야 하는 모든 성분</em>을 복사해서
                  등록 화면에 붙여넣으면, 어떤 제품이든 성분 궁합을 분석해 드려요.
                </p>
                <div className="shop-links">
                  {shopLinks.map((l) => (
                    <a key={l.id} className="shop-link" href={l.url} target="_blank" rel="noopener noreferrer" title={l.hint}>
                      {l.icon} {l.label} ↗
                    </a>
                  ))}
                </div>
                <div className="row mt-2" style={{ gap: 6 }}>
                  <button type="button" className="btn btn--sm flex-1" onClick={registerFromQuery}>
                    “{validation.value}” 등록하기
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => pushOverlay({ type: 'photo-search' })}>
                    사진으로 찾기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {outcome.widenedBrand && (
                <div className="search-widened mt-2">
                  <p className="small">
                    찾으신 제품이 아직 목록에 없어요. 아래에서 고르거나, <strong>“{validation.value}” 로 바로 등록</strong>하면 전성분을 붙여넣어 분석할 수 있어요.
                  </p>
                  <button type="button" className="btn btn--sm" onClick={registerFromQuery}>
                    “{validation.value}” 등록하기
                  </button>
                </div>
              )}
              <div className="search-results">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="not-found-help mt-2">
                <p className="small muted">찾던 제품이 없나요? 올리브영에서 전성분을 복사해 오면 어떤 제품이든 등록해서 분석할 수 있어요.</p>
                <div className="row" style={{ gap: 6 }}>
                  <a className="shop-link" href={shopLinks[0]?.url} target="_blank" rel="noopener noreferrer">
                    🛒 올리브영에서 찾아보기 ↗
                  </a>
                  <button type="button" className="link-btn" onClick={registerFromQuery}>
                    직접 등록하기
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
