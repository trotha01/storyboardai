import { Project, Panel, CharacterSpec } from '../models/schema';
import { composeImagePrompt, detectCharacters } from './continuity';
import { generateImage } from './openai';

function pickTurnaround(c: CharacterSpec, panel: Panel): string | undefined {
  const tr = c.turnarounds;
  if (!tr) return undefined;
  const n = (panel.notes || '').toLowerCase();
  if (n.includes('from behind') || n.includes('back'))
    return tr.back || tr.threeQuarter || tr.front || undefined;
  if (n.includes('profile'))
    return tr.profile || tr.threeQuarter || tr.front || undefined;
  return tr.threeQuarter || tr.front || tr.profile || tr.back || undefined;
}

export async function generatePanelImage(
  project: Project,
  apiKey: string,
  panel: Panel,
  prev?: Panel,
  useTurnarounds = true
) {
  const prompt = composeImagePrompt(project, panel, prev);
  const chars = detectCharacters(project, panel);
  const firstWithRef =
    useTurnarounds && chars.map((c) => pickTurnaround(c, panel)).find(Boolean);

  if (firstWithRef) {
    return await generateImage({
      apiKey,
      model: project.imageModel,
      prompt,
      mode: 'img2img',
      initImageDataUrl: firstWithRef!,
    });
  } else {
    return await generateImage({
      apiKey,
      model: project.imageModel,
      prompt,
    });
  }
}
