import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private router: Router,
    private paidDialogService: PaidDialogService
  ) {}

  openPaidDialog() {
    this.paidDialogService.closeDialog();
    this.router.navigate(['profile/subscription']);
  }

  closeDialog() {
    this.paidDialogService.closeDialog();
  }
}
