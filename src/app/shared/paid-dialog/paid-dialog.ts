import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paid-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './paid-dialog.html',
  styleUrls: ['./paid-dialog.scss'],
})
export class PaidDialog {

  @Output() close = new EventEmitter<void>();
  constructor(private router: Router) {}

  openPaidDialog() {
    this.close.emit();
    this.router.navigate(['profile/subscription']);
  }

  closeDialog() {
    this.close.emit();
  }
}
