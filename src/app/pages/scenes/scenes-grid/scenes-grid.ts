import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScenesHeader } from '../scenes-header/scenes-header';

export interface SceneUI {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [ScenesHeader],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid {
  @Input() scenes: SceneUI[] = [];
  @Output() selectScene = new EventEmitter<SceneUI>();

  select(scene: SceneUI) {
    this.selectScene.emit(scene);
  }
}
