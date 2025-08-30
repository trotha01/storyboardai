import { z } from 'zod';

export const panelSchema = z.object({
  id: z.string(),
  cutNumber: z.number(),
  timeSeconds: z.number(),
  actionDialogue: z.string(),
  notes: z.string(),
  imagePrompt: z.string(),
  imageDataUrl: z.string().optional(),
  history: z.array(z.object({
    ts: z.string(),
    actionDialogue: z.string(),
    notes: z.string(),
    imagePrompt: z.string(),
    imageDataUrl: z.string().optional(),
    changeReason: z.string(),
  })),
});

export type Panel = z.infer<typeof panelSchema>;

export const projectSchema = z.object({
  projectTitle: z.string(),
  pageSize: z.enum(['A4', 'Letter']),
  seed: z.number().optional(),
  textModel: z.string(),
  imageModel: z.string(),
  panels: z.array(panelSchema),
});

export type Project = z.infer<typeof projectSchema>;
