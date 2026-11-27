import type { ProductPrice, Profile } from '@/types';
import type { UserData } from './repository';

/**
 * 서버에 저장할 칸이 아직 없어서 올리지 못한 값의 임시 보관함.
 *
 * supabase/schema.sql 의 최신 구간(검사 코드 · 가격)을 실행하기 전 프로젝트에서는
 * profiles.skin_code 열과 user_product_prices 표가 없다. 예전에는 이때 값을 조용히
 * 버려서, 화면에는 저장된 것처럼 보이다가 새로고침하면 사라졌다.
 *
 * 이제는 못 올린 값을 이 기기에 보관해 두었다가(새로고침해도 남는다),
 * 서버에 칸이 생기면 다음 접속 때 자동으로 올리고 보관함을 비운다.
 */

/** profiles 표의 새 열에 들어가는 값 */
export interface PendingProfileExtra {
  skinCode: string | null;
  skinCodeAt: string | null;
  feedTopics: Profile['feedTopics'] | null;
}

export interface PendingData {
  profileExtra: PendingProfileExtra | null;
  /** 제품 id → 가격 */
  prices: Record<string, ProductPrice>;
}

/** 서버에 없는 저장 칸 — 화면 안내에 쓴다 */
export type MissingSchema = 'profile' | 'prices';

/** load() 가 함께 돌려주는 서버 저장 상태 */
export interface ServerSyncStatus {
  /** 서버에 아직 없는 칸 */
  missing: MissingSchema[];
  /** 이 기기에만 보관 중인 건수 */
  pending: number;
  /** 이번 접속에서 서버로 올린 건수 */
  uploaded: number;
}

/** localStorage 와 같은 모양 — 테스트에서 가짜로 바꿔 끼운다 */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const EMPTY_PENDING: PendingData = { profileExtra: null, prices: {} };

/** 계정마다 따로 보관한다 (로그인 계정을 바꿔도 섞이지 않게) */
export const pendingKey = (userId: string) => `my-vanity:pending:${userId}`;

export const pendingCount = (p: PendingData): number => (p.profileExtra ? 1 : 0) + Object.keys(p.prices).length;

export function readPending(kv: KeyValueStore, userId: string): PendingData {
  try {
    const raw = kv.getItem(pendingKey(userId));
    if (!raw) return { profileExtra: null, prices: {} };
    const parsed = JSON.parse(raw) as Partial<PendingData>;
    return { profileExtra: parsed.profileExtra ?? null, prices: parsed.prices ?? {} };
  } catch {
    // 저장소를 못 읽거나 값이 깨졌으면 빈 보관함으로 본다
    return { profileExtra: null, prices: {} };
  }
}

/** 비었으면 키 자체를 지운다 */
export function writePending(kv: KeyValueStore, userId: string, data: PendingData): void {
  try {
    if (pendingCount(data) === 0) kv.removeItem(pendingKey(userId));
    else kv.setItem(pendingKey(userId), JSON.stringify(data));
  } catch {
    // 사파리 개인정보 보호 모드 등 저장이 막힌 환경 — 보관만 못 할 뿐 앱은 계속 동작한다
  }
}

/**
 * 서버에서 읽어 온 값 위에 보관함의 값을 덮어 화면에 보여 줄 데이터를 만든다.
 * 보관함의 값이 더 나중에 사용자가 입력한 것이므로 보관함이 이긴다.
 */
export function mergePending(data: UserData, pending: PendingData): UserData {
  if (pendingCount(pending) === 0) return data;
  const pendingIds = new Set(Object.keys(pending.prices));
  return {
    ...data,
    profile:
      data.profile && pending.profileExtra
        ? {
            ...data.profile,
            skinCode: pending.profileExtra.skinCode,
            skinCodeAt: pending.profileExtra.skinCodeAt,
            feedTopics: pending.profileExtra.feedTopics,
          }
        : data.profile,
    prices: [...data.prices.filter((p) => !pendingIds.has(p.productId)), ...Object.values(pending.prices)],
  };
}

/**
 * 서버에 칸이 없어 이 기기에만 보관했다는 알림.
 * 실패가 아니라 "보관은 했지만 서버에는 아직" 이라서 일반 저장 오류와 구분한다.
 */
export class SavedOnDeviceOnly extends Error {
  readonly missing: MissingSchema;
  constructor(missing: MissingSchema) {
    super(
      missing === 'profile'
        ? '검사 결과를 서버에 저장할 칸이 아직 없어 이 기기에만 보관했어요'
        : '가격을 서버에 저장할 표가 아직 없어 이 기기에만 보관했어요',
    );
    this.name = 'SavedOnDeviceOnly';
    this.missing = missing;
  }
}

/** 이 기기의 저장소 — 못 쓰는 환경이면 아무것도 기억하지 않는 가짜를 돌려준다 */
export function deviceStore(): KeyValueStore {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // 접근 자체가 막힌 환경
  }
  return { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };
}

export interface UploadPlan {
  /** 지금 서버로 올릴 것 */
  profileExtra: PendingProfileExtra | null;
  prices: ProductPrice[];
  /** 서버에 칸이 없어 계속 보관할 것 */
  remaining: PendingData;
}

/**
 * 보관함의 값을 "지금 올릴 것 / 계속 보관할 것 / 버릴 것" 으로 가른다.
 * 서버에 같은 항목이 더 최신으로 들어 있으면(다른 기기에서 고친 경우) 서버 값을 따르고 보관분은 버린다.
 */
export function planUpload(data: UserData, pending: PendingData, has: { profile: boolean; prices: boolean }): UploadPlan {
  const plan: UploadPlan = { profileExtra: null, prices: [], remaining: { profileExtra: null, prices: {} } };

  const extra = pending.profileExtra;
  if (extra) {
    const serverAt = data.profile?.skinCodeAt ?? null;
    const stale = Boolean(serverAt && extra.skinCodeAt && serverAt > extra.skinCodeAt);
    // 프로필 행이 없으면 올릴 곳이 없으니 일단 계속 보관한다
    if (!has.profile || !data.profile) plan.remaining.profileExtra = extra;
    else if (!stale) plan.profileExtra = extra;
  }

  Object.values(pending.prices).forEach((price) => {
    if (!has.prices) {
      plan.remaining.prices[price.productId] = price;
      return;
    }
    const server = data.prices.find((p) => p.productId === price.productId);
    if (server && server.updatedAt >= price.updatedAt) return;
    plan.prices.push(price);
  });

  return plan;
}
