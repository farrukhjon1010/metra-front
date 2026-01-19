import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaidDialog} from '../../shared/paid-dialog/paid-dialog';

@Component({
  selector: 'app-home',
  imports: [CommonModule, PaidDialog],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {

  showPaidDialog = signal(true);

  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000); // 1 минута
  }

}
