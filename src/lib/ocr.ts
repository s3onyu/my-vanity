import { createWorker, PSM, type Worker } from 'tesseract.js';
import { prepareForOcr } from './imagePrep';

export interface OcrProgress {
  status: string;
  /** 0~1 (현재 패스 기준) */
  progress: number;
  /** 1부터 시작하는 현재 패스 번호 */
  pass: number;
  passes: number;
}

/** tesseract.js 상태 문자열 → 한국어 안내 */
export function ocrStatusKo(status: string): string {
  if (status.includes('preparing')) return '사진 선명하게 다듬는 중';
  if (status.includes('loading tesseract core')) return '인식 엔진 불러오는 중';
  if (status.includes('initializing tesseract')) return '엔진 준비 중';
  if (status.includes('loading language')) return '언어 데이터 내려받는 중 (처음 한 번만, 조금 걸려요)';
  if (status.includes('initializing api')) return '언어 데이터 준비 중';
  if (status.includes('recognizing')) return '글자 인식 중';
  return '준비 중';
}

let workerPromise: Promise<Worker> | null = null;
let progressHandler: ((p: { status: string; progress: number }) => void) | null = null;

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

interface OcrWord {
  text: string;
  confidence: number;
}
interface OcrLine {
  words: OcrWord[];
  text: string;
  confidence: number;
}
interface OcrBlocks {
  blocks?: { paragraphs: { lines: OcrLine[] }[] }[] | null;
  text: string;
}

/** 신뢰도가 낮은 단어를 걸러내고 줄 단위 텍스트로 재구성 */
function linesFromResult(data: OcrBlocks, minWordConfidence: number): string[] {
  const out: string[] = [];
  const blocks = data.blocks ?? [];
  if (blocks.length) {
    blocks.forEach((b) =>
      b.paragraphs.forEach((p) =>
        p.lines.forEach((line) => {
          const words = line.words.filter((w) => w.confidence >= minWordConfidence && w.text.trim());
          if (words.length) out.push(words.map((w) => w.text.trim()).join(' '));
        }),
      ),
    );
    return out;
  }
  return data.text.split('\n').map((l) => l.trim()).filter(Boolean);
}

const normLine = (s: string) => s.toLowerCase().replace(/[^0-9a-zㄱ-ㆎ가-힣]+/g, '');

/**
 * 제품 사진에서 글자를 읽어낸다.
 * 전처리(업스케일·흑백·대비) 후 페이지 분할 모드를 바꿔가며 여러 번 인식하고 결과를 합친다.
 */
export async function recognizeProductText(image: string, onProgress?: (p: OcrProgress) => void): Promise<string> {
  onProgress?.({ status: 'preparing', progress: 0, pass: 0, passes: 0 });
  const prepared = await prepareForOcr(image);
  const passes: { img: string; psm: PSM }[] = [
    { img: prepared.enhanced, psm: PSM.SPARSE_TEXT },
    { img: prepared.enhanced, psm: PSM.AUTO },
    prepared.inverted ? { img: prepared.inverted, psm: PSM.SPARSE_TEXT } : { img: prepared.enhanced, psm: PSM.SINGLE_BLOCK },
  ];

  const worker = await getWorker();
  const seen = new Set<string>();
  const lines: string[] = [];
  try {
    for (let i = 0; i < passes.length; i += 1) {
      progressHandler = (p) => onProgress?.({ ...p, pass: i + 1, passes: passes.length });
      await worker.setParameters({ tessedit_pageseg_mode: passes[i].psm });
      const { data } = await worker.recognize(passes[i].img, {}, { text: true, blocks: true });
      linesFromResult(data as unknown as OcrBlocks, 40).forEach((line) => {
        const key = normLine(line);
        if (key.length >= 2 && !seen.has(key)) {
          seen.add(key);
          lines.push(line);
        }
      });
    }
  } finally {
    progressHandler = null;
  }
  return lines.join('\n');
}

/** 워커를 미리 띄워 첫 인식 지연을 줄인다 (실패해도 조용히 무시) */
export function warmUpOcr() {
  void getWorker().catch(() => undefined);
}
