import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreateCard} from '../create.component';

@Component({
  selector: 'app-create-detail',
  imports: [],
  standalone: true,
  templateUrl: './create-detail.html',
  styleUrls: ['./create-detail.scss'],
})
export class CreateDetail {

  @Input() card!: CreateCard;
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
