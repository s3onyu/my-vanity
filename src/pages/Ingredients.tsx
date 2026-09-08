import { useEffect, useMemo, useState } from 'react';
import type { IngredientCategory } from '@/types';
import { searchIngredients } from '@/data';
import { CATEGORY_LABEL } from '@/data/concerns';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { IngredientCard } from '@/components/ingredients/IngredientCard';
import { useAppStore } from '@/store/useAppStore';

const FILTERS: (IngredientCategory | 'all')[] = [
  'all',
  'tone',
  'hydration',
  'barrier',
  'soothing',
  'sebum',
  'exfoliation',
  'antioxidant',
  'firming',
  'renewal',
  'sunscreen',
];

const MAX_QUERY = 40;

export function IngredientsPage() {
  const filter = useAppStore((s) => s.ingredientFilter);
  const clearFilter = useAppStore((s) => s.clearIngredientFilter);
  const [query, setQuery] = useState(filter?.query ?? '');
  const [category, setCategory] = useState<IngredientCategory | 'all'>(filter?.category ?? 'all');

  // 다른 화면에서 "관련 성분 보기"로 넘어온 경우 필터를 받아 적용
  useEffect(() => {
    if (filter) {
      setQuery(filter.query ?? '');
      setCategory(filter.category ?? 'all');
      clearFilter();
    }
  }, [filter, clearFilter]);

  const trimmed = query.trim();
  const tooLong = trimmed.length > MAX_QUERY;
  const results = useMemo(() => (tooLong ? [] : searchIngredients(trimmed, category)), [trimmed, category, tooLong]);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">Encyclopedia</div>
        <h1 className="h1">
          성분 <em>백과</em>
        </h1>
        <p>성분 이름이나 INCI 명으로 찾고, 카테고리별로 살펴봐요.</p>
      </header>

      <div className="search">
        <span className="search__icon">
          <Icon name="search" size={16} />
        </span>
        <input
          className={`input${tooLong ? ' is-invalid' : ''}`}
          type="search"
          placeholder="성분 이름 또는 INCI (예: 나이아신, retinol)"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, MAX_QUERY + 5))}
          aria-label="성분 검색"
        />
      </div>
      {tooLong && <p className="field-error mt-1">검색어는 {MAX_QUERY}자 이하로 입력해주세요.</p>}

      <div className="chip-scroll mt-2" role="tablist" aria-label="카테고리">
        {FILTERS.map((f) => (
          <Chip key={f} active={category === f} onClick={() => setCategory(f)}>
            {f === 'all' ? '전체' : CATEGORY_LABEL[f]}
          </Chip>
        ))}
      </div>

      <div className="search-meta">
        <span>{results.length}개 성분</span>
        {(trimmed || category !== 'all') && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            초기화
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty mt-2">
          <strong>해당하는 성분이 없어요</strong>
          한글 이름(예: 판테놀)이나 INCI(예: Panthenol)로 다시 찾아보세요.
        </div>
      ) : (
        <div className="ing-grid mt-2">
          {results.map((ing) => (
            <IngredientCard key={ing.id} ingredient={ing} />
          ))}
        </div>
      )}
      <p className="fine-print">
        성분 설명은 교육 목적의 일반 정보이며 특정 제품의 효능·안전성을 보장하지 않아요. 카드의 색은 대표 카테고리를 뜻해요.
      </p>
    </div>
  );
}
