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

export const turnaroundsSchema = z.object({
  front: z.string().nullable(),
  threeQuarter: z.string().nullable(),
  profile: z.string().nullable(),
  back: z.string().nullable(),
  expressions: z
    .object({
      neutral: z.string().nullable().optional(),
      smile: z.string().nullable().optional(),
      concern: z.string().nullable().optional(),
    })
    .optional(),
});

export type Turnarounds = z.infer<typeof turnaroundsSchema>;

export const worldSpecSchema = z.object({
  projectCodename: z.string(),
  timePeriod: z.string(),
  geography: z.string(),
  seasonWeather: z.string(),
  productionDesign: z.string(),
  cameraDefaults: z.object({
    aspect: z.enum(['16:9', '3:2']),
    lens: z.string(),
    angle: z.string(),
  }),
  renderingStyle: z.string(),
  negatives: z.string(),
});

export type WorldSpec = z.infer<typeof worldSpecSchema>;

export const characterSpecSchema = z.object({
  name: z.string(),
  role: z.string(),
  signature: z.string(),
  wardrobe: z.string(),
  hairFace: z.string(),
  props: z.string(),
  seedHint: z.number().optional(),
  refImages: z.array(z.string()).optional(),
  turnarounds: turnaroundsSchema.optional(),
});

export type CharacterSpec = z.infer<typeof characterSpecSchema>;

export const styleBibleSchema = z.object({
  world: worldSpecSchema,
  characters: z.array(characterSpecSchema),
});

export type StyleBible = z.infer<typeof styleBibleSchema>;

export const projectSchema = z.object({
  projectTitle: z.string(),
  pageSize: z.enum(['A4', 'Letter']),
  seed: z.number().optional(),
  textModel: z.string(),
  imageModel: z.string(),
  styleBible: styleBibleSchema,
  panels: z.array(panelSchema),
});

export type Project = z.infer<typeof projectSchema>;
