import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Avatar, CreateAvatarDto, UpdateAvatarDto} from '../models/avatar.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarsService {

  constructor(private http: HttpClient) {
  }

  uploadPhotos(files: { front?: File; left?: File; right?: File }): Observable<{
    images: { key: string; url: string }[]
  }> {
    const form = new FormData();
    if (files.front) form.append('front', files.front);
    if (files.left) form.append('left', files.left);
    if (files.right) form.append('right', files.right);

    return this.http.post<{ images: { key: string; url: string }[] }>('/avatars/upload', form);
  }

  generateAvatars(dto: CreateAvatarDto): Observable<Avatar[]> {
    return this.http.post<Avatar[]>('/avatars/generate', dto);
  }

  confirmSelection(userId: string, selectedAvatarIds: string[]): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/avatars/confirm', {
      userId,
      selectedAvatarIds,
    });
  }

  createAvatar(dto: CreateAvatarDto): Observable<Avatar> {
    return this.http.post<Avatar>('/avatars', dto);
  }

  getAllAvatars(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>('/avatars');
  }

  getAvatarByUserId(userId: string): Observable<Avatar> {
    return this.http.get<Avatar>(`avatars/user/${userId}`);
  }

  updateAvatar(id: string, dto: UpdateAvatarDto): Observable<Avatar> {
    return this.http.put<Avatar>(`avatars/${id}`, dto);
  }

  deleteAvatar(id: string): Observable<void> {
    return this.http.delete<void>(`avatars/${id}`);
  }
}
