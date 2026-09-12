import type { BoardPost, Product, Profile, ProductMatch, RoutineItem, SkinLog } from '@/types';
import { deletePhoto, getPhoto, isPhotoStoreAvailable, listPhotos, putPhoto } from '@/lib/photoStore';
import { EMPTY_USER_DATA, type Repository, type UserData } from './repository';

const USER_KEY = 'my-vanity:user:v1';
const POSTS_KEY = 'my-vanity:posts:v1';
const PRODUCT_PHOTO_PREFIX = 'product:';
const LOG_PHOTO_PREFIX = 'log:';

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
 * 사진(data URL)은 용량이 커서 IndexedDB 에 따로 두고, JSON 에는 넣지 않는다.
 * 모든 메서드는 Promise 를 돌려줘서 Supabase 구현과 호출부가 동일하다.
 */
export function createLocalRepository(seedPosts: BoardPost[] = []): Repository {
  const idb = isPhotoStoreAvailable();
  const readUser = (): UserData => read<UserData>(USER_KEY, EMPTY_USER_DATA);
  const writeUser = (patch: Partial<UserData>) => write(USER_KEY, { ...readUser(), ...patch });

  const readStoredPosts = (): BoardPost[] => read<{ posts: BoardPost[] }>(POSTS_KEY, { posts: [] }).posts;
  const readPosts = (): BoardPost[] => {
    const stored = readStoredPosts();
    const ids = new Set(stored.map((p) => p.id));
    return [...stored, ...seedPosts.filter((s) => !ids.has(s.id))];
  };
  const writePosts = (posts: BoardPost[]) => write(POSTS_KEY, { posts });

  /** 사진 저장 — IndexedDB 우선, 안 되면 JSON 안에 (작은 사진만) */
  const savePhoto = async (key: string, dataUrl: string, fallback: () => void) => {
    if (idb) {
      try {
        await putPhoto(key, dataUrl);
        return;
      } catch {
        /* IDB 실패 → 아래 폴백 */
      }
    }
    fallback();
  };

  return {
    kind: 'local',

    async load() {
      const user = readUser();
      // 사진은 IDB 에서 합친다. 예전 버전이 JSON 에 넣어 둔 제품 사진은 IDB 로 옮긴다.
      let productPhotos = { ...user.productPhotos };
      let logs = user.logs;
      if (idb) {
        try {
          const legacy = Object.entries(user.productPhotos).filter(([, v]) => v.startsWith('data:'));
          await Promise.all(legacy.map(([id, url]) => putPhoto(PRODUCT_PHOTO_PREFIX + id, url)));
          if (legacy.length) writeUser({ productPhotos: {} });
          productPhotos = { ...(await listPhotos(PRODUCT_PHOTO_PREFIX)) };
          const logPhotos = await listPhotos(LOG_PHOTO_PREFIX);
          logs = user.logs.map((l) => (logPhotos[l.id] ? { ...l, photoUrl: logPhotos[l.id] } : l));
        } catch {
          /* IDB 를 못 읽으면 JSON 값 그대로 */
        }
      }
      return { ...user, productPhotos, logs, sharedProductPhotos: {} };
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
      const { photoUrl, ...rest } = log;
      const slim: SkinLog = { ...rest, photoUrl: null };
      if (photoUrl) {
        await savePhoto(LOG_PHOTO_PREFIX + log.id, photoUrl, () => {
          slim.photoUrl = photoUrl;
        });
      } else if (idb) {
        await deletePhoto(LOG_PHOTO_PREFIX + log.id).catch(() => undefined);
      }
      writeUser({ logs: [...readUser().logs.filter((l) => l.id !== log.id), slim] });
    },

    async deleteLog(id: string) {
      writeUser({ logs: readUser().logs.filter((l) => l.id !== id) });
      if (idb) await deletePhoto(LOG_PHOTO_PREFIX + id).catch(() => undefined);
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
      await savePhoto(PRODUCT_PHOTO_PREFIX + productId, imageUrl, () => {
        writeUser({ productPhotos: { ...readUser().productPhotos, [productId]: imageUrl } });
      });
    },

    async deleteProductPhoto(productId: string) {
      const photos = { ...readUser().productPhotos };
      delete photos[productId];
      writeUser({ productPhotos: photos });
      if (idb) await deletePhoto(PRODUCT_PHOTO_PREFIX + productId).catch(() => undefined);
    },

    async shareProductPhoto() {
      throw new Error('사진 공유는 서버(Supabase)에 연결됐을 때만 할 수 있어요.');
    },

    async unshareProductPhoto() {
      /* 로컬 모드에는 공유된 사진이 없다 */
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

/** 저장된 사진 하나를 직접 읽을 때 (미리보기 등) */
export const readLocalPhoto = (key: string) => getPhoto(key);
