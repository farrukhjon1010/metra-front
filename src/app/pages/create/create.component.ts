import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CreateGrid} from './create-grid/create-grid';
import {CreateDetail} from './create-detail/create-detail';

export interface CreateCard {
  id: string;
  title: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, CreateGrid, CreateDetail],
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {

  selectedCard: CreateCard | null = null;

  selectCard(card: CreateCard) {
    this.selectedCard = card;
  }

  back() {
    this.selectedCard = null;
  }
}
