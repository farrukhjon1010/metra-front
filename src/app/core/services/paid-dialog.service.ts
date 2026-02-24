import { Injectable, signal, computed } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../models/subscription.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaidDialogService {

  showDialog = signal(false);

  private hasActiveSubscription = signal<boolean | null>(null);
  private isLimitReached = signal(false);

  hasAccess = computed(() => {
    const active = this.hasActiveSubscription();
    if (active === null) return false;
    return active && !this.isLimitReached();
  });

  constructor(private subscriptionService: SubscriptionService) {
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
    this.showDialog.set(false);
  }

  setLimitReached(reached: boolean) {
    this.isLimitReached.set(reached);
  }
}
