import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory as ModelSceneCategory } from '../../../core/models/scene.model';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../../scenes/scenes-card/scenes-card';
import { Loading } from '../../../shared/components/loading/loading';
import { HomeHeader } from '../home-header/home-header';
import { Subscription } from 'rxjs';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';

@Component({
  selector: 'app-home-category',
  standalone: true,
  imports: [CommonModule, ScenesCard, Loading, HomeHeader, PaidDialog],
  templateUrl: './home-category.html',
  styleUrls: ['./home-category.scss']
})
export class HomeCategory implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sceneService = inject(SceneService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions = new Subscription();
  public paidDialogService = inject(PaidDialogService);

  scenes: Scene[] = [];
  selectedScene: Scene | null = null;
  loader = false;
  category: ModelSceneCategory | null = null;

  get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    const categoriesSub = this.sceneService.getCategories().subscribe({
      next: categories => {
        this.category = categories.find(c => c.id === categoryId) || null;

        const scenesSub = this.sceneService.getScenes({ categoryId }).subscribe({
          next: categoryScenes => {
            this.scenes = categoryScenes;
            if (categoryScenes.length > 0) {
              this.selectedScene = categoryScenes[0];
            } else if (this.category) {
              this.selectedScene = {
                id: 0,
                name: '',
                image: this.category.image,
                category: this.category,
                prompt: '',
                mode: 'Template',
                createdAt: new Date().toISOString()
              } as Scene;
            }
            this.loader = true;
            this.cdr.detectChanges();
          },
          error: () => {
            this.scenes = [];
            this.selectedScene = null;
            this.loader = true;
            this.cdr.detectChanges();
          }
        });
        this.subscriptions.add(scenesSub);
      },
      error: () => {
        this.category = null;
        this.scenes = [];
        this.selectedScene = null;
        this.loader = true;
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.add(categoriesSub);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
