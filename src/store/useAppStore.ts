import { useMemo } from 'react';
import { create } from 'zustand';
import type {
  BoardPost,
  ConcernId,
  IngredientCategory,
  MatchType,
  Product,
  Profile,
  ProductMatch,
  RoutineItem,
  RoutineType,
  SkinLog,
} from '@/types';
import { todayISO } from '@/lib/date';
import { uid } from '@/lib/id';
import { fallbackToLocal, repo } from './index';

export type Page = 'home' | 'products' | 'ingredients' | 'care' | 'diary';

export type Overlay =
  | { type: 'board' }
  | { type: 'post'; id: string }
  | { type: 'post-form' }
  | { type: 'tutorial'; id?: string }
  | { type: 'profile-edit' }
  | { type: 'care'; concernId: ConcernId }
  | { type: 'photo-search' };

export interface IngredientFilter {
  query?: string;
  category?: IngredientCategory | 'all';
}

export interface StorageStatus {
  kind: 'local' | 'supabase';
  /** 서버 연결 실패로 로컬 저장소로 내려앉았는지 */
  fallback: boolean;
  error: string | null;
  /** 마지막으로 복원(hydrate)한 시각 */
  restoredAt: string | null;
}

interface AppState {
  hydrated: boolean;
  storage: StorageStatus;
  profile: Profile | null;
  routines: RoutineItem[];
  logs: SkinLog[];
  matches: ProductMatch[];
  customProducts: Product[];
  posts: BoardPost[];

  // UI
  page: Page;
  activeRoutine: RoutineType;
  overlays: Overlay[];
  ingredientSheet: string | null;
  ingredientFilter: IngredientFilter | null;
  toast: string | null;

  // 데이터 액션
  hydrate: () => Promise<void>;
  saveProfile: (input: { skinType: Profile['skinType']; concerns: ConcernId[]; nickname?: string | null }) => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
  addToRoutine: (productId: string, routineType?: RoutineType) => Promise<'added' | 'exists'>;
  removeFromRoutine: (itemId: string) => Promise<void>;
  moveRoutineItem: (itemId: string, dir: -1 | 1) => Promise<void>;
  saveLog: (log: Omit<SkinLog, 'id' | 'products'> & { id?: string }) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  toggleMatch: (productId: string, matchType: MatchType) => Promise<'set' | 'unset'>;
  removeMatch: (id: string) => Promise<void>;
  addCustomProduct: (input: Omit<Product, 'id' | 'verified' | 'custom'>) => Promise<Product>;
  removeCustomProduct: (id: string) => Promise<void>;
  createPost: (input: Omit<BoardPost, 'id' | 'likes' | 'createdAt'>) => Promise<void>;
  likePost: (id: string) => Promise<void>;

