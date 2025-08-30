import React, { useState } from 'react';
import { Panel } from '../models/schema';

interface Props {
  panel: Panel;
  onChange: (p: Panel) => void;
}

export default function EditorSidebar({ panel, onChange }: Props) {
  const [actionDialogue, setAction] = useState(panel.actionDialogue);
  const [notes, setNotes] = useState(panel.notes);
  const [time, setTime] = useState(panel.timeSeconds);

  const apply = () => {
    onChange({ ...panel, actionDialogue, notes, timeSeconds: time });
  };

  return (
    <div className="editor-sidebar">
      <h3>Edit Panel</h3>
      <label>Action/Dialogue</label>
      <textarea value={actionDialogue} onChange={(e) => setAction(e.target.value)} />
      <label>Notes</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      <label>Seconds</label>
      <input
        type="number"
        step="0.1"
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
      />
      <button onClick={apply}>Apply</button>
    </div>
  );
}
