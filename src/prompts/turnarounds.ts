import { WorldSpec, CharacterSpec } from '../models/schema';

export const TURNAROUND_SYSTEM = `
You generate neutral character turnarounds for animation model sheets.
Output should be consistent across views. No background, plain white.
Hand-drawn pencil look, black & white, grayscale wash, minimal shading, thick black frame, clean linework, no color, no logos, no text overlay.
`;

// Single-sheet prompt: front, 3/4 front, profile and back in one image
export function turnaroundPrompt(world: WorldSpec, c: CharacterSpec) {
  return [
    `PROJECT ${world.projectCodename} — Character turnaround sheet.`,
    `${world.renderingStyle}.`,
    `Year ${world.timePeriod}, ${world.geography}.`,
    `Subject: ${c.name} — ${c.signature}. Wardrobe: ${c.wardrobe}. Face/hair: ${c.hairFace}. Props: ${c.props}.`,
    `Show four full-body views left-to-right: FRONT, 3/4 FRONT, PROFILE, BACK. Neutral pose, arms slightly away from body.`,
    `Plain white background. Each view full body head to sandals, centered, consistent height.`,
    `Avoid: ${world.negatives}, no background elements, no scenery.`,
  ].join(' ');
}
