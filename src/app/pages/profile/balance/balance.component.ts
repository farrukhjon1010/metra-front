import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';

interface TokenPackage {
  tokens: number;
  price: number;
  tag?: 'Популярно' | 'Выгодно';
}

@Component({
  selector: 'app-balance',
  imports: [CommonModule, FormsModule, ButtonComponent],
  standalone: true,
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent {
  balance = 0;

  tokenPackages: TokenPackage[] = [
    { tokens: 100, price: 390 },
    { tokens: 300, price: 990 },
    { tokens: 1000, price: 2790, tag: 'Популярно' },
    { tokens: 5000, price: 11990, tag: 'Выгодно' },
  ];

  constructor(private router: Router) {}

  buyToken(pkg: TokenPackage) {
    console.log('Покупка пакета:', pkg);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
