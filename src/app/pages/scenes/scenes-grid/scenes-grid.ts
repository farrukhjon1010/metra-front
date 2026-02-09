import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScenesHeader } from '../scenes-header/scenes-header';
import { Scene } from '../../home/home.data';

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [ScenesHeader],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid {
  @Input() scenes: Scene[] = [];
  @Output() selectScene = new EventEmitter<Scene>();

  select(scene: Scene) {
    this.selectScene.emit(scene);
  }
}
