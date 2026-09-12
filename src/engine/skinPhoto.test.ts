import { describe, expect, it } from 'vitest';
import { computeSkinMetrics, describeMetricChange, photoConditionNote, type SkinMetrics } from './skinPhoto';

/** 단색 얼굴 영역을 가진 가짜 ImageData */
function fakeImage(width: number, height: number, paint: (x: number, y: number) => [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = paint(x, y);
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { width, height, data, colorSpace: 'srgb' } as ImageData;
}

const inOval = (x: number, y: number, w: number, h: number) => {
  const dx = (x - w / 2) / (w * 0.32);
  const dy = (y - h / 2) / (h * 0.42);
  return dx * dx + dy * dy <= 1;
};

describe('skinPhoto — 참고 지표', () => {
  it('피부색 타원 안에서는 피부 비율이 높고 균일도가 높다', () => {
    const img = fakeImage(200, 260, (x, y) => (inOval(x, y, 200, 260) ? [214, 170, 150] : [30, 30, 30]));
    const m = computeSkinMetrics(img);
    expect(m.skinRatio).toBeGreaterThan(0.9);
    expect(m.evenness).toBeGreaterThan(90);
    expect(m.shine).toBe(0);
  });

  it('붉은 기가 강한 피부는 홍조 지표가 더 높다', () => {
    const calm = computeSkinMetrics(fakeImage(200, 260, () => [214, 170, 150]));
    const flushed = computeSkinMetrics(fakeImage(200, 260, () => [230, 150, 140]));
    expect(flushed.redness).toBeGreaterThan(calm.redness);
  });

  it('밝고 채도 낮은 반사 픽셀이 많으면 광택 지표가 오른다', () => {
    const matte = computeSkinMetrics(fakeImage(200, 260, () => [214, 170, 150]));
    const glossy = computeSkinMetrics(fakeImage(200, 260, (x) => (x % 5 === 0 ? [250, 246, 242] : [214, 170, 150])));
    expect(glossy.shine).toBeGreaterThan(matte.shine);
  });

  it('밝기 편차가 크면 균일도가 내려간다', () => {
    const even = computeSkinMetrics(fakeImage(200, 260, () => [214, 170, 150]));
    const patchy = computeSkinMetrics(fakeImage(200, 260, (x, y) => ((x + y) % 7 === 0 ? [150, 110, 95] : [214, 170, 150])));
    expect(patchy.evenness).toBeLessThan(even.evenness);
  });

  it('얼굴이 가이드 밖이거나 어두우면 조건 경고를 낸다', () => {
    const noFace = computeSkinMetrics(fakeImage(200, 260, () => [40, 40, 40]));
    expect(photoConditionNote(noFace).level).toBe('warn');
    const dark = computeSkinMetrics(fakeImage(200, 260, () => [90, 60, 50]));
    expect(dark.brightness).toBeLessThan(70);
    expect(photoConditionNote(dark).level).toBe('warn');
    const ok = computeSkinMetrics(fakeImage(200, 260, () => [214, 170, 150]));
    expect(photoConditionNote(ok).level).toBe('ok');
  });

  it('두 사진 비교 문장은 6 이상 차이만 말하고 방향을 알려준다', () => {
    const a: SkinMetrics = { redness: 40, shine: 20, evenness: 70, brightness: 150, skinRatio: 0.9 };
    const b: SkinMetrics = { redness: 28, shine: 22, evenness: 78, brightness: 155, skinRatio: 0.9 };
    const lines = describeMetricChange(a, b);
    expect(lines.some((l) => l.includes('홍조') && l.includes('나아진'))).toBe(true);
    expect(lines.some((l) => l.includes('광택'))).toBe(false);
    expect(lines.some((l) => l.includes('균일도') && l.includes('나아진'))).toBe(true);
  });
});
