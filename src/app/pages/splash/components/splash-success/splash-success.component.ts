import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-splash-success',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './splash-success.component.html',
  styleUrls: ['./splash-success.component.scss'],
})
export class SplashSuccessComponent {
  @Output() start = new EventEmitter<void>();
}

