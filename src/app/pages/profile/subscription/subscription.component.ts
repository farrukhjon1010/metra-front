import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-subscription',
  imports: [ButtonComponent],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent {

  constructor(private router: Router) {
  }
  goBack() {
    this.router.navigate(['/profile']);
  }
}
