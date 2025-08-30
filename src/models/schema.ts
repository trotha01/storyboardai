export type Panel = {
  id: string;
  cutNumber: number;
  timeSeconds: number;
  actionDialogue: string;
  notes: string;
  imagePrompt: string;
  imageDataUrl?: string;
  history: Array<{
    ts: string;
    actionDialogue: string;
    notes: string;
    imagePrompt: string;
    imageDataUrl?: string;
    changeReason: string;
  }>;
};

export type Turnarounds = {
  sheet: string | null;
  front: string | null;
  threeQuarter: string | null;
  profile: string | null;
  back: string | null;
  expressions?: {
    neutral?: string | null;
    smile?: string | null;
    concern?: string | null;
  };
};

export type WorldSpec = {
  projectCodename: string;
  timePeriod: string;
  geography: string;
  seasonWeather: string;
  productionDesign: string;
  cameraDefaults: { aspect: '16:9' | '3:2'; lens: string; angle: string };
  renderingStyle: string;
  negatives: string;
};

export type CharacterSpec = {
  name: string;
  role: string;
  signature: string;
  wardrobe: string;
  hairFace: string;
  props: string;
  seedHint?: number;
  refImages?: string[];
  turnarounds?: Turnarounds;
};

export type StyleBible = {
  world: WorldSpec;
  characters: CharacterSpec[];
};

export type Project = {
  projectTitle: string;
  pageSize: 'A4' | 'Letter';
  seed?: number;
  textModel: string;
  imageModel: string;
  styleBible: StyleBible;
  panels: Panel[];
};
