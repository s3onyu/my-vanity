import { useMemo } from 'react';
import type { RoutineType } from '@/types';
import { ingredientOfTheDay } from '@/data';
import { CONCERN_MAP, SKIN_TYPE_LABEL } from '@/data/concerns';
import { TUTORIALS } from '@/data/tutorials';
import { analyzeRoutine } from '@/engine/compatibility';
import { todayISO, formatKoDate, relativeTime } from '@/lib/date';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { ScoreRing, scoreTone } from '@/components/products/ScoreCard';
import { CategoryBadges } from '@/components/ingredients/IngredientCard';
import { VERDICT_META } from '@/components/board/BoardOverlay';
import { TutorialPreview } from '@/components/tutorial/TutorialOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useCatalog } from '@/store/catalog';

function RoutineSummary({ type }: { type: RoutineType }) {
  const routines = useAppStore((s) => s.routines);
  const skinType = useAppStore((s) => s.profile?.skinType ?? null);
  const navigate = useAppStore((s) => s.navigate);
  const setActiveRoutine = useAppStore((s) => s.setActiveRoutine);
  const catalog = useCatalog();
  const ids = useMemo(
    () => routines.filter((r) => r.routineType === type).sort((a, b) => a.sortOrder - b.sortOrder).map((r) => r.productId),
    [routines, type],
  );
  const result = useMemo(() => analyzeRoutine({ productIds: ids, routineType: type, skinType }, catalog), [ids, type, skinType, catalog]);

  return (
    <button
      type="button"
      className="home-routine"
      onClick={() => {
        setActiveRoutine(type);
        navigate('products');
      }}
    >
      <div className="home-routine__ring">
        <ScoreRing score={result.empty ? 0 : result.score} size={64} />
        <span className="home-routine__num serif">{result.empty ? '–' : result.score}</span>
      </div>
      <div className="flex-1" style={{ textAlign: 'left' }}>
        <div className="row" style={{ gap: 6 }}>
          <Icon name={type === 'AM' ? 'sun' : 'moon'} size={14} />
          <span className="h3">{type === 'AM' ? '아침' : '저녁'} 루틴</span>
          <span className="tiny muted">{ids.length}단계</span>
        </div>
        <div className={`small mt-1 ${result.empty ? 'muted' : `tone-${scoreTone(result.score)}`}`}>
          {result.empty ? '아직 제품이 없어요. 담으러 가기 →' : result.summary}
        </div>
      </div>
    </button>
  );
}

export function HomePage() {
  const profile = useAppStore((s) => s.profile);
  const storage = useAppStore((s) => s.storage);
  const posts = useAppStore((s) => s.posts);
  const pushOverlay = useAppStore((s) => s.pushOverlay);
  const openIngredient = useAppStore((s) => s.openIngredient);
  const today = todayISO();
  const ingredient = useMemo(() => ingredientOfTheDay(today), [today]);

  return (
    <div className="page">
      <header className="page-head">
        <div className="eyebrow">{formatKoDate(today)}</div>
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
          <div className="row" style={{ gap: 10 }}>
            <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'profile-edit' })}>
              프로필 수정
            </button>
            <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'settings' })}>
              설정
            </button>
          </div>
        </div>
      )}
      <div className="row row--between mt-1">
        <span className="tiny muted">
          {storage.kind === 'supabase' ? '☁️ 서버(Supabase)에 저장 · 재방문 시 자동 복원' : '📱 이 기기(localStorage)에 저장 · 재방문 시 자동 복원'}
        </span>
      </div>
      {storage.fallback && (
        <div className="notice notice--warn mt-2">
          서버에 연결하지 못해 이 기기에만 저장하고 있어요. 네트워크와 Supabase 설정(익명 로그인, 테이블)을 확인한 뒤 새로고침해주세요.
          <div className="tiny mt-1">{storage.error}</div>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Routine</div>
            <h2 className="h2">오늘의 루틴 궁합</h2>
          </div>
        </div>
        <div className="stack stack--sm">
          <RoutineSummary type="AM" />
          <RoutineSummary type="PM" />
        </div>
        <p className="fine-print">점수는 참고용 근사치예요. 근거는 내 제품 탭에서 확인할 수 있어요.</p>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Ingredient of the day</div>
            <h2 className="h2">오늘의 성분</h2>
          </div>
        </div>
        <button type="button" className={`ing-day bg-${ingredient.colorTag}-2`} onClick={() => openIngredient(ingredient.id)}>
          <div className="ing-day__name serif">{ingredient.nameKo}</div>
          <div className="ing-day__inci">{ingredient.nameInci}</div>
          <p className="ing-day__desc">{ingredient.shortDesc}</p>
          <div className="row" style={{ gap: 4 }}>
            <CategoryBadges ingredient={ingredient} />
            <span className="link-btn" style={{ marginLeft: 'auto' }}>
              자세히
            </span>
          </div>
        </button>
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
        <div className="h-scroll">
          {posts.slice(0, 6).map((post) => {
            const meta = CONCERN_MAP[post.concernCategory];
            const v = VERDICT_META[post.verdict];
            return (
              <button
                key={post.id}
                type="button"
                className="post-preview"
                onClick={() => {
                  pushOverlay({ type: 'board' });
                  pushOverlay({ type: 'post', id: post.id });
                }}
              >
                <div className="row" style={{ gap: 4 }}>
                  <Badge color={meta.colorTag}>{meta.title}</Badge>
                  <Badge color={v.color}>{v.label}</Badge>
                </div>
                <div className="post-preview__title clamp-2">{post.title}</div>
                {post.productName && <div className="tiny muted ellipsis">{post.productName}</div>}
                <div className="post-preview__meta">
                  {post.authorNickname} · {relativeTime(post.createdAt)} · ♥ {post.likes}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Tutorial</div>
            <h2 className="h2">눈화장 튜토리얼</h2>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'tutorial', mode: 'video' })}>
              🎬 영상으로 배우기
            </button>
            <button type="button" className="link-btn" onClick={() => pushOverlay({ type: 'tutorial' })}>
              전체 보기
            </button>
          </div>
        </div>
        <div className="h-scroll">
          {TUTORIALS.filter((t) => t.category === 'eye').map((t) => (
            <button key={t.id} type="button" className="tut-preview" onClick={() => pushOverlay({ type: 'tutorial', id: t.id })}>
              <TutorialPreview tutorial={t} />
              <div className="tut-preview__title">{t.title}</div>
              <div className="tiny muted">{t.tags.slice(0, 2).join(' · ')}</div>
            </button>
          ))}
        </div>
        <p className="fine-print">튜토리얼 이미지는 실제 인물이 아닌 원본 일러스트예요.</p>
      </section>

      <p className="fine-print text-center mt-4">
        내 화장대는 성분 교육·루틴 관리 앱이며 의료 진단이나 치료를 대신하지 않아요. 제품·성분 데이터는 데모용이며 미검증 표기를 유지해요.
      </p>
    </div>
  );
}
