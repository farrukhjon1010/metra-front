import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-splash-select',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './splash-select.component.html',
  styleUrls: ['./splash-select.component.scss'],
})
export class SplashSelectComponent {
  @Input() generatedAvatars: string[] = [];
  @Input() selectedAvatars: string[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<void>();

  isSelected(avatar: string) {
    return this.selectedAvatars.includes(avatar);
  }
}
