import React from 'react';
import Button from './Button';
import Toggle from './Toggle';

interface Props {
  apiKey: string;
  setApiKey: (k: string) => void;
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPdf: () => void;
  onGenerateImages: () => void;
  hasProject: boolean;
  useTurnaroundsBase: boolean;
  setUseTurnaroundsBase: (v: boolean) => void;
}

export default function TopBar({
  apiKey,
  setApiKey,
  onNew,
  onSave,
  onLoad,
  onExportPdf,
  onGenerateImages,
  hasProject,
  useTurnaroundsBase,
  setUseTurnaroundsBase,
}: Props) {
  return (
    <header className="toolbar">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-3">
        <h1 className="text-[var(--ink)] text-[var(--fs-4)] font-semibold">Storyboard</h1>
        <input
          type="password"
          placeholder="OpenAI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="ml-4 px-3 py-2 border border-[var(--stroke)] rounded-xl bg-[var(--surface)] text-[var(--ink)]"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" onClick={onNew}>New</Button>
          <Button variant="ghost" onClick={onSave}>Save</Button>
          <Button variant="ghost" onClick={onLoad}>Load</Button>
          <Button variant="ghost" onClick={onExportPdf}>Export PDF</Button>
          <div className="w-px h-6 bg-[var(--stroke)] mx-1" />
          <Toggle id="useTurnarounds" label="Use Turnarounds" checked={useTurnaroundsBase} onChange={setUseTurnaroundsBase} />
          <Button variant="primary" onClick={onGenerateImages} disabled={!hasProject || !apiKey}>
            Generate Images
          </Button>
        </div>
      </div>
    </header>
  );
}
