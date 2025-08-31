import { Panel, Project, CharacterSpec } from '../models/schema';

export function continuityHint(prev?: Panel, next?: Panel) {
  const hints: string[] = [];
  if (prev) hints.push(`Before: ${prev.actionDialogue}`);
  if (next) hints.push(`After: ${next.actionDialogue}`);
  return hints.join(' ');
}

export function detectCharacters(project: Project, panel: Panel): CharacterSpec[] {
  const text = `${panel.actionDialogue} ${panel.notes}`.toLowerCase();
  return project.styleBible.characters.filter((c) =>
    text.includes(c.name.toLowerCase())
  );
}

export function composeImagePrompt(
  project: Project,
  panel: Panel,
  prev?: Panel
) {
  const W = project.styleBible.world;
  const chars =
    detectCharacters(project, panel)
      .map(
        (c) =>
          `${c.name}: ${c.signature}; wardrobe: ${c.wardrobe}; face/hair: ${c.hairFace}; props: ${c.props}`
      )
      .join(' | ') || 'Background extras only';

  return [
    `PROJECT ${W.projectCodename} — Film storyboard thumbnail.`,
    `${W.renderingStyle}.`,
    `World: year ${W.timePeriod}, ${W.geography}, ${W.seasonWeather}; production design: ${W.productionDesign}.`,
    `Camera defaults: aspect ${W.cameraDefaults.aspect}, lens ${W.cameraDefaults.lens}, angle ${W.cameraDefaults.angle}.`,
    `Shot intent: ${panel.notes || 'neutral beat'}; duration ${panel.timeSeconds.toFixed(1)}s.`,
    `Characters: ${chars}.`,
    prev ? `Continuity: maintain positions/wardrobe from previous panel.` : '',
    `Composition: ${panel.actionDialogue || 'quiet moment'}.`,
    `Avoid: ${W.negatives}.`,
  ]
    .filter(Boolean)
    .join(' ');
}
