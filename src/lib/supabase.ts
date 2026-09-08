import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** 환경변수가 모두 있을 때만 Supabase 모드로 동작한다. 없으면 localStorage 모드. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error('Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 없어요.');
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  }
  return client;
}

/**
 * 익명 로그인으로 기기별 user_id 를 확보한다.
 * 이미 세션이 있으면 그대로 쓰고, 없으면 새로 만든다 (Supabase 대시보드에서 Anonymous Sign-ins 활성화 필요).
 */
export async function ensureUserId(): Promise<string> {
  const sb = getSupabase();
  const { data } = await sb.auth.getSession();
  if (data.session?.user) return data.session.user.id;
  const { data: signed, error } = await sb.auth.signInAnonymously();
  if (error || !signed.user) throw new Error(`익명 로그인에 실패했어요: ${error?.message ?? 'unknown'}`);
  return signed.user.id;
}
