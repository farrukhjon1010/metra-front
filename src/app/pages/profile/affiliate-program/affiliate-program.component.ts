import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {ReferralInfo} from '../../../core/models/referral.model';
import {ReferralService} from '../../../core/services/referral.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-affiliate-program',
  imports: [ButtonComponent],
  templateUrl: './affiliate-program.component.html',
  styleUrls: ['./affiliate-program.component.scss'],
})
export class AffiliateProgramComponent implements OnInit, OnDestroy {

  link = '';
  clicks = 0;
  purchases = 0;
  income = 0;
  currency = '';
  copied = false;
  loading = true;
  private destroy$ = new Subject<void>();

  @Output() incomeChange = new EventEmitter<number>();

  constructor(
    private router: Router,
    private referralService: ReferralService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadReferralInfo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReferralInfo() {
    this.referralService.getReferralInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ReferralInfo) => {
          this.link = data.referralLink;
          this.clicks = data.stats.clicks;
          this.purchases = data.stats.purchases;
          this.income = data.stats.income;
          this.currency = data.stats.currency;

          this.loading = false;

          this.referralService.setIncome({
            income: this.income,
            currency: this.currency
          });

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Ошибка загрузки рефералки', err);
          this.loading = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  copyLink() {
    if (!this.link) return;

    navigator.clipboard.writeText(this.link).then(() => {
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 1500);
      this.cdr.detectChanges();
    });
  }

  goToWithdraw() {

  }

  shareReferralLink() {
    if (!this.link) return;

    if (navigator.share) {
      navigator.share({
        url: this.link
      }).catch(() => {});
    } else {
      this.copyLink();
    }
  }
}
