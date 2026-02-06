import {Component} from '@angular/core';
import {ScenesCard} from '../../scenes/scenes-card/scenes-card';

@Component({
  selector: 'app-home-detail',
  imports: [
    ScenesCard
  ],
  standalone: true,
  templateUrl: './home-detail.html',
  styleUrls: ['./home-detail.scss'],
})
export class HomeDetail  {
  scene: any;


}
