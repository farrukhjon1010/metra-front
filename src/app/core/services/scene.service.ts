import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Scene } from '../models/scene.model';

@Injectable({ providedIn: 'root' })
export class SceneService {
  constructor(private api: ApiService) {}

  getScenes(filter?: { type?: string }): Observable<Scene[]> {
    const params: any = {};
    if (filter?.type) {
      params.type = filter.type;
    }

    return this.api.getScenes(params).pipe(
      map((res: any) => res as Scene[]),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}
