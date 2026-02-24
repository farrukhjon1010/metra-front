import { Component, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AvatarService } from '../../../../core/services/avatar.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { Subscription as AppSubscription } from '../../../../core/models/subscription.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-splash-case',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './splash-case.component.html',
  styleUrls: ['./splash-case.component.scss'],
})
export class SplashCaseComponent implements OnInit, OnDestroy {

  hasAvatars = false;
  hasActiveSubscription = false;
  private destroy$ = new Subject<void>();
  @Output() create = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();

  constructor(
    private avatarService: AvatarService,
    private subscriptionService: SubscriptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAvatars();
    this.loadSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAvatars() {
    this.avatarService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.hasAvatars = (res?.imagesURL?.length ?? 0) > 0;
          this.cdr.markForCheck();
        },
        error: () => {
          this.hasAvatars = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadSubscription() {
    this.subscriptionService.getMySubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const activeSub: AppSubscription | undefined = res?.[0];
          this.hasActiveSubscription = activeSub?.isActive === true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.hasActiveSubscription = false;
          this.cdr.markForCheck();
        }
      });
  }
}
