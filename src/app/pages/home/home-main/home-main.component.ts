import { Component, inject, OnInit, signal } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory } from '../../../core/models/scene.model';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { HomeRecommendation } from '../home-recommendation/home-recommendation';
import { HomeHeader } from '../home-header/home-header';
import { ScenesHeader } from '../../scenes/scenes-header/scenes-header';
import { Router } from '@angular/router';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [ScenesGrid, HomeRecommendation, HomeHeader, ScenesHeader, PaidDialog]
})
export class HomeMainComponent implements OnInit {

  public categories = signal<SceneCategory[]>([]);
  public scenes = signal<Scene[]>([]);
  public showPaidDialog = signal(false);

  private sceneService = inject(SceneService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private paidDialogService = inject(PaidDialogService);

  ngOnInit() {
    this.loadCategories();
    this.showPaidDialog.set(this.paidDialogService.showDialog());
  }

  loadCategories() {
    this.sceneService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories ?? []),
      error: (err) => {
        console.error('Ошибка загрузки категорий', err);
        this.toast.show('Ошибка загрузки категорий', 'error');
      }
    });
  }

  async onCategorySelect(category: SceneCategory) {
    if (this.paidDialogService.tryShowDialog()) {
      this.showPaidDialog.set(true);
      return;
    }

    try {
      const scenes = await firstValueFrom(this.sceneService.getScenes({ categoryId: category.id })) ?? [];
      this.scenes.set(scenes);

      if (scenes.length > 0) {
        await this.router.navigate(['/home', scenes[0].id]);
      } else {
        await this.router.navigate(['/home/home/category', category.id]);
      }
    } catch (err) {
      console.error('Ошибка загрузки сцен', err);
      this.toast.show('Ошибка загрузки сцен', 'error');
    }
  }
}
