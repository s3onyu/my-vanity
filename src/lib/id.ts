/** 브라우저/노드 모두에서 동작하는 간단한 고유 id 생성기 */
export function uid(prefix = ''): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  const core =
    typeof g.crypto?.randomUUID === 'function'
      ? g.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${core}` : core;
}
