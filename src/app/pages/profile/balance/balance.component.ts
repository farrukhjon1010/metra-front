import {Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import { Router } from '@angular/router';
import { TokenPackage } from '../../../core/models/token-transactions.model';
import { TokenTransactionsService } from '../../../core/services/token-transactions.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Loading } from '../../../shared/components/loading/loading';
import { take } from 'rxjs/operators';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  imports: [ButtonComponent, Loading]
})
export class BalanceComponent implements OnInit {

  public tokenPackages: TokenPackage[] = [];
  public isLoading = false;

  private router = inject(Router);
  private tokenService = inject(TokenTransactionsService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  ngOnInit() {
    this.tokenService.getTokenPackages()
      .pipe(take(1))
      .subscribe({
        next: (packages) => {
          this.tokenPackages = packages;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Не удалось загрузить пакеты токенов', err);
          this.toast.show('Не удалось загрузить пакеты токенов', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  buyToken(pkg: TokenPackage) {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.tokenService.createOrder(pkg.tokens)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          window.location.href = res.url;
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toast.show('Не удалось создать заказ. Попробуйте позже.', 'error');
        }
      });
  }
}
