import localforage from 'localforage';
import { Project } from '../models/schema';

const store = localforage.createInstance({ name: 'storyboardsmith' });

export async function saveProject(project: Project) {
  await store.setItem(project.projectTitle, project);
}

export async function loadProject(title: string) {
  return store.getItem(title);
}

export async function listProjects() {
  return store.keys();
}
