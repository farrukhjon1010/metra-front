import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css',
})
export class BalanceComponent implements OnInit {
  balance = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUserBalance().subscribe((res: any) => {
      this.balance = res.balance;
    });
  }

  addFunds(amount: number) {
    this.api.addFunds(amount).subscribe((res: any) => {
      this.balance = res.balance;
    });
  }
}
