import React, { useState } from 'react';
import { Panel, Project } from '../models/schema';

interface Props {
  onCreate: (p: Project) => void;
}

export default function NewProjectForm({ onCreate }: Props) {
  const [title, setTitle] = useState('Untitled');
  const [count, setCount] = useState(4);

  const submit = () => {
    const panels: Panel[] = Array.from({ length: count }, (_, i) => ({
      id: crypto.randomUUID(),
      cutNumber: i + 1,
      timeSeconds: 1,
      actionDialogue: '',
      notes: '',
      imagePrompt: '',
      history: [],
    }));
    onCreate({
      projectTitle: title,
      pageSize: 'A4',
      textModel: 'gpt-4o-mini',
      imageModel: 'gpt-image-1',
      panels,
    });
  };

  return (
    <div className="new-project-form">
      <h3>New Storyboard</h3>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Number of Panels</label>
      <input
      type="number"
      value={count}
      onChange={(e) => setCount(parseInt(e.target.value, 10))}
      />
      <button onClick={submit}>Create</button>
    </div>
  );
}
