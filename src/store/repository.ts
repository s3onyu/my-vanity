import type { BoardPost, Product, Profile, ProductMatch, RoutineItem, SkinLog } from '@/types';

/** 한 사용자의 저장 데이터 묶음 */
export interface UserData {
  profile: Profile | null;
  routines: RoutineItem[];
  logs: SkinLog[];
  matches: ProductMatch[];
  /** 사용자가 직접 등록한 제품 (사진 등록 등) */
  customProducts: Product[];
  /** 제품 id → 내가 붙인 사진(data URL 또는 URL) */
  productPhotos: Record<string, string>;
  /** 제품 id → 다른 사용자가 공유한 사진 URL (서버 모드에서만 채워짐) */
  sharedProductPhotos: Record<string, string>;
}

export const EMPTY_USER_DATA: UserData = {
  profile: null,
  routines: [],
  logs: [],
  matches: [],
  customProducts: [],
  productPhotos: {},
  sharedProductPhotos: {},
};

/**
 * 저장소 추상화.
 * 1단계에서는 localStorage(+IndexedDB) 구현을, 이후 단계에서는 Supabase 구현을 같은 인터페이스로 갈아끼운다.
 * 스토어(useAppStore)는 이 인터페이스만 알고 있다.
 */
export interface Repository {
  readonly kind: 'local' | 'supabase';

  /** 재방문 시 저장된 사용자 데이터를 한 번에 불러온다 */
  load(): Promise<UserData>;

  saveProfile(profile: Profile): Promise<void>;

  upsertRoutineItems(items: RoutineItem[]): Promise<void>;
  deleteRoutineItem(id: string): Promise<void>;

  upsertLog(log: SkinLog): Promise<void>;
  deleteLog(id: string): Promise<void>;

  upsertMatch(match: ProductMatch): Promise<void>;
  deleteMatch(id: string): Promise<void>;

  upsertCustomProduct(product: Product): Promise<void>;
  deleteCustomProduct(id: string): Promise<void>;

  upsertProductPhoto(productId: string, imageUrl: string): Promise<void>;
  deleteProductPhoto(productId: string): Promise<void>;

  /** 내 제품 사진을 다른 사용자에게도 공개 — 공개 URL 을 돌려준다 (로컬 모드는 지원하지 않음) */
  shareProductPhoto(productId: string, imageUrl: string): Promise<string>;
  unshareProductPhoto(productId: string): Promise<void>;

  /** 커뮤니티 게시글 — 다른 사용자에게도 공개되는 공유 데이터 */
  listPosts(): Promise<BoardPost[]>;
  createPost(post: BoardPost): Promise<BoardPost>;
  likePost(id: string): Promise<number>;
}
