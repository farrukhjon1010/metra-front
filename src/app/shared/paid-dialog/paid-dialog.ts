import {Component, inject} from '@angular/core';
import { PaidDialogService } from '../../core/services/paid-dialog.service';
import { ButtonComponent } from '../components/button/button.component';

@Component({
  selector: 'app-paid-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './paid-dialog.html',
  styleUrls: ['./paid-dialog.scss'],
})
export class PaidDialog {

  public paidDialogService = inject(PaidDialogService);

  openPaidDialog() {
    this.paidDialogService.openPaidDialog();
  }

  closeDialog() {
    this.paidDialogService.closeDialog();
  }
}
