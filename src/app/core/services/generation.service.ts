import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateImageDto, GenerationResponse, CreateGenerationDto, GenerationPromptResponse } from '../models/generation.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class GenerationService {
  private readonly apiUrl = `${environment.apiUrl}/generations`;

  constructor(private http: HttpClient) { }

  generateImage(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-image`, dto);
  }

  create(dto: any): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  findByUser(filter: 'all' | 'photo' | 'video' = 'all'): Observable<any[]> {
    const params = new HttpParams().set('filter', filter);
    return this.http.get<any[]>(`${this.apiUrl}/by-user`, { params });
  }

  findByCategory(type?: string): Observable<any[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);

    return this.http.get<any[]>(`${this.apiUrl}/by-category`, { params });
  }
  
  getPrompt(type: string): Observable<GenerationPromptResponse> {
    const params = new HttpParams().set('type', type);

    return this.http.get<GenerationPromptResponse>(
      `${this.apiUrl}/prompt`,
      { params }
    );
  }
}
