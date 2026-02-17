import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpscaleModel, UpscaleModelResponse } from '../models/upscale.model';

@Injectable({
  providedIn: 'root'
})
export class UpscaleService {

  private readonly apiUrl = 'correction-image/improve';

  constructor(private http: HttpClient) { }

  improveImage(imageUrl: string): Observable<UpscaleModelResponse> {
    const body: UpscaleModel = {
      imageUrl
    };

    return this.http.post<UpscaleModelResponse>(this.apiUrl, body);
  }
}