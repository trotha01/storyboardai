import React, { useState } from 'react';
import { Panel, Project, StyleBible } from '../models/schema';
import { openaiChat, generateImage } from '../lib/openai';
import { PLANNER_SYSTEM, plannerUserPrompt } from '../prompts/planner';
import { defaultStyleBible } from '../state/useStore';
import { turnaroundPrompt } from '../prompts/turnarounds';

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
  const [prompts, setPrompts] = useState<Record<number, Record<string, string>>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const prepareTurnarounds = () => {
    const p: Record<number, Record<string, string>> = {};
    styleBible.characters.forEach((c, ci) => {
      p[ci] = {};
      (['front', 'threeQuarter', 'profile', 'back'] as const).forEach((view) => {
        p[ci][view] = turnaroundPrompt(styleBible.world, c, view);
      });
      (['neutral', 'smile', 'concern'] as const).forEach((expr) => {
        p[ci][`expr-${expr}`] = turnaroundPrompt(
          styleBible.world,
          c,
          'front',
          expr
        );
      });
    });
    setPrompts(p);
    setTurnReady(true);
  };

  const generateOne = async (ci: number, key: string) => {
    const prompt = prompts[ci][key];
    if (!prompt) return;
    if (!apiKey) {
      alert('API key required');
      return;
    }
    const loadingKey = `${ci}-${key}`;
    setLoading({ ...loading, [loadingKey]: true });
    try {
      const c = styleBible.characters[ci];
      const img = await generateImage({
        apiKey,
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        seed: c.seedHint,
      });
      c.turnarounds =
        c.turnarounds || {
          front: null,
          threeQuarter: null,
          profile: null,
          back: null,
          expressions: {},
        };
      if (key.startsWith('expr-')) {
        const expr = key.replace('expr-', '') as 'neutral' | 'smile' | 'concern';
        c.turnarounds.expressions = c.turnarounds.expressions || {};
        c.turnarounds.expressions[expr] = img.dataUrl;
      } else {
        (c.turnarounds as any)[key] = img.dataUrl;
      }
      setStyleBible({ ...styleBible });
    } catch (e) {
      console.error(e);
      alert('Failed to generate view');
    } finally {
      setLoading({ ...loading, [loadingKey]: false });
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
              {(['front', 'threeQuarter', 'profile', 'back'] as const).map((view) => (
                <div key={view}>
                  <textarea
                    value={prompts[ci][view]}
                    onChange={(e) =>
                      setPrompts({
                        ...prompts,
                        [ci]: { ...prompts[ci], [view]: e.target.value },
                      })
                    }
                  />
                  {c.turnarounds && (c.turnarounds as any)[view] && (
                    <img src={(c.turnarounds as any)[view]} alt={view} />
                  )}
                  <button
                    onClick={() => generateOne(ci, view)}
                    disabled={loading[`${ci}-${view}`]}
                  >
                    {c.turnarounds && (c.turnarounds as any)[view]
                      ? loading[`${ci}-${view}`]
                        ? 'Regenerating...'
                        : 'Regenerate'
                      : loading[`${ci}-${view}`]
                      ? 'Generating...'
                      : 'Generate'}
                  </button>
                </div>
              ))}
              <div className="expressions">
                {(['neutral', 'smile', 'concern'] as const).map((expr) => {
                  const key = `expr-${expr}`;
                  return (
                    <div key={key}>
                      <textarea
                        value={prompts[ci][key]}
                        onChange={(e) =>
                          setPrompts({
                            ...prompts,
                            [ci]: { ...prompts[ci], [key]: e.target.value },
                          })
                        }
                      />
                      {c.turnarounds?.expressions?.[expr] && (
                        <img src={c.turnarounds.expressions[expr] || undefined} alt={expr} />
                      )}
                      <button
                        onClick={() => generateOne(ci, key)}
                        disabled={loading[`${ci}-${key}`]}
                      >
                        {c.turnarounds?.expressions?.[expr]
                          ? loading[`${ci}-${key}`]
                            ? 'Regenerating...'
                            : 'Regenerate'
                          : loading[`${ci}-${key}`]
                          ? 'Generating...'
                          : 'Generate'}
                      </button>
                    </div>
                  );
                })}
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
