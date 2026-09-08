import { useAppStore } from '@/store/useAppStore';

export function ProductsPage() {
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const setActiveRoutine = useAppStore((s) => s.setActiveRoutine);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">My products</div>
        <h1 className="h1">
          내 <em>화장대</em>
        </h1>
        <p>제품을 담고 아침/저녁 루틴의 성분 궁합을 확인해요.</p>
      </header>

      <div className="segment" role="tablist" aria-label="루틴">
        {(['AM', 'PM'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={activeRoutine === t}
            className={`segment__btn${activeRoutine === t ? ' is-active' : ''}`}
            onClick={() => setActiveRoutine(t)}
          >
            {t === 'AM' ? '☀️ 아침' : '🌙 저녁'}
          </button>
        ))}
      </div>

      <section className="section">
        <div className="empty">
          <strong>3차시에서 완성돼요</strong>
          제품 검색/등록, 루틴 관리, 궁합 분석, 추천이 여기에 들어갑니다.
        </div>
      </section>
    </div>
  );
}
