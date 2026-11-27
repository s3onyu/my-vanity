import { describe, expect, it } from 'vitest';
import type { ProductPrice, Profile } from '@/types';
import { EMPTY_USER_DATA, type UserData } from './repository';
import { type KeyValueStore, type PendingData, mergePending, pendingCount, pendingKey, planUpload, readPending, writePending } from './pendingSync';

const memory = (): KeyValueStore & { map: Map<string, string> } => {
  const map = new Map<string, string>();
  return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) };
};

const price = (productId: string, won: number, updatedAt = '2026-11-19T10:00:00.000Z'): ProductPrice => ({ productId, price: won, updatedAt });
const profile: Profile = { skinType: 'dry', concerns: [], nickname: null, createdAt: '2026-01-01T00:00:00.000Z' };
const data = (over: Partial<UserData> = {}): UserData => ({ ...EMPTY_USER_DATA, profile, ...over });
const extra = (code: string, at = '2026-11-19T10:00:00.000Z') => ({ skinCode: code, skinCodeAt: at, feedTopics: null });

describe('보관함 읽기·쓰기', () => {
  it('쓴 값을 그대로 다시 읽는다 (새로고침해도 남는다)', () => {
    const kv = memory();
    const pending: PendingData = { profileExtra: extra('DSPW'), prices: { p1: price('p1', 18000) } };
    writePending(kv, 'u1', pending);
    expect(readPending(kv, 'u1')).toEqual(pending);
  });

  it('계정마다 따로 보관한다', () => {
    const kv = memory();
    writePending(kv, 'u1', { profileExtra: extra('DSPW'), prices: {} });
    expect(pendingCount(readPending(kv, 'u2'))).toBe(0);
  });

  it('비면 키 자체를 지운다', () => {
    const kv = memory();
    writePending(kv, 'u1', { profileExtra: extra('DSPW'), prices: {} });
    writePending(kv, 'u1', { profileExtra: null, prices: {} });
    expect(kv.map.has(pendingKey('u1'))).toBe(false);
  });

  it('값이 깨져 있으면 빈 보관함으로 본다', () => {
    const kv = memory();
    kv.setItem(pendingKey('u1'), '{깨진 값');
    expect(readPending(kv, 'u1')).toEqual({ profileExtra: null, prices: {} });
  });
});

describe('mergePending — 화면에 보여 줄 값', () => {
  it('보관해 둔 검사 코드와 가격을 서버 값 위에 얹는다', () => {
    const out = mergePending(data(), { profileExtra: extra('OSNT'), prices: { p1: price('p1', 9900) } });
    expect(out.profile?.skinCode).toBe('OSNT');
    expect(out.prices).toEqual([price('p1', 9900)]);
  });

  it('같은 제품은 보관분이 이긴다', () => {
    const out = mergePending(data({ prices: [price('p1', 1000), price('p2', 2000)] }), { profileExtra: null, prices: { p1: price('p1', 1500) } });
    expect(out.prices.find((p) => p.productId === 'p1')?.price).toBe(1500);
    expect(out.prices.find((p) => p.productId === 'p2')?.price).toBe(2000);
  });

  it('보관함이 비면 아무것도 바꾸지 않는다', () => {
    const d = data({ prices: [price('p1', 1000)] });
    expect(mergePending(d, { profileExtra: null, prices: {} })).toBe(d);
  });
});

describe('planUpload — 올릴 것과 계속 보관할 것', () => {
  const pending: PendingData = { profileExtra: extra('DSPW'), prices: { p1: price('p1', 18000) } };

  it('서버에 칸이 없으면 전부 계속 보관한다', () => {
    const plan = planUpload(data(), pending, { profile: false, prices: false });
    expect(plan.profileExtra).toBeNull();
    expect(plan.prices).toEqual([]);
    expect(plan.remaining).toEqual(pending);
  });

  it('서버에 칸이 생기면 전부 올린다', () => {
    const plan = planUpload(data(), pending, { profile: true, prices: true });
    expect(plan.profileExtra?.skinCode).toBe('DSPW');
    expect(plan.prices).toEqual([price('p1', 18000)]);
    expect(pendingCount(plan.remaining)).toBe(0);
  });

  it('한쪽 칸만 생기면 그쪽만 올린다', () => {
    const plan = planUpload(data(), pending, { profile: true, prices: false });
    expect(plan.profileExtra?.skinCode).toBe('DSPW');
    expect(plan.prices).toEqual([]);
    expect(Object.keys(plan.remaining.prices)).toEqual(['p1']);
  });

  it('서버 값이 더 최신이면(다른 기기에서 고침) 보관분을 버린다', () => {
    const server = data({
      profile: { ...profile, skinCode: 'ORNW', skinCodeAt: '2026-11-20T00:00:00.000Z' },
      prices: [price('p1', 20000, '2026-11-20T00:00:00.000Z')],
    });
    const plan = planUpload(server, pending, { profile: true, prices: true });
    expect(plan.profileExtra).toBeNull();
    expect(plan.prices).toEqual([]);
    expect(pendingCount(plan.remaining)).toBe(0);
  });

  it('프로필 행이 아직 없으면 검사 코드는 계속 보관한다', () => {
    const plan = planUpload(data({ profile: null }), pending, { profile: true, prices: true });
    expect(plan.profileExtra).toBeNull();
    expect(plan.remaining.profileExtra?.skinCode).toBe('DSPW');
  });
});
