import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {TokenPackage} from '../../../core/models/token-transactions.model';
import {TokenTransactionsService} from '../../../core/services/token-transactions.service';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Loading} from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  imports: [ButtonComponent, Loading]
})
export class BalanceComponent implements OnInit {
  tokenPackages: TokenPackage[] = [];
  userId = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading = false;

  constructor(
    private router: Router,
    private tokenService: TokenTransactionsService
  ) {}

  ngOnInit() {
    this.tokenService.getTokenPackages().subscribe(packages => {
      this.tokenPackages = packages;
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  buyToken(pkg: TokenPackage) {
    this.isLoading = true;
    this.tokenService.createOrder(this.userId, pkg.tokens).subscribe({
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
