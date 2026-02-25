import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarService } from '../../../core/services/avatar.service';
import { ReferralService } from '../../../core/services/referral.service';
import { BalanceService } from '../../../core/services/balance.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription as AppSubscription } from '../../../core/models/subscription.model';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Loading } from '../../../shared/components/loading/loading';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [ButtonComponent, AsyncPipe, Loading],
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
})
export class ProfileMainComponent implements OnInit {

  public planDetails = {
    'Metra Basic': { tokens: 120, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana'] },
    'Metra Pro': { tokens: 350, features: ['Доступ к сценам METRA', 'Доступ к Nano Banana Pro', 'Видео-режимы', 'Wardrobe'] },
    'Metra Max': { tokens: 800, features: ['Доступ к сценам METRA', 'Nano Banana Pro', 'Видео-режимы', 'Wardrobe', 'Upscale', 'Приоритет в очереди'] }
  };

  public selectedAvatars = signal<string[]>([]);
  public selectedAvatar = signal<string | null>(null); // <-- выбранный аватар
  public isAvatarsLoading = signal(true);
  public activeSubscription = signal<AppSubscription | null>(null);
  public remainingDays = signal(0);
  public isSubscriptionLoading = signal(true);

  public income$: Observable<number> = inject(ReferralService).income$.pipe(map(d => d.income));
  public currency$: Observable<string> = inject(ReferralService).income$.pipe(map(d => d.currency));
  public balance$: Observable<number> = inject(BalanceService).balance$;
  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private referralService = inject(ReferralService);
  private balanceService = inject(BalanceService);
  private subscriptionService = inject(SubscriptionService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.loadUserAvatars();
    this.loadMySubscription();

    this.referralService.getReferralInfo().pipe(take(1)).subscribe({
      next: (data) => {
        this.referralService.setIncome({ income: data.stats.income, currency: data.stats.currency });
      },
      error: () => this.referralService.setIncome({ income: 0, currency: '' })
    });

    this.balanceService.loadUserBalance();
  }

  get displayAvatars(): { src: string | null, isEmpty: boolean }[] {
    const avatars = this.selectedAvatars();
    const emptyCount = Math.max(0, 3 - avatars.length);
    const realAvatars = avatars.map(src => ({ src, isEmpty: false }));
    const emptyAvatars = Array.from({ length: emptyCount }, () => ({ src: null, isEmpty: true }));

    return [...realAvatars, ...emptyAvatars];
  }

  loadMySubscription(): void {
    this.isSubscriptionLoading.set(true);
    this.subscriptionService.getMySubscription().pipe(take(1)).subscribe({
      next: (res) => {
        this.activeSubscription.set(res?.[0] ?? null);
        this.calculateRemainingDays();
        this.isSubscriptionLoading.set(false);
      },
      error: () => {
        this.activeSubscription.set(null);
        this.isSubscriptionLoading.set(false);
      }
    });
  }

  calculateRemainingDays(): void {
    const sub = this.activeSubscription();
    if (!sub) {
      this.remainingDays.set(0);
      return;
    }
    const now = new Date();
    const end = new Date(sub.endsAt);
    const diffTime = end.getTime() - now.getTime();
    this.remainingDays.set(Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
  }

  get currentPlanDetails() {
    const sub = this.activeSubscription();
    if (!sub) return null;
    const planKey = sub.plan as keyof typeof this.planDetails;
    return this.planDetails[planKey];
  }

  loadUserAvatars(): void {
    this.isAvatarsLoading.set(true);
    this.avatarService.findByUser().pipe(take(1)).subscribe({
      next: (avatar) => {
        const avatars = avatar?.imagesURL ?? [];
        this.selectedAvatars.set(avatars);
        this.selectedAvatar.set(avatars[0] ?? null);
        this.isAvatarsLoading.set(false);
      },
      error: () => {
        this.selectedAvatars.set([]);
        this.selectedAvatar.set(null);
        this.isAvatarsLoading.set(false);
        this.toast.show('Не удалось загрузить Аватары', 'error');
      }
    });
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar.set(avatar);
  }

  goToAddAvatar(): void {
    if (this.isAvatarsLoading() || this.selectedAvatars().length >= 3) return;
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
