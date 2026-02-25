import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarService } from '../../../core/services/avatar.service';
import { ReferralService } from '../../../core/services/referral.service';
import { BalanceService } from '../../../core/services/balance.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription as AppSubscription } from '../../../core/models/subscription.model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [ButtonComponent, AsyncPipe, Loading],
  templateUrl: './profile-main-component.html',
  styleUrls: ['./profile-main-component.scss'],
})
export class ProfileMainComponent implements OnInit, OnDestroy {

  public planDetails: Record<string, { tokens: number; features: string[] }> = {
    'Metra Basic': { tokens: 120, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana'] },
    'Metra Pro': { tokens: 350, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana Pro', 'Видео-режимы', 'Wardrobe'] },
    'Metra Max': { tokens: 800, features: ['Доступ к сценам METRA', 'Nano Banana Pro', 'Видео-режимы', 'Wardrobe', 'Upscale', 'Приоритет в очереди'] }
  };

  public selectedAvatars: string[] = [];
  public isAvatarsLoading = true;
  public activeSubscription: AppSubscription | null = null;
  public remainingDays = 0;

  public income$: Observable<number> = inject(ReferralService).income$.pipe(map(d => d.income));
  public currency$: Observable<string> = inject(ReferralService).income$.pipe(map(d => d.currency));
  public balance$: Observable<number> = inject(BalanceService).balance$;
  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private referralService = inject(ReferralService);
  private balanceService = inject(BalanceService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptionService = inject(SubscriptionService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

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
          this.toast.show('Не удалось загрузить Аватары', 'error');
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