  // UI 액션
  navigate: (page: Page) => void;
  setActiveRoutine: (t: RoutineType) => void;
  pushOverlay: (o: Overlay) => void;
  popOverlay: () => void;
  closeOverlays: () => void;
  openIngredient: (id: string) => void;
  closeIngredient: () => void;
  goToIngredients: (filter: IngredientFilter) => void;
  clearIngredientFilter: () => void;
  showToast: (msg: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

/** 아침/저녁 분리 이전에 저장된 기록을 현재 루틴 기준으로 나눠준다 */
function normalizeLog(l: SkinLog, routines: RoutineItem[]): SkinLog {
  if (Array.isArray(l.amProducts) && Array.isArray(l.pmProducts)) return l;
  const am = new Set(routines.filter((r) => r.routineType === 'AM').map((r) => r.productId));
  const products = l.products ?? [];
  return {
    ...l,
    amProducts: products.filter((p) => am.has(p)),
    pmProducts: products.filter((p) => !am.has(p)),
    products,
  };
}

/** 저장 실패를 조용히 삼키지 않고 토스트로 알린다 */
async function persist(task: Promise<void>, onError: (msg: string) => void) {
  try {
    await task;
  } catch (err) {
    onError(`저장에 실패했어요: ${(err as Error).message}`);
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  storage: { kind: repo.kind, fallback: false, error: null, restoredAt: null },
  profile: null,
  routines: [],
  logs: [],
  matches: [],
  customProducts: [],
  posts: [],

  page: 'home',
  activeRoutine: new Date().getHours() < 15 ? 'AM' : 'PM',
  overlays: [],
  ingredientSheet: null,
  ingredientFilter: null,
  toast: null,

  // ------------------------------------------------------------------ data
  /**
   * 재방문 시 저장된 프로필·루틴·기록·궁합 기록·직접 등록 제품·게시글을 불러와 화면을 복원한다 (8차시).
   * Supabase 연결에 실패하면 로컬 저장소로 내려앉아 앱이 멈추지 않게 한다.
   */
  async hydrate() {
    let error: string | null = null;
    let fallback = false;
    let data;
    let posts: BoardPost[] = [];
    try {
      [data, posts] = await Promise.all([repo.load(), repo.listPosts()]);
    } catch (err) {
      error = (err as Error).message;
      fallback = true;
      fallbackToLocal();
      [data, posts] = await Promise.all([repo.load(), repo.listPosts()]);
    }
    set({
      hydrated: true,
      storage: { kind: repo.kind, fallback, error, restoredAt: new Date().toISOString() },
      profile: data.profile,
      routines: [...data.routines].sort((a, b) => a.sortOrder - b.sortOrder),
      logs: data.logs.map((l) => normalizeLog(l, data.routines)).sort((a, b) => b.date.localeCompare(a.date)),
      matches: data.matches,
      customProducts: data.customProducts.map((p) => ({ ...p, custom: true })),
      posts,
    });
    if (error) get().showToast('서버에 연결하지 못해 이 기기에만 저장해요');
  },

  async saveProfile(input) {
    const prev = get().profile;
    const profile: Profile = {
      skinType: input.skinType,
      concerns: input.concerns,
      nickname: input.nickname === undefined ? (prev?.nickname ?? null) : input.nickname,
      createdAt: prev?.createdAt ?? new Date().toISOString(),
    };
    set({ profile });
    await persist(repo.saveProfile(profile), get().showToast);
  },

  async setNickname(nickname) {
    const prev = get().profile;
    const profile: Profile = prev
      ? { ...prev, nickname }
      : { skinType: null, concerns: [], nickname, createdAt: new Date().toISOString() };
    set({ profile });
    await persist(repo.saveProfile(profile), get().showToast);
  },

  async addToRoutine(productId, routineType = get().activeRoutine) {
    const { routines } = get();
    if (routines.some((r) => r.routineType === routineType && r.productId === productId)) return 'exists';
    const sameType = routines.filter((r) => r.routineType === routineType);
    const item: RoutineItem = {
      id: uid('rt'),
      routineType,
      productId,
      sortOrder: sameType.length ? Math.max(...sameType.map((r) => r.sortOrder)) + 1 : 0,
      startedAt: todayISO(),
    };
    set({ routines: [...routines, item] });
    await persist(repo.upsertRoutineItems([item]), get().showToast);
    return 'added';
  },

  async removeFromRoutine(itemId) {
    set({ routines: get().routines.filter((r) => r.id !== itemId) });
    await persist(repo.deleteRoutineItem(itemId), get().showToast);
  },

  async moveRoutineItem(itemId, dir) {
    const { routines } = get();
    const target = routines.find((r) => r.id === itemId);
    if (!target) return;
    const list = routines.filter((r) => r.routineType === target.routineType).sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((r) => r.id === itemId);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    const reordered = [...list];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    const updated = reordered.map((r, i) => ({ ...r, sortOrder: i }));
    const others = routines.filter((r) => r.routineType !== target.routineType);
    set({ routines: [...others, ...updated].sort((a, b) => a.sortOrder - b.sortOrder) });
    await persist(repo.upsertRoutineItems(updated), get().showToast);
  },

  async saveLog(input) {
    const { logs } = get();
    // 같은 날짜의 기록이 있으면 덮어쓴다
    const existing = input.id ? logs.find((l) => l.id === input.id) : logs.find((l) => l.date === input.date);
    const products = [...new Set([...input.amProducts, ...input.pmProducts])];
    const log: SkinLog = { ...input, products, id: existing?.id ?? input.id ?? uid('log') };
    set({ logs: [...logs.filter((l) => l.id !== log.id), log].sort((a, b) => b.date.localeCompare(a.date)) });
    await persist(repo.upsertLog(log), get().showToast);
  },

  async deleteLog(id) {
    set({ logs: get().logs.filter((l) => l.id !== id) });
    await persist(repo.deleteLog(id), get().showToast);
  },

  async toggleMatch(productId, matchType) {
    const { matches } = get();
    const existing = matches.find((m) => m.productId === productId);
    if (existing && existing.matchType === matchType) {
      set({ matches: matches.filter((m) => m.id !== existing.id) });
      await persist(repo.deleteMatch(existing.id), get().showToast);
      return 'unset';
    }
    const match: ProductMatch = {
      id: existing?.id ?? uid('mt'),
      productId,
      matchType,
      createdAt: new Date().toISOString(),
    };
    set({ matches: [...matches.filter((m) => m.productId !== productId), match] });
    await persist(repo.upsertMatch(match), get().showToast);
    return 'set';
  },

  async removeMatch(id) {
    set({ matches: get().matches.filter((m) => m.id !== id) });
    await persist(repo.deleteMatch(id), get().showToast);
  },

  async addCustomProduct(input) {
    const product: Product = { ...input, id: uid('cp'), verified: false, custom: true };
    set({ customProducts: [...get().customProducts, product] });
    await persist(repo.upsertCustomProduct(product), get().showToast);
    return product;
  },

  async removeCustomProduct(id) {
    const { routines, matches, customProducts } = get();
    const routineItems = routines.filter((r) => r.productId === id);
    const matchItems = matches.filter((m) => m.productId === id);
    set({
      customProducts: customProducts.filter((p) => p.id !== id),
      routines: routines.filter((r) => r.productId !== id),
      matches: matches.filter((m) => m.productId !== id),
    });
    await persist(
      Promise.all([
        repo.deleteCustomProduct(id),
        ...routineItems.map((r) => repo.deleteRoutineItem(r.id)),
        ...matchItems.map((m) => repo.deleteMatch(m.id)),
      ]).then(() => undefined),
      get().showToast,
    );
  },

  async createPost(input) {
    const post: BoardPost = { ...input, id: uid('post'), likes: 0, createdAt: new Date().toISOString() };
    set({ posts: [post, ...get().posts] });
    try {
      const saved = await repo.createPost(post);
      if (saved.id !== post.id) set({ posts: get().posts.map((p) => (p.id === post.id ? saved : p)) });
    } catch (err) {
      set({ posts: get().posts.filter((p) => p.id !== post.id) });
      get().showToast(`게시에 실패했어요: ${(err as Error).message}`);
      throw err;
    }
  },

  async likePost(id) {
    set({ posts: get().posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)) });
    try {
      const likes = await repo.likePost(id);
      set({ posts: get().posts.map((p) => (p.id === id ? { ...p, likes } : p)) });
    } catch (err) {
      get().showToast(`좋아요 저장에 실패했어요: ${(err as Error).message}`);
    }
  },

  // -------------------------------------------------------------------- ui
  navigate(page) {
    set({ page, overlays: [], ingredientSheet: null });
    window.scrollTo({ top: 0 });
  },
  setActiveRoutine(t) {
    set({ activeRoutine: t });
  },
  pushOverlay(o) {
    set({ overlays: [...get().overlays, o] });
  },
  popOverlay() {
    set({ overlays: get().overlays.slice(0, -1) });
  },
  closeOverlays() {
    set({ overlays: [] });
  },
  openIngredient(id) {
    set({ ingredientSheet: id });
  },
  closeIngredient() {
    set({ ingredientSheet: null });
  },
  goToIngredients(filter) {
    set({ page: 'ingredients', ingredientFilter: filter, overlays: [], ingredientSheet: null });
    window.scrollTo({ top: 0 });
  },
  clearIngredientFilter() {
    set({ ingredientFilter: null });
  },
  showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 2600);
  },
}));

// ---------------------------------------------------------------- selectors

/** 특정 루틴(AM/PM)의 제품을 순서대로 — 참조가 안정적이어야 하므로 useMemo 로 감싼다 */
export function useRoutine(type: RoutineType): RoutineItem[] {
  const routines = useAppStore((s) => s.routines);
  return useMemo(
    () => routines.filter((r) => r.routineType === type).sort((a, b) => a.sortOrder - b.sortOrder),
    [routines, type],
  );
}

export const selectMatchOf = (productId: string) => (s: AppState) =>
  s.matches.find((m) => m.productId === productId)?.matchType ?? null;
