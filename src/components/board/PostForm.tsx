import { useMemo, useState } from 'react';
import type { ConcernId, Verdict } from '@/types';
import { CONCERNS } from '@/data/concerns';
import { searchProducts } from '@/data';
import { resizeImage } from '@/lib/image';
import { Overlay } from '@/components/layout/Overlay';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { VERDICT_META } from './BoardOverlay';

const LIMITS = { title: [2, 60], body: [10, 1000], nickname: [2, 12] } as const;

interface Errors {
  concern?: string;
  verdict?: string;
  title?: string;
  body?: string;
  nickname?: string;
  image?: string;
}

/** 글쓰기: 고민 → 제품(선택) → 총평 → 제목 → 본문 → 사진(선택) → 닉네임 */
export function PostFormOverlay({ initialProductName }: { initialProductName?: string } = {}) {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const createPost = useAppStore((s) => s.createPost);
  const setNickname = useAppStore((s) => s.setNickname);
  const savedNickname = useAppStore((s) => s.profile?.nickname ?? '');
  const showToast = useAppStore((s) => s.showToast);

  const [concern, setConcern] = useState<ConcernId | null>(null);
  const [productQuery, setProductQuery] = useState('');
  const [productName, setProductName] = useState<string | null>(initialProductName ?? null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [nickname, setNick] = useState(savedNickname);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const suggestions = useMemo(() => (productQuery.trim().length >= 1 && !productName ? searchProducts(productQuery, 5) : []), [productQuery, productName]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!concern) e.concern = '고민 카테고리를 골라주세요.';
    if (!verdict) e.verdict = '총평을 골라주세요.';
    const t = title.trim();
    if (t.length < LIMITS.title[0] || t.length > LIMITS.title[1]) e.title = `제목은 ${LIMITS.title[0]}~${LIMITS.title[1]}자로 써주세요.`;
    const b = body.trim();
    if (b.length < LIMITS.body[0] || b.length > LIMITS.body[1]) e.body = `본문은 ${LIMITS.body[0]}~${LIMITS.body[1]}자로 써주세요.`;
    const n = nickname.trim();
    if (n.length < LIMITS.nickname[0] || n.length > LIMITS.nickname[1]) e.nickname = `닉네임은 ${LIMITS.nickname[0]}~${LIMITS.nickname[1]}자로 써주세요.`;
    return e;
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setImage(await resizeImage(file));
      setErrors((cur) => ({ ...cur, image: undefined }));
    } catch (err) {
      setErrors((cur) => ({ ...cur, image: (err as Error).message }));
    }
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setBusy(true);
    const nick = nickname.trim();
    if (nick !== savedNickname) await setNickname(nick);
    await createPost({
      authorNickname: nick,
      concernCategory: concern!,
      title: title.trim(),
      body: body.trim(),
      productName: productName ?? (productQuery.trim() || null),
      verdict: verdict!,
      imageUrl: image,
    });
    setBusy(false);
    showToast('게시글을 올렸어요');
    popOverlay();
  };

  return (
    <Overlay title="화장대 후기 쓰기" onClose={popOverlay}>
      <div className="notice notice--warn mb-3">
        이 글은 <strong>다른 사용자에게도 공개</strong>돼요. 개인정보나 연락처는 적지 말아주세요. 개인 후기이며 효과를 보장하지 않는다는 문구가
        함께 표시돼요.
      </div>

      <div className="field">
        <label>1. 피부 고민</label>
        <div className="chip-row">
          {CONCERNS.map((c) => (
            <Chip key={c.id} active={concern === c.id} onClick={() => setConcern(c.id)}>
              {c.icon} {c.title}
            </Chip>
          ))}
        </div>
        {errors.concern && <span className="field-error">{errors.concern}</span>}
      </div>

      <div className="field">
        <label htmlFor="post-product">2. 사용 제품 (선택)</label>
        {productName ? (
          <div className="row">
            <Chip onRemove={() => setProductName(null)}>{productName}</Chip>
          </div>
        ) : (
          <input
            id="post-product"
            className="input"
            placeholder="제품명을 검색하거나 직접 입력"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value.slice(0, 60))}
          />
        )}
        {suggestions.length > 0 && (
          <div className="suggest">
            {suggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                className="suggest__item"
                onClick={() => {
                  setProductName(`${p.brand} ${p.name}`);
                  setProductQuery('');
                }}
              >
                <span className="tiny muted">{p.brand}</span> {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <label>3. 총평</label>
        <div className="verdict-row">
          {(Object.keys(VERDICT_META) as Verdict[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`verdict-btn${verdict === v ? ` is-active bg-${VERDICT_META[v].color}-2` : ''}`}
              onClick={() => setVerdict(v)}
              aria-pressed={verdict === v}
            >
              <span style={{ fontSize: 20 }}>{VERDICT_META[v].icon}</span>
              <span>{VERDICT_META[v].label}</span>
            </button>
          ))}
        </div>
        {errors.verdict && <span className="field-error">{errors.verdict}</span>}
      </div>

      <div className="field">
        <label htmlFor="post-title">4. 제목</label>
        <input
          id="post-title"
          className={`input${errors.title ? ' is-invalid' : ''}`}
          placeholder="예: 환절기 장벽 루틴, 이렇게 바꿨어요"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, LIMITS.title[1] + 10))}
        />
        <span className="field-hint">{title.trim().length}/{LIMITS.title[1]}</span>
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="post-body">5. 본문</label>
        <textarea
          id="post-body"
          className={`textarea${errors.body ? ' is-invalid' : ''}`}
          placeholder="어떻게 썼고, 어떤 변화가 있었는지 솔직하게 적어주세요."
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, LIMITS.body[1] + 50))}
        />
        <span className="field-hint">{body.trim().length}/{LIMITS.body[1]}</span>
        {errors.body && <span className="field-error">{errors.body}</span>}
      </div>

      <div className="field">
        <label htmlFor="post-image">6. 사진 (선택 · 업로드 시 자동 리사이즈)</label>
        {image ? (
          <div className="stack stack--sm">
            <img src={image} alt="첨부 미리보기" className="post-detail__img" />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setImage(null)}>
              사진 지우기
            </button>
          </div>
        ) : (
          <label className="file-drop">
            <Icon name="camera" size={18} /> 사진 고르기
            <input id="post-image" type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        )}
        {errors.image && <span className="field-error">{errors.image}</span>}
      </div>

      <div className="field">
        <label htmlFor="post-nick">7. 닉네임 (게시판에 표시)</label>
        <input
          id="post-nick"
          className={`input${errors.nickname ? ' is-invalid' : ''}`}
          placeholder="2~12자"
          value={nickname}
          onChange={(e) => setNick(e.target.value.slice(0, LIMITS.nickname[1] + 5))}
        />
        {errors.nickname && <span className="field-error">{errors.nickname}</span>}
      </div>

      <button type="button" className="btn btn--block mt-2" onClick={submit} disabled={busy}>
        {busy ? '올리는 중…' : '게시하기'}
      </button>
    </Overlay>
  );
}
