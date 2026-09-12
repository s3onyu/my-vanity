import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { setupNative } from '@/lib/native';
import { BottomNav } from '@/components/layout/BottomNav';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { IngredientSheet } from '@/components/ingredients/IngredientSheet';
import { CareOverlay } from '@/components/care/CareOverlay';
import { BoardOverlay, PostDetailOverlay } from '@/components/board/BoardOverlay';
import { PostFormOverlay } from '@/components/board/PostForm';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { PhotoSearchOverlay } from '@/components/products/PhotoSearchOverlay';
import { HomePage } from '@/pages/Home';
import { ProductsPage } from '@/pages/Products';
import { IngredientsPage } from '@/pages/Ingredients';
import { CarePage } from '@/pages/Care';
import { DiaryPage } from '@/pages/Diary';

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

/** 오버레이 스택 — 맨 위 하나만 렌더링 (게시판 → 상세처럼 겹쳐 열린 경우 뒤로가기로 하나씩 닫힌다) */
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
      return <BoardOverlay key={top.query ?? ''} initialQuery={top.query} />;
    case 'post':
      return <PostDetailOverlay id={top.id} />;
    case 'post-form':
      return <PostFormOverlay initialProductName={top.productName} />;
    case 'tutorial':
      return (
        <TutorialOverlay
          key={`${top.mode ?? 'illustration'}-${top.id ?? top.categoryId ?? 'list'}`}
          initialId={top.id}
          initialMode={top.mode}
          initialCategoryId={top.categoryId}
        />
      );
    case 'care':
      return <CareOverlay concernId={top.concernId} />;
    case 'photo-search':
      return <PhotoSearchOverlay key={top.registerOnly ? 'register' : 'photo'} registerOnly={top.registerOnly} />;
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

  // 설치형 앱: Android 뒤로가기 → 시트/오버레이 닫기 → 홈 → 종료
  useEffect(
    () =>
      setupNative({
        onBack: () => {
          const s = useAppStore.getState();
          if (s.ingredientSheet) {
            s.closeIngredient();
            return 'handled';
          }
          if (s.overlays.length) {
            s.popOverlay();
            return 'handled';
          }
          if (s.page !== 'home') {
            s.navigate('home');
            return 'handled';
          }
          return 'exit';
        },
      }),
    [],
  );

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
