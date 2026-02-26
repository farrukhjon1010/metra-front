import {Injectable} from '@angular/core';
import {tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {

  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<any>('/api/login', data).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuth(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
