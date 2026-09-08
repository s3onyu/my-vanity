import { useMemo, useState } from 'react';
import type { ConcernId, Product, ProductCategory, SkinType } from '@/types';
import { INGREDIENTS, searchIngredients } from '@/data';
import { CONCERNS, SKIN_TYPES } from '@/data/concerns';
import { Chip } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';

const CATEGORIES: ProductCategory[] = ['토너', '에센스', '앰플', '세럼', '로션', '크림', '선크림', '클렌징', '마스크', '아이크림', '오일', '미스트', '필링', '패드', '베이스'];

/** 제품명 힌트로 카테고리를 추정 */
export function guessCategory(name: string): ProductCategory {
  const n = name.toLowerCase();
  const table: [RegExp, ProductCategory][] = [
    [/선크림|선 크림|sun|spf|자외선/, '선크림'],
    [/클렌징|클렌저|cleans|폼|foam|워시/, '클렌징'],
    [/토너|toner|스킨|skin/, '토너'],
    [/앰플|ampoule/, '앰플'],
    [/세럼|serum/, '세럼'],
    [/에센스|essence/, '에센스'],
    [/로션|lotion|에멀전|emulsion/, '로션'],
    [/아이|eye/, '아이크림'],
    [/오일|oil/, '오일'],
    [/미스트|mist/, '미스트'],
    [/필링|peel|각질/, '필링'],
    [/패드|pad/, '패드'],
    [/마스크|mask|팩/, '마스크'],
    [/프라이머|베이스|primer|쿠션|파운데이션/, '베이스'],
    [/크림|cream|밤|balm/, '크림'],
  ];
  return table.find(([re]) => re.test(n))?.[1] ?? '크림';
}

interface Props {
  initialBrand?: string;
  initialName?: string;
  imageUrl?: string | null;
  onSaved: (product: Product, addedToRoutine: boolean) => void;
  onCancel?: () => void;
}

