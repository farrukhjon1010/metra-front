import { Component, EventEmitter, Output } from '@angular/core';
import { CreateCard } from '../create.component';

@Component({
  selector: 'app-create-grid',
  standalone: true,
  templateUrl: './create-grid.html',
  styleUrls: ['./create-grid.scss'],
})
export class CreateGrid {
  @Output() select = new EventEmitter<CreateCard>();

  selectCard(card: CreateCard) {
    this.select.emit(card);
  }
}
