import {Component, inject, OnInit} from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory } from '../../../core/models/scene.model';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { HomeRecommendation } from '../home-recommendation/home-recommendation';
import { HomeHeader } from '../home-header/home-header';
import { ScenesHeader } from '../../scenes/scenes-header/scenes-header';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [ScenesGrid, HomeRecommendation, HomeHeader, ScenesHeader, AsyncPipe, PaidDialog]
})
export class HomeMainComponent implements OnInit {

  public scenes: Scene[] = [];
  public categories$!: Observable<SceneCategory[]>;

  private sceneService = inject(SceneService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private paidDialogService = inject(PaidDialogService);

  public get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categories$ = this.sceneService.getCategories();
  }

  onCategorySelect(category: SceneCategory) {
    if (this.paidDialogService.tryShowDialog()) return;

    this.sceneService.getScenes({ categoryId: category.id }).subscribe({
      next: (scenes) => {
        if (scenes.length > 0) {
          this.router.navigate(['/home', scenes[0].id]);
        } else {
          this.router.navigate(['/home/home/category', category.id]);
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки Категории', err);
        this.toast.show('Ошибка загрузки Категории', 'error');
      }
    });
  }
}
