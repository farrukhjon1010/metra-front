import {ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {ReferralInfo} from '../../../core/models/referral.model';
import {ReferralService} from '../../../core/services/referral.service';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-affiliate-program',
  imports: [ButtonComponent],
  templateUrl: './affiliate-program.component.html',
  styleUrls: ['./affiliate-program.component.scss'],
})
export class AffiliateProgramComponent implements OnInit, OnDestroy {

  @Output() incomeChange = new EventEmitter<number>();

  public link = '';
  public clicks = 0;
  public purchases = 0;
  public income = 0;
  public currency = '';
  public copied = false;
  public loading = true;
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private referralService = inject(ReferralService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

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
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка загрузки Рефералки', err);
          this.loading = false;
          this.toast.show('Ошибка загрузки данных Рефералки', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  copyLink() {
    if (!this.link || this.link.trim() === '') {
      this.toast.show('Ссылка отсутствует', 'error');
      return;
    }

    navigator.clipboard.writeText(this.link).then(() => {
      this.copied = true;
      this.toast.show('Ссылка скопирована', 'success');
      this.cdr.detectChanges();

      setTimeout(() => {
        this.copied = false;
        this.cdr.detectChanges();
      }, 1500);
    }).catch(() => {
      this.toast.show('Не удалось скопировать ссылку', 'error');
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
