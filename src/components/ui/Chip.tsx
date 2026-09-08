import type { ReactNode } from 'react';
import type { ColorTag } from '@/types';

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  small?: boolean;
  children: ReactNode;
  title?: string;
}

export function Chip({ active, onClick, onRemove, small, children, title }: ChipProps) {
  const cls = `chip${active ? ' is-active' : ''}${small ? ' chip--sm' : ''}`;
  if (onClick || onRemove) {
    return (
      <button type="button" className={cls} onClick={onClick ?? onRemove} title={title}>
        {children}
        {onRemove && <span className="chip__x" aria-hidden="true">×</span>}
      </button>
    );
  }
  return (
    <span className={cls} title={title}>
      {children}
    </span>
  );
}

interface BadgeProps {
  color?: ColorTag | 'ink' | 'danger' | 'none';
  children: ReactNode;
  className?: string;
}

export function Badge({ color = 'none', children, className = '' }: BadgeProps) {
  return <span className={`badge${color !== 'none' ? ` badge--${color}` : ''} ${className}`.trim()}>{children}</span>;
}
