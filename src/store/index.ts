import { BOARD_SEED } from '@/data/boardSeed';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createLocalRepository } from './localRepository';
import { createSupabaseRepository } from './supabaseRepository';
import type { Repository } from './repository';

/**
 * 앱이 사용하는 저장소.
 * - VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 있으면 Supabase (7차시)
 * - 없으면 localStorage (1~5차시와 동일)
 * 서버 연결에 실패하면 hydrate 단계에서 로컬 저장소로 내려앉는다 (8차시).
 */
export const repoRef: { current: Repository } = {
  current: isSupabaseConfigured ? createSupabaseRepository() : createLocalRepository(BOARD_SEED),
};

export function fallbackToLocal(): Repository {
  repoRef.current = createLocalRepository(BOARD_SEED);
  return repoRef.current;
}

/** 스토어에서 쓰는 얇은 프록시 — 항상 현재 저장소로 위임한다 */
export const repo: Repository = {
  get kind() {
    return repoRef.current.kind;
  },
  load: () => repoRef.current.load(),
  saveProfile: (p) => repoRef.current.saveProfile(p),
  upsertRoutineItems: (items) => repoRef.current.upsertRoutineItems(items),
  deleteRoutineItem: (id) => repoRef.current.deleteRoutineItem(id),
  upsertLog: (log) => repoRef.current.upsertLog(log),
  deleteLog: (id) => repoRef.current.deleteLog(id),
  upsertMatch: (m) => repoRef.current.upsertMatch(m),
  deleteMatch: (id) => repoRef.current.deleteMatch(id),
  upsertCustomProduct: (p) => repoRef.current.upsertCustomProduct(p),
  deleteCustomProduct: (id) => repoRef.current.deleteCustomProduct(id),
  upsertProductPhoto: (productId, url) => repoRef.current.upsertProductPhoto(productId, url),
  deleteProductPhoto: (productId) => repoRef.current.deleteProductPhoto(productId),
  listPosts: () => repoRef.current.listPosts(),
  createPost: (post) => repoRef.current.createPost(post),
  likePost: (id) => repoRef.current.likePost(id),
};
