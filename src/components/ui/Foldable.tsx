import { useId, useState } from 'react';
import { Icon } from './Icon';

interface Props {
  /** 접혀 있을 때도 보이는 제목 */
  title: React.ReactNode;
  /** 제목 아래 한 줄 요약 — 펼치지 않고도 무슨 내용인지 알 수 있게 */
  hint?: React.ReactNode;
  /** 처음부터 펼친 상태로 둘지 */
  defaultOpen?: boolean;
  /** 제목 줄에 붙일 추가 클래스 (색 구분 등) */
  tone?: 'minus' | 'plus' | 'plain';
  children: React.ReactNode;
}

/**
 * 제목 줄만 보이고, 옆의 “펼치기” 버튼을 누르면 내용이 열리는 섹션.
 * 점수 이유처럼 길어지기 쉬운 목록을 평소에는 접어 두기 위해 쓴다.
 */
export function Foldable({ title, hint, defaultOpen = false, tone = 'plain', children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <section className={`foldable foldable--${tone}${open ? ' is-open' : ''}`}>
      <button type="button" className="foldable__head" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((v) => !v)}>
        <span className="foldable__title">{title}</span>
        <span className="foldable__toggle">
          {open ? '접기' : '펼치기'}
          <span className="foldable__chev" aria-hidden="true">
            <Icon name="chevron" size={13} />
          </span>
        </span>
      </button>
      {hint && !open && <p className="foldable__hint">{hint}</p>}
      <div id={bodyId} className="foldable__body" hidden={!open}>
        {open && children}
      </div>
    </section>
  );
}
