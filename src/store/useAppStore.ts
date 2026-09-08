import { create } from 'zustand';
import type {
  BoardPost,
  ConcernId,
  IngredientCategory,
  MatchType,
  Profile,
  ProductMatch,
  RoutineItem,
  RoutineType,
  SkinLog,
} from '@/types';
import { todayISO } from '@/lib/date';
import { uid } from '@/lib/id';
import { repo } from './index';

export type Page = 'home' | 'products' | 'ingredients' | 'care' | 'diary';

export type Overlay =
  | { type: 'board' }
  | { type: 'post'; id: string }
  | { type: 'post-form' }
  | { type: 'tutorial'; id?: string }
  | { type: 'profile-edit' }
  | { type: 'care'; concernId: ConcernId };

export interface IngredientFilter {
  query?: string;
  category?: IngredientCategory | 'all';
}

interface AppState {
  hydrated: boolean;
  profile: Profile | null;
  routines: RoutineItem[];
  logs: SkinLog[];
  matches: ProductMatch[];
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
  saveLog: (log: Omit<SkinLog, 'id'> & { id?: string }) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  toggleMatch: (productId: string, matchType: MatchType) => Promise<'set' | 'unset'>;
  removeMatch: (id: string) => Promise<void>;
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

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  profile: null,
  routines: [],
  logs: [],
  matches: [],
  posts: [],

  page: 'home',
  activeRoutine: new Date().getHours() < 15 ? 'AM' : 'PM',
  overlays: [],
  ingredientSheet: null,
  ingredientFilter: null,
  toast: null,

  // ------------------------------------------------------------------ data
  async hydrate() {
    const [data, posts] = await Promise.all([repo.load(), repo.listPosts()]);
    set({
      hydrated: true,
      profile: data.profile,
      routines: [...data.routines].sort((a, b) => a.sortOrder - b.sortOrder),
      logs: [...data.logs].sort((a, b) => b.date.localeCompare(a.date)),
      matches: data.matches,
      posts,
    });
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
    await repo.saveProfile(profile);
  },

  async setNickname(nickname) {
    const prev = get().profile;
    const profile: Profile = prev
      ? { ...prev, nickname }
      : { skinType: null, concerns: [], nickname, createdAt: new Date().toISOString() };
    set({ profile });
    await repo.saveProfile(profile);
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
    await repo.upsertRoutineItems([item]);
    return 'added';
  },

  async removeFromRoutine(itemId) {
    set({ routines: get().routines.filter((r) => r.id !== itemId) });
    await repo.deleteRoutineItem(itemId);
  },

  async moveRoutineItem(itemId, dir) {
    const { routines } = get();
    const target = routines.find((r) => r.id === itemId);
    if (!target) return;
    const list = routines
      .filter((r) => r.routineType === target.routineType)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((r) => r.id === itemId);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    const reordered = [...list];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    const updated = reordered.map((r, i) => ({ ...r, sortOrder: i }));
    const others = routines.filter((r) => r.routineType !== target.routineType);
    set({ routines: [...others, ...updated].sort((a, b) => a.sortOrder - b.sortOrder) });
    await repo.upsertRoutineItems(updated);
  },

  async saveLog(input) {
    const { logs } = get();
    // 같은 날짜의 기록이 있으면 덮어쓴다
    const existing = input.id ? logs.find((l) => l.id === input.id) : logs.find((l) => l.date === input.date);
    const log: SkinLog = { ...input, id: existing?.id ?? input.id ?? uid('log') };
    const next = [...logs.filter((l) => l.id !== log.id), log].sort((a, b) => b.date.localeCompare(a.date));
    set({ logs: next });
    await repo.upsertLog(log);
  },

  async deleteLog(id) {
    set({ logs: get().logs.filter((l) => l.id !== id) });
    await repo.deleteLog(id);
  },

  async toggleMatch(productId, matchType) {
    const { matches } = get();
    const existing = matches.find((m) => m.productId === productId);
    if (existing && existing.matchType === matchType) {
      set({ matches: matches.filter((m) => m.id !== existing.id) });
      await repo.deleteMatch(existing.id);
      return 'unset';
    }
    const match: ProductMatch = {
      id: existing?.id ?? uid('mt'),
      productId,
      matchType,
      createdAt: new Date().toISOString(),
    };
    set({ matches: [...matches.filter((m) => m.productId !== productId), match] });
    await repo.upsertMatch(match);
    return 'set';
  },

  async removeMatch(id) {
    set({ matches: get().matches.filter((m) => m.id !== id) });
    await repo.deleteMatch(id);
  },

  async createPost(input) {
    const post: BoardPost = { ...input, id: uid('post'), likes: 0, createdAt: new Date().toISOString() };
    set({ posts: [post, ...get().posts] });
    const saved = await repo.createPost(post);
    if (saved.id !== post.id) {
      set({ posts: get().posts.map((p) => (p.id === post.id ? saved : p)) });
    }
  },

  async likePost(id) {
    set({ posts: get().posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)) });
    const likes = await repo.likePost(id);
    set({ posts: get().posts.map((p) => (p.id === id ? { ...p, likes } : p)) });
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
    toastTimer = setTimeout(() => set({ toast: null }), 2200);
  },
}));

// ---------------------------------------------------------------- selectors

export const selectRoutine = (type: RoutineType) => (s: AppState) =>
  s.routines.filter((r) => r.routineType === type).sort((a, b) => a.sortOrder - b.sortOrder);

export const selectMatchOf = (productId: string) => (s: AppState) =>
  s.matches.find((m) => m.productId === productId)?.matchType ?? null;
