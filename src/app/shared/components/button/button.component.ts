import {Component, Input} from '@angular/core';
import {NgClass,} from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green';

@Component({
  selector: 'app-button',
  imports: [
    NgClass,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: ButtonType = 'primary';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';
}
