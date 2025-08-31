import React from 'react';
import { Panel } from '../models/schema';
import PanelCard from './PanelCard';

interface Props {
  panels: Panel[];
  onSelect: (p: Panel) => void;
  selectedId?: string;
  onGenerateImage: (p: Panel) => void;
}

export default function StoryboardTable({
  panels,
  onSelect,
  selectedId,
  onGenerateImage,
}: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Cut #</th>
          <th>Panel</th>
          <th>Action/Dialogue</th>
          <th>Notes</th>
          <th>Sec</th>
        </tr>
      </thead>
      <tbody>
        {panels.map((p) => (
          <PanelCard
            key={p.id}
            panel={p}
            selected={p.id === selectedId}
            onSelect={() => onSelect(p)}
            onGenerate={() => onGenerateImage(p)}
          />
        ))}
      </tbody>
    </table>
  );
}
