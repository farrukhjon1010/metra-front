import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-splash-success',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './splash-success.component.html',
  styleUrls: ['./splash-success.component.scss'],
})
export class SplashSuccessComponent {
  @Output() start = new EventEmitter<void>();
}

