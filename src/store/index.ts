import { createLocalRepository } from './localRepository';
import type { Repository } from './repository';
import { BOARD_SEED } from '@/data/boardSeed';

/**
 * 앱이 사용하는 단일 저장소 인스턴스.
 * 6~7차시에서 환경변수(VITE_SUPABASE_URL)가 있으면 Supabase 구현으로 교체한다.
 */
export const repo: Repository = createLocalRepository(BOARD_SEED);
