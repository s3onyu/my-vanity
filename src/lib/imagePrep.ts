/**
 * OCR 전처리 — 제품 라벨 사진은 글자가 작고 배경색이 다양해 그대로 넣으면 인식률이 낮다.
 * 1) 긴 변을 2200px 근처까지 키우고(작은 사진은 최대 3배)  2) 흑백 변환  3) 2~98 백분위 대비 늘리기
 * 4) 어두운 배경이면 반전본도 함께 만든다. 모두 기기 안(canvas)에서 처리한다.
 */
export interface PreparedImage {
  enhanced: string;
  /** 어두운 배경(밝은 글자)일 때만 만들어지는 반전본 */
  inverted: string | null;
  width: number;
  height: number;
  meanLuma: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러올 수 없어요.'));
    img.src = src;
  });
}

export async function prepareForOcr(src: string, maxSide = 2200): Promise<PreparedImage> {
  const img = await loadImage(src);
  const scale = Math.min(3, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('이미지를 처리할 수 없어요.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const image = ctx.getImageData(0, 0, w, h);
  const px = image.data;
  const n = w * h;
  const luma = new Uint8ClampedArray(n);
  const hist = new Uint32Array(256);
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const l = (px[i * 4] * 299 + px[i * 4 + 1] * 587 + px[i * 4 + 2] * 114) / 1000;
    const v = l | 0;
    luma[i] = v;
    hist[v] += 1;
    sum += v;
  }
  const meanLuma = sum / n;

  // 2~98 백분위로 대비 늘리기
  let lo = 0;
  let hi = 255;
  let acc = 0;
  for (let v = 0; v < 256; v += 1) {
    acc += hist[v];
    if (acc >= n * 0.02) {
      lo = v;
      break;
    }
  }
  acc = 0;
  for (let v = 255; v >= 0; v -= 1) {
    acc += hist[v];
    if (acc >= n * 0.02) {
      hi = v;
      break;
    }
  }
  const range = Math.max(1, hi - lo);
  for (let i = 0; i < n; i += 1) {
    const v = Math.max(0, Math.min(255, ((luma[i] - lo) * 255) / range));
    px[i * 4] = v;
    px[i * 4 + 1] = v;
    px[i * 4 + 2] = v;
    px[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const enhanced = canvas.toDataURL('image/png');

  let inverted: string | null = null;
  if (meanLuma < 120) {
    for (let i = 0; i < n; i += 1) {
      const v = 255 - px[i * 4];
      px[i * 4] = v;
      px[i * 4 + 1] = v;
      px[i * 4 + 2] = v;
    }
    ctx.putImageData(image, 0, 0);
    inverted = canvas.toDataURL('image/png');
  }

  return { enhanced, inverted, width: w, height: h, meanLuma };
}
