import React, { useState } from 'react';
import { Panel, Project, StyleBible } from '../models/schema';
import { openaiChat, generateImage } from '../lib/openai';
import { PLANNER_SYSTEM, plannerUserPrompt } from '../prompts/planner';
import { defaultStyleBible } from '../state/useStore';
import { generateTurnarounds } from '../lib/turnarounds';
import { turnaroundPrompt } from '../prompts/turnarounds';

interface Props {
  apiKey: string;
  onCreate: (p: Project) => void;
}

export default function NewProjectForm({ apiKey, onCreate }: Props) {
  const [title, setTitle] = useState('Untitled');
  const [count, setCount] = useState(4);
  const [description, setDescription] = useState('');
  const [styleBible, setStyleBible] = useState<StyleBible>(
    JSON.parse(JSON.stringify(defaultStyleBible))
  );
  const [turnLoading, setTurnLoading] = useState(false);
  const [turnReady, setTurnReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const genTurnarounds = async () => {
    if (!apiKey) {
      alert('API key required');
      return;
    }
    setTurnLoading(true);
    try {
      const proj: Project = {
        projectTitle: title,
        pageSize: 'A4',
        textModel: 'gpt-4o-mini',
        imageModel: 'gpt-image-1',
        styleBible,
        panels: [],
      };
      await generateTurnarounds(proj, apiKey);
      setStyleBible({ ...proj.styleBible });
      setTurnReady(true);
    } catch (e) {
      console.error(e);
      alert('Failed to generate turnarounds');
    } finally {
      setTurnLoading(false);
    }
  };

  const regenerate = async (
    ci: number,
    view: 'front' | 'threeQuarter' | 'profile' | 'back'
  ) => {
    try {
      const c = styleBible.characters[ci];
      const prompt = turnaroundPrompt(styleBible.world, c, view as any);
      const img = await generateImage({
        apiKey,
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        seed: c.seedHint,
      });
      c.turnarounds = c.turnarounds || {
        front: null,
        threeQuarter: null,
        profile: null,
        back: null,
        expressions: {},
      };
      (c.turnarounds as any)[view] = img.dataUrl;
      setStyleBible({ ...styleBible });
    } catch (e) {
      console.error(e);
      alert('Failed to regenerate view');
    }
  };

  const generateStory = async () => {
    if (!apiKey) {
      alert('API key required');
      return;
    }
    setStoryLoading(true);
    try {
      const res = await openaiChat(apiKey, {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: PLANNER_SYSTEM },
          { role: 'user', content: plannerUserPrompt(title, description, count) },
        ],
      });
      const content = res.choices[0].message.content;
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
        styleBible,
        panels,
      });
    } catch (e) {
      console.error(e);
      alert('Failed to generate panels');
    } finally {
      setStoryLoading(false);
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
      {!turnReady && (
        <button onClick={genTurnarounds} disabled={turnLoading}>
          {turnLoading ? 'Generating...' : 'Generate Turnarounds'}
        </button>
      )}
      {turnReady && !accepted && (
        <div className="turnarounds">
          {styleBible.characters.map((c, ci) => (
            <div key={c.name} className="character-turnarounds">
              <h4>{c.name}</h4>
              {(['front', 'threeQuarter', 'profile', 'back'] as const).map(
                (view) => (
                  <div key={view}>
                    {c.turnarounds && (
                      <img src={(c.turnarounds as any)[view]} alt={view} />
                    )}
                    <button onClick={() => regenerate(ci, view)}>Regenerate</button>
                  </div>
                )
              )}
            </div>
          ))}
          <button onClick={() => setAccepted(true)}>Accept Turnarounds</button>
        </div>
      )}
      {accepted && (
        <button onClick={generateStory} disabled={storyLoading}>
          {storyLoading ? 'Generating...' : 'Generate Storyboard'}
        </button>
      )}
    </div>
  );
}
