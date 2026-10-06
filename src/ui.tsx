import type { ReactNode } from 'react';
import type { DayId } from './types';
import { DAY_COLORS } from './data/program';

export function DayTag({ dayId }: { dayId: DayId }) {
  return (
    <span className="tag" style={{ background: DAY_COLORS[dayId] }}>
      {dayId} DIENA
    </span>
  );
}

export function ProgressBar({ percent, color }: { percent: number; color?: string }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="bar" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-fill" style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

export function TopBar({ left, center, right }: { left?: ReactNode; center?: ReactNode; right?: ReactNode }) {
  return (
    <div className="topbar">
      <div className="topbar-side">{left}</div>
      <div className="topbar-center">{center}</div>
      <div className="topbar-side right">{right}</div>
    </div>
  );
}

export function Confirm({
  text,
  yes,
  no,
  onYes,
  onNo,
  danger,
  extra,
}: {
  text: string;
  yes: string;
  no: string;
  onYes: () => void;
  onNo: () => void;
  danger?: boolean;
  extra?: ReactNode;
}) {
  return (
    <div className="confirm" role="alertdialog">
      <span>{text}</span>
      <div className="row wrap">
        <button className={'btn btn-sm ' + (danger ? 'btn-danger' : 'btn-day')} onClick={onYes}>
          {yes}
        </button>
        <button className="btn btn-sm btn-ghost" onClick={onNo}>
          {no}
        </button>
        {extra}
      </div>
    </div>
  );
}
