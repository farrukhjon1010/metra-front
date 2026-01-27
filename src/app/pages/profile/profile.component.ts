import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ButtonComponent} from '../../shared/components/button/button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  currentStep: 'select' | 'success' | 'profile' = 'select';
  selectedAvatars: string[] = [];

  constructor(public router: Router) {
  }

  addMoreAvatars(): void {
    this.currentStep = 'select';
  }

  goToAddAvatar() {
    this.router.navigate(['/profile/add-avatar']);
  }

  goToReplenish() {
    this.router.navigate(['/profile/balance']);
  }

  goToAffiliateProgram() {
    this.router.navigate(['/profile/affiliate-program']);
  }

  goToSubscription() {
    this.router.navigate(['/profile/subscription']);
  }
}
