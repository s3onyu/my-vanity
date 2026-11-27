import { useEffect, useState } from 'react';
import { changePassword, checkPassword, isAccountAvailable, isEmail, sendPasswordReset, PASSWORD_MIN } from '@/lib/account';
import { Overlay } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';

type Mode = 'overview' | 'signup' | 'signin' | 'password';

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const check = checkPassword(password);
  return (
    <div className="pw-strength">
      <div className="pw-strength__track">
        <div className={`pw-strength__fill is-${check.strength}`} style={{ width: `${(check.strength / 4) * 100}%` }} />
      </div>
      <span className="tiny muted">
        {check.label}
        {check.problems.length > 0 && ` · 필요: ${check.problems.join(', ')}`}
      </span>
    </div>
  );
}

/**
 * 계정 (요청 9번).
 *
 * 지금까지는 익명 로그인만 써서 브라우저를 지우면 기록이 사라졌다.
 * 여기서 이메일·비밀번호를 붙이면 (익명 계정이 그대로 승격되므로) 기존 기록을 유지한 채
 * 다른 기기에서도 같은 화장대를 열 수 있다.
 */
export function AccountOverlay() {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const account = useAppStore((s) => s.account);
  const storage = useAppStore((s) => s.storage);
  const refreshAccount = useAppStore((s) => s.refreshAccount);
  const createAccount = useAppStore((s) => s.createAccount);
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);
  const showToast = useAppStore((s) => s.showToast);
  const routines = useAppStore((s) => s.routines);
  const logs = useAppStore((s) => s.logs);

  const [mode, setMode] = useState<Mode>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void refreshAccount();
  }, [refreshAccount]);

  const reset = () => {
    setPassword('');
    setPassword2('');
    setError(null);
  };

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!isAccountAvailable() || storage.kind !== 'supabase') {
    return (
      <Overlay title="계정" onClose={popOverlay}>
        <div className="empty">
          <strong>지금은 이 기기에만 저장돼요</strong>
          계정으로 로그인해 여러 기기에서 쓰려면 서버(Supabase) 연결이 필요해요.
          {storage.error && <div className="tiny muted mt-2">{storage.error}</div>}
        </div>
        <p className="fine-print">
          이 기기에 저장된 기록은 그대로 쓸 수 있어요. 브라우저 데이터를 지우면 함께 사라지니, 중요한 기록은 서버 연결 후 계정을 만들어
          두시는 게 안전해요.
        </p>
      </Overlay>
    );
  }

  // ---------------------------------------------------------------- 회원가입
  if (mode === 'signup') {
    return (
      <Overlay title="계정 만들기" onClose={() => setMode('overview')}>
        <div className="stack">
          <div className="notice">
            지금 이 기기에 있는 <strong>루틴 {routines.length}개 · 피부 기록 {logs.length}건</strong>을 그대로 들고 계정으로 옮겨요.
          </div>
          <div className="field">
            <label htmlFor="ac-email">이메일</label>
            <input
              id="ac-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 120))}
              placeholder="example@email.com"
            />
          </div>
          <div className="field">
            <label htmlFor="ac-pw">비밀번호</label>
            <input
              id="ac-pw"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 72))}
              placeholder={`${PASSWORD_MIN}자 이상, 영문+숫자`}
            />
            <StrengthBar password={password} />
          </div>
          <div className="field">
            <label htmlFor="ac-pw2">비밀번호 확인</label>
            <input
              id="ac-pw2"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value.slice(0, 72))}
            />
          </div>
          {error && <div className="notice notice--danger">{error}</div>}
          <button
            type="button"
            className="btn btn--block"
            disabled={busy || !isEmail(email) || !checkPassword(password).ok || password !== password2}
            onClick={() =>
              run(async () => {
                const { needsConfirmation } = await createAccount(email, password);
                reset();
                setMode('overview');
                setNotice(
                  needsConfirmation
                    ? '확인 메일을 보냈어요. 메일의 링크를 누르면 계정이 완성돼요.'
                    : '계정을 만들었어요. 이제 다른 기기에서도 로그인할 수 있어요.',
                );
                showToast('계정을 만들었어요');
              })
            }
          >
            {busy ? '만드는 중…' : '계정 만들기'}
          </button>
          {password && password2 && password !== password2 && <p className="field-error">비밀번호 확인이 달라요.</p>}
          <p className="fine-print">
            비밀번호는 Supabase Auth 가 해시해서 보관하고, 이 앱은 입력한 비밀번호를 따로 저장하지 않아요. 이메일은 로그인과 비밀번호
            재설정에만 써요.
          </p>
        </div>
      </Overlay>
    );
  }

  // ------------------------------------------------------------------ 로그인
  if (mode === 'signin') {
    return (
      <Overlay title="로그인" onClose={() => setMode('overview')}>
        <div className="stack">
          <p className="small muted">
            다른 기기에서 쓰던 계정으로 로그인하면 그 계정의 루틴·기록을 불러와요. 지금 이 기기에만 있던 기록은 로그인한 계정의 기록으로
            바뀌어요.
          </p>
          <div className="field">
            <label htmlFor="si-email">이메일</label>
            <input
              id="si-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 120))}
              placeholder="example@email.com"
            />
          </div>
          <div className="field">
            <label htmlFor="si-pw">비밀번호</label>
            <input
              id="si-pw"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 72))}
            />
          </div>
          {error && <div className="notice notice--danger">{error}</div>}
          <button
            type="button"
            className="btn btn--block"
            disabled={busy || !isEmail(email) || password.length < 1}
            onClick={() =>
              run(async () => {
                await signIn(email, password);
                reset();
                setMode('overview');
                showToast('로그인했어요');
              })
            }
          >
            {busy ? '로그인 중…' : '로그인'}
          </button>
          <button
            type="button"
            className="link-btn"
            disabled={busy || !isEmail(email)}
            onClick={() =>
              run(async () => {
                await sendPasswordReset(email);
                setNotice('비밀번호 재설정 메일을 보냈어요.');
                setMode('overview');
              })
            }
          >
            비밀번호를 잊었어요 — 재설정 메일 받기
          </button>
        </div>
      </Overlay>
    );
  }

  // ------------------------------------------------------------- 비밀번호 변경
  if (mode === 'password') {
    return (
      <Overlay title="비밀번호 바꾸기" onClose={() => setMode('overview')}>
        <div className="stack">
          <div className="field">
            <label htmlFor="np-pw">새 비밀번호</label>
            <input
              id="np-pw"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 72))}
              placeholder={`${PASSWORD_MIN}자 이상, 영문+숫자`}
            />
            <StrengthBar password={password} />
          </div>
          <div className="field">
            <label htmlFor="np-pw2">새 비밀번호 확인</label>
            <input
              id="np-pw2"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value.slice(0, 72))}
            />
          </div>
          {error && <div className="notice notice--danger">{error}</div>}
          <button
            type="button"
            className="btn btn--block"
            disabled={busy || !checkPassword(password).ok || password !== password2}
            onClick={() =>
              run(async () => {
                await changePassword(password);
                reset();
                setMode('overview');
                showToast('비밀번호를 바꿨어요');
              })
            }
          >
            {busy ? '바꾸는 중…' : '비밀번호 바꾸기'}
          </button>
        </div>
      </Overlay>
    );
  }

  // ------------------------------------------------------------------- 현재 상태
  const isEmailAccount = account.kind === 'email';
  return (
    <Overlay title="계정" onClose={popOverlay}>
      {notice && <div className="notice mb-2">{notice}</div>}

      <div className="card">
        <div className="row row--between">
          <span className="small muted">로그인 상태</span>
          <Badge color={isEmailAccount ? 'mint' : 'butter'}>
            {isEmailAccount ? '이메일 계정' : account.kind === 'anonymous' ? '익명 (이 기기에서만)' : '로그인 전'}
          </Badge>
        </div>
        {isEmailAccount && (
          <>
            <div className="row row--between mt-1">
              <span className="small muted">이메일</span>
              <span className="small">{account.email}</span>
            </div>
            <div className="row row--between mt-1">
              <span className="small muted">이메일 인증</span>
              <span className="small">{account.emailConfirmed ? '완료' : '메일의 링크를 눌러주세요'}</span>
            </div>
          </>
        )}
        <div className="row row--between mt-1">
          <span className="small muted">저장된 내 데이터</span>
          <span className="small">
            루틴 {routines.length}개 · 기록 {logs.length}건
          </span>
        </div>
      </div>

      {!isEmailAccount ? (
        <div className="card card--soft mt-2">
          <div className="h3">계정을 만들면</div>
          <ul className="bullets mt-1">
            <li>브라우저 데이터를 지워도 기록이 남아요</li>
            <li>휴대폰과 노트북에서 같은 화장대를 열 수 있어요</li>
            <li>지금 이 기기의 기록이 그대로 계정으로 옮겨가요 (새로 시작하지 않아요)</li>
          </ul>
          <button type="button" className="btn btn--block mt-2" onClick={() => { reset(); setMode('signup'); }}>
            이메일로 계정 만들기
          </button>
          <button type="button" className="btn btn--ghost btn--block mt-1" onClick={() => { reset(); setMode('signin'); }}>
            이미 계정이 있어요 — 로그인
          </button>
        </div>
      ) : (
        <div className="stack stack--sm mt-2">
          <button type="button" className="setting-row" onClick={() => { reset(); setMode('password'); }}>
            <span className="flex-1">비밀번호 바꾸기</span>
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--block"
            disabled={busy}
            onClick={() => {
              if (!window.confirm('로그아웃하면 이 기기에서는 다시 익명으로 시작해요. 계정의 기록은 그대로 남아요. 로그아웃할까요?')) return;
              void run(async () => {
                await signOut();
                showToast('로그아웃했어요');
                popOverlay();
              });
            }}
          >
            로그아웃
          </button>
        </div>
      )}

      <p className="fine-print">
        계정 정보(이메일·비밀번호)는 Supabase Auth 가 관리해요. 비밀번호는 해시로만 저장되고 이 앱은 원문을 볼 수 없어요. 계정과 모든
        데이터를 지우려면 설정 → 내 데이터 모두 삭제를 이용해 주세요.
      </p>
    </Overlay>
  );
}
