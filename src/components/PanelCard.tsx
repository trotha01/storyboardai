import React from 'react';
import { Panel } from '../models/schema';

interface Props {
  panel: Panel;
  onSelect: () => void;
  selected: boolean;
}

export default function PanelCard({ panel, onSelect, selected }: Props) {
  return (
    <tr onClick={onSelect} style={{ background: selected ? '#eef' : undefined }}>
      <td>{panel.cutNumber}</td>
      <td>
        {panel.imageDataUrl ? (
          <img src={panel.imageDataUrl} className="panel-image" width={160} />
        ) : (
          <div
            className="panel-image"
            style={{ width: 160, height: 100, fontSize: 10, padding: 4 }}
          >
            {panel.imagePrompt}
          </div>
        )}
      </td>
      <td>{panel.actionDialogue}</td>
      <td>{panel.notes}</td>
      <td>{panel.timeSeconds.toFixed(1)}</td>
    </tr>
  );
}
