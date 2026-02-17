import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CreateTokenOrderResponse, TokenPackage, TokenTransaction } from '../models/token-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class TokenTransactionsService {
  private readonly apiUrl = `${environment.apiUrl}/token-transactions`;

  constructor(private http: HttpClient) { }

  createOrder(tokensAmount: number): Observable<CreateTokenOrderResponse> {
    const params = new HttpParams()
      .set('tokensAmount', tokensAmount.toString());

    return this.http.post<CreateTokenOrderResponse>(`${this.apiUrl}/create-order`, null, { params });
  }

  createSubscriptionOrder(amount: number): Observable<CreateTokenOrderResponse> {
    const params = new HttpParams()
      .set('amount', amount.toString());

    return this.http.post<CreateTokenOrderResponse>(
      `${this.apiUrl}/create-subscription-order`,
      null,
      { params }
    );
  }

  getUserTransactions(): Observable<TokenTransaction[]> {
    return this.http.get<TokenTransaction[]>(`${this.apiUrl}/user-transactions`)
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