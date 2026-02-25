import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreateCard} from '../../create.data';

@Component({
  selector: 'app-create-header',
  imports: [],
  standalone: true,
  templateUrl: './create-header.html',
  styleUrls: ['./create-header.scss'],
})
export class CreateHeader {

  @Input() card!: CreateCard;
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
