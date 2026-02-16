import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  getScenes<T>(params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>('/scenes', { params: httpParams });
  }

  createScene<T>(data: unknown): Observable<T> {
    return this.http.post<T>('/scenes', data);
  }

  deleteScene<T>(id: number): Observable<T> {
    return this.http.delete<T>(`/scenes/${id}`);
  }

  getSceneCategories<T>(): Observable<T> {
    return this.http.get<T>('/scene-categories');
  }

  createSceneCategory<T>(data: FormData): Observable<T> {
    return this.http.post<T>('/scene-categories', data);
  }

  deleteSceneCategory<T>(id: number): Observable<T> {
    return this.http.delete<T>(`/scene-categories/${id}`);
  }

  getUserBalance<T>(): Observable<T> {
    return this.http.get<T>('/api/user/balance');
  }

  addFunds<T>(amount: number): Observable<T> {
    return this.http.post<T>('/api/user/balance', { amount });
  }
}
