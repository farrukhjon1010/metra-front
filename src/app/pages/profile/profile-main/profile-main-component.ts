import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarService } from '../../../core/services/avatar.service';
import { ReferralService } from '../../../core/services/referral.service';
import { BalanceService } from '../../../core/services/balance.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Loading } from '../../../shared/components/loading/loading';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Subscription as AppSubscription } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [ButtonComponent, AsyncPipe, Loading],
  templateUrl: './profile-main-component.html',
  styleUrls: ['./profile-main-component.scss'],
})
export class ProfileMainComponent implements OnInit, OnDestroy {

  planDetails: Record<string, { tokens: number; features: string[] }> = {
    'Metra Basic': { tokens: 120, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana'] },
    'Metra Pro': { tokens: 350, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana Pro', 'Видео-режимы', 'Wardrobe'] },
    'Metra Max': { tokens: 800, features: ['Доступ к сценам METRA', 'Nano Banana Pro', 'Видео-режимы', 'Wardrobe', 'Upscale', 'Приоритет в очереди'] }
  };

  selectedAvatars: string[] = [];
  income$: Observable<number>;
  currency$: Observable<string>;
  balance$: Observable<number>;
  isAvatarsLoading = true;
  activeSubscription: AppSubscription | null = null;
  remainingDays = 0;
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private avatarService: AvatarService,
    private referralService: ReferralService,
    private balanceService: BalanceService,
    private cdr: ChangeDetectorRef,
    private subscriptionService: SubscriptionService
  ) {
    this.income$ = this.referralService.income$.pipe(map(data => data.income));
    this.currency$ = this.referralService.income$.pipe(map(data => data.currency));
    this.balance$ = this.balanceService.balance$;
  }

  ngOnInit(): void {
    this.loadUserAvatars();
    this.loadMySubscription();
    this.referralService.getReferralInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.referralService.setIncome({ income: data.stats.income, currency: data.stats.currency });
          this.cdr.markForCheck();
        },
        error: () => this.referralService.setIncome({ income: 0, currency: '' })
      });
    this.balanceService.loadUserBalance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMySubscription(): void {
    this.subscriptionService.getMySubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.activeSubscription = res?.[0] ?? null;
          this.calculateRemainingDays();
          this.cdr.markForCheck();
        },
        error: () => {
          this.activeSubscription = null;
          this.cdr.markForCheck();
        }
      });
  }

  calculateRemainingDays(): void {
    if (!this.activeSubscription) {
      this.remainingDays = 0;
      return;
    }
    const now = new Date();
    const end = new Date(this.activeSubscription.endsAt);
    const diffTime = end.getTime() - now.getTime();
    this.remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  get currentPlanDetails() {
    if (!this.activeSubscription) return null;
    return this.planDetails[this.activeSubscription.plan];
  }

  loadUserAvatars(): void {
    this.isAvatarsLoading = true;
    this.avatarService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avatar) => {
          this.selectedAvatars = avatar?.imagesURL ?? [];
          this.isAvatarsLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.selectedAvatars = [];
          this.isAvatarsLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  goToAddAvatar(): void {
    if (this.isAvatarsLoading || this.selectedAvatars.length >= 3) return;
    this.router.navigate(['/profile/add-avatar']);
  }

  goToReplenish(): void {
    this.router.navigate(['/profile/balance']);
  }

  goToAffiliateProgram(): void {
    this.router.navigate(['/profile/affiliate-program']);
  }

  goToSubscription(): void {
    this.router.navigate(['/profile/subscription']);
  }
}
