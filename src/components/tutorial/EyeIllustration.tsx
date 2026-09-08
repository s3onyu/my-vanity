import { useId, useMemo } from 'react';
import type { EyeLayer } from '@/types';

/**
 * 눈 일러스트 (실제 인물이 아닌 원본 일러스트).
 * - 홍채/동공은 눈꺼풀 경계(clipPath) 안에만 그려진다.
 * - 아이라이너는 lash-line 곡선을 샘플링해 두께 프로파일을 붙인 하나의 다각형이라
 *   윙이 자연스럽게 이어진다.
 */

type Pt = [number, number];

// 기준 지오메트리 (viewBox 0 0 320 200) — 안쪽 눈꼬리(왼쪽) → 바깥 눈꼬리(오른쪽)
const P0: Pt = [56, 112];
const P3: Pt = [264, 100];
const UPPER: [Pt, Pt, Pt, Pt] = [P0, [92, 58], [212, 48], P3];
const LOWER: [Pt, Pt, Pt, Pt] = [P0, [100, 146], [216, 146], P3];
const CREASE: [Pt, Pt, Pt, Pt] = [
  [58, 100],
  [96, 24],
  [226, 16],
  [272, 88],
];

const cubic = (c: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const cc = 3 * mt * t * t;
  const d = t * t * t;
  return [
    a * c[0][0] + b * c[1][0] + cc * c[2][0] + d * c[3][0],
    a * c[0][1] + b * c[1][1] + cc * c[2][1] + d * c[3][1],
  ];
};

const cubicTangent = (c: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const mt = 1 - t;
  const x = 3 * mt * mt * (c[1][0] - c[0][0]) + 6 * mt * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]);
  const y = 3 * mt * mt * (c[1][1] - c[0][1]) + 6 * mt * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]);
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
};

const pathOf = (c: [Pt, Pt, Pt, Pt]) =>
  `M${c[0][0]},${c[0][1]} C${c[1][0]},${c[1][1]} ${c[2][0]},${c[2][1]} ${c[3][0]},${c[3][1]}`;

const reversePathOf = (c: [Pt, Pt, Pt, Pt]) =>
  `C${c[2][0]},${c[2][1]} ${c[1][0]},${c[1][1]} ${c[0][0]},${c[0][1]}`;

/** 눈 뜬 영역 (윗눈꺼풀 → 아랫눈꺼풀 역방향) */
const EYE_OPENING = `${pathOf(UPPER)} ${reversePathOf(LOWER)} Z`;

/** 눈꺼풀 영역 (lash line → crease 역방향) */
const LID_REGION = `${pathOf(UPPER)} L${CREASE[3][0]},${CREASE[3][1]} ${reversePathOf(CREASE)} Z`;

/** 눈꺼풀 클립 — crease 보다 위로 여유를 두어 블러가 자연스럽게 사라지게 */
const LID_CLIP = `${pathOf(UPPER)} L${CREASE[3][0] + 6},${CREASE[3][1] - 20} C${CREASE[2][0]},${CREASE[2][1] - 24} ${CREASE[1][0]},${
  CREASE[1][1] - 24
} ${CREASE[0][0] - 8},${CREASE[0][1] - 18} Z`;

const REGION_X: Record<'full' | 'inner' | 'mid' | 'outer', [number, number]> = {
  full: [30, 300],
  inner: [30, 128],
  mid: [108, 214],
  outer: [190, 300],
};

const LINER_PROFILE: Record<
  NonNullable<Extract<EyeLayer, { kind: 'liner' }>['style']>,
  { base: number; extra: number; wingLen: number; wingDir: Pt; underline?: boolean }
> = {
  thin: { base: 1.2, extra: 2.2, wingLen: 0, wingDir: [1, -0.5] },
  medium: { base: 1.8, extra: 3.6, wingLen: 10, wingDir: [1, -0.5] },
  thick: { base: 2.8, extra: 6.5, wingLen: 16, wingDir: [1, -0.55] },
  wing: { base: 1.4, extra: 4.2, wingLen: 30, wingDir: [1, -0.6] },
  downturn: { base: 1.4, extra: 3.2, wingLen: 22, wingDir: [1, 0.5] },
  puppy: { base: 1.4, extra: 3.0, wingLen: 16, wingDir: [1, 0.4], underline: true },
};

