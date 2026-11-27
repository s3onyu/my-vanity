import { useState } from 'react';
import type { Product } from '@/types';
import { SKIN_TYPE_LABEL } from '@/data/concerns';
import { checkIrritants, type IrritantFlag } from '@/engine/irritants';
import { SourceList } from '@/components/evidence/SourceList';
import { useAppStore } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';

const LEVEL_CLASS = { 1: 'is-info', 2: 'is-warn', 3: 'is-danger' } as const;
const LEVEL_LABEL = { 1: '참고', 2: '주의', 3: '특히 주의' } as const;

function FlagRow({ flag }: { flag: IrritantFlag }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  return (
    <li className={`irritant ${LEVEL_CLASS[flag.level]}`}>
      <div className="row row--between">
        <button type="button" className="link-btn" onClick={() => openIngredient(flag.ingredientId)}>
          {flag.name}
        </button>
        <span className="irritant__level">{LEVEL_LABEL[flag.level]}</span>
      </div>
      <p className="irritant__why">{flag.why}</p>
      <p className="irritant__tip">💡 {flag.tip}</p>
      <SourceList sources={flag.sources} />
    </li>
  );
}

interface Props {
  product: Product;
  /** true 면 접기 없이 전부 보여준다 (제품 등록 화면 등) */
  alwaysOpen?: boolean;
}

/**
 * 내 피부 타입에서 자극이 될 수 있는 성분 안내 (요청 11번).
 * 프로필에 피부 타입이 없으면 검사/설정으로 안내하고, 걸리는 성분이 없으면 조용히 괜찮다고만 알려준다.
 */
export function IrritantNotice({ product, alwaysOpen = false }: Props) {
  const skinType = useAppStore((s) => s.profile?.skinType ?? null);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const catalog = useCatalog();
  const [open, setOpen] = useState(alwaysOpen);
  const check = checkIrritants(product, skinType, catalog);

  if (!skinType) {
    return (
      <button type="button" className="irritant-bar is-empty" onClick={() => pushOverlay({ type: 'skin-quiz' })}>
        🧪 피부 타입을 등록하면 내 피부에 자극될 수 있는 성분을 표시해 드려요 →
      </button>
    );
  }

  if (check.flags.length === 0) {
    return (
      <p className="irritant-bar is-ok">
        ✅ {SKIN_TYPE_LABEL[skinType]} 피부에서 특별히 걸리는 성분은 없어요
      </p>
    );
  }

  return (
    <div className="irritant-box">
      <button
        type="button"
        className={`irritant-bar ${LEVEL_CLASS[check.level as 1 | 2 | 3]}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        ⚠️ {check.summary} {open ? '접기' : '자세히'}
      </button>
      {open && (
        <>
          <ul className="irritant-list">
            {check.flags.map((f) => (
              <FlagRow key={f.ingredientId} flag={f} />
            ))}
          </ul>
          <p className="fine-print">
            피부 타입별로 자주 보고되는 경향을 알려주는 참고 정보예요. 같은 성분도 농도·제형·사람에 따라 다르게 느껴질 수 있고, 의학적
            진단이 아니에요.
          </p>
        </>
      )}
    </div>
  );
}
