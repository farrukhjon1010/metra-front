import {Component, OnInit, ChangeDetectorRef, signal} from '@angular/core';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory } from '../../../core/models/scene.model';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { HomeRecommendation } from '../home-recommendation/home-recommendation';
import { HomeHeader } from '../home-header/home-header';
import { ScenesHeader } from '../../scenes/scenes-header/scenes-header';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {PaidDialog} from '../../../shared/paid-dialog/paid-dialog';
import {Loading} from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [ScenesGrid, HomeRecommendation, HomeHeader, ScenesHeader, AsyncPipe, PaidDialog, ScenesGrid, Loading,]
})
export class HomeMainComponent implements OnInit {

  scenes: Scene[] = [];
  viewMode: 'categories' | 'scenes' = 'categories';
  isPaidDialogVisible = false;
  categories$!: Observable<SceneCategory[]>;
  showPaidDialog = signal(true);

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
    this.categories$ = this.sceneService.getCategories();
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
          this.router.navigate(['/home', scenes[0].id]);
        } else {
          this.router.navigate(['/home/home/category', category.id]);
        }
      });
  }


  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000);
  }

}
