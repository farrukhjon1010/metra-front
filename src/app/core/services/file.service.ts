import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private readonly apiUrl = environment.apiUrl

    constructor(private http: HttpClient) { }

    uploadAvatars(files: File[], userId: string): Observable<any> {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/files/avatar/${userId}`, formData, {
            reportProgress: true,
            observe: 'events'
        })
    }

    uploadGeneratedAvatars(files: File[], userId: string): Observable<any> {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });

        return this.http.post(`${this.apiUrl}/files/generated-avatar/${userId}`, formData, {
            reportProgress: true,
            observe: 'events'
        })
    }

    uploadGeneratedAvatar(file: File, userId: string, index: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/files/generated-avatar/${userId}/${index}`, formData);
    }

    uploadImageGeneration(file: File, userId: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/files/save-for-generation/${userId}`, formData);
    }

    uploadGeneratedImage(file: File, userId: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/files/save-generated/${userId}`, formData);
    }

    downloadFile(url: string, type: 'image' | 'video') {
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);

            a.href = objectUrl;
            a.download = type === 'image'
              ? 'generation-image.jpg'
              : 'generation-video.mp4';

            a.click();
            URL.revokeObjectURL(objectUrl);
          });
      }

}
