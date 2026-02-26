import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private readonly apiUrl = 'files';

    constructor(private http: HttpClient) {}

    uploadAvatars(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/avatar`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    uploadGeneratedAvatars(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/generated-avatar`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    uploadGeneratedAvatar(file: File, index: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/generated-avatar/${index}`, formData);
    }

    uploadImageGeneration(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/save-for-generation`, formData);
    }

    uploadGeneratedImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/save-generated`, formData);
    }
}
