import { useAppStore } from '@/store/useAppStore';
import { CONCERN_MAP, SKIN_TYPE_LABEL } from '@/data/concerns';

export function HomePage() {
  const profile = useAppStore((s) => s.profile);
  const pushOverlay = useAppStore((s) => s.pushOverlay);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">My Vanity</div>
        <h1 className="h1">
          오늘의 <em>화장대</em>
        </h1>
      </header>

      {profile && (
        <div className="profile-strip">
          <span>
            <strong>{profile.skinType ? SKIN_TYPE_LABEL[profile.skinType] : '타입 미설정'}</strong>
            {' · '}
            {profile.concerns.map((c) => CONCERN_MAP[c].title).join(', ') || '고민 미설정'}
          </span>
          <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'profile-edit' })}>
            프로필 수정
          </button>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Routine</div>
            <h2 className="h2">오늘의 루틴 궁합</h2>
          </div>
        </div>
        <div className="empty">
          <strong>3~4차시에서 완성돼요</strong>
          루틴 궁합 점수 요약이 여기에 표시됩니다.
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Ingredient of the day</div>
            <h2 className="h2">오늘의 성분</h2>
          </div>
        </div>
        <div className="empty">성분 카드가 여기에 표시됩니다.</div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Community</div>
            <h2 className="h2">다른 사람들의 화장대</h2>
          </div>
          <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'board' })}>
            전체 보기
          </button>
        </div>
        <div className="empty">게시글 미리보기가 여기에 표시됩니다.</div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Tutorial</div>
            <h2 className="h2">메이크업 튜토리얼</h2>
          </div>
          <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'tutorial' })}>
            전체 보기
          </button>
        </div>
        <div className="empty">튜토리얼 미리보기가 여기에 표시됩니다.</div>
      </section>
    </div>
  );
}
