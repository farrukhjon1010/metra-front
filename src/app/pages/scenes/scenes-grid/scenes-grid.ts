import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Scene, SceneCategory } from '../../../core/models/scene.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid {

  @Input() scenes: Scene[] = [];
  @Input() categories: SceneCategory[] = [];
  @Input() viewMode: 'categories' | 'scenes' = 'categories';

  @Output() selectScene = new EventEmitter<Scene>();
  @Output() selectCategory = new EventEmitter<SceneCategory>();

  onCategoryClick(category: SceneCategory) {
    this.selectCategory.emit(category);
  }

  onSceneClick(scene: Scene) {
    this.selectScene.emit(scene);
  }
}
