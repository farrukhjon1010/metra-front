import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreateCard} from '../create.component';

@Component({
  selector: 'app-create-grid',
  imports: [],
  standalone: true,
  templateUrl: './create-grid.html',
  styleUrls: ['./create-grid.scss'],
})
export class CreateGrid {

  @Input() cards: CreateCard[] = [];
  @Output() select = new EventEmitter<CreateCard>();

  get categories(): string[] {
    return [...new Set(this.cards.map(card => card.category))];
  }

  cardsByCategory(category: string): CreateCard[] {
    return this.cards.filter(card => card.category === category);
  }

  selectCard(card: CreateCard) {
    this.select.emit(card);
  }
}
