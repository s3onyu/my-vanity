export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/** Date → 'YYYY-MM-DD' (로컬 시간 기준) */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** a 부터 b 까지 며칠 차이인지 (b - a, 정수) */
export function daysBetween(a: string, b: string): number {
  const ms = parseISODate(b).getTime() - parseISODate(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** 사용 시작일 기준 "사용 N일째" 의 N (시작일 = 1일째) */
export function usageDay(startedAt: string, today = todayISO()): number {
  return Math.max(1, daysBetween(startedAt, today) + 1);
}

/** '2026-09-08' → '9월 8일 (월)' */
export function formatKoDate(iso: string, withDay = true): string {
  const d = parseISODate(iso);
  const base = `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return withDay ? `${base} (${DAY_NAMES[d.getDay()]})` : base;
}

export function dayOfWeek(iso: string): number {
  return parseISODate(iso).getDay();
}

/** ISO datetime → '방금 전', '3시간 전', '5일 전', 'YYYY.MM.DD' */
export function relativeTime(isoDateTime: string, now = Date.now()): string {
  const t = new Date(isoDateTime).getTime();
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const d = new Date(t);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
