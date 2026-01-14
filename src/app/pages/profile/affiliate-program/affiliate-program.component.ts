import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-affiliate-program',
  imports: [ButtonComponent],
  templateUrl: './affiliate-program.component.html',
  styleUrls: ['./affiliate-program.component.scss'],
})
export class AffiliateProgramComponent {
  link: any;

  constructor(private router: Router) {}
  goBack() {
    this.router.navigate(['/profile']);
  }


  copied = false;

  copyLink() {
      const textToCopy = 'Привет!';

      navigator.clipboard.writeText(textToCopy).then(() => {
        this.copied = true;

        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }).catch(err => {
        console.error('Не удалось скопировать текст: ', err);
      });
    }

  goToWithdraw() {

  }

  goToShare() {

  }
}
