import { CONCERNS } from '@/data/concerns';
import { useAppStore } from '@/store/useAppStore';

export function CarePage() {
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">Focus care</div>
        <h1 className="h1">
          고민별 <em>집중 관리</em>
        </h1>
        <p>고민을 고르면 자주 언급되는 성분을 모아 보여줘요.</p>
      </header>
      <div className="grid-2">
        {CONCERNS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`card card--soft bg-${c.colorTag}-2`}
            style={{ textAlign: 'left' }}
            onClick={() => pushOverlay({ type: 'care', concernId: c.id })}
          >
            <div style={{ fontSize: 22 }}>{c.icon}</div>
            <div className="h3 mt-1">{c.title}</div>
            <div className="small muted mt-1 clamp-2">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
