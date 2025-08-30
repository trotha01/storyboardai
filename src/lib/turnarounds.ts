import { Project } from '../models/schema';
import { turnaroundPrompt } from '../prompts/turnarounds';
import { generateImage } from './openai';

const VIEWS = ['front', 'threeQuarter', 'profile', 'back'] as const;
type View = typeof VIEWS[number];

async function splitSheet(dataUrl: string): Promise<Record<View, string>> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.width / 4;
      const h = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      const out: Record<View, string> = {
        front: '',
        threeQuarter: '',
        profile: '',
        back: '',
      };
      VIEWS.forEach((v, i) => {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, i * w, 0, w, h, 0, 0, w, h);
        out[v] = canvas.toDataURL('image/png');
      });
      resolve(out);
    };
    img.src = dataUrl;
  });
}

export async function generateTurnarounds(project: Project, apiKey: string) {
  const world = project.styleBible.world;
  for (const c of project.styleBible.characters) {
    const prompt = turnaroundPrompt(world, c);
    const img = await generateImage({
      apiKey,
      model: project.imageModel,
      prompt,
      size: '1024x1024',
      seed: c.seedHint,
    });
    const slices = await splitSheet(img.dataUrl);
    c.turnarounds = {
      front: slices.front,
      threeQuarter: slices.threeQuarter,
      profile: slices.profile,
      back: slices.back,
      expressions: {},
    };
  }
}

export { splitSheet as splitTurnaroundSheet };
