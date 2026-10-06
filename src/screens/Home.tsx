import { useState, type CSSProperties } from 'react';
import type { DayId, Session, Settings, WorkoutRecord } from '../types';
import { DAYS, DAY_COLORS, PROGRAM_GOAL, getDay } from '../data/program';
import { formatDate, lastDoneByDay, progress } from '../workout/engine';
import { useInstallPrompt } from '../hooks';
import { Confirm, DayTag } from '../ui';

interface Props {
  session: Session | null;
  history: WorkoutRecord[];
  settings: Settings;
  onSettings: (s: Settings) => void;
  onPickDay: (d: DayId) => void;
  onResume: () => void;
  onDiscard: () => void;
  onHistory: () => void;
}

export default function Home(p: Props) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const install = useInstallPrompt();
  const lastByDay = lastDoneByDay(p.history);
  const newest = [...p.history].sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))[0];
  const active = p.session;
  const activeDay = active ? getDay(active.dayId) : null;
  const prog = active && activeDay ? progress(active, activeDay) : null;

  return (
    <div className="screen home">
      <header className="hero" style={{ backgroundImage: 'url(assets/cover.webp)' }}>
        <div className="hero-shade" />
        <div className="hero-text">
          <div className="eyebrow">3 dienų programa</div>
          <h1 className="h-display hero-title">
            Kyokushin
            <br />
            Training
          </h1>
          <p className="muted small">{PROGRAM_GOAL}</p>
        </div>
      </header>

      {active && activeDay && (
        <section className="card resume" style={{ '--day': DAY_COLORS[active.dayId] } as CSSProperties}>
          <div className="row between">
            <DayTag dayId={active.dayId} />
            <span className="muted small">pradėta {formatDate(active.startedAt)}</span>
          </div>
          <div className="resume-title">
            {active.phase === 'FINISHED'
              ? 'Treniruotė baigta, bet dar neišsaugota'
              : `Pratimas ${active.exerciseIndex + 1}/${activeDay.exercises.length} · atlikta ${prog?.done}/${prog?.planned} setų`}
          </div>
          <div className="row">
            <button className="btn btn-day grow" onClick={p.onResume}>
              {active.phase === 'FINISHED' ? 'Peržiūrėti suvestinę' : 'Tęsti pradėtą treniruotę'}
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmDiscard(true)}>
              Atmesti
            </button>
          </div>
          {confirmDiscard && (
            <Confirm
              text="Atmesti pradėtą treniruotę? Jos duomenys bus prarasti."
              yes="Atmesti"
              no="Ne"
              danger
              onYes={p.onDiscard}
              onNo={() => setConfirmDiscard(false)}
            />
          )}
        </section>
      )}

      <section className="days">
        {DAYS.map((d) => (
          <button key={d.id} className="day-card" style={{ '--day': DAY_COLORS[d.id] } as CSSProperties} onClick={() => p.onPickDay(d.id)}>
            <span className="day-letter h-display">{d.id}</span>
            <span className="day-body">
              <span className="day-name h-display">{d.name}</span>
              <span className="day-sub">{d.subtitle}</span>
              <span className="muted small">{lastByDay[d.id] ? 'Paskutinį kartą: ' + formatDate(lastByDay[d.id] as string) : 'Dar nedaryta'}</span>
            </span>
            <span className="chev">›</span>
          </button>
        ))}
      </section>

      <section className="row between wrap">
        <div className="muted small">{newest ? 'Paskutinė treniruotė: ' + formatDate(newest.finishedAt) : 'Išsaugotų treniruočių dar nėra'}</div>
        <button className="btn btn-outline" onClick={p.onHistory}>
          Istorija ({p.history.length})
        </button>
      </section>

      <section className="card settings">
        <label className="switch">
          <input type="checkbox" checked={p.settings.sound} onChange={(e) => p.onSettings({ ...p.settings, sound: e.target.checked })} />
          Garsas timerio gale
        </label>
        <label className="switch">
          <input type="checkbox" checked={p.settings.vibrate} onChange={(e) => p.onSettings({ ...p.settings, vibrate: e.target.checked })} />
          Vibracija timerio gale
        </label>
      </section>

      {!install.isStandalone && install.canInstall && (
        <button className="btn btn-outline" onClick={install.promptInstall}>
          Įdiegti programėlę į telefoną
        </button>
      )}
      {!install.isStandalone && !install.canInstall && install.isIOS && (
        <button className="btn btn-outline" onClick={() => setShowIosHint((v) => !v)}>
          Kaip įsidėti į pradžios ekraną
        </button>
      )}
      {showIosHint && <p className="muted small">Safari: spausk „Dalintis“ (kvadratas su rodykle) ir pasirink „Į pradžios ekraną“ (Add to Home Screen).</p>}
    </div>
  );
}
