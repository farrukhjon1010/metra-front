import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ScenesHeader} from '../scenes-header/scenes-header';

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [ScenesHeader],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid {
  @Input() scenes: { title: string; description: string; image: string }[] = [];
  @Output() selectScene = new EventEmitter<{ title: string; description: string; image: string }>();

  select(scene: { title: string; description: string; image: string }) {
    this.selectScene.emit(scene);
  }

}
