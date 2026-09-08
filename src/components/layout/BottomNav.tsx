import { useAppStore, type Page } from '@/store/useAppStore';
import { Icon, type IconName } from '@/components/ui/Icon';

const TABS: { id: Page; label: string; icon: IconName }[] = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'products', label: '내 제품', icon: 'vanity' },
  { id: 'ingredients', label: '성분', icon: 'leaf' },
  { id: 'care', label: '관리', icon: 'sparkle' },
  { id: 'diary', label: '기록', icon: 'journal' },
];

export function BottomNav() {
  const page = useAppStore((s) => s.page);
  const navigate = useAppStore((s) => s.navigate);
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`bottom-nav__item${page === t.id ? ' is-active' : ''}`}
          onClick={() => navigate(t.id)}
          aria-current={page === t.id ? 'page' : undefined}
        >
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
