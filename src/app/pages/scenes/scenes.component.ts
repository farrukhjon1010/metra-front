import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScenesGrid } from './scenes-grid/scenes-grid';
import { Loading } from '../../shared/components/loading/loading';
import { SceneCategory } from '../../core/models/scene.model';
import { SceneService } from '../../core/services/scene.service';
import { Observable } from 'rxjs';
import { ScenesHeader } from './scenes-header/scenes-header';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [CommonModule, ScenesGrid, Loading, RouterModule, ScenesHeader],
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
          this.router.navigate(['/scenes/scenes/category', category.id]);
        }
      });
  }
}
