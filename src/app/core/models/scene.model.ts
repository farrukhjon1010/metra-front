export interface Scene {
  id: number;
  mode: SceneMode;
  name: string;
  image: string;
  prompt: string;
  createdAt: string;
  category: SceneCategory;
}

export type SceneMode = 'Template' | 'FreeStyle';

export interface SceneCategory {
  id: number;
  name: string;
  createdAt: string;
  image: string;
  description: string;
}
