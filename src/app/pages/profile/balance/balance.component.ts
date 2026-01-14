import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-balance',
  imports: [CommonModule, FormsModule, ButtonComponent],
  standalone: true,
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {
  balance = 0;

  constructor(private router: Router) {}

  ngOnInit() {


  }

  addFunds() {

  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
