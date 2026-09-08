import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BottomNav } from '@/components/layout/BottomNav';
import { Overlay } from '@/components/layout/Overlay';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { HomePage } from '@/pages/Home';
import { ProductsPage } from '@/pages/Products';
import { IngredientsPage } from '@/pages/Ingredients';
import { CarePage } from '@/pages/Care';
import { DiaryPage } from '@/pages/Diary';
import { IngredientSheet } from '@/components/ingredients/IngredientSheet';
import { CareOverlay } from '@/components/care/CareOverlay';

function CurrentPage() {
  const page = useAppStore((s) => s.page);
  switch (page) {
    case 'products':
      return <ProductsPage />;
    case 'ingredients':
      return <IngredientsPage />;
    case 'care':
      return <CarePage />;
    case 'diary':
      return <DiaryPage />;
    default:
      return <HomePage />;
  }
}

function Overlays() {
  const overlays = useAppStore((s) => s.overlays);
  const popOverlay = useAppStore((s) => s.popOverlay);
  if (overlays.length === 0) return null;
  const top = overlays[overlays.length - 1];

  switch (top.type) {
    case 'profile-edit':
      return (
        <div className="overlay">
          <div className="overlay__panel">
            <Onboarding editMode onDone={popOverlay} />
          </div>
        </div>
      );
    case 'board':
      return (
        <Overlay title="다른 사람들의 화장대" onClose={popOverlay}>
          <div className="empty">5차시에서 완성돼요 — 커뮤니티 게시판</div>
        </Overlay>
      );
    case 'tutorial':
      return (
        <Overlay title="메이크업 튜토리얼" onClose={popOverlay}>
          <div className="empty">5차시에서 완성돼요 — 메이크업 튜토리얼</div>
        </Overlay>
      );
    case 'care':
      return <CareOverlay concernId={top.concernId} />;
    default:
      return null;
  }
}

function Toast() {
  const toast = useAppStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      {toast}
    </div>
  );
}

export default function App() {
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="app-frame">
        <div className="splash">
          <div className="serif">내 화장대</div>
          <div>저장된 화장대를 불러오는 중…</div>
        </div>
      </div>
    );
  }

  if (!profile || !profile.skinType) {
    return (
      <div className="app-frame">
        <Onboarding />
        <Toast />
      </div>
    );
  }

  return (
    <div className="app-frame">
      <CurrentPage />
      <BottomNav />
      <Overlays />
      <IngredientSheet />
      <Toast />
    </div>
  );
}
