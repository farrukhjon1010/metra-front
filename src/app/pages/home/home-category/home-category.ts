import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
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
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-category',
  standalone: true,
  imports: [CommonModule, ScenesCard, Loading, HomeHeader, PaidDialog],
  templateUrl: './home-category.html',
  styleUrls: ['./home-category.scss']
})
export class HomeCategory implements OnInit, OnDestroy {

  public scenes = signal<Scene[]>([]);
  public selectedScene = signal<Scene | null>(null);
  public loader = signal(false);
  public category = signal<ModelSceneCategory | null>(null);

  private route = inject(ActivatedRoute);
  private sceneService = inject(SceneService);
  private router = inject(Router);
  private subscriptions = new Subscription();
  public paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  public showPaidDialog = computed(() => this.paidDialogService.showDialog());

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    const categoriesSub = this.sceneService.getCategories().subscribe({
      next: categories => {
        const cat = categories.find(c => c.id === categoryId) || null;
        this.category.set(cat);

        const scenesSub = this.sceneService.getScenes({ categoryId }).subscribe({
          next: categoryScenes => {
            this.scenes.set(categoryScenes);

            if (categoryScenes.length > 0) {
              this.selectedScene.set(categoryScenes[0]);
            } else if (cat) {
              this.selectedScene.set({
                id: 0,
                name: '',
                image: cat.image,
                category: cat,
                prompt: '',
                mode: 'Template',
                createdAt: new Date().toISOString()
              } as Scene);
            }
            this.loader.set(true);
          },
          error: () => {
            this.scenes.set([]);
            this.selectedScene.set(null);
            this.loader.set(true);
            this.toast.show('Ошибка загрузки Сцен', 'error');
          }
        });
        this.subscriptions.add(scenesSub);
      },
      error: () => {
        this.category.set(null);
        this.scenes.set([]);
        this.selectedScene.set(null);
        this.loader.set(true);
        this.toast.show('Ошибка загрузки Категорий', 'error');
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