/** 사진/수동으로 내 제품을 직접 등록 — 성분을 골라야 궁합 점수에 반영된다 */
export function CustomProductForm({ initialBrand = '', initialName = '', imageUrl = null, onSaved, onCancel }: Props) {
  const addCustomProduct = useAppStore((s) => s.addCustomProduct);
  const addToRoutine = useAppStore((s) => s.addToRoutine);
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const profileSkin = useAppStore((s) => s.profile?.skinType ?? null);

  const [brand, setBrand] = useState(initialBrand);
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<ProductCategory>(() => guessCategory(initialName));
  const [ingredientIds, setIngredientIds] = useState<string[]>([]);
  const [ingQuery, setIngQuery] = useState('');
  const [concerns, setConcerns] = useState<ConcernId[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>(profileSkin ? [profileSkin] : []);
  const [addToCurrent, setAddToCurrent] = useState(true);
  const [errors, setErrors] = useState<{ brand?: string; name?: string; ingredients?: string }>({});
  const [busy, setBusy] = useState(false);

  const suggestions = useMemo(() => {
    const list = ingQuery.trim() ? searchIngredients(ingQuery) : INGREDIENTS.filter((i) => i.tags?.includes('active') || ['ceramide', 'hyaluronic-acid', 'panthenol', 'centella', 'niacinamide', 'glycerin', 'squalane'].includes(i.id));
    return list.filter((i) => !ingredientIds.includes(i.id)).slice(0, 12);
  }, [ingQuery, ingredientIds]);

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, v: T) =>
    setter((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const submit = async () => {
    const e: typeof errors = {};
    if (brand.trim().length < 1 || brand.trim().length > 30) e.brand = '브랜드는 1~30자로 써주세요.';
    if (name.trim().length < 2 || name.trim().length > 60) e.name = '제품명은 2~60자로 써주세요.';
    if (ingredientIds.length === 0) e.ingredients = '핵심 성분을 최소 1개 골라주세요. 궁합 점수 계산의 기준이 돼요.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const product = await addCustomProduct({
      brand: brand.trim(),
      name: name.trim(),
      aliases: [],
      category,
      keyIngredients: ingredientIds,
      relatedConcerns: concerns,
      skinTypes: skinTypes.length ? skinTypes : ['dry', 'oily', 'combo', 'normal', 'sensitive'],
      imageUrl,
    });
    let added = false;
    if (addToCurrent) added = (await addToRoutine(product.id)) === 'added';
    setBusy(false);
    onSaved(product, added);
  };

  return (
    <div className="stack">
      {imageUrl && (
        <div className="row">
          <img src={imageUrl} alt="제품 사진" className="product-thumb product-thumb--lg" />
          <span className="small muted">사진은 이 기기(또는 내 계정)에만 저장돼요.</span>
        </div>
      )}
      <div className="field">
        <label htmlFor="cp-brand">브랜드</label>
        <input id="cp-brand" className={`input${errors.brand ? ' is-invalid' : ''}`} value={brand} onChange={(e) => setBrand(e.target.value.slice(0, 40))} placeholder="예: 라운드랩" />
        {errors.brand && <span className="field-error">{errors.brand}</span>}
      </div>
      <div className="field">
        <label htmlFor="cp-name">제품명</label>
        <input
          id="cp-name"
          className={`input${errors.name ? ' is-invalid' : ''}`}
          value={name}
          onChange={(e) => {
            setName(e.target.value.slice(0, 80));
            setCategory(guessCategory(e.target.value));
          }}
          placeholder="예: 1025 독도 토너"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="cp-category">카테고리</label>
        <select id="cp-category" className="select" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cp-ing">핵심 성분 (전성분표에서 앞쪽에 있는 성분 위주로, 최대 8개)</label>
        {ingredientIds.length > 0 && (
          <div className="chip-row mb-1">
            {ingredientIds.map((id) => {
              const ing = INGREDIENTS.find((i) => i.id === id);
              return ing ? (
                <Chip key={id} small active onRemove={() => setIngredientIds((cur) => cur.filter((x) => x !== id))}>
                  {ing.nameKo}
                </Chip>
              ) : null;
            })}
          </div>
        )}
        <input id="cp-ing" className="input" value={ingQuery} onChange={(e) => setIngQuery(e.target.value.slice(0, 40))} placeholder="성분 이름 또는 INCI 검색 (예: 세라마이드, retinol)" />
        <div className="chip-row mt-1">
          {suggestions.map((ing) => (
            <Chip key={ing.id} small onClick={() => ingredientIds.length < 8 && setIngredientIds((cur) => [...cur, ing.id])}>
              + {ing.nameKo}
            </Chip>
          ))}
        </div>
        {errors.ingredients && <span className="field-error">{errors.ingredients}</span>}
      </div>

      <div className="field">
        <label>관련 고민 (선택)</label>
        <div className="chip-row">
          {CONCERNS.map((c) => (
            <Chip key={c.id} small active={concerns.includes(c.id)} onClick={() => toggle(setConcerns, c.id)}>
              {c.icon} {c.title}
            </Chip>
          ))}
        </div>
      </div>
      <div className="field">
        <label>맞는 피부 타입 (선택, 비우면 전체)</label>
        <div className="chip-row">
          {SKIN_TYPES.map((s) => (
            <Chip key={s.id} small active={skinTypes.includes(s.id)} onClick={() => toggle(setSkinTypes, s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <label className="row small" style={{ gap: 8 }}>
        <input type="checkbox" checked={addToCurrent} onChange={(e) => setAddToCurrent(e.target.checked)} />
        등록하면서 {activeRoutine === 'AM' ? '아침' : '저녁'} 루틴에 바로 담기
      </label>

      <div className="row">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="button" className="btn flex-1" onClick={submit} disabled={busy}>
          {busy ? '등록 중…' : '내 제품으로 등록'}
        </button>
      </div>
      <p className="fine-print">
        직접 등록한 제품은 "내가 등록" 표시와 함께 검색·루틴·궁합 분석에 포함돼요. 성분 정보는 내가 입력한 값이므로 정확하지 않을 수 있어요.
      </p>
    </div>
  );
}
