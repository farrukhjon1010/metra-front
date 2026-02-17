import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {TokenPackage} from '../../../core/models/token-transactions.model';
import {TokenTransactionsService} from '../../../core/services/token-transactions.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Loading} from '../../../shared/components/loading/loading';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  imports: [ButtonComponent, Loading]
})
export class BalanceComponent implements OnInit {
  tokenPackages: TokenPackage[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private tokenService: TokenTransactionsService
  ) {}

  ngOnInit() {
    this.tokenService.getTokenPackages()
      .pipe(take(1))
      .subscribe(packages => {
        this.tokenPackages = packages;
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  buyToken(pkg: TokenPackage) {
    this.isLoading = true;
    this.tokenService.createOrder(pkg.tokens)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          window.location.href = res.url;
        },
        error: () => {
          this.isLoading = false;
          alert('Не удалось создать заказ. Попробуйте позже.');
        }
      });
  }
}
