import { Component } from '@angular/core';
import {ButtonComponent} from '../components/button/button.component';

@Component({
  selector: 'app-paid-dialog',
  imports: [
    ButtonComponent
  ],
  templateUrl: './paid-dialog.html',
  styleUrls: ['./paid-dialog.scss'],
})
export class PaidDialog {
  showPaidDialog = false;

  openPaidDialog() {
    this.showPaidDialog = false;
  }

  closeDialog() {
    this.showPaidDialog = false;
  }
}
