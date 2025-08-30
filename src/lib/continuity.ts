import { Panel } from '../models/schema';

export function continuityHint(prev?: Panel, next?: Panel) {
  const hints: string[] = [];
  if (prev) hints.push(`Before: ${prev.actionDialogue}`);
  if (next) hints.push(`After: ${next.actionDialogue}`);
  return hints.join(' ');
}
