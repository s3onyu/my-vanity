import { useState } from 'react';
import type { RoutineFrequency, RoutineItem } from '@/types';
import { DAY_NAMES } from '@/lib/date';
import { frequencyHint, frequencyLabel, frequencyOf } from '@/engine/schedule';
import { Chip } from '@/components/ui/Chip';
import { useAppStore } from '@/store/useAppStore';

const KINDS: { kind: RoutineFrequency['kind']; label: string }[] = [
  { kind: 'daily', label: '매일' },
  { kind: 'alt', label: '격일' },
  { kind: 'weekdays', label: '요일 지정' },
];

/** 제품별 사용 빈도 선택 (요청 4번) — 매일 / 격일 / 요일 지정 */
export function FrequencyPicker({ item }: { item: RoutineItem }) {
  const setRoutineFrequency = useAppStore((s) => s.setRoutineFrequency);
  const showToast = useAppStore((s) => s.showToast);
  const current = frequencyOf(item);
  const [open, setOpen] = useState(false);

  const apply = async (freq: RoutineFrequency) => {
    await setRoutineFrequency(item.id, freq);
    showToast(`사용 빈도를 ${frequencyLabel(freq)}(으)로 바꿨어요`);
  };

  const toggleDay = async (d: number) => {
    const days = current.kind === 'weekdays' ? current.days : [];
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort((a, b) => a - b);
    await setRoutineFrequency(item.id, { kind: 'weekdays', days: next });
  };

  return (
    <div className="freq">
      <button type="button" className="freq__btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        🔁 {frequencyLabel(current)}
      </button>
      {open && (
        <div className="freq__panel">
          <div className="chip-row">
            {KINDS.map((k) => (
              <Chip
                key={k.kind}
                small
                active={current.kind === k.kind}
                onClick={() => apply(k.kind === 'weekdays' ? { kind: 'weekdays', days: current.kind === 'weekdays' ? current.days : [1, 4] } : { kind: k.kind } as RoutineFrequency)}
              >
                {k.label}
              </Chip>
            ))}
          </div>
          {current.kind === 'weekdays' && (
            <div className="chip-row mt-1" role="group" aria-label="쓰는 요일">
              {DAY_NAMES.map((name, d) => (
                <Chip key={d} small active={current.days.includes(d)} onClick={() => toggleDay(d)}>
                  {name}
                </Chip>
              ))}
            </div>
          )}
          <p className="tiny muted mt-1">{frequencyHint(current)}</p>
        </div>
      )}
    </div>
  );
}
