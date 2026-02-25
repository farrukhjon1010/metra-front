import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScenesGrid } from './scenes-grid/scenes-grid';
import { Loading } from '../../shared/components/loading/loading';
import { SceneCategory } from '../../core/models/scene.model';
import { SceneService } from '../../core/services/scene.service';
import { Observable } from 'rxjs';
import { ScenesHeader } from './scenes-header/scenes-header';
import {ToastService} from '../../core/services/toast.service';
import {ToastComponent} from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [CommonModule, ScenesGrid, Loading, RouterModule, ScenesHeader, ToastComponent],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss']
})
export class ScenesComponent implements OnInit {

  private sceneService = inject(SceneService);
  private router = inject(Router);
  private toast = inject(ToastService);
  public categories$!: Observable<SceneCategory[]>;

  ngOnInit() {
    this.categories$ = this.sceneService.getCategories();
  }

  onCategorySelect(category: SceneCategory) {
    this.sceneService.getScenes({ categoryId: category.id }).subscribe({
      next: (scenes) => {
        if (scenes.length > 0) {
          this.router.navigate(['/scenes', scenes[0].id]);
        } else {
          this.router.navigate(['/scenes/scenes/category', category.id]);
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки сцен', err);
        this.toast.show('Не удалось загрузить сцены', 'error');
      }
    });
  }
}
