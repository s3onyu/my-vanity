import { useEffect, useMemo, useState } from 'react';
import type { EyeLayer, FaceLayer, Tutorial, TutorialCategory } from '@/types';
import { TUTORIALS } from '@/data/tutorials';
import { Overlay } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { EyeIllustration } from './EyeIllustration';
import { FaceIllustration } from './FaceIllustration';

const CATEGORY_LABEL: Record<TutorialCategory, string> = { eye: '눈화장', blush: '블러셔', nose: '코쉐딩' };

function layersUpTo(t: Tutorial, step: number) {
  return t.steps.slice(0, step + 1).flatMap((s) => s.layers);
}

function Illustration({ tutorial, step, width }: { tutorial: Tutorial; step: number; width?: number | string }) {
  const layers = useMemo(() => layersUpTo(tutorial, step), [tutorial, step]);
  return tutorial.illustration === 'eye' ? (
    <EyeIllustration layers={layers as EyeLayer[]} width={width} />
  ) : (
    <FaceIllustration layers={layers as FaceLayer[]} width={width} />
  );
}

/** 완성 일러스트 미리보기 (목록·홈 카드용) */
export function TutorialPreview({ tutorial }: { tutorial: Tutorial }) {
  return (
    <div className="tut-thumb">
      <Illustration tutorial={tutorial} step={tutorial.steps.length - 1} />
    </div>
  );
}

function TutorialDetail({ tutorial, onBack }: { tutorial: Tutorial; onBack: () => void }) {
  const [step, setStep] = useState(-1); // -1 = 맨눈/맨얼굴
  useEffect(() => setStep(-1), [tutorial.id]);
  const total = tutorial.steps.length;
  const progress = ((step + 1) / total) * 100;

  return (
    <div>
      <button type="button" className="link-btn" onClick={onBack}>
        ← 목록으로
      </button>
      <div className="row row--between mt-2">
        <div>
          <div className="eyebrow">{CATEGORY_LABEL[tutorial.category]}</div>
          <h2 className="h1" style={{ fontSize: 24 }}>
            {tutorial.title}
          </h2>
          <p className="small muted mt-1">{tutorial.subtitle}</p>
        </div>
      </div>
      <div className="row row--wrap mt-1" style={{ gap: 4 }}>
        {tutorial.tags.map((t) => (
          <Badge key={t}>#{t}</Badge>
        ))}
      </div>

      <div className="tut-stage mt-3">
        <Illustration tutorial={tutorial} step={step} />
        <div className="tut-stage__caption">
          {step < 0 ? (tutorial.illustration === 'eye' ? '맨눈' : '맨얼굴') : `${step + 1}단계 · ${tutorial.steps[step].title}`}
        </div>
      </div>
      <p className="tiny muted mt-1 text-center">실제 인물이 아닌 원본 일러스트 위에 단계별 메이크업이 누적돼요.</p>

      <div className="progress mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step + 1}>
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="row row--between mt-1">
        <span className="small muted">
          {step + 1} / {total} 단계
        </span>
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep(-1)} disabled={step < 0}>
            {tutorial.illustration === 'eye' ? '맨눈으로 되돌리기' : '맨얼굴로 되돌리기'}
          </button>
          <button type="button" className="btn btn--sm" onClick={() => setStep((s) => Math.min(total - 1, s + 1))} disabled={step >= total - 1}>
            다음 단계 <Icon name="chevron" size={14} />
          </button>
        </div>
      </div>

      <ol className="tut-steps mt-3">
        {tutorial.steps.map((s, i) => {
          const state = i === step ? 'is-current' : i < step ? 'is-done' : '';
          return (
            <li key={i} className={`tut-step ${state}`}>
              <button type="button" className="tut-step__btn" onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}>
                <span className="tut-step__num">{i < step ? '✓' : i + 1}</span>
                <span className="flex-1">
                  <span className="tut-step__title">{s.title}</span>
                  {i === step && <span className="tut-step__tip">{s.tip}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** 메이크업 튜토리얼 오버레이 — 목록(카테고리 탭 + 카드 그리드) / 상세(단계별 누적 일러스트) */
export function TutorialOverlay({ initialId }: { initialId?: string }) {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const [category, setCategory] = useState<TutorialCategory>(() => TUTORIALS.find((t) => t.id === initialId)?.category ?? 'eye');
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);
  const selected = TUTORIALS.find((t) => t.id === selectedId) ?? null;
  const list = TUTORIALS.filter((t) => t.category === category);

  return (
    <Overlay title="메이크업 튜토리얼" onClose={popOverlay}>
      {selected ? (
        <TutorialDetail tutorial={selected} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="tabs" role="tablist">
            {(Object.keys(CATEGORY_LABEL) as TutorialCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                className={`tabs__btn${category === c ? ' is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABEL[c]} <span className="tiny muted">{TUTORIALS.filter((t) => t.category === c).length}</span>
              </button>
            ))}
          </div>
          <div className="tut-grid">
            {list.map((t) => (
              <button key={t.id} type="button" className="tut-card" onClick={() => setSelectedId(t.id)}>
                <TutorialPreview tutorial={t} />
                <div className="row row--wrap" style={{ gap: 4 }}>
                  {t.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
                <div className="tut-card__title">{t.title}</div>
                <div className="tiny muted">{t.steps.length}단계 · {t.subtitle}</div>
              </button>
            ))}
          </div>
          <p className="fine-print">모든 이미지는 실제 인물이 아닌 원본 일러스트예요. 단계를 누르면 해당 단계까지의 메이크업이 누적돼 그려져요.</p>
        </>
      )}
    </Overlay>
  );
}