function linerPolygon(style: keyof typeof LINER_PROFILE): string {
  const prof = LINER_PROFILE[style];
  const N = 44;
  const bottom: Pt[] = [];
  const top: Pt[] = [];
  for (let i = 0; i <= N; i += 1) {
    const t = i / N;
    const p = cubic(UPPER, t);
    const [tx, ty] = cubicTangent(UPPER, t);
    const n: Pt = [ty, -tx]; // 위쪽(눈 바깥) 방향 법선
    const w = prof.base + prof.extra * Math.pow(t, 1.6);
    bottom.push(p);
    top.push([p[0] + n[0] * w, p[1] + n[1] * w]);
  }
  const pts: Pt[] = [...bottom];
  if (prof.wingLen > 0) {
    const end = bottom[bottom.length - 1];
    const d = prof.wingDir;
    const len = Math.hypot(d[0], d[1]);
    const dir: Pt = [d[0] / len, d[1] / len];
    const tip: Pt = [end[0] + dir[0] * prof.wingLen, end[1] + dir[1] * prof.wingLen];
    // 윙: lash line 끝 → 팁 → 윗변 끝으로 이어지는 하나의 면
    pts.push([end[0] + dir[0] * prof.wingLen * 0.55, end[1] + dir[1] * prof.wingLen * 0.55 + 0.5]);
    pts.push(tip);
  }
  pts.push(...top.reverse());
  return `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} Z`;
}

interface LashSpec {
  count: number;
  min: number;
  max: number;
  width: number;
  curl: number;
  lower: boolean;
}

const LASH_SPEC: Record<NonNullable<Extract<EyeLayer, { kind: 'lashes' }>['style']>, LashSpec> = {
  natural: { count: 13, min: 9, max: 15, width: 1.3, curl: 4, lower: true },
  volume: { count: 20, min: 12, max: 21, width: 1.9, curl: 5, lower: true },
  curl: { count: 15, min: 11, max: 19, width: 1.5, curl: 8, lower: false },
  doll: { count: 17, min: 12, max: 22, width: 1.6, curl: 5, lower: true },
};

function lashPaths(spec: LashSpec): { upper: string[]; lower: string[] } {
  const upper: string[] = [];
  for (let i = 0; i < spec.count; i += 1) {
    const t = 0.14 + (0.84 * i) / (spec.count - 1);
    const p = cubic(UPPER, t);
    const [tx, ty] = cubicTangent(UPPER, t);
    const n: Pt = [ty, -tx];
    // 바깥쪽으로 갈수록 눈꼬리 방향으로 기울어짐
    const lean = 0.15 + t * 0.55;
    const dir: Pt = [n[0] + lean, n[1]];
    const dl = Math.hypot(dir[0], dir[1]);
    const ux = dir[0] / dl;
    const uy = dir[1] / dl;
    const len = spec.min + (spec.max - spec.min) * Math.pow(Math.sin(Math.PI * (0.2 + t * 0.7)), 0.9);
    const end: Pt = [p[0] + ux * len, p[1] + uy * len];
    // 컨트롤 포인트: 살짝 위로 말리는 컬
    const ctrl: Pt = [p[0] + ux * len * 0.55 + uy * spec.curl * 0.6, p[1] + uy * len * 0.55 - ux * spec.curl * 0.6 - spec.curl * 0.4];
    upper.push(`M${p[0].toFixed(1)},${p[1].toFixed(1)} Q${ctrl[0].toFixed(1)},${ctrl[1].toFixed(1)} ${end[0].toFixed(1)},${end[1].toFixed(1)}`);
  }
  const lower: string[] = [];
  if (spec.lower) {
    for (let i = 0; i < 8; i += 1) {
      const t = 0.3 + (0.62 * i) / 7;
      const p = cubic(LOWER, t);
      const [tx, ty] = cubicTangent(LOWER, t);
      const n: Pt = [-ty, tx]; // 아래 방향
      const len = 4 + 2.5 * Math.sin(Math.PI * t);
      lower.push(`M${p[0].toFixed(1)},${p[1].toFixed(1)} l${(n[0] * len + 1.2).toFixed(1)},${(n[1] * len).toFixed(1)}`);
    }
  }
  return { upper, lower };
}

