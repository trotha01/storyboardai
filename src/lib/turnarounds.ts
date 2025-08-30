import { Project, CharacterSpec } from '../models/schema';
import { turnaroundPrompt } from '../prompts/turnarounds';
import { generateImage } from './openai';

const VIEWS = ['front', 'threeQuarter', 'profile', 'back'] as const;
type View = typeof VIEWS[number];

export async function generateTurnarounds(project: Project, apiKey: string) {
  const world = project.styleBible.world;
  for (const c of project.styleBible.characters) {
    const tr =
      c.turnarounds ??
      (c.turnarounds = {
        front: null,
        threeQuarter: null,
        profile: null,
        back: null,
        expressions: {},
      });
    for (const view of VIEWS) {
      const prompt = turnaroundPrompt(world, c, view);
      const img = await generateImage({
        apiKey,
        model: project.imageModel,
        prompt,
        size: '1024x1024',
        seed: c.seedHint,
      });
      tr[view] = img.dataUrl;
    }
    for (const expr of ['neutral', 'smile', 'concern'] as const) {
      const prompt = turnaroundPrompt(world, c, 'front', expr);
      const img = await generateImage({
        apiKey,
        model: project.imageModel,
        prompt,
        size: '1024x1024',
        seed: c.seedHint,
      });
      tr.expressions![expr] = img.dataUrl;
    }
  }
}
