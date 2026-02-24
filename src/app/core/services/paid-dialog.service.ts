import { Injectable, signal, computed, inject } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { Router } from '@angular/router';
import { Subscription } from '../models/subscription.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaidDialogService {

  showDialog = signal(true);
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);
  private hasActiveSubscription = signal<boolean | null>(null);
  private isLimitReached = signal(false);

  hasAccess = computed(() => {
    const active = this.hasActiveSubscription();
    if (active === null) return false;
    return active && !this.isLimitReached();
  });

  constructor() {
    this.loadSubscription();
  }

  private loadSubscription() {
    this.subscriptionService.getMySubscription()
      .pipe(
        tap((subs: Subscription[]) => {
          const isActive = subs.some(s => s.isActive);
          this.hasActiveSubscription.set(isActive);
        })
      )
      .subscribe({
        error: () => {
          this.hasActiveSubscription.set(false);
        }
      });
  }

  tryShowDialog(): boolean {
    if (!this.hasAccess()) {
      this.showDialog.set(true);
      return true;
    }
    return false;
  }

  closeDialog() {
    if (!this.hasAccess()) {
      this.router.navigate(['profile/subscription']);
    } else {
      this.showDialog.set(false);
    }
  }

  openPaidDialog() {
    this.showDialog.set(false);
    this.router.navigate(['profile/subscription']);
  }

  setLimitReached(reached: boolean) {
    this.isLimitReached.set(reached);
  }
}