/** 글리터 점 — 결정적(pseudo-random) 좌표 */
function glitterPoints(region: 'center' | 'inner' | 'full'): { x: number; y: number; r: number; o: number }[] {
  const out: { x: number; y: number; r: number; o: number }[] = [];
  const ranges: Record<typeof region, [number, number]> = { center: [0.32, 0.72], inner: [0.05, 0.4], full: [0.06, 0.94] };
  const [t0, t1] = ranges[region];
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const count = region === 'full' ? 34 : 22;
  for (let i = 0; i < count; i += 1) {
    const t = t0 + (t1 - t0) * rnd();
    const u = 0.12 + 0.7 * rnd();
    const a = cubic(UPPER, t);
    const b = cubic(CREASE, t);
    out.push({ x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, r: 1 + rnd() * 1.8, o: 0.5 + rnd() * 0.5 });
  }
  return out;
}

const Z_ORDER: Record<EyeLayer['kind'], number> = {
  lid: 1,
  aegyo: 2,
  crease: 3,
  outerV: 4,
  underline: 4,
  innerCorner: 5,
  glitter: 6,
  liner: 7,
  lashes: 8,
};

interface Props {
  layers: EyeLayer[];
  /** 렌더 너비(px). 높이는 비율에 맞춰 자동 */
  width?: number | string;
  className?: string;
}

