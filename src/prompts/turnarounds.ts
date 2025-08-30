import { WorldSpec, CharacterSpec } from '../models/schema';

export const TURNAROUND_SYSTEM = `
You generate neutral character turnarounds for animation model sheets.
Output should be consistent across views. No background, plain white.
Hand-drawn pencil look, black & white, grayscale wash, minimal shading, thick black frame, clean linework, no color, no logos, no text overlay.
`;

export function turnaroundPrompt(
  world: WorldSpec,
  c: CharacterSpec,
  view: 'front' | 'threeQuarter' | 'profile' | 'back',
  expr?: 'neutral' | 'smile' | 'concern'
) {
  const viewText = (
    {
      front: 'full-body FRONT view, standing neutral, arms slightly away from body',
      threeQuarter: 'full-body 3/4 FRONT view (turned 30°), standing neutral',
      profile: 'full-body true PROFILE (left), standing neutral',
      back: 'full-body BACK view, standing neutral',
    } as const
  )[view];

  const expressionText = expr
    ? `facial expression: ${expr}`
    : 'facial expression: neutral';

  return [
    `PROJECT ${world.projectCodename} — Character turnaround.`,
    `${world.renderingStyle}.`,
    `Year ${world.timePeriod}, ${world.geography}.`,
    `Subject: ${c.name} — ${c.signature}. Wardrobe: ${c.wardrobe}. Face/hair: ${c.hairFace}. Props: ${c.props}.`,
    `${viewText}. ${expressionText}.`,
    `Plain white background. Full body visible head to sandals, centered, consistent height.`,
    `Avoid: ${world.negatives}, no background elements, no scenery.`,
  ].join(' ');
}
