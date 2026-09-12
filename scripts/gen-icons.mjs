/**
 * 앱 아이콘·스플래시·PWA 아이콘 생성 (외부 의존성 없이 순수 Node 로 PNG 를 그린다).
 *   node scripts/gen-icons.mjs
 * 결과:
 *   resources/icon.png (1024)  resources/icon-foreground.png / icon-background.png (Android adaptive)
 *   resources/splash.png, splash-dark.png (2732)
 *   public/icons/icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png
 * 이후 `npx @capacitor/assets generate` 가 resources/ 를 읽어 iOS/Android 에셋을 채운다.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const CREAM = [0xfd, 0xfb, 0xf5];
const CIRCLES = [
  { color: [0xf4, 0xc2, 0xc2], dx: 0, dy: -0.35 }, // rose
  { color: [0xb8, 0xdf, 0xd1], dx: -0.42, dy: 0.28 }, // mint
  { color: [0xc8, 0xdf, 0xee], dx: 0.42, dy: 0.28 }, // sky
];
const INK = [0x1a, 0x1f, 0x1c];

// ---- PNG 인코더 (RGB, 8bit)
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function encodePng(width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 3 + 1)] = 0;
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- 렌더링: 크림 배경 + 세 개의 파스텔 원 (+ 가운데 잉크 점)
function render(size, { radiusRatio, background = CREAM, dot = true, transparentBg = false }) {
  const rgb = Buffer.alloc(size * size * 3);
  const cx = size / 2;
  const cy = size / 2;
  const R = size * radiusRatio;
  const shapes = CIRCLES.map((c) => ({ ...c, x: cx + c.dx * R, y: cy + c.dy * R, r: R * 0.78 }));
  if (dot) shapes.push({ color: INK, x: cx, y: cy + R * 0.02, r: R * 0.11 });
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let [r, g, b] = transparentBg ? CREAM : background;
      for (const s of shapes) {
        const d = Math.hypot(x + 0.5 - s.x, y + 0.5 - s.y);
        const a = Math.max(0, Math.min(1, s.r - d + 0.5)) * (s.color === INK ? 1 : 0.9);
        if (a > 0) {
          r = r + (s.color[0] - r) * a;
          g = g + (s.color[1] - g) * a;
          b = b + (s.color[2] - b) * a;
        }
      }
      const i = (y * size + x) * 3;
      rgb[i] = r;
      rgb[i + 1] = g;
      rgb[i + 2] = b;
    }
  }
  return encodePng(size, size, rgb);
}

mkdirSync('resources', { recursive: true });
mkdirSync('public/icons', { recursive: true });

const out = [
  ['resources/icon.png', render(1024, { radiusRatio: 0.24 })],
  ['resources/icon-foreground.png', render(1024, { radiusRatio: 0.17 })], // adaptive: 안전 영역(가운데 66%) 안에
  ['resources/icon-background.png', render(1024, { radiusRatio: 0, dot: false })],
  ['resources/splash.png', render(2732, { radiusRatio: 0.06 })],
  ['resources/splash-dark.png', render(2732, { radiusRatio: 0.06, background: [0x1a, 0x1f, 0x1c] })],
  ['public/icons/icon-192.png', render(192, { radiusRatio: 0.24 })],
  ['public/icons/icon-512.png', render(512, { radiusRatio: 0.24 })],
  ['public/icons/icon-512-maskable.png', render(512, { radiusRatio: 0.17 })],
  ['public/icons/apple-touch-icon.png', render(180, { radiusRatio: 0.24 })],
];
out.forEach(([path, buf]) => {
  writeFileSync(path, buf);
  console.log(`${path} ${(buf.length / 1024).toFixed(1)}KB`);
});
