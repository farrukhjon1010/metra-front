import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {

  constructor(private router: Router) {}

  get showHeader(): boolean {
    return !this.router.url.includes('improving-quality');
  }
}
