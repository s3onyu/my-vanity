import { useMemo, useState } from 'react';
import { getIngredient } from '@/data';
import { CONCERN_MAP, SKIN_TYPE_LABEL } from '@/data/concerns';
import { CODE_LEGEND, QUIZ, scoreQuiz, type Answers, type QuizResult } from '@/engine/skinQuiz';
import { Overlay } from '@/components/layout/Overlay';
import { Badge } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

function AxisBar({ axis }: { axis: QuizResult['axes'][number] }) {
  return (
    <div className="axis">
      <div className="row row--between">
        <span className="axis__letter serif">{axis.letter}</span>
        <span className="axis__label">{axis.label}</span>
      </div>
      <div className="axis__track" role="img" aria-label={`${axis.label} ${axis.percent}%`}>
        <div className="axis__fill" style={{ width: `${axis.percent}%` }} />
        <span className="axis__mid" aria-hidden="true" />
      </div>
      <p className="axis__desc">{axis.desc}</p>
    </div>
  );
}

function ResultView({ result, onSave, saving }: { result: QuizResult; onSave: () => void; saving: boolean }) {
  const openIngredient = useAppStore((s) => s.openIngredient);
  const goToIngredients = useAppStore((s) => s.goToIngredients);
  const popOverlay = useAppStore((s) => s.popOverlay);

  return (
    <div className="stack">
      <div className="quiz-result">
        <div className="eyebrow">My skin type</div>
        <div className="quiz-result__code serif">{result.code}</div>
        <div className="quiz-result__title">{result.title}</div>
        <p className="quiz-result__lead">{result.lead}</p>
      </div>

      <div className="card card--soft">
        <div className="h3">네 글자가 뜻하는 것</div>
        <dl className="legend mt-1">
          {CODE_LEGEND.map((l) => (
            <div key={l.letter} className="legend__item">
              <dt>{l.letter}</dt>
              <dd>{l.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="card">
        <div className="h3 mb-2">축별로 보면</div>
        {result.axes.map((a) => (
          <AxisBar key={a.axis} axis={a} />
        ))}
      </div>

      <div className="card">
        <div className="h3">이 결과로 저장하면</div>
        <div className="row row--wrap mt-2" style={{ gap: 5 }}>
          <Badge color="sky">피부 타입 {SKIN_TYPE_LABEL[result.skinType]}</Badge>
          {result.concerns.map((c) => (
            <Badge key={c} color={CONCERN_MAP[c].colorTag}>
              {CONCERN_MAP[c].icon} {CONCERN_MAP[c].title}
            </Badge>
          ))}
        </div>
        <p className="small muted mt-2">
          프로필에 저장하면 궁합 점수의 가중치와 추천, 그리고 “내 피부에 자극될 수 있는 성분” 표시에 바로 반영돼요.
        </p>
        <button type="button" className="btn btn--block mt-2" onClick={onSave} disabled={saving}>
          {saving ? '저장 중…' : '이 결과로 프로필 저장'}
        </button>
      </div>

      <div className="card">
        <div className="h3">먼저 챙기면 좋은 성분</div>
        <div className="chip-row mt-1">
          {result.focusIngredients.map((id) => {
            const ing = getIngredient(id);
            return ing ? (
              <button key={id} type="button" className={`ing-tag ing-tag--${ing.colorTag}`} onClick={() => openIngredient(id)}>
                {ing.nameKo}
              </button>
            ) : null;
          })}
        </div>
        {result.careful.length > 0 && (
          <>
            <div className="h3 mt-3">천천히 들여도 되는 성분</div>
            <div className="chip-row mt-1">
              {result.careful.map((id) => {
                const ing = getIngredient(id);
                return ing ? (
                  <button key={id} type="button" className="ing-tag" onClick={() => openIngredient(id)}>
                    ! {ing.nameKo}
                  </button>
                ) : null;
              })}
            </div>
            <p className="tiny muted mt-1">쓰지 말라는 뜻이 아니라, 저농도로 천천히 시작하면 좋다는 뜻이에요.</p>
          </>
        )}
        <button
          type="button"
          className="btn btn--ghost btn--block mt-2"
          onClick={() => {
            popOverlay();
            goToIngredients({ query: '' });
          }}
        >
          성분 백과에서 더 찾아보기
        </button>
      </div>

      <p className="fine-print">
        이 검사는 설문으로 피부 경향을 나눠 보는 참고용 분류예요 (피부 유형을 유분·민감·색소·주름 네 축으로 나누는 방식을 따랐어요).
        의학적 진단이 아니며, 같은 사람도 계절·건강 상태에 따라 결과가 달라질 수 있어요.
      </p>
    </div>
  );
}

/** 피부 유형 검사 (요청 2번) — 질문에 답하면 네 글자 코드와 추천 성분이 나오고, 프로필에 바로 저장할 수 있다 */
export function SkinQuizOverlay() {
  const popOverlay = useAppStore((s) => s.popOverlay);
  const saveQuizResult = useAppStore((s) => s.saveQuizResult);
  const showToast = useAppStore((s) => s.showToast);
  const savedCode = useAppStore((s) => s.profile?.skinCode ?? null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const result = useMemo(() => scoreQuiz(answers), [answers]);
  const q = QUIZ[step];
  const answeredCount = Object.keys(answers).length;
  const isLast = step === QUIZ.length - 1;

  const choose = (idx: number) => {
    setAnswers((cur) => ({ ...cur, [q.id]: idx }));
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  const save = async () => {
    setSaving(true);
    await saveQuizResult(result);
    setSaving(false);
    showToast(`${result.code} · ${result.title}으로 저장했어요`);
    popOverlay();
  };

  if (done) {
    return (
      <Overlay
        title="검사 결과"
        onClose={popOverlay}
        right={
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setAnswers({});
              setStep(0);
              setDone(false);
            }}
          >
            다시 하기
          </button>
        }
      >
        <ResultView result={result} onSave={save} saving={saving} />
      </Overlay>
    );
  }

  return (
    <Overlay title={`피부 유형 검사 ${step + 1}/${QUIZ.length}`} onClose={popOverlay}>
      <div className="quiz">
        <div className="progress">
          <div className="progress__bar" style={{ width: `${Math.round(((step + 1) / QUIZ.length) * 100)}%` }} />
        </div>
        {step === 0 && (
          <p className="small muted mt-2">
            {savedCode
              ? `지난번 결과는 ${savedCode} 였어요. 다시 해서 덮어쓸 수 있어요.`
              : '15개 질문에 답하면 유분·민감·색소·주름 네 축으로 내 피부 유형을 알려드려요. 1분 정도 걸려요.'}
          </p>
        )}

        <div className="quiz__q">
          <div className="eyebrow">{['유분', '민감도', '색소 반응', '주름·탄력'][['oil', 'sensitivity', 'pigment', 'wrinkle'].indexOf(q.axis)]}</div>
          <h2 className="quiz__title">{q.question}</h2>
          {q.hint && <p className="quiz__hint">{q.hint}</p>}
        </div>

        <div className="option-list" role="radiogroup" aria-label={q.question}>
          {q.options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={answers[q.id] === i}
              className={`option${answers[q.id] === i ? ' is-selected' : ''}`}
              onClick={() => choose(i)}
            >
              <span className="option__icon bg-sky-2">{i + 1}</span>
              <span>
                <span className="option__title">{o.label}</span>
              </span>
              <span className="option__check">✓</span>
            </button>
          ))}
        </div>

        <div className="row mt-3">
          {step > 0 && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep((s) => s - 1)}>
              <Icon name="back" size={14} /> 이전
            </button>
          )}
          <span className="flex-1" />
          {answeredCount >= 6 && (
            <button type="button" className="btn btn--sm" onClick={() => setDone(true)}>
              여기까지 보고 결과 보기
            </button>
          )}
        </div>
        <p className="tiny muted mt-2 text-center">보기를 누르면 다음 질문으로 넘어가요. 답하지 않은 질문은 중간값으로 계산해요.</p>
      </div>
    </Overlay>
  );
}
