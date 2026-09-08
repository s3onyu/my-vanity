import { useMemo, useState } from 'react';
import { searchProducts } from '@/data';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from './ProductCard';

const MAX_QUERY = 40;

/** 검색어 검증 — 공백만, 길이 초과, 특수문자만 입력 방지 */
export function validateQuery(raw: string): { ok: boolean; message?: string; value: string } {
  const value = raw.trim();
  if (!value) return { ok: false, value };
  if (value.length > MAX_QUERY) return { ok: false, value, message: `검색어는 ${MAX_QUERY}자 이하로 입력해주세요.` };
  if (!/[\p{L}\p{N}]/u.test(value)) return { ok: false, value, message: '브랜드, 제품명, 별칭 또는 성분명을 입력해주세요.' };
  return { ok: true, value };
}

interface Props {
  /** 검색 결과가 열려 있을 때 호출 (상단 섹션 접기 등에 사용) */
  onActiveChange?: (active: boolean) => void;
}

export function ProductSearch({ onActiveChange }: Props) {
  const [raw, setRaw] = useState('');
  const validation = useMemo(() => validateQuery(raw), [raw]);
  const results = useMemo(() => (validation.ok ? searchProducts(validation.value) : []), [validation]);

  const update = (v: string) => {
    setRaw(v.slice(0, MAX_QUERY + 5));
    onActiveChange?.(v.trim().length > 0);
  };

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
          placeholder="브랜드·제품명·별칭·성분으로 검색 (예: 헤라, 독도토너, 레티놀)"
          value={raw}
          onChange={(e) => update(e.target.value)}
          aria-label="제품 검색"
          aria-invalid={Boolean(validation.message)}
        />
      </div>
      {validation.message && <p className="field-error mt-1">{validation.message}</p>}

      {validation.ok && (
        <>
          <div className="search-meta">
            <span>
              “{validation.value}” 검색 결과 {results.length}개{results.length >= 40 ? ' (상위 40개)' : ''}
            </span>
            <button type="button" className="link-btn" onClick={() => update('')}>
              닫기
            </button>
          </div>
          {results.length === 0 ? (
            <div className="empty mt-2">
              <strong>검색 결과가 없어요</strong>
              브랜드명 일부(예: 라운드랩), 줄임말(예: 독도토너), 성분명(예: 세라마이드)으로 다시 찾아보세요.
            </div>
          ) : (
            <div className="search-results">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
