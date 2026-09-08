import { createWorker, type Worker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  /** 0~1 */
  progress: number;
}

/** tesseract.js 상태 문자열 → 한국어 안내 */
export function ocrStatusKo(status: string): string {
  if (status.includes('loading tesseract core')) return '인식 엔진 불러오는 중';
  if (status.includes('initializing tesseract')) return '엔진 준비 중';
  if (status.includes('loading language')) return '언어 데이터 내려받는 중 (처음 한 번만, 조금 걸려요)';
  if (status.includes('initializing api')) return '언어 데이터 준비 중';
  if (status.includes('recognizing')) return '글자 인식 중';
  return '준비 중';
}

let workerPromise: Promise<Worker> | null = null;
let progressHandler: ((p: OcrProgress) => void) | null = null;

/**
 * OCR 워커는 한 번만 만들어 재사용한다.
 * 워커 스크립트·코어(wasm)·언어 데이터(kor+eng)는 tesseract.js 기본 CDN 에서 내려받으며,
 * 사진은 서버로 전송되지 않고 기기 안에서만 처리된다.
 */
async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker('kor+eng', 1, {
      logger: (m: { status: string; progress?: number }) => progressHandler?.({ status: m.status, progress: m.progress ?? 0 }),
    }).catch((err: unknown) => {
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

/** 제품 사진에서 글자를 읽어낸다 (data URL 또는 Blob) */
export async function recognizeProductText(image: string | Blob, onProgress?: (p: OcrProgress) => void): Promise<string> {
  progressHandler = onProgress ?? null;
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(image);
    return data.text ?? '';
  } finally {
    progressHandler = null;
  }
}

/** 워커를 미리 띄워 첫 인식 지연을 줄인다 (실패해도 조용히 무시) */
export function warmUpOcr() {
  void getWorker().catch(() => undefined);
}
