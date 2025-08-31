import React, { useState } from 'react';
import Button from './Button';
import Spinner from './Spinner';
import type { Panel } from '../models/schema';

interface Props {
  row: Panel;
  onGenerate: (p: Panel) => Promise<void> | void;
}

export default function PanelCard({ row, onGenerate }: Props) {
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate(row);
    setLoading(false);
  };
  return (
    <div>
      <div className="relative aspect-video rounded-xl bg-[#111] overflow-hidden ring-4 ring-black/80">
        {loading && <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)] animate-pulse" />}
        {row.imageDataUrl ? (
          <img src={row.imageDataUrl} className="w-full h-full object-cover" alt={`Cut ${row.id}`} />
        ) : (
          <div className="grid place-content-center h-full text-white/70">No image</div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button variant="primary" onClick={handleGenerate} aria-label={`Generate image for cut ${row.cutNumber}`}>
          {row.imageDataUrl ? 'Regenerate' : 'Generate'}
        </Button>
        <Button variant="ghost">Edit Prompt</Button>
        {loading && <Spinner label="Generating…" />}
      </div>

      <div className="mt-2 text-[var(--muted-ink)] text-[var(--fs-0)]">Cut #{row.cutNumber}</div>
    </div>
  );
}
