/**
 * 한글 검색 보조 — 초성 검색과 토큰 분해.
 *
 * 검색이 안 된다는 이야기가 가장 많았던 두 경우를 여기서 해결한다.
 *  1) "ㅈㄹㅇㄷ" 처럼 초성만 치는 경우
 *  2) "제로이드 크림" 처럼 가운데 단어를 빼고 치는 경우 (토큰 분해 → 모두 포함하면 통과)
 */

/** 초성 19자 — 유니코드 한글 음절 계산식의 순서 그대로 */
const CHOSUNG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';

const SYLLABLE_BASE = 0xac00;
const SYLLABLE_LAST = 0xd7a3;
/** 한 초성이 담당하는 음절 수 (중성 21 × 종성 28) */
const PER_CHOSUNG = 588;

/** 호환 자모 영역의 자음 (ㄱ~ㅎ) — 초성만 입력했는지 판단할 때 쓴다 */
const JAMO_CONSONANTS = new Set([...'ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ']);

/** 한글 음절을 초성으로 바꾼다. 한글이 아닌 문자는 그대로 둔다 ("코스알엑스3" → "ㅋㅅㅇㅇㅅ3") */
export function toChosung(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= SYLLABLE_BASE && code <= SYLLABLE_LAST) {
      out += CHOSUNG[Math.floor((code - SYLLABLE_BASE) / PER_CHOSUNG)];
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * 입력이 초성 검색인지 — 자음 자모만 들어 있고 완성된 한글 음절이 없을 때.
 * "ㅈㄹㅇㄷ" 는 true, "제로이드" 나 "ㄱ크림" 은 false.
 */
export function isChosungQuery(raw: string): boolean {
  const q = raw.replace(/\s+/g, '');
  if (q.length < 2) return false;
  let consonants = 0;
  for (const ch of q) {
    if (JAMO_CONSONANTS.has(ch)) {
      consonants += 1;
      continue;
    }
    // 완성 음절이나 모음, 영문·숫자가 섞이면 초성 검색이 아니다
    return false;
  }
  return consonants >= 2;
}

/** 검색어를 공백 기준으로 쪼갠다 — 빈 조각과 한 글자 기호는 버린다 */
export function searchTokens(raw: string): string[] {
  return raw
    .trim()
    .split(/[\s,·/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
