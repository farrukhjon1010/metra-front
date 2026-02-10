import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { environment } from '../../../environment/environment';
import {TokenBalance} from '../models/balance.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private readonly apiUrl = `${environment.apiUrl}/token-balances`;

  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUserBalance(): void {
    this.http.get<{ balance: number }>(`${environment.apiUrl}/token-balances/by-user`)
      .subscribe({
        next: (data) => this.balanceSubject.next(data.balance),
        error: () => this.balanceSubject.next(0)
      });
  }

  getAllTokenBalances(): Observable<TokenBalance[]> {
    return this.http.get<TokenBalance[]>(this.apiUrl);
  }

  getUserTokenBalance(): Observable<TokenBalance> {
    return this.http.get<TokenBalance>(`${this.apiUrl}/by-user`);
  }
}
