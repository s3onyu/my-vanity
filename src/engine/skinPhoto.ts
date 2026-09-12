/**
 * 피부 사진 참고 지표 — 기기 안에서만 계산한다.
 *
 * 같은 사람이 비슷한 조명·거리에서 찍은 사진끼리 "달라졌는지"를 보는 상대 지표이며,
 * 절대 수치나 진단이 아니다. 조명·화장·카메라 보정에 따라 크게 달라진다.
 */

import type { SkinMetrics } from '@/types';

export type { SkinMetrics };

export interface Ellipse {
  /** 0~1 (가로 비율) */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** 앱 안 카메라의 얼굴 가이드 위치 — 촬영 화면과 지표 계산이 같은 값을 쓴다 */
export const FACE_GUIDE: Ellipse = { cx: 0.5, cy: 0.5, rx: 0.32, ry: 0.42 };

export const METRIC_META: { key: keyof Pick<SkinMetrics, 'redness' | 'shine' | 'evenness'>; label: string; emoji: string; higherIsBetter: boolean; desc: string }[] = [
  { key: 'redness', label: '홍조', emoji: '🌡️', higherIsBetter: false, desc: '피부에서 붉은 기가 차지하는 정도' },
  { key: 'shine', label: '광택', emoji: '✨', higherIsBetter: false, desc: '빛을 반사하는 번들거림 정도' },
  { key: 'evenness', label: '균일도', emoji: '🪞', higherIsBetter: true, desc: '피부 밝기가 고른 정도 (자국·그늘이 적을수록 높음)' },
];

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** YCbCr 기반의 단순 피부색 판정 */
function isSkin(r: number, g: number, b: number): boolean {
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
}

/**
 * ImageData 의 타원 영역을 훑어 지표를 계산한다 (순수 함수 — 테스트 가능).
 * 큰 사진은 step 으로 건너뛰며 샘플링한다.
 */
export function computeSkinMetrics(image: ImageData, ellipse: Ellipse = FACE_GUIDE): SkinMetrics {
  const { width, height, data } = image;
  const cx = ellipse.cx * width;
  const cy = ellipse.cy * height;
  const rx = ellipse.rx * width;
  const ry = ellipse.ry * height;
  const step = Math.max(1, Math.floor(Math.max(width, height) / 400));

  let inside = 0;
  let skin = 0;
  let sumR = 0;
  let sumBright = 0;
  let specular = 0;
  const lumas: number[] = [];

  for (let y = 0; y < height; y += step) {
    const dy = (y - cy) / ry;
    for (let x = 0; x < width; x += step) {
      const dx = (x - cx) / rx;
      if (dx * dx + dy * dy > 1) continue;
      inside += 1;
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      sumBright += luma;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (max >= 235 && sat <= 0.28) specular += 1;
      if (isSkin(r, g, b)) {
        skin += 1;
        sumR += r / (r + g + b + 1);
        lumas.push(luma);
      }
    }
  }

  if (inside === 0) return { redness: 0, shine: 0, evenness: 0, brightness: 0, skinRatio: 0 };
  const brightness = sumBright / inside;
  const skinRatio = skin / inside;
  if (skin < 20) return { redness: 0, shine: clamp((specular / inside / 0.12) * 100), evenness: 0, brightness, skinRatio };

  const meanR = sumR / skin;
  const meanL = lumas.reduce((s, v) => s + v, 0) / lumas.length;
  const std = Math.sqrt(lumas.reduce((s, v) => s + (v - meanL) ** 2, 0) / lumas.length);

  return {
    redness: Math.round(clamp(((meanR - 0.36) / 0.14) * 100)),
    shine: Math.round(clamp((specular / inside / 0.12) * 100)),
    evenness: Math.round(clamp(100 - (std / 45) * 100)),
    brightness: Math.round(brightness),
    skinRatio: Math.round(skinRatio * 100) / 100,
  };
}

/** 촬영 조건 안내 — 비교 가능한 사진인지 알려준다 */
export function photoConditionNote(m: SkinMetrics): { level: 'ok' | 'warn'; text: string } {
  if (m.skinRatio < 0.25) return { level: 'warn', text: '얼굴이 가이드 안에 충분히 들어오지 않았어요. 지표가 부정확할 수 있어요.' };
  if (m.brightness < 70) return { level: 'warn', text: '사진이 어두워요. 창가나 밝은 조명 아래에서 찍으면 비교가 정확해져요.' };
  if (m.brightness > 215) return { level: 'warn', text: '사진이 너무 밝아요. 직사광을 피해 찍어보세요.' };
  return { level: 'ok', text: '비교하기 좋은 조건이에요. 다음에도 비슷한 조명과 거리로 찍어주세요.' };
}

/** 두 사진의 지표 차이를 쉬운 문장으로 */
export function describeMetricChange(prev: SkinMetrics, next: SkinMetrics): string[] {
  const out: string[] = [];
  METRIC_META.forEach((m) => {
    const d = next[m.key] - prev[m.key];
    if (Math.abs(d) < 6) return;
    const better = m.higherIsBetter ? d > 0 : d < 0;
    out.push(`${m.emoji} ${m.label} ${d > 0 ? '▲' : '▼'}${Math.abs(d)} · ${better ? '나아진 방향' : '나빠진 방향'}`);
  });
  if (Math.abs(next.brightness - prev.brightness) > 45) out.push('💡 두 사진의 밝기 차이가 커서 지표 비교는 참고만 해주세요.');
  return out;
}

/** data URL 이미지를 읽어 지표를 계산한다 (브라우저 전용) */
export async function analyzeSkinPhoto(dataUrl: string, ellipse: Ellipse = FACE_GUIDE): Promise<SkinMetrics> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('사진을 불러올 수 없어요.'));
    el.src = dataUrl;
  });
  const scale = Math.min(1, 480 / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('사진을 처리할 수 없어요.');
  ctx.drawImage(img, 0, 0, w, h);
  return computeSkinMetrics(ctx.getImageData(0, 0, w, h), ellipse);
}
