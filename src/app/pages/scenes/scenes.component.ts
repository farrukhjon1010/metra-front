import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScenesGrid } from './scenes-grid/scenes-grid';
import { Loading } from '../../shared/components/loading/loading';
import { Scene, SceneCategory } from '../../core/models/scene.model';
import { SceneService } from '../../core/services/scene.service';
import { Observable } from 'rxjs';
import { ScenesHeader } from './scenes-header/scenes-header';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [
    CommonModule,
    ScenesGrid,
    Loading,
    RouterModule,
    ScenesHeader
  ],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss']
})
export class ScenesComponent implements OnInit {

  private sceneService = inject(SceneService);
  private router = inject(Router);

  categories$!: Observable<SceneCategory[]>;

  ngOnInit() {
    this.categories$ = this.sceneService.getCategories();
  }

  onCategorySelect(category: SceneCategory) {
    this.sceneService.getScenes({ categoryId: category.id })
      .subscribe(scenes => {
        if (scenes.length > 0) {
          this.router.navigate(['/scenes', scenes[0].id]);
        } else {
          // Если сцен нет, все равно переходим, чтобы показать пустой экран с информацией о категории
          // Но нам нужен ID сцены для роута /scenes/:id.
          // Если сцен нет, мы не можем перейти на /scenes/:id, так как id нет.
          // Возможно, стоит использовать другой роут или передавать categoryId.
          // В текущей реализации роутинга есть path: 'scenes/category/:categoryId'.
          this.router.navigate(['/scenes/scenes/category', category.id]);
        }
      });
  }

  onSceneSelect(scene: Scene) {
    this.router.navigate(['/scenes', scene.id])  }
}
