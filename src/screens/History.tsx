import { useState, type CSSProperties } from 'react';
import type { WorkoutRecord } from '../types';
import { DAY_COLORS } from '../data/program';
import { formatDate, formatDuration, formatWeight } from '../workout/engine';
import { Confirm, DayTag, TopBar } from '../ui';

interface Props {
  history: WorkoutRecord[];
  detailId?: string;
  onOpen: (id: string) => void;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export default function History(p: Props) {
  const [confirm, setConfirm] = useState(false);
  const sorted = [...p.history].sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
  const back = (
    <button className="btn-icon" onClick={p.onBack} aria-label="Atgal">
      ‹
    </button>
  );

  if (p.detailId) {
    const rec = sorted.find((r) => r.id === p.detailId);
    if (!rec) {
      return (
        <div className="screen">
          <TopBar left={back} />
          <p className="muted">Įrašas nerastas.</p>
        </div>
      );
    }
    return (
      <div className="screen" style={{ '--day': DAY_COLORS[rec.dayId] } as CSSProperties}>
        <TopBar left={back} center={<DayTag dayId={rec.dayId} />} />
        <h1 className="h-display title">{formatDate(rec.finishedAt)}</h1>
        <div className="stats">
          <div className="stat">
            <div className="h-display stat-num">{formatDuration(rec.durationSec)}</div>
            <div className="muted small">trukmė</div>
          </div>
          <div className="stat">
            <div className="h-display stat-num">
              {rec.totalSetsDone}/{rec.totalSetsPlanned}
            </div>
            <div className="muted small">setų atlikta</div>
          </div>
        </div>
        <ul className="sum-list">
          {rec.exercises.map((e) => (
            <li key={e.exerciseId}>
              <div className="sum-name">
                {e.name}
                <span className="muted small">
                  {' '}
                  {e.sets.length}/{e.plannedSets} setai
                </span>
              </div>
              <div className="muted small">{e.sets.length ? e.sets.map((st) => `${formatWeight(st.weightKg)} × ${st.reps}`).join(' · ') : 'praleista'}</div>
              {e.note && <div className="small">„{e.note}“</div>}
            </li>
          ))}
        </ul>
        {rec.note && <p className="card">„{rec.note}“</p>}
        {p.onDelete &&
          (confirm ? (
            <Confirm text="Ištrinti šią treniruotę iš istorijos?" yes="Ištrinti" no="Ne" danger onYes={() => p.onDelete!(rec.id)} onNo={() => setConfirm(false)} />
          ) : (
            <button className="btn btn-ghost danger-text" onClick={() => setConfirm(true)}>
              Ištrinti įrašą
            </button>
          ))}
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar left={back} center={<span className="top-ex">Istorija</span>} />
      {sorted.length === 0 ? (
        <p className="muted">Dar nėra išsaugotų treniruočių. Užbaigus treniruotę spausk „Išsaugoti treniruotę“.</p>
      ) : (
        <ul className="hist-list">
          {sorted.map((r) => (
            <li key={r.id}>
              <button className="hist-row" style={{ '--day': DAY_COLORS[r.dayId] } as CSSProperties} onClick={() => p.onOpen(r.id)}>
                <span className="hist-day h-display">{r.dayId}</span>
                <span className="hist-main">
                  <span>{formatDate(r.finishedAt)}</span>
                  <span className="muted small">
                    {formatDuration(r.durationSec)} · {r.totalSetsDone}/{r.totalSetsPlanned} setų
                  </span>
                </span>
                <span className="chev">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
