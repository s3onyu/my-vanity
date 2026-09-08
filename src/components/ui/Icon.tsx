import type { SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'vanity'
  | 'leaf'
  | 'sparkle'
  | 'journal'
  | 'search'
  | 'back'
  | 'close'
  | 'plus'
  | 'minus'
  | 'up'
  | 'down'
  | 'heart'
  | 'thumbUp'
  | 'thumbDown'
  | 'chevron'
  | 'sun'
  | 'moon'
  | 'edit'
  | 'trash'
  | 'info'
  | 'camera'
  | 'check';

const PATHS: Record<IconName, string> = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  vanity: 'M9 3h6v4H9zM7 7h10l1 4H6zM6 11h12v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM10 15h4',
  leaf: 'M5 20c0-8 4-14 14-15-1 10-7 14-14 15zM5 20c3-4 6-7 10-10',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M6.5 17.5 9 15M15 9l2.5-2.5',
  journal: 'M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6zM6 3v18M10 8h4M10 12h4',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4 4',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  up: 'M6 15l6-6 6 6',
  down: 'M6 9l6 6 6-6',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  thumbUp: 'M7 10v10H4V10zM7 10l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2l-1.5 7a2 2 0 0 1-2 2H7',
  thumbDown: 'M17 14V4h3v10zM17 14l-4 7a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2l1.5-7a2 2 0 0 1 2-2H17',
  chevron: 'M9 5l7 7-7 7',
  sun: 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  edit: 'M4 20h4l10-10-4-4L4 16zM13 7l4 4',
  trash: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
  info: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5M12 8h.01',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 10a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
  check: 'M5 12l4 4L19 7',
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={name === 'heart' && rest.fill ? rest.fill : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
