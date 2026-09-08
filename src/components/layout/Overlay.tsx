import { useEffect, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface OverlayProps {
  title: string;
  onClose: () => void;
  right?: ReactNode;
  children: ReactNode;
}

/** 전체 화면 오버레이 (게시판, 튜토리얼, 프로필 수정 등) */
export function Overlay({ title, onClose, right, children }: OverlayProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="overlay__panel">
        <div className="overlay__top">
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            <Icon name="back" />
          </button>
          <div className="h3 ellipsis">{title}</div>
          {right}
        </div>
        <div className="overlay__body">{children}</div>
      </div>
    </div>
  );
}

interface SheetProps {
  onClose: () => void;
  children: ReactNode;
  label?: string;
}

/** 하단 시트 (성분 상세 등) */
export function Sheet({ onClose, children, label = '상세' }: SheetProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="sheet" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        {children}
      </div>
    </div>
  );
}
