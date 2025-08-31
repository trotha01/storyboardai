import React from 'react';

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
    <div className="topbar">
      <input
        type="password"
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={onNew}>New</button>
      <button onClick={onSave}>Save</button>
      <button onClick={onLoad}>Load</button>
      <button onClick={onExportPdf}>Export PDF</button>
      <button onClick={onGenerateImages} disabled={!hasProject || !apiKey}>
        Generate Images
      </button>
      <label style={{ marginLeft: '8px' }}>
        <input
          type="checkbox"
          checked={useTurnaroundsBase}
          onChange={(e) => setUseTurnaroundsBase(e.target.checked)}
        />
        Use Turnarounds
      </label>
    </div>
  );
}
