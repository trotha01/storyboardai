import React from 'react';
import { Panel } from '../models/schema';

interface Props {
  key?: any;
  panel: Panel;
  onSelect: () => void;
  selected: boolean;
  onGenerate: () => void;
}

export default function PanelCard({ panel, onSelect, selected, onGenerate }: Props) {
  return (
    <tr onClick={onSelect} style={{ background: selected ? '#eef' : undefined }}>
      <td>{panel.cutNumber}</td>
      <td>
        {panel.imageDataUrl ? (
          <img
            src={panel.imageDataUrl}
            className="panel-image"
            width={192}
            height={128}
          />
        ) : (
          <div
            className="panel-image"
            style={{ width: 192, height: 128, fontSize: 10, padding: 4 }}
          >
            {panel.imagePrompt}
          </div>
        )}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
          >
            {panel.imageDataUrl ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </td>
      <td>{panel.actionDialogue}</td>
      <td>{panel.notes}</td>
      <td>{panel.timeSeconds.toFixed(1)}</td>
    </tr>
  );
}
