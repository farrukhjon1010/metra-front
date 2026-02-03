import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Referral, ReferralInfo} from '../models/balance.model';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  private readonly apiUrl = `${environment.apiUrl}/referral`;

  constructor(private http: HttpClient) {}

  getReferralInfo(): Observable<ReferralInfo> {
    return this.http.get<ReferralInfo>(`${this.apiUrl}/info`);
  }

  generateReferralLink(): Observable<{ referralLink: string }> {
    return this.http.post<{ referralLink: string }>(
      `${this.apiUrl}/generate-link`,
      {}
    );
  }

  clickReferralLink(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/click-link/${code}`, {});
  }

  createReferral(payload: {
    inviterId: string;
    invitedUserId: string;
  }): Observable<Referral> {
    return this.http.post<Referral>(this.apiUrl, payload);
  }

  getAllReferrals(): Observable<Referral[]> {
    return this.http.get<Referral[]>(this.apiUrl);
  }

  getReferralsByInviter(): Observable<Referral[]> {
    return this.http.get<Referral[]>(`${this.apiUrl}/by-inviter`);
  }
}
