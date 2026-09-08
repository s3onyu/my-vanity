import type { BoardPost, Product, Profile, ProductMatch, RoutineItem, SkinLog } from '@/types';
import { EMPTY_USER_DATA, type Repository, type UserData } from './repository';

const USER_KEY = 'my-vanity:user:v1';
const POSTS_KEY = 'my-vanity:posts:v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 공간 부족 등은 조용히 무시 — 화면 상태는 유지됨 */
  }
}

/**
 * localStorage 기반 저장소 (1~5차시, 그리고 서버 연결 실패 시 폴백).
 * 모든 메서드는 Promise 를 돌려줘서 Supabase 구현과 호출부가 동일하다.
 */
export function createLocalRepository(seedPosts: BoardPost[] = []): Repository {
  const readUser = (): UserData => read<UserData>(USER_KEY, EMPTY_USER_DATA);
  const writeUser = (patch: Partial<UserData>) => write(USER_KEY, { ...readUser(), ...patch });

  const readStoredPosts = (): BoardPost[] => read<{ posts: BoardPost[] }>(POSTS_KEY, { posts: [] }).posts;
  const readPosts = (): BoardPost[] => {
    const stored = readStoredPosts();
    const ids = new Set(stored.map((p) => p.id));
    return [...stored, ...seedPosts.filter((s) => !ids.has(s.id))];
  };
  const writePosts = (posts: BoardPost[]) => write(POSTS_KEY, { posts });

  return {
    kind: 'local',

    async load() {
      return readUser();
    },

    async saveProfile(profile: Profile) {
      writeUser({ profile });
    },

    async upsertRoutineItems(items: RoutineItem[]) {
      const map = new Map(readUser().routines.map((r) => [r.id, r]));
      items.forEach((it) => map.set(it.id, it));
      writeUser({ routines: [...map.values()] });
    },

    async deleteRoutineItem(id: string) {
      writeUser({ routines: readUser().routines.filter((r) => r.id !== id) });
    },

    async upsertLog(log: SkinLog) {
      writeUser({ logs: [...readUser().logs.filter((l) => l.id !== log.id), log] });
    },

    async deleteLog(id: string) {
      writeUser({ logs: readUser().logs.filter((l) => l.id !== id) });
    },

    async upsertMatch(match: ProductMatch) {
      writeUser({ matches: [...readUser().matches.filter((m) => m.id !== match.id), match] });
    },

    async deleteMatch(id: string) {
      writeUser({ matches: readUser().matches.filter((m) => m.id !== id) });
    },

    async upsertCustomProduct(product: Product) {
      writeUser({ customProducts: [...readUser().customProducts.filter((p) => p.id !== product.id), product] });
    },

    async deleteCustomProduct(id: string) {
      writeUser({ customProducts: readUser().customProducts.filter((p) => p.id !== id) });
    },

    async upsertProductPhoto(productId: string, imageUrl: string) {
      writeUser({ productPhotos: { ...readUser().productPhotos, [productId]: imageUrl } });
    },

    async deleteProductPhoto(productId: string) {
      const photos = { ...readUser().productPhotos };
      delete photos[productId];
      writeUser({ productPhotos: photos });
    },

    async listPosts() {
      return readPosts().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async createPost(post: BoardPost) {
      writePosts([post, ...readStoredPosts()]);
      return post;
    },

    async likePost(id: string) {
      const target = readPosts().find((p) => p.id === id);
      if (!target) return 0;
      const updated = { ...target, likes: target.likes + 1 };
      // 시드 게시글에 좋아요를 누르면 로컬 사본으로 승격해서 저장
      writePosts([updated, ...readStoredPosts().filter((p) => p.id !== id)]);
      return updated.likes;
    },
  };
}
