import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateImageDto, GenerationResponse, CreateGenerationDto, GenerationType } from '../models/generation.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })

export class GenerationService {
    private readonly apiUrl = `${environment.apiUrl}/generations`;

    constructor(private http: HttpClient) { }

    generateImage(dto: GenerateImageDto): Observable<GenerationResponse> {
        return this.http.post<GenerationResponse>(`${this.apiUrl}/generate-image`, dto);
    }

    create(dto: CreateGenerationDto): Observable<any> {
        return this.http.post(this.apiUrl, dto);
    }

    findAll(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    findByUser(userId: string, type?: GenerationType): Observable<any[]> {
        let params = new HttpParams().set('userId', userId);
        if (type) {
            params = params.set('type', type);
        }
        return this.http.get<any[]>(`${this.apiUrl}/by-user`, { params });
    }
}