import React, { useState } from 'react';
import { Panel, Project, StyleBible } from '../models/schema';
import { openaiChat, generateImage } from '../lib/openai';
import { PLANNER_SYSTEM, plannerUserPrompt } from '../prompts/planner';
import { defaultStyleBible } from '../state/useStore';
import { turnaroundPrompt } from '../prompts/turnarounds';
import { splitTurnaroundSheet } from '../lib/turnarounds';

interface Props {
  apiKey: string;
  onCreate: (p: Project) => void;
}

export default function NewProjectForm({ apiKey, onCreate }: Props) {
  const [title, setTitle] = useState('Untitled');
  const [count, setCount] = useState(4);
  const [description, setDescription] = useState('');
  const [styleBible, setStyleBible] = useState(
    JSON.parse(JSON.stringify(defaultStyleBible))
  );
  const [turnReady, setTurnReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [prompts, setPrompts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const downloadSheet = (ci: number) => {
    const sheet = styleBible.characters[ci].turnarounds?.sheet;
    if (!sheet) return;
    const a = document.createElement('a');
    a.href = sheet;
    a.download = `${styleBible.characters[ci].name}-turnaround.png`;
    a.click();
  };

  const handleUpload = async (ci: number, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const slices = await splitTurnaroundSheet(dataUrl);
      const c = styleBible.characters[ci];
      c.turnarounds = {
        sheet: dataUrl,
        front: slices.front,
        threeQuarter: slices.threeQuarter,
        profile: slices.profile,
        back: slices.back,
        expressions: {},
      };
      setStyleBible({ ...styleBible });
    };
    reader.readAsDataURL(file);
  };

  const prepareTurnarounds = () => {
    const p: Record<number, string> = {};
    styleBible.characters.forEach((c, ci) => {
      p[ci] = turnaroundPrompt(styleBible.world, c);
    });
    setPrompts(p);
    setTurnReady(true);
  };

  const generateOne = async (ci: number) => {
    const prompt = prompts[ci];
    if (!prompt) return;
    if (!apiKey) {
      alert('API key required');
      return;
    }
    setLoading({ ...loading, [ci]: true });
    try {
      const c = styleBible.characters[ci];
      const img = await generateImage({
        apiKey,
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        seed: c.seedHint,
      });
      const slices = await splitTurnaroundSheet(img.dataUrl);
      c.turnarounds = {
        sheet: img.dataUrl,
        front: slices.front,
        threeQuarter: slices.threeQuarter,
        profile: slices.profile,
        back: slices.back,
        expressions: {},
      };
      setStyleBible({ ...styleBible });
    } catch (e) {
      console.error(e);
      alert('Failed to generate turnaround');
    } finally {
      setLoading({ ...loading, [ci]: false });
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
        <button onClick={prepareTurnarounds}>Prepare Turnaround Prompts</button>
      )}
      {turnReady && !accepted && (
        <div className="turnarounds">
          {styleBible.characters.map((c, ci) => (
            <div key={c.name} className="character-turnarounds">
              <h4>{c.name}</h4>
              <textarea
                value={prompts[ci]}
                onChange={(e) => setPrompts({ ...prompts, [ci]: e.target.value })}
              />
              {c.turnarounds?.sheet && (
                <img
                  className="turnaround-sheet"
                  src={c.turnarounds.sheet}
                  alt="turnaround sheet"
                />
              )}
              <div className="views">
                {(['front', 'threeQuarter', 'profile', 'back'] as const).map((view) => (
                  <img
                    key={view}
                    src={(c.turnarounds as any)?.[view] || undefined}
                    alt={view}
                  />
                ))}
              </div>
              <div className="actions">
                <button onClick={() => generateOne(ci)} disabled={loading[ci]}>
                  {c.turnarounds ? (loading[ci] ? 'Regenerating...' : 'Regenerate') : loading[ci] ? 'Generating...' : 'Generate'}
                </button>
                {c.turnarounds?.sheet && (
                  <button onClick={() => downloadSheet(ci)}>Download Sheet</button>
                )}
                <label className="upload-label">
                  Upload Sheet
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleUpload(ci, e.target.files?.[0])}
                  />
                </label>
              </div>
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
