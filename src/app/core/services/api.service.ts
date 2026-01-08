import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getScenes() {
    return this.http.get('/api/scenes');
  }

  createScene(data: any) {
    return this.http.post('/api/scenes', data);
  }
  getUserBalance() {
    return this.http.get('/api/user/balance');
  }

  addFunds(amount: number) {
    return this.http.post('/api/user/balance', { amount });
  }
}
