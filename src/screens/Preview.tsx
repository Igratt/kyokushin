import { useState, type CSSProperties } from 'react';
import type { Day } from '../types';
import { DAY_COLORS } from '../data/program';
import { Confirm, DayTag, TopBar } from '../ui';

interface Props {
  day: Day;
  restOverrides: Record<string, number>;
  onSetRest: (exerciseId: string, seconds: number | null) => void;
  onStart: () => void;
  onBack: () => void;
  hasActive: boolean;
}

export default function Preview(p: Props) {
  const [confirm, setConfirm] = useState(false);
  const totalSets = p.day.exercises.reduce((n, e) => n + e.sets, 0);
  const start = () => (p.hasActive ? setConfirm(true) : p.onStart());

  return (
    <div className="screen" style={{ '--day': DAY_COLORS[p.day.id] } as CSSProperties}>
      <TopBar
        left={
          <button className="btn-icon" onClick={p.onBack} aria-label="Atgal">
            ‹
          </button>
        }
        center={<DayTag dayId={p.day.id} />}
      />
      <h1 className="h-display title">{p.day.subtitle}</h1>
      <p className="muted small">
        {p.day.exercises.length} pratimai · {totalSets} setai. Poilsį po setu gali pakoreguoti čia, prieš startą.
      </p>

      <ol className="ex-list">
        {p.day.exercises.map((ex, i) => {
          const rest = p.restOverrides[ex.id] ?? ex.restSeconds;
          const changed = p.restOverrides[ex.id] !== undefined && p.restOverrides[ex.id] !== ex.restSeconds;
          return (
            <li key={ex.id} className="ex-row">
              <img src={ex.image} alt="" className="thumb" loading="lazy" />
              <div className="ex-main">
                <div className="ex-name">
                  <span className="num">{i + 1}</span>
                  {ex.name}
                </div>
                <div className="muted small">
                  {ex.sets} × {ex.reps}
                </div>
              </div>
              <div className="rest-ctl">
                <button className="btn-mini" onClick={() => p.onSetRest(ex.id, Math.max(15, rest - 15))} aria-label="Mažiau poilsio">
                  −
                </button>
                <span className={'rest-val' + (changed ? ' changed' : '')}>{rest} s</span>
                <button className="btn-mini" onClick={() => p.onSetRest(ex.id, Math.min(600, rest + 15))} aria-label="Daugiau poilsio">
                  +
                </button>
                {changed && (
                  <button className="link-mini" onClick={() => p.onSetRest(ex.id, null)}>
                    atstatyti
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="sticky-bottom">
        {confirm ? (
          <Confirm
            text="Yra nebaigta treniruotė. Pradėti naują ir ją atmesti?"
            yes="Pradėti naują"
            no="Ne"
            danger
            onYes={p.onStart}
            onNo={() => setConfirm(false)}
          />
        ) : (
          <button className="btn btn-xl btn-day" onClick={start}>
            Pradėti treniruotę
          </button>
        )}
      </div>
    </div>
  );
}
