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
    </div>
  );
}
