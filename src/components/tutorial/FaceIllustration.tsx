import { useId, useMemo, type ReactElement } from 'react';
import type { FaceLayer } from '@/types';

/**
 * 얼굴 일러스트 (실제 인물이 아닌 원본 일러스트).
 * 블러셔·하이라이트·코쉐딩 레이어가 얼굴 윤곽(clipPath) 안에 누적된다.
 * 왼쪽 좌표만 정의하고 오른쪽은 x=160 기준으로 미러링한다.
 */

const FACE = 'M160,70 C222,70 258,130 258,205 C258,280 214,332 160,332 C106,332 62,280 62,205 C62,130 98,70 160,70 Z';

const Z_ORDER: Record<FaceLayer['kind'], number> = { blush: 1, noseShade: 2, highlight: 3, blend: 0 };

const BLUSH_SHAPES: Record<Extract<FaceLayer, { kind: 'blush' }>['shape'], ReactElement> = {
  diagonal: <ellipse cx="96" cy="224" rx="36" ry="15" transform="rotate(-28 96 224)" />,
  apple: <circle cx="110" cy="234" r="24" />,
  horizontal: <ellipse cx="108" cy="222" rx="42" ry="13" />,
  uzone: <path d="M78,198 C74,238 96,270 140,258" fill="none" strokeWidth="26" strokeLinecap="round" />,
};

interface Props {
  layers: FaceLayer[];
  width?: number | string;
  className?: string;
}

