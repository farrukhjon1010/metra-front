import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-scenes-card',
  templateUrl: './scenes-card.html',
  styleUrls: ['./scenes-card.scss'],
  standalone: true,
  imports: [ButtonComponent]
})
export class ScenesCard {

  @Input() scene: { title: string; description: string; image: string } | null = null;
  @Output() back = new EventEmitter<void>();

  backToGrid() {
    this.back.emit();
  }

  firstCards = Array(6).fill(0);

  secondCards = Array(6).fill(0);

  showFreeStyle = false;
}
