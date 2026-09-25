import { useState } from 'react';
import type { ReportReason } from '@/types';
import { REPORT_REASONS, SUPPORT_EMAIL } from '@/data/legal';
import { Sheet } from '@/components/layout/Overlay';
import { useAppStore } from '@/store/useAppStore';

/** 게시글 신고 — 사유를 고르면 운영자에게 접수되고 내 화면에서 바로 숨겨진다 */
export function ReportSheet({ postId }: { postId: string }) {
  const post = useAppStore((s) => s.posts.find((p) => p.id === postId));
  const popOverlay = useAppStore((s) => s.popOverlay);
  const closeOverlays = useAppStore((s) => s.closeOverlays);
  const overlays = useAppStore((s) => s.overlays);
  const reportPost = useAppStore((s) => s.reportPost);
  const blockAuthor = useAppStore((s) => s.blockAuthor);
  const blocked = useAppStore((s) => s.blockedAuthors);

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const author = post?.authorNickname ?? '';
  const isBlocked = blocked.includes(author);

  const submit = async () => {
    if (!reason) {
      setError('신고 사유를 골라 주세요.');
      return;
    }
    if (reason === 'other' && detail.trim().length < 5) {
      setError('기타를 고르셨다면 사유를 5자 이상 적어 주세요.');
      return;
    }
    setError(null);
    setBusy(true);
    await reportPost(postId, reason, detail.trim().slice(0, 300));
    if (alsoBlock && author && !isBlocked) await blockAuthor(author);
    setBusy(false);
    // 신고 시트와 (열려 있다면) 그 아래 게시글 상세를 함께 닫는다
    const belowIsDetail = overlays.length >= 2 && overlays[overlays.length - 2].type === 'post';
    popOverlay();
    if (belowIsDetail) popOverlay();
  };

  return (
    <Sheet onClose={popOverlay} label="게시글 신고">
      <div className="h3">이 글을 신고할까요?</div>
      {post && <p className="small muted mt-1 clamp-2">“{post.title}” · {post.authorNickname}</p>}
      <p className="small muted mt-2">
        접수된 신고는 확인 후 24시간 안에 처리하고, 규칙을 어긴 글은 삭제됩니다. 신고한 글은 바로 내 화면에서 사라져요.
      </p>

      <div className="field mt-3">
        <label>신고 사유</label>
        <div className="stack stack--sm">
          {REPORT_REASONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`option${reason === r.id ? ' is-selected' : ''}`}
              onClick={() => {
                setReason(r.id);
                setError(null);
              }}
              aria-pressed={reason === r.id}
            >
              <span>
                <span className="option__title">{r.label}</span>
                <span className="option__desc">{r.desc}</span>
              </span>
              <span className="option__check">✓</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="report-detail">자세한 내용 (선택)</label>
        <textarea
          id="report-detail"
          className="textarea"
          style={{ minHeight: 64 }}
          value={detail}
          onChange={(e) => setDetail(e.target.value.slice(0, 300))}
          placeholder="어떤 점이 문제인지 알려 주시면 처리에 도움이 돼요."
        />
      </div>

      {author && !isBlocked && (
        <label className="row small" style={{ gap: 8, padding: '4px 2px' }}>
          <input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} />
          {author} 님의 글을 앞으로 보지 않기 (차단)
        </label>
      )}

      {error && <p className="field-error">{error}</p>}

      <div className="row mt-2">
        <button type="button" className="btn btn--ghost flex-1" onClick={popOverlay} disabled={busy}>
          취소
        </button>
        <button type="button" className="btn btn--danger flex-1" onClick={submit} disabled={busy}>
          {busy ? '접수 중…' : '신고하기'}
        </button>
      </div>
      <p className="fine-print">
        긴급하거나 답변이 필요한 신고는 {SUPPORT_EMAIL} 로도 보내 주세요. 허위 신고가 반복되면 이용이 제한될 수 있어요.
      </p>
      <button type="button" className="link-btn mt-2" onClick={closeOverlays}>
        게시판 닫기
      </button>
    </Sheet>
  );
}
