import { useMemo } from 'react';
import { create } from 'zustand';
import type {
  BoardPost,
  ConcernId,
  PostReport,
  ReportReason,
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
import { CATEGORY_STEP } from '@/engine/constants';
import { TERMS_VERSION } from '@/data/legal';
import { fallbackToLocal, repo } from './index';
import { findProduct } from './catalog';

export type Page = 'home' | 'products' | 'ingredients' | 'care' | 'diary';

export type Overlay =
  | { type: 'board'; query?: string }
  | { type: 'post'; id: string }
  | { type: 'post-form'; productName?: string }
  | { type: 'tutorial'; id?: string; mode?: 'illustration' | 'video'; categoryId?: string }
  | { type: 'profile-edit' }
  | { type: 'care'; concernId: ConcernId }
  | { type: 'photo-search'; registerOnly?: boolean }
  | { type: 'settings' }
  | { type: 'legal'; doc?: 'terms' | 'privacy' | 'rules' }
  | { type: 'report'; postId: string };

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
  productPhotos: Record<string, string>;
  /** 다른 사용자가 공유한 제품 사진 (서버 모드) */
  sharedPhotos: Record<string, string>;
  /** 내가 공유한 제품 id */
  mySharedPhotoIds: string[];
  posts: BoardPost[];
  /** 내가 신고한 게시글 (내 화면에서 숨김) */
  reports: PostReport[];
  /** 내가 차단한 작성자 닉네임 */
  blockedAuthors: string[];

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
  /** 권장 바르는 순서(카테고리 단계)대로 루틴을 정렬한다. 바뀐 게 없으면 false */
  sortRoutineByStep: (routineType: RoutineType) => Promise<boolean>;
  saveLog: (log: Omit<SkinLog, 'id'> & { id?: string }) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  toggleMatch: (productId: string, matchType: MatchType) => Promise<'set' | 'unset'>;
  removeMatch: (id: string) => Promise<void>;
  addCustomProduct: (input: Omit<Product, 'id' | 'verified' | 'custom'>) => Promise<Product>;
  removeCustomProduct: (id: string) => Promise<void>;
  setProductPhoto: (productId: string, imageUrl: string) => Promise<void>;
  removeProductPhoto: (productId: string) => Promise<void>;
  shareProductPhoto: (productId: string) => Promise<boolean>;
  unshareProductPhoto: (productId: string) => Promise<void>;
  createPost: (input: Omit<BoardPost, 'id' | 'likes' | 'createdAt'>) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  /** 내가 쓴 글 삭제 */
  deleteMyPost: (id: string) => Promise<void>;
  /** 게시글 신고 — 서버(운영자)에 접수하고 내 화면에서는 즉시 숨긴다 */
  reportPost: (postId: string, reason: ReportReason, detail: string) => Promise<void>;
  /** 작성자 차단 — 그 사람의 글이 내 화면에서 모두 사라진다 */
  blockAuthor: (nickname: string) => Promise<void>;
  unblockAuthor: (nickname: string) => Promise<void>;
  /** 커뮤니티 이용약관·개인정보 처리 동의 */
  agreeToTerms: () => Promise<void>;
  /** 내 모든 데이터 삭제 (계정 삭제) */
  deleteAllMyData: () => Promise<void>;

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

const sortLogs = (logs: SkinLog[]) => [...logs].sort((a, b) => b.date.localeCompare(a.date) || (a.period === 'PM' ? -1 : 1));

/** 아침/저녁 분리 이전에 저장된 기록을 시간대 기록으로 바꿔준다 */
function normalizeLogs(raw: SkinLog[]): SkinLog[] {
  const out: SkinLog[] = [];
  raw.forEach((l) => {
    const legacy = l as SkinLog & { amProducts?: string[]; pmProducts?: string[] };
    if (legacy.period === 'AM' || legacy.period === 'PM') {
      out.push({ ...l, products: l.products ?? [] });
      return;
    }
    const am = legacy.amProducts ?? [];
    const pm = legacy.pmProducts ?? legacy.products ?? [];
    if (am.length) out.push({ ...l, id: `${l.id}-am`, period: 'AM', products: am });
    out.push({ ...l, id: am.length ? `${l.id}-pm` : l.id, period: 'PM', products: pm });
  });
  return sortLogs(out);
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
  productPhotos: {},
  sharedPhotos: {},
  mySharedPhotoIds: [],
  posts: [],
  reports: [],
  blockedAuthors: [],

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
    const logs = normalizeLogs(data.logs);
    set({
      hydrated: true,
      storage: { kind: repo.kind, fallback, error, restoredAt: new Date().toISOString() },
      profile: data.profile,
      routines: [...data.routines].sort((a, b) => a.sortOrder - b.sortOrder),
      logs,
      matches: data.matches,
      customProducts: data.customProducts.map((p) => ({ ...p, custom: true })),
      productPhotos: data.productPhotos ?? {},
      sharedPhotos: data.sharedProductPhotos ?? {},
      posts,
      reports: data.reports ?? [],
      blockedAuthors: data.blockedAuthors ?? [],
    });
    if (error) get().showToast('서버에 연결하지 못해 이 기기에만 저장해요');

    // 아침/저녁 분리 이전 기록이 있으면 한 번만 저장소에도 옮겨 적는다 (다음 방문부터는 그대로 복원)
    const legacy = data.logs.filter((l) => l.period !== 'AM' && l.period !== 'PM');
    if (legacy.length) {
      const legacyIds = new Set(legacy.map((l) => l.id));
      await persist(
        Promise.all([
          ...logs.filter((l) => !legacyIds.has(l.id) || l.period).map((l) => repo.upsertLog(l)),
          ...legacy.filter((l) => !logs.some((m) => m.id === l.id)).map((l) => repo.deleteLog(l.id)),
        ]).then(() => undefined),
        get().showToast,
      );
    }
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

  async sortRoutineByStep(routineType) {
    const { routines } = get();
    const list = routines.filter((r) => r.routineType === routineType).sort((a, b) => a.sortOrder - b.sortOrder);
    const stepOf = (r: RoutineItem) => {
      const p = findProduct(r.productId);
      return p ? CATEGORY_STEP[p.category] : 99;
    };
    // 같은 단계끼리는 기존 순서 유지 (stable)
    const sorted = list.map((r, i) => ({ r, i })).sort((a, b) => stepOf(a.r) - stepOf(b.r) || a.i - b.i).map((x) => x.r);
    if (sorted.every((r, i) => r.id === list[i].id)) return false;
    const updated = sorted.map((r, i) => ({ ...r, sortOrder: i }));
    const others = routines.filter((r) => r.routineType !== routineType);
    set({ routines: [...others, ...updated].sort((a, b) => a.sortOrder - b.sortOrder) });
    await persist(repo.upsertRoutineItems(updated), get().showToast);
    return true;
  },

  async saveLog(input) {
    const { logs } = get();
    // 같은 날짜·시간대(아침/저녁)의 기록이 있으면 덮어쓴다
    const existing = input.id
      ? logs.find((l) => l.id === input.id)
      : logs.find((l) => l.date === input.date && l.period === input.period);
    const log: SkinLog = { ...input, products: [...new Set(input.products)], id: existing?.id ?? input.id ?? uid('log') };
    set({ logs: sortLogs([...logs.filter((l) => l.id !== log.id), log]) });
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

  async setProductPhoto(productId, imageUrl) {
    set({ productPhotos: { ...get().productPhotos, [productId]: imageUrl } });
    await persist(repo.upsertProductPhoto(productId, imageUrl), get().showToast);
  },

  async removeProductPhoto(productId) {
    const photos = { ...get().productPhotos };
    delete photos[productId];
    set({ productPhotos: photos });
    await persist(repo.deleteProductPhoto(productId), get().showToast);
  },

  async shareProductPhoto(productId) {
    const url = get().productPhotos[productId];
    if (!url) return false;
    try {
      const publicUrl = await repo.shareProductPhoto(productId, url);
      set({ sharedPhotos: { ...get().sharedPhotos, [productId]: publicUrl }, mySharedPhotoIds: [...new Set([...get().mySharedPhotoIds, productId])] });
      return true;
    } catch (err) {
      get().showToast((err as Error).message);
      return false;
    }
  },

  async unshareProductPhoto(productId) {
    const shared = { ...get().sharedPhotos };
    delete shared[productId];
    set({ sharedPhotos: shared, mySharedPhotoIds: get().mySharedPhotoIds.filter((id) => id !== productId) });
    await persist(repo.unshareProductPhoto(productId), get().showToast);
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

  async deleteMyPost(id) {
    set({ posts: get().posts.filter((p) => p.id !== id) });
    await persist(repo.deletePost(id), get().showToast);
  },

  async reportPost(postId, reason, detail) {
    try {
      const report = await repo.reportPost(postId, reason, detail);
      set({ reports: [...get().reports.filter((r) => r.postId !== postId), report] });
      get().showToast('신고를 접수했어요. 이 글은 내 화면에서 숨겨져요');
    } catch (err) {
      get().showToast('신고 접수에 실패했어요: ' + (err as Error).message);
    }
  },

  async blockAuthor(nickname) {
    if (!get().blockedAuthors.includes(nickname)) set({ blockedAuthors: [...get().blockedAuthors, nickname] });
    await persist(repo.blockAuthor(nickname), get().showToast);
    get().showToast(nickname + ' 님의 글을 더 이상 보지 않아요');
  },

  async unblockAuthor(nickname) {
    set({ blockedAuthors: get().blockedAuthors.filter((n) => n !== nickname) });
    await persist(repo.unblockAuthor(nickname), get().showToast);
  },

  async agreeToTerms() {
    const prev = get().profile;
    const profile: Profile = {
      skinType: prev?.skinType ?? null,
      concerns: prev?.concerns ?? [],
      nickname: prev?.nickname ?? null,
      createdAt: prev?.createdAt ?? new Date().toISOString(),
      agreedAt: new Date().toISOString(),
      agreedVersion: TERMS_VERSION,
    };
    set({ profile });
    await persist(repo.saveProfile(profile), get().showToast);
  },

  async deleteAllMyData() {
    await repo.deleteAllData();
    set({
      profile: null,
      routines: [],
      logs: [],
      matches: [],
      customProducts: [],
      productPhotos: {},
      sharedPhotos: {},
      mySharedPhotoIds: [],
      reports: [],
      blockedAuthors: [],
      overlays: [],
      page: 'home',
    });
    // 남은 게시글 목록은 서버에서 다시 읽는다 (내 글은 지워진 상태)
    try {
      set({ posts: await repo.listPosts() });
    } catch {
      set({ posts: [] });
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

/** 신고했거나 차단한 작성자의 글을 뺀 게시글 목록 */
export function useVisiblePosts(): BoardPost[] {
  const posts = useAppStore((s) => s.posts);
  const reports = useAppStore((s) => s.reports);
  const blocked = useAppStore((s) => s.blockedAuthors);
  return useMemo(() => {
    const hidden = new Set(reports.map((r) => r.postId));
    const blockedSet = new Set(blocked);
    return posts.filter((p) => !hidden.has(p.id) && !blockedSet.has(p.authorNickname));
  }, [posts, reports, blocked]);
}

/** 커뮤니티 이용약관에 (현재 버전으로) 동의했는지 */
export function useHasAgreed(): boolean {
  return useAppStore((s) => Boolean(s.profile?.agreedAt) && s.profile?.agreedVersion === TERMS_VERSION);
}

export const selectMatchOf = (productId: string) => (s: AppState) =>
  s.matches.find((m) => m.productId === productId)?.matchType ?? null;
