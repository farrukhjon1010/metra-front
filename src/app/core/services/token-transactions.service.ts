import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import {CreateTokenOrderResponse, TokenPackage, TokenTransaction} from '../models/token-transactions.model';


@Injectable({
  providedIn: 'root'
})
export class TokenTransactionsService {
  private readonly apiUrl = `${environment.apiUrl}/token-transactions`;

  constructor(private http: HttpClient) {}

  createOrder(userId: string, tokensAmount: number): Observable<CreateTokenOrderResponse> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('tokensAmount', tokensAmount.toString());

    return this.http.post<CreateTokenOrderResponse>(`${this.apiUrl}/create-order`, null, { params });
  }

  webhookYooKassa(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/webhook/yookassa`, null);
  }

  getUserTransactions(userId: string): Observable<TokenTransaction[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<TokenTransaction[]>(`${this.apiUrl}/user-transactions`, { params })
      .pipe(
        map(transactions => transactions.map(tx => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          user: tx.user ? { ...tx.user, createdAt: new Date(tx.user.createdAt) } : undefined,
          inviter: tx.inviter ? { ...tx.inviter, createdAt: new Date(tx.inviter.createdAt) } : null
        })))
      );
  }

  getAllTransactions(): Observable<TokenTransaction[]> {
    return this.http.get<TokenTransaction[]>(`${this.apiUrl}/all`)
      .pipe(
        map(transactions => transactions.map(tx => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          user: tx.user ? { ...tx.user, createdAt: new Date(tx.user.createdAt) } : undefined,
          inviter: tx.inviter ? { ...tx.inviter, createdAt: new Date(tx.inviter.createdAt) } : null
        })))
      );
  }

  getTokenPackages(): Observable<TokenPackage[]> {
    const packages: TokenPackage[] = [
      { tokens: 100, price: 390 },
      { tokens: 300, price: 990 },
      { tokens: 1000, price: 2790, tag: 'Популярно' },
      { tokens: 5000, price: 11990, tag: 'Выгодно' },
    ];
    return of(packages);
  }
}
