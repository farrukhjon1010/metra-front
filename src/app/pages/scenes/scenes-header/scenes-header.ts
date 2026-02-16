import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scenes-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './scenes-header.html',
  styleUrls: ['./scenes-header.scss'],
})
export class ScenesHeader {
  @Input() showBack = false;
  @Input() backLink: any[] = ['/scenes'];
}
