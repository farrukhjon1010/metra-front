import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { TokenTransactionsService } from '../../../core/services/token-transactions.service';
import { Loading } from '../../../shared/components/loading/loading';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Subscription } from '../../../core/models/subscription.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {ToastService} from '../../../core/services/toast.service';

interface SubscriptionPlan {
  id: string;
  title: string;
  price: number;
  features: string[];
  examples: string[];
  isRecommended?: boolean;
  cardClass: string;
  spanClass: string;
  buttonType: 'primary' | 'danger' | 'green';
}

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [ButtonComponent, CommonModule, Loading],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  public plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      title: 'Metra Basic',
      price: 990,
      features: ['120 токенов в месяц', 'Доступ к сценам METRA', 'Доступ к Nano Banana'],
      examples: ['~24 генераций в Nano Banana', 'или 12 генераций в Nano Banana PRO', 'комбинируйте режимы как удобно'],
      cardClass: 'metra-basic-card',
      spanClass: 'span-card-basic',
      buttonType: 'primary'
    },
    {
      id: 'pro',
      title: 'Metra Pro',
      price: 2490,
      isRecommended: true,
      features: ['350 токенов в месяц', 'Доступ к сценам METRA', 'Доступ к Nano Banana Pro', 'Видео-режимы', 'Примерка одежды (Wardrobe)'],
      examples: ['~70 генераций в Nano Banana', 'или ~35 генераций в Nano Banana PRO', 'или фото + видео + wardrobe в любом сочетании'],
      cardClass: 'metra-pro-card',
      spanClass: 'span-card-pro',
      buttonType: 'danger'
    },
    {
      id: 'max',
      title: 'Metra Max',
      price: 4990,
      features: ['800 токенов в месяц', 'Доступ к сценам METRA', 'Доступ к Nano Banana Pro', 'Видео-режимы', 'Примерка одежды (Wardrobe)', 'Upscale', 'Приоритет в очереди'],
      examples: ['~160 генераций в Nano Banana', 'или ~80 генераций в Nano Banana PRO', 'или активное использование всех функций'],
      cardClass: 'metra-max-card',
      spanClass: 'span-card-max',
      buttonType: 'green'
    }
  ];

  public isLoading = false;
  public activeSubscription: Subscription | null = null;
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private tokenTransactionsService = inject(TokenTransactionsService);
  private subscriptionService = inject(SubscriptionService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.loadMySubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMySubscription() {
    this.subscriptionService.getMySubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.length) {
            this.activeSubscription = res[0];
          } else {
            this.activeSubscription = null;
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Ошибка загрузки подписки', err);
          this.activeSubscription = null;
          this.toast.show('Ошибка загрузки подписки', 'error');
          this.cdr.markForCheck();
        }
      });
  }

  isCurrentPlan(plan: SubscriptionPlan): boolean {
    return this.activeSubscription?.plan === plan.title &&
      this.activeSubscription?.isActive === true;
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  selectPlan(plan: SubscriptionPlan) {
    if (this.isCurrentPlan(plan)) return;

    this.isLoading = true;
    this.cdr.markForCheck();
    this.tokenTransactionsService.createSubscriptionOrder(plan.price)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          window.location.href = res.url;
        },
        error: err => {
          console.error('Ошибка при создании подписки', err);
          this.isLoading = false;
          this.toast.show('Не удалось создать подписку', 'error');
          this.cdr.markForCheck();
        }
      });
  }

  getSubscriptionStatusClass(): string {
    if (!this.activeSubscription) return '';

    const now = new Date();
    const end = new Date(this.activeSubscription.endsAt);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 14) return 'badge-green';
    if (diffDays > 7) return 'badge-yellow';

    return 'badge-red';
  }
}
