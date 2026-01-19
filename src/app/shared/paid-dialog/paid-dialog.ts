import {Component, EventEmitter, Output} from '@angular/core';
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

  @Output() close = new EventEmitter<void>();

  openPaidDialog() {
    this.close.emit();
  }

  closeDialog() {
    this.close.emit();
  }
}
