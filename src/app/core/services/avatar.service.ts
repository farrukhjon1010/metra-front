import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {GenerateAvatarDto, AvatarResponse, Avatar, CreateAvatarDto, UpdateAvatarDto} from '../models/avatar.model';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly apiUrl = `avatars`;

  constructor(private http: HttpClient) {
  }

  generateAvatar(data: GenerateAvatarDto): Observable<AvatarResponse> {
    return this.http.post<AvatarResponse>(`${this.apiUrl}/generate-avatar`, data);
  }

  create(dto: CreateAvatarDto): Observable<Avatar> {
    return this.http.post<Avatar>(this.apiUrl, dto);
  }

  findAll(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>(this.apiUrl);
  }

  findByUser(): Observable<Avatar> {
    return this.http.get<Avatar>(`${this.apiUrl}/my`);
  }

  update(id: string, dto: UpdateAvatarDto): Observable<Avatar> {
    return this.http.patch<Avatar>(`${this.apiUrl}/${id}`, dto);
  }

  addImgUrl(newUrl: string): Observable<Avatar> {
    return this.http.patch<Avatar>(`${this.apiUrl}/add`, { url: newUrl });
  }

  setMainAvatar(url: string): Observable<Avatar> {
    return this.http.patch<Avatar>(`${this.apiUrl}/set-main`, { url });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
