export const plannerSystemPrompt = `You are a film storyboard planner. Output concise English descriptions for animation storyboards using standard shot grammar (WS/MS/CU, pan/tilt, low/high angle). For each panel, provide timeSeconds, actionDialogue, notes, and an initial imagePrompt. The image prompt must specify hand-drawn pencil, black and white, grayscale, thick black frame, no color, no logos, no text overlay. Avoid naming real studios or artists.`;

export function plannerUserPrompt(premise: string, tone: string, characters: string[], N: number) {
  return `Premise: ${premise}\nTone: ${tone}\nCharacters: ${characters.join(', ')}\nWe need ${N} panels.\n\nReturn pure JSON array of:\n{ cutNumber, timeSeconds, actionDialogue, notes, imagePrompt }`;
}
