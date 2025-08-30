import React, { useState } from 'react';
import { Panel, Project } from '../models/schema';
import { openaiChat } from '../lib/openai';
import { plannerSystemPrompt } from '../prompts/planner';

interface Props {
  apiKey: string;
  onCreate: (p: Project) => void;
}

export default function NewProjectForm({ apiKey, onCreate }: Props) {
  const [title, setTitle] = useState('Untitled');
  const [count, setCount] = useState(4);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!apiKey) {
      alert('API key required');
      return;
    }
    setLoading(true);
    try {
      const res = await openaiChat(apiKey, {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: plannerSystemPrompt },
          {
            role: 'user',
            content: `Title: ${title}\nDescription: ${description}\nWe need ${count} panels.\n\nReturn pure JSON array of:\n{ cutNumber, timeSeconds, actionDialogue, notes, imagePrompt }`,
          },
        ],
      });
      const content = res.choices[0].message.content;
      // OpenAI may wrap JSON in Markdown code fences; extract the JSON portion
      const match = content.match(/```(?:json)?\n([\s\S]*?)```/);
      const jsonStr = match ? match[1] : content;
      const arr = JSON.parse(jsonStr);
      const panels: Panel[] = arr.map((p: any, i: number) => ({
        id: crypto.randomUUID(),
        cutNumber: p.cutNumber ?? i + 1,
        timeSeconds: p.timeSeconds ?? 1,
        actionDialogue: p.actionDialogue ?? '',
        notes: p.notes ?? '',
        imagePrompt: p.imagePrompt ?? '',
        history: [],
      }));
      onCreate({
        projectTitle: title,
        pageSize: 'A4',
        textModel: 'gpt-4o-mini',
        imageModel: 'gpt-image-1',
        panels,
      });
    } catch (e) {
      console.error(e);
      alert('Failed to generate panels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-project-form">
      <h3>New Storyboard</h3>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <label>Number of Panels</label>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(parseInt(e.target.value, 10))}
      />
      <button onClick={submit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
