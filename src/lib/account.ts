import { getSupabase, isSupabaseConfigured } from './supabase';

/**
 * 계정 (요청 9번).
 *
 * 지금까지는 익명 로그인만 써서, 브라우저를 지우거나 다른 기기로 옮기면 내 화장대를 못 찾았다.
 * 여기서는 그 익명 계정에 이메일·비밀번호를 붙여(승격) 영구 계정으로 바꾼다.
 * 익명 계정의 user_id 가 그대로 유지되므로 기존 루틴·기록·사진이 전부 남는다.
 *
 * 비밀번호는 Supabase Auth 가 해시해서 보관하고, 이 앱은 입력값을 저장하거나 로그에 남기지 않는다.
 */

export type AccountKind = 'none' | 'anonymous' | 'email';

export interface AccountInfo {
  kind: AccountKind;
  email: string | null;
  /** 이메일 인증을 마쳤는지 */
  emailConfirmed: boolean;
  userId: string | null;
}

export const EMPTY_ACCOUNT: AccountInfo = { kind: 'none', email: null, emailConfirmed: false, userId: null };

export const PASSWORD_MIN = 8;

/** 서버 모드가 아니면 계정 기능을 쓸 수 없다 */
export const isAccountAvailable = () => isSupabaseConfigured;

function assertAvailable() {
  if (!isSupabaseConfigured) {
    throw new Error('계정 기능은 서버(Supabase)에 연결됐을 때만 쓸 수 있어요. 지금은 이 기기에만 저장돼요.');
  }
}

/** 지금 로그인 상태 */
export async function readAccount(): Promise<AccountInfo> {
  if (!isSupabaseConfigured) return EMPTY_ACCOUNT;
  const { data } = await getSupabase().auth.getSession();
  const user = data.session?.user;
  if (!user) return EMPTY_ACCOUNT;
  const email = user.email ?? null;
  return {
    kind: email ? 'email' : 'anonymous',
    email,
    emailConfirmed: Boolean(user.email_confirmed_at),
    userId: user.id,
  };
}

export interface PasswordCheck {
  ok: boolean;
  /** 0~4 */
  strength: number;
  label: string;
  problems: string[];
}

/** 비밀번호 세기 검사 — 화면에서 바로 보여준다 (서버로 보내지 않는다) */
export function checkPassword(pw: string): PasswordCheck {
  const problems: string[] = [];
  if (pw.length < PASSWORD_MIN) problems.push(`${PASSWORD_MIN}자 이상`);
  if (!/[a-zA-Z]/.test(pw)) problems.push('영문 포함');
  if (!/[0-9]/.test(pw)) problems.push('숫자 포함');
  const bonus = /[^a-zA-Z0-9]/.test(pw) ? 1 : 0;
  const long = pw.length >= 12 ? 1 : 0;
  const strength = Math.max(0, Math.min(4, 3 - problems.length + bonus + long));
  const label = ['아주 약함', '약함', '보통', '강함', '아주 강함'][strength];
  return { ok: problems.length === 0, strength, label, problems };
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered')) return '이미 가입된 이메일이에요. 로그인해 주세요.';
  if (m.includes('invalid login credentials')) return '이메일이나 비밀번호가 맞지 않아요.';
  if (m.includes('email not confirmed')) return '메일로 받은 링크를 눌러 이메일 인증을 먼저 끝내주세요.';
  if (m.includes('password')) return '비밀번호 조건을 확인해 주세요 (8자 이상, 영문+숫자).';
  if (m.includes('rate limit') || m.includes('too many')) return '시도가 너무 잦아요. 잠시 뒤에 다시 해주세요.';
  if (m.includes('anonymous')) return '익명 로그인 설정을 확인해 주세요.';
  return message;
}

/**
 * 지금 쓰고 있는 익명 계정에 이메일·비밀번호를 붙인다 (회원가입).
 * 이미 이메일 계정이면 거절한다. Supabase 설정에 따라 확인 메일이 갈 수 있다.
 */
export async function upgradeToEmail(email: string, password: string): Promise<{ needsConfirmation: boolean }> {
  assertAvailable();
  if (!isEmail(email)) throw new Error('이메일 형식을 확인해 주세요.');
  const check = checkPassword(password);
  if (!check.ok) throw new Error(`비밀번호 조건: ${check.problems.join(', ')}`);
  const sb = getSupabase();
  const { data: session } = await sb.auth.getSession();
  if (!session.session?.user) throw new Error('먼저 앱을 한 번 열어 세션을 만들어 주세요.');
  if (session.session.user.email) throw new Error('이미 이메일 계정으로 로그인돼 있어요.');

  const { data, error } = await sb.auth.updateUser({ email: email.trim(), password });
  if (error) throw new Error(friendly(error.message));
  return { needsConfirmation: !data.user?.email_confirmed_at };
}

/** 다른 기기에서 내 화장대 불러오기 (로그인) */
export async function signInWithEmail(email: string, password: string): Promise<AccountInfo> {
  assertAvailable();
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(friendly(error.message));
  return readAccount();
}

/** 로그아웃 — 다시 열면 새 익명 세션이 만들어진다 */
export async function signOutAccount(): Promise<void> {
  assertAvailable();
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(friendly(error.message));
}

/** 비밀번호 재설정 메일 보내기 */
export async function sendPasswordReset(email: string): Promise<void> {
  assertAvailable();
  if (!isEmail(email)) throw new Error('이메일 형식을 확인해 주세요.');
  const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });
  if (error) throw new Error(friendly(error.message));
}

/** 비밀번호 바꾸기 (로그인된 상태에서) */
export async function changePassword(password: string): Promise<void> {
  assertAvailable();
  const check = checkPassword(password);
  if (!check.ok) throw new Error(`비밀번호 조건: ${check.problems.join(', ')}`);
  const { error } = await getSupabase().auth.updateUser({ password });
  if (error) throw new Error(friendly(error.message));
}
