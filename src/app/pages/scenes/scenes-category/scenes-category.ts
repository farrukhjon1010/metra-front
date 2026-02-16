import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SceneService } from '../../../core/services/scene.service';
import { Scene, SceneCategory as ModelSceneCategory } from '../../../core/models/scene.model';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../scenes-card/scenes-card';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-scenes-category',
  standalone: true,
  imports: [CommonModule, ScenesCard, Loading],
  templateUrl: './scenes-category.html',
  styleUrls: ['./scenes-category.scss']
})
export class SceneCategory implements OnInit {
  private route = inject(ActivatedRoute);
  private sceneService = inject(SceneService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  scenes: Scene[] = [];
  selectedScene: Scene | null = null;
  loaded = false;
  category: ModelSceneCategory | null = null;

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    this.sceneService.getCategories().subscribe(categories => {
      this.category = categories.find(c => c.id === categoryId) || null;

      this.sceneService.getScenes({ categoryId }).subscribe({
        next: (scenes) => {
          this.scenes = scenes;
          if (scenes.length > 0) {
            this.selectedScene = scenes[0];
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
          this.loaded = true;
          this.cdr.detectChanges();
        },
        error: () => {
          this.scenes = [];
          this.selectedScene = null;
          this.loaded = true;
          this.cdr.detectChanges();
        }
      });
    });
  }

  goBack() {
    this.router.navigate(['/scenes']);
  }
}
