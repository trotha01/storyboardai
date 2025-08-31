import React from 'react';
import PanelCard from './PanelCard';
import Field from './Field';
import type { Panel } from '../models/schema';

interface Props {
  row: Panel;
  onGenerate: (p: Panel) => Promise<void> | void;
  onChange: (p: Panel) => void;
  onSelect?: () => void;
  [key: string]: any;
}

export default function StoryboardRow({ row, onGenerate, onChange, onSelect }: Props) {
  return (
    <article onClick={onSelect} className="card grid md:grid-cols-[320px,1fr] gap-16 md:gap-8 p-4 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] shadow-sm">
      <PanelCard row={row} onGenerate={onGenerate} />
      <div className="space-y-3">
        <Field label="Action / Dialogue">
          <textarea
            value={row.actionDialogue}
            onChange={(e) => onChange({ ...row, actionDialogue: e.target.value })}
          />
        </Field>
        <div className="grid md:grid-cols-3 gap-3">
          <Field className="md:col-span-2" label="Notes">
            <textarea
              value={row.notes}
              onChange={(e) => onChange({ ...row, notes: e.target.value })}
            />
          </Field>
          <Field label="Sec">
            <input
              type="number"
              min={0}
              step={0.5}
              value={row.timeSeconds}
              onChange={(e) => onChange({ ...row, timeSeconds: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-[var(--stroke)] rounded-xl bg-[var(--surface)] text-[var(--ink)]"
            />
          </Field>
        </div>
      </div>
    </article>
  );
}