export function EyeIllustration({ layers, width = '100%', className }: Props) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;
  const sorted = useMemo(() => [...layers].sort((a, b) => Z_ORDER[a.kind] - Z_ORDER[b.kind]), [layers]);
  const bareLashes = useMemo(() => lashPaths({ count: 9, min: 6, max: 9, width: 1, curl: 3, lower: false }), []);

  return (
    <svg
      viewBox="0 0 320 200"
      width={width}
      className={className}
      role="img"
      aria-label="눈 메이크업 일러스트"
      style={{ display: 'block', maxWidth: '100%' }}
    >
      <defs>
        <linearGradient id={id('skin')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e2d3" />
          <stop offset="1" stopColor="#efcdb8" />
        </linearGradient>
        <radialGradient id={id('iris')} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#8a5f42" />
          <stop offset="0.7" stopColor="#4f3626" />
          <stop offset="1" stopColor="#2c1c14" />
        </radialGradient>
        <clipPath id={id('eye')}>
          <path d={EYE_OPENING} />
        </clipPath>
        <clipPath id={id('lid')}>
          <path d={LID_CLIP} />
        </clipPath>
        <mask id={id('outside')}>
          <rect width="320" height="200" fill="white" />
          <path d={EYE_OPENING} fill="black" />
        </mask>
        <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={id('softer')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('glow')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* 피부 */}
      <rect width="320" height="200" rx="18" fill={`url(#${id('skin')})`} />
      {/* 눈두덩 음영 */}
      <ellipse cx="166" cy="70" rx="120" ry="40" fill="#e2bda6" opacity="0.35" filter={`url(#${id('softer')})`} />
      {/* 눈썹 */}
      <path
        d="M44,72 C92,34 196,26 288,46 C202,44 112,54 50,82 Z"
        fill="#6b5346"
        opacity="0.9"
        filter={`url(#${id('glow')})`}
      />

      {/* 눈 흰자 + 홍채 (clip) */}
      <path d={EYE_OPENING} fill="#fcf9f5" />
      <g clipPath={`url(#${id('eye')})`}>
        <circle cx="162" cy="106" r="37" fill={`url(#${id('iris')})`} />
        <circle cx="162" cy="106" r="37" fill="none" stroke="#24160f" strokeWidth="2.2" opacity="0.7" />
        <circle cx="162" cy="106" r="15" fill="#160d09" />
        <circle cx="150" cy="92" r="6.5" fill="#fff" opacity="0.92" />
        <circle cx="174" cy="120" r="3" fill="#fff" opacity="0.5" />
        {/* 윗눈꺼풀 그림자 */}
        <path d={pathOf(UPPER)} fill="none" stroke="#b58b74" strokeWidth="10" opacity="0.35" filter={`url(#${id('soft')})`} />
      </g>

      {/* 메이크업 레이어 */}
      {sorted.map((layer, idx) => (
        <EyeLayerView key={idx} layer={layer} id={id} />
      ))}

      {/* 눈꺼풀 라인, 쌍꺼풀, 아랫눈꺼풀 */}
      <path d={pathOf(UPPER)} fill="none" stroke="#a97b66" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <path d={pathOf(CREASE)} fill="none" stroke="#d3a68f" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      <path d={pathOf(LOWER)} fill="none" stroke="#c99c88" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      {/* 기본 속눈썹 (맨눈) */}
      {!sorted.some((l) => l.kind === 'lashes') && (
        <g stroke="#5b4034" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.65">
          {bareLashes.upper.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

function EyeLayerView({ layer, id }: { layer: EyeLayer; id: (n: string) => string }) {
  switch (layer.kind) {
    case 'lid': {
      const [x0, x1] = REGION_X[layer.region];
      return (
        <g clipPath={`url(#${id('lid')})`}>
          <g clipPath={undefined}>
            <path
              d={LID_REGION}
              fill={layer.color}
              opacity={layer.opacity ?? 0.7}
              filter={`url(#${id('soft')})`}
              style={{ clipPath: `polygon(${x0}px 0, ${x1}px 0, ${x1}px 200px, ${x0}px 200px)` }}
            />
          </g>
        </g>
      );
    }
    case 'crease':
      return (
        <g clipPath={`url(#${id('lid')})`}>
          <path
            d={pathOf(CREASE)}
            fill="none"
            stroke={layer.color}
            strokeWidth="12"
            strokeLinecap="round"
            opacity={layer.opacity ?? 0.6}
            filter={`url(#${id('softer')})`}
          />
        </g>
      );
    case 'outerV':
      return (
        <g clipPath={`url(#${id('lid')})`}>
          <path
            d="M198,72 C230,56 256,66 270,94 L252,106 C238,90 220,84 198,72 Z"
            fill={layer.color}
            opacity={layer.opacity ?? 0.7}
            filter={`url(#${id('soft')})`}
          />
        </g>
      );
    case 'underline': {
      const [x0, x1] = layer.region === 'outer' ? [160, 290] : layer.region === 'inner' ? [40, 150] : [40, 290];
      return (
        <g mask={`url(#${id('outside')})`}>
          <path
            d={pathOf(LOWER)}
            transform="translate(0,5)"
            fill="none"
            stroke={layer.color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity={layer.opacity ?? 0.65}
            filter={`url(#${id('soft')})`}
            style={{ clipPath: `polygon(${x0}px 0, ${x1}px 0, ${x1}px 200px, ${x0}px 200px)` }}
          />
        </g>
      );
    }
    case 'aegyo':
      return (
        <g mask={`url(#${id('outside')})`}>
          <path
            d={pathOf(LOWER)}
            transform="translate(0,10)"
            fill="none"
            stroke={layer.color}
            strokeWidth="13"
            strokeLinecap="round"
            opacity={layer.opacity ?? 0.5}
            filter={`url(#${id('softer')})`}
            style={{ clipPath: 'polygon(80px 0, 250px 0, 250px 200px, 80px 200px)' }}
          />
        </g>
      );
    case 'innerCorner':
      return (
        <g>
          <circle cx="66" cy="110" r="8" fill={layer.color} opacity="0.85" filter={`url(#${id('glow')})`} />
          <circle cx="64" cy="108" r="2" fill="#fff" opacity="0.9" />
        </g>
      );
    case 'glitter':
      return (
        <g>
          {glitterPoints(layer.region).map((g, i) => (
            <g key={i} opacity={g.o}>
              <circle cx={g.x} cy={g.y} r={g.r} fill={layer.color} />
              <circle cx={g.x - g.r * 0.3} cy={g.y - g.r * 0.3} r={g.r * 0.4} fill="#fff" />
            </g>
          ))}
        </g>
      );
    case 'liner': {
      const prof = LINER_PROFILE[layer.style];
      return (
        <g>
          <path d={linerPolygon(layer.style)} fill={layer.color} />
          {prof.underline && (
            <g mask={`url(#${id('outside')})`}>
              <path
                d={pathOf(LOWER)}
                transform="translate(0,1.5)"
                fill="none"
                stroke={layer.color}
                strokeWidth="2"
                strokeLinecap="round"
                style={{ clipPath: 'polygon(180px 0, 290px 0, 290px 200px, 180px 200px)' }}
              />
            </g>
          )}
        </g>
      );
    }
    case 'lashes': {
      const spec = LASH_SPEC[layer.style];
      const paths = lashPaths(spec);
      const color = layer.color ?? '#221612';
      return (
        <g stroke={color} strokeWidth={spec.width} strokeLinecap="round" fill="none">
          {paths.upper.map((d, i) => (
            <path key={`u${i}`} d={d} />
          ))}
          {paths.lower.map((d, i) => (
            <path key={`l${i}`} d={d} strokeWidth={spec.width * 0.7} opacity="0.8" />
          ))}
        </g>
      );
    }
    default:
      return null;
  }
}
