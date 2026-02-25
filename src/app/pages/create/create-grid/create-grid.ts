import {Component, inject} from '@angular/core';
import { CREATE_CARDS, CreateCard } from '../create.data';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';

@Component({
  selector: 'app-create-grid',
  standalone: true,
  imports: [CommonModule, PaidDialog],
  templateUrl: './create-grid.html',
  styleUrls: ['./create-grid.scss'],
})
export class CreateGrid {

  public cards: CreateCard[] = CREATE_CARDS;
  public paidDialogService = inject(PaidDialogService);
  private router = inject(Router);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  get categories(): string[] {
    return [...new Set(this.cards.map(card => card.category))];
  }

  cardsByCategory(category: string): CreateCard[] {
    return this.cards.filter(card => card.category === category);
  }

  selectCard(card: CreateCard) {
    if (this.paidDialogService.tryShowDialog()) return;
    this.router.navigate(['/create', card.type]);
  }
}
