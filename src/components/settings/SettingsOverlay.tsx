import { useState } from 'react';
import { SUPPORT_EMAIL, TERMS_VERSION } from '@/data/legal';
import { Overlay } from '@/components/layout/Overlay';
import { Badge, Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

const CONFIRM_WORD = '삭제';

/** 설정 — 프로필, 약관, 차단 목록, 내 데이터 삭제(계정 삭제) */
export function SettingsOverlay() {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const profile = useAppStore((s) => s.profile);
  const storage = useAppStore((s) => s.storage);
  const blocked = useAppStore((s) => s.blockedAuthors);
  const reports = useAppStore((s) => s.reports);
  const posts = useAppStore((s) => s.posts);
  const logs = useAppStore((s) => s.logs);
  const routines = useAppStore((s) => s.routines);
  const productPhotos = useAppStore((s) => s.productPhotos);
  const unblockAuthor = useAppStore((s) => s.unblockAuthor);
  const deleteAllMyData = useAppStore((s) => s.deleteAllMyData);
  const showToast = useAppStore((s) => s.showToast);

  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);

  const myPosts = profile?.nickname ? posts.filter((p) => p.authorNickname === profile.nickname && !p.isDemo) : [];
  const photoCount = Object.keys(productPhotos).length + logs.filter((l) => l.photoUrl).length;

  const runDelete = async () => {
    setBusy(true);
    try {
      await deleteAllMyData();
      showToast('모든 데이터를 삭제했어요');
    } catch (err) {
      showToast('삭제에 실패했어요: ' + (err as Error).message);
    } finally {
      setBusy(false);
      setDeleting(false);
      setConfirmOpen(false);
      setConfirmText('');
    }
  };

  return (
    <Overlay title="설정" onClose={popOverlay}>
      {/* ---------------- 내 정보 ---------------- */}
      <section>
        <div className="h3 mb-2">내 정보</div>
        <div className="card">
          <div className="row row--between">
            <span className="small muted">닉네임</span>
            <span className="small">{profile?.nickname ?? '아직 없음 (첫 글쓰기 때 정해요)'}</span>
          </div>
          <div className="row row--between mt-1">
            <span className="small muted">저장 위치</span>
            <Badge color={storage.kind === 'supabase' ? 'mint' : 'sky'}>
              {storage.kind === 'supabase' ? '☁️ 서버' : '📱 이 기기'}
            </Badge>
          </div>
          <div className="row row--between mt-1">
            <span className="small muted">약관 동의</span>
            <span className="small">
              {profile?.agreedAt ? `${profile.agreedAt.slice(0, 10)} (v${profile.agreedVersion ?? '?'})` : '아직 안 함'}
            </span>
          </div>
          <button type="button" className="btn btn--ghost btn--block mt-2" onClick={() => pushOverlay({ type: 'profile-edit' })}>
            피부 타입·고민 다시 설정
          </button>
        </div>
      </section>

      {/* ---------------- 약관 ---------------- */}
      <section className="section">
        <div className="h3 mb-2">약관 및 정책</div>
        <div className="stack stack--sm">
          <button type="button" className="setting-row" onClick={() => pushOverlay({ type: 'legal', doc: 'terms' })}>
            <span className="flex-1">이용약관</span>
            <Icon name="chevron" size={14} />
          </button>
          <button type="button" className="setting-row" onClick={() => pushOverlay({ type: 'legal', doc: 'privacy' })}>
            <span className="flex-1">개인정보 처리방침</span>
            <Icon name="chevron" size={14} />
          </button>
          <button type="button" className="setting-row" onClick={() => pushOverlay({ type: 'legal', doc: 'rules' })}>
            <span className="flex-1">커뮤니티 규칙</span>
            <Icon name="chevron" size={14} />
          </button>
        </div>
        <p className="tiny muted mt-1">현재 버전 {TERMS_VERSION} · 문의 {SUPPORT_EMAIL}</p>
      </section>

      {/* ---------------- 차단 ---------------- */}
      <section className="section">
        <div className="h3 mb-2">차단한 사용자 {blocked.length > 0 && <span className="muted small">{blocked.length}명</span>}</div>
        {blocked.length === 0 ? (
          <p className="small muted">차단한 사용자가 없어요. 게시글의 신고 버튼에서 작성자를 차단할 수 있어요.</p>
        ) : (
          <div className="chip-row">
            {blocked.map((n) => (
              <Chip key={n} small onRemove={() => unblockAuthor(n)} title="누르면 차단 해제">
                {n}
              </Chip>
            ))}
          </div>
        )}
        {reports.length > 0 && <p className="tiny muted mt-1">신고해서 숨긴 글 {reports.length}개</p>}
      </section>

      {/* ---------------- 데이터 삭제 ---------------- */}
      <section className="section">
        <div className="h3 mb-2">내 데이터</div>
        <div className="card card--soft">
          <div className="data-summary">
            <div>
              <span className="data-summary__num serif">{routines.length}</span>
              <span className="tiny muted">루틴 제품</span>
            </div>
            <div>
              <span className="data-summary__num serif">{logs.length}</span>
              <span className="tiny muted">피부 기록</span>
            </div>
            <div>
              <span className="data-summary__num serif">{photoCount}</span>
              <span className="tiny muted">사진</span>
            </div>
            <div>
              <span className="data-summary__num serif">{myPosts.length}</span>
              <span className="tiny muted">내 글</span>
            </div>
          </div>
          <p className="small muted mt-2">
            {storage.kind === 'supabase'
              ? '삭제하면 이 기기와 서버에 저장된 내 기록·사진·내가 쓴 글이 모두 지워지고 익명 계정도 함께 삭제돼요.'
              : '삭제하면 이 기기에 저장된 내 기록·사진·내가 쓴 글이 모두 지워져요.'}{' '}
            되돌릴 수 없어요.
          </p>

          {!deleting ? (
            <button type="button" className="btn btn--danger btn--block mt-2" onClick={() => setDeleting(true)}>
              <Icon name="trash" size={15} /> 내 데이터 모두 삭제
            </button>
          ) : !confirmOpen ? (
            <div className="stack stack--sm mt-2">
              <div className="notice notice--danger">
                정말 삭제할까요? 루틴, 피부 기록, 사진, 내가 쓴 글이 모두 사라지고 복구할 수 없어요.
              </div>
              <div className="row">
                <button type="button" className="btn btn--ghost flex-1" onClick={() => setDeleting(false)}>
                  그만두기
                </button>
                <button type="button" className="btn btn--danger flex-1" onClick={() => setConfirmOpen(true)}>
                  계속하기
                </button>
              </div>
            </div>
          ) : (
            <div className="stack stack--sm mt-2">
              <label className="small" htmlFor="confirm-delete">
                확인을 위해 <strong>{CONFIRM_WORD}</strong> 라고 입력해 주세요.
              </label>
              <input
                id="confirm-delete"
                className="input"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_WORD}
                autoComplete="off"
              />
              <div className="row">
                <button type="button" className="btn btn--ghost flex-1" onClick={() => { setDeleting(false); setConfirmOpen(false); setConfirmText(''); }}>
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn--danger flex-1"
                  disabled={confirmText.trim() !== CONFIRM_WORD || busy}
                  onClick={runDelete}
                >
                  {busy ? '삭제 중…' : '영구 삭제'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <p className="fine-print">
        내 화장대는 성분 교육·루틴 관리 앱이며 의료 진단이나 치료를 대신하지 않아요. 제품·성분 데이터는 참고용이며 미검증 항목은 따로
        표시돼요.
      </p>
    </Overlay>
  );
}
