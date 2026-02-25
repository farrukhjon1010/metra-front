import {Component, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectorRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AvatarService } from '../../../../core/services/avatar.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { Subscription as AppSubscription } from '../../../../core/models/subscription.model';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-splash-case',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './splash-case.component.html',
  styleUrls: ['./splash-case.component.scss'],
})
export class SplashCaseComponent implements OnInit, OnDestroy {

  public hasAvatars: boolean = false;
  public hasActiveSubscription: boolean = false;
  public loading: boolean = true;
  private destroy$ = new Subject<void>();
  private avatarService = inject(AvatarService);
  private subscriptionService = inject(SubscriptionService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  @Output() create = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    forkJoin({
      avatars: this.avatarService.findByUser().pipe(
        catchError(err => {
          console.error('Ошибка загрузки аватаров', err);
          this.toast.show('Не удалось загрузить Аватар', 'error');
          return of({ imagesURL: [] });
        })
      ),
      subscription: this.subscriptionService.getMySubscription().pipe(
        catchError(err => {
          console.error('Ошибка загрузки подписки', err);
          this.toast.show('Не удалось загрузить подписку', 'error');
          return of([]);
        })
      )
    }).pipe(takeUntil(this.destroy$))
      .subscribe(({ avatars, subscription }) => {
        this.hasAvatars = (avatars?.imagesURL?.length ?? 0) > 0;

        const activeSub: AppSubscription | undefined = subscription?.[0];
        this.hasActiveSubscription = activeSub?.isActive === true;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }
}
