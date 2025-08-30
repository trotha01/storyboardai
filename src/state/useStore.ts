import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Panel, Project, StyleBible } from '../models/schema';

export const defaultStyleBible: StyleBible = {
  world: {
    projectCodename: 'GRAPHITE-TEPEYAC',
    timePeriod: '1531',
    geography:
      'Valley of Mexico around Tepeyac hill and the causeways near Lake Texcoco',
    seasonWeather:
      'early winter (December), crisp morning, clear sky after recent rain',
    productionDesign:
      'maguey (agave) and nopal patches, chinampa edges and canals, packed-earth paths, thatched-roof adobe huts, simple wooden carts, a modest Franciscan chapel in the distance',
    cameraDefaults: { aspect: '16:9', lens: '35mm', angle: 'eye-level' },
    renderingStyle:
      'hand-drawn pencil, black and white, grayscale wash, minimal shading, thick black frame, clean linework, no color, no logos, no text overlay',
    negatives:
      'no modern clothing, no steel zippers, no plastic, no neon signs, no paved roads, no baroque architecture (keep pre/early-colonial simplicity), no firearms on-screen, no glass windows with panes',
  },
  characters: [
    {
      name: 'Juan Diego',
      role: 'protagonist (Nahua convert, ~57 years old)',
      signature: 'slender, humble posture, middle height; carries folded tilma across chest',
      wardrobe:
        'ayate tilma (maguey-fiber cloak) draped over shoulders and tied at chest, simple cotton maxtlatl/loincloth under a knee-length cotton tunic, cactli (leather sandals)',
      hairFace: 'short straight dark hair, weathered face, sparse beard, thoughtful eyes',
      props: 'tilma, woven sling bag, rosary of wooden beads',
      seedHint: 531,
    },
    {
      name: 'Juan Bernardino',
      role: 'uncle (elder, recovering from illness)',
      signature: 'older, thinner, slightly stooped; leans when walking',
      wardrobe:
        'cotton tunic with a woven blanket/tilmatli wrapped around shoulders, cactli sandals',
      hairFace: 'grayer short hair, deeper wrinkles, kind eyes',
      props: 'walking staff, woolen blanket',
      seedHint: 1531,
    },
  ],
};

interface State {
  project: Project | null;
  history: Project[];
  future: Project[];
  useTurnaroundsBase: boolean;
  setUseTurnaroundsBase: (v: boolean) => void;
  setProject: (p: Project) => void;
  updatePanel: (panel: Panel) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<State>()(
  devtools((set, get) => ({
    project: null,
    history: [],
    future: [],
    useTurnaroundsBase: true,
    setUseTurnaroundsBase: (v) => set({ useTurnaroundsBase: v }),
    setProject: (p) => set({ project: p, history: [], future: [] }),
    updatePanel: (panel) =>
      set((state) => {
        if (!state.project) return {};
        const nextProject: Project = {
          ...state.project,
          panels: state.project.panels.map((p) =>
            p.id === panel.id ? panel : p
          ),
        };
        return {
          project: nextProject,
          history: [...state.history, state.project],
          future: [],
        };
      }),
    undo: () =>
      set((state) => {
        const prev = state.history.pop();
        if (!prev) return {};
        return {
          project: prev,
          history: [...state.history],
          future: [state.project!, ...state.future],
        };
      }),
    redo: () =>
      set((state) => {
        const next = state.future.shift();
        if (!next) return {};
        return {
          project: next,
          history: [...state.history, state.project!],
          future: [...state.future],
        };
      }),
  }))
);
