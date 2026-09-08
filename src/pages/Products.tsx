import { useAppStore, useRoutine } from '@/store/useAppStore';
import { ProductSearch } from '@/components/products/ProductSearch';
import { RoutineList } from '@/components/products/RoutineList';
import { MatchRecords } from '@/components/products/MatchRecords';

export function ProductsPage() {
  const activeRoutine = useAppStore((s) => s.activeRoutine);
  const setActiveRoutine = useAppStore((s) => s.setActiveRoutine);
  const items = useRoutine(activeRoutine);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">My products</div>
        <h1 className="h1">
          내 <em>화장대</em>
        </h1>
        <p>제품을 담고 아침/저녁 루틴의 성분 궁합을 확인해요.</p>
      </header>

      <section>
        <ProductSearch />
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Routine</div>
            <h2 className="h2">
              {activeRoutine === 'AM' ? '아침' : '저녁'} 루틴 <em>{items.length}단계</em>
            </h2>
          </div>
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
        </div>
        <RoutineList />
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Compatibility</div>
            <h2 className="h2">성분 궁합 분석</h2>
          </div>
        </div>
        <div className="empty">
          <strong>4~5차시에서 완성돼요</strong>
          궁합 점수 카드와 계산 근거가 여기에 표시됩니다.
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">My skin log</div>
            <h2 className="h2">내 피부 궁합 기록</h2>
          </div>
        </div>
        <MatchRecords />
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">For you</div>
            <h2 className="h2">
              고민에 맞는 <em>다음 한 칸</em>
            </h2>
          </div>
        </div>
        <div className="empty">
          <strong>4~5차시에서 완성돼요</strong>
          고민 기반 추천 카드가 여기에 표시됩니다.
        </div>
      </section>
    </div>
  );
}
