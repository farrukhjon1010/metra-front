import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory } from '../../../core/models/scene.model';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { HomeRecommendation } from '../home-recommendation/home-recommendation';
import { HomeHeader } from '../home-header/home-header';
import { ScenesHeader } from '../../scenes/scenes-header/scenes-header';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [ScenesGrid, HomeRecommendation, HomeHeader, ScenesHeader,]
})
export class HomeMainComponent implements OnInit {

  categories: SceneCategory[] = [];
  scenes: Scene[] = [];
  viewMode: 'categories' | 'scenes' = 'categories';
  isPaidDialogVisible = false;

  constructor(
    private sceneService: SceneService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.isPaidDialogVisible = true;
  }

  loadCategories() {
    this.sceneService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadScenes(categoryId: number) {
    this.sceneService.getScenes({ categoryId }).subscribe({
      next: (data) => {
        this.scenes = data;
        this.viewMode = 'scenes';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onCategorySelect(category: SceneCategory) {
    this.sceneService.getScenes({ categoryId: category.id })
      .subscribe(scenes => {
        if (scenes.length > 0) {
          this.router.navigate(['/scenes', scenes[0].id]);
        }
      });
  }

}