export function FaceIllustration({ layers, width = '100%', className }: Props) {
  const uid = useId().replace(/:/g, '');
  const id = (n: string) => `${uid}-${n}`;
  const sorted = useMemo(() => [...layers].sort((a, b) => Z_ORDER[a.kind] - Z_ORDER[b.kind]), [layers]);
  const blended = layers.some((l) => l.kind === 'blend');

  return (
    <svg
      viewBox="0 0 320 380"
      width={width}
      className={className}
      role="img"
      aria-label="얼굴 메이크업 일러스트"
      style={{ display: 'block', maxWidth: '100%' }}
    >
      <defs>
        <linearGradient id={id('skin')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dfd0" />
          <stop offset="1" stopColor="#edcbb5" />
        </linearGradient>
        <clipPath id={id('face')}>
          <path d={FACE} />
        </clipPath>
        <filter id={id('blur')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={blended ? 11 : 7} />
        </filter>
        <filter id={id('soft')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={id('glow')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* 배경 */}
      <rect width="320" height="380" rx="20" fill="#fbf3ec" />
      {/* 뒷머리 */}
      <path d="M62,120 C60,40 260,40 258,120 L266,300 C240,320 200,300 200,300 L120,300 C120,300 80,320 54,300 Z" fill="#4a3733" />
      {/* 목 */}
      <path d="M130,300 L130,380 L190,380 L190,300 C180,318 140,318 130,300 Z" fill="#e6c1a9" />
      {/* 얼굴 */}
      <path d={FACE} fill={`url(#${id('skin')})`} />
      {/* 귀 */}
      <ellipse cx="60" cy="210" rx="9" ry="16" fill="#efcdb9" />
      <ellipse cx="260" cy="210" rx="9" ry="16" fill="#efcdb9" />

      {/* 메이크업 레이어 (얼굴 안으로 클립) */}
      <g clipPath={`url(#${id('face')})`}>
        {sorted.map((layer, i) => (
          <FaceLayerView key={i} layer={layer} id={id} />
        ))}
      </g>

      {/* 앞머리 */}
      <path d="M66,150 C70,80 120,60 160,62 C200,60 250,80 254,150 C230,118 200,104 160,102 C120,104 90,118 66,150 Z" fill="#4a3733" />
      <path d="M62,170 C60,120 78,98 96,92 C86,120 80,150 78,190 Z" fill="#4a3733" />
      <path d="M258,170 C260,120 242,98 224,92 C234,120 240,150 242,190 Z" fill="#4a3733" />

      {/* 눈썹 */}
      <path d="M92,154 C106,143 130,143 142,153" fill="none" stroke="#5a453b" strokeWidth="4" strokeLinecap="round" />
      <path d="M228,154 C214,143 190,143 178,153" fill="none" stroke="#5a453b" strokeWidth="4" strokeLinecap="round" />

      {/* 눈 */}
      {[118, 202].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - 22},178 C${cx - 14},165 ${cx + 14},165 ${cx + 22},178 C${cx + 14},189 ${cx - 14},189 ${cx - 22},178 Z`}
            fill="#fdfaf7"
          />
          <clipPath id={id(`eye${cx}`)}>
            <path d={`M${cx - 22},178 C${cx - 14},165 ${cx + 14},165 ${cx + 22},178 C${cx + 14},189 ${cx - 14},189 ${cx - 22},178 Z`} />
          </clipPath>
          <g clipPath={`url(#${id(`eye${cx}`)})`}>
            <circle cx={cx} cy="178" r="9" fill="#4d3a2f" />
            <circle cx={cx} cy="178" r="4" fill="#1b110d" />
            <circle cx={cx - 3} cy="174" r="2" fill="#fff" />
          </g>
          <path d={`M${cx - 22},178 C${cx - 14},165 ${cx + 14},165 ${cx + 22},178`} fill="none" stroke="#5a3f33" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* 코 */}
      <path d="M152,178 C148,200 146,222 147,238" fill="none" stroke="#dcb4a0" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M168,178 C172,200 174,222 173,238" fill="none" stroke="#dcb4a0" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M144,246 C150,255 170,255 176,246" fill="none" stroke="#c99a84" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M140,244 C138,250 141,253 146,252" fill="none" stroke="#c99a84" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M180,244 C182,250 179,253 174,252" fill="none" stroke="#c99a84" strokeWidth="1.8" strokeLinecap="round" />

      {/* 입술 */}
      <path d="M138,285 C148,278 156,280 160,283 C164,280 172,278 182,285 C174,291 146,291 138,285 Z" fill="#d98a86" />
      <path d="M138,285 C146,301 174,301 182,285 C170,289 150,289 138,285 Z" fill="#e39d97" />
    </svg>
  );
}

function Mirrored({ children }: { children: ReactElement }) {
  return (
    <>
      {children}
      <g transform="translate(320,0) scale(-1,1)">{children}</g>
    </>
  );
}

function FaceLayerView({ layer, id }: { layer: FaceLayer; id: (n: string) => string }) {
  switch (layer.kind) {
    case 'blush':
      return (
        <g fill={layer.color} stroke={layer.color} opacity={layer.opacity ?? 0.45} filter={`url(#${id('blur')})`}>
          <Mirrored>{BLUSH_SHAPES[layer.shape]}</Mirrored>
        </g>
      );
    case 'highlight': {
      const color = layer.color ?? '#fff7ea';
      switch (layer.region) {
        case 'cheekbone':
          return (
            <g fill={color} opacity="0.85" filter={`url(#${id('soft')})`}>
              <Mirrored>
                <ellipse cx="88" cy="204" rx="22" ry="7" transform="rotate(-24 88 204)" />
              </Mirrored>
            </g>
          );
        case 'noseBridge':
          return <rect x="156" y="172" width="8" height="64" rx="4" fill={color} opacity="0.8" filter={`url(#${id('soft')})`} />;
        case 'noseTip':
          return <circle cx="160" cy="244" r="6" fill={color} opacity="0.9" filter={`url(#${id('glow')})`} />;
        case 'browBone':
          return (
            <g stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.75" filter={`url(#${id('soft')})`}>
              <Mirrored>
                <path d="M98,162 C110,156 128,156 140,162" />
              </Mirrored>
            </g>
          );
        case 'cupid':
          return (
            <path d="M152,276 L160,281 L168,276" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.9" filter={`url(#${id('glow')})`} />
          );
        default:
          return null;
      }
    }
    case 'noseShade': {
      const common = { stroke: layer.color, fill: 'none', strokeLinecap: 'round' as const, opacity: layer.opacity ?? 0.45, filter: `url(#${id('soft')})` };
      switch (layer.style) {
        case 'browStart':
          return (
            <g {...common} strokeWidth="7">
              <Mirrored>
                <path d="M145,156 C149,166 150,174 151,182" />
              </Mirrored>
            </g>
          );
        case 'bridgeSides':
          return (
            <g {...common} strokeWidth="8">
              <Mirrored>
                <path d="M148,180 C145,202 144,222 146,240" />
              </Mirrored>
            </g>
          );
        case 'nostril':
          return (
            <g {...common} strokeWidth="8">
              <Mirrored>
                <path d="M136,236 C133,246 136,254 144,256" />
              </Mirrored>
            </g>
          );
        case 'tipBreak':
          return <path d="M149,235 L171,235" {...common} strokeWidth="8" />;
        case 'tipUnder':
          return <path d="M147,254 C153,261 167,261 173,254" {...common} strokeWidth="7" />;
        default:
          return null;
      }
    }
    default:
      return null;
  }
}
