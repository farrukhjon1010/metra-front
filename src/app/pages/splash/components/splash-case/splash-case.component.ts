import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-splash-case',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './splash-case.component.html',
  styleUrls: ['./splash-case.component.scss'],
})
export class SplashCaseComponent {
  @Output() create = new EventEmitter<void>();
  @Output() demo = new EventEmitter<void>();
}
