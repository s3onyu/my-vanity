/**
 * 한국어 조사 붙이기 — 받침 유무에 따라 을/를, 이/가, 은/는, 과/와 를 고른다.
 * 영문·숫자로 끝나면 발음을 알 수 없어 앞쪽(을/이/은/과)을 쓴다.
 */
export function josa(word: string, pair: '을/를' | '이/가' | '은/는' | '과/와'): string {
  const [withFinal, withoutFinal] = pair.split('/');
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  const isHangul = code >= 0xac00 && code <= 0xd7a3;
  if (!isHangul) {
    // 숫자는 발음 기준으로 처리
    const digitFinal: Record<string, boolean> = { '0': true, '1': true, '3': true, '6': true, '7': true, '8': true, '2': false, '4': false, '5': false, '9': false };
    if (last in digitFinal) return `${word}${digitFinal[last] ? withFinal : withoutFinal}`;
    return `${word}${withFinal}`;
  }
  const hasFinal = (code - 0xac00) % 28 !== 0;
  return `${word}${hasFinal ? withFinal : withoutFinal}`;
}
