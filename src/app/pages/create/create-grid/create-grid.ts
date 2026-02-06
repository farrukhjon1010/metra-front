import {Component} from '@angular/core';
import {CREATE_CARDS, CreateCard} from '../create.data';
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-create-grid',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './create-grid.html',
  styleUrls: ['./create-grid.scss'],
})
export class CreateGrid {

  cards: CreateCard[] = CREATE_CARDS;

  constructor(private router: Router) {}

  get categories(): string[] {
    return [...new Set(this.cards.map(card => card.category))];
  }

  cardsByCategory(category: string): CreateCard[] {
    return this.cards.filter(card => card.category === category);
  }

  selectCard(card: CreateCard) {
    this.router.navigate(['/create', card.type]);
  }
}
