import {Component, Input} from '@angular/core';
import {NgClass,} from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() type: ButtonType = 'primary';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';
}
