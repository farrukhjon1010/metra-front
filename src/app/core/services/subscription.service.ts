import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private readonly apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  createOrUpdateSubscription(plan: string): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, { plan });
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  getMySubscription(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/by-user`);
  }

  deactivateSubscription(id: string): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  updateSubscription(id: string, data: Partial<Subscription>): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}`, data);
  }
}
