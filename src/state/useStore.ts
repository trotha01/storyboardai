import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Panel, Project } from '../models/schema';

interface State {
  project: Project | null;
  history: Project[];
  future: Project[];
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
