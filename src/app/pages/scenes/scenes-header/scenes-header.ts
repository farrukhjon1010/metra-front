import {Component, Input} from '@angular/core';
import {SceneCategory} from '../../../core/models/scene.model';

@Component({
  selector: 'app-scenes-header',
  standalone: true,
  imports: [],
  templateUrl: './scenes-header.html',
  styleUrls: ['./scenes-header.scss'],
})
export class ScenesHeader {
  @Input() categories: SceneCategory[] | null = [];
}
