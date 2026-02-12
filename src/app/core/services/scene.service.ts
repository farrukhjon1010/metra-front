import { Injectable } from '@angular/core';
import { Scene, SceneMode, SceneCategory } from '../models/scene.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SceneService {

  constructor(private api: ApiService) {}

  getScenes(filter?: { mode?: SceneMode; categoryId?: number }): Observable<Scene[]> {
    return this.api.getScenes<Scene[]>(filter);
  }

  createScene(data: { mode: SceneMode; name: string; image: string; prompt: string; categoryId: number }): Observable<Scene> {
    return this.api.createScene<Scene>(data);
  }

  deleteScene(id: number): Observable<void> {
    return this.api.deleteScene<void>(id);
  }

  getCategories(): Observable<SceneCategory[]> {
    return this.api.getSceneCategories<SceneCategory[]>();
  }

  createCategory(formData: FormData): Observable<SceneCategory> {
    return this.api.createSceneCategory<SceneCategory>(formData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.api.deleteSceneCategory<void>(id);
  }
}
