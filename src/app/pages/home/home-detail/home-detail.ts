import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../../scenes/scenes-card/scenes-card';
import { SceneService } from '../../../core/services/scene.service';
import { Scene } from '../../../core/models/scene.model';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard],
  templateUrl: './home-detail.html',
  styleUrls: ['./home-detail.scss'],
})
export class HomeDetail implements OnInit {

  public scene = signal<Scene | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sceneService = inject(SceneService);
  private location = inject(Location);
  private toast = inject(ToastService);

  ngOnInit() {
    const sceneId = Number(this.route.snapshot.paramMap.get('id'));
    if (!sceneId) return;

    this.sceneService.getScenes()
      .pipe(take(1))
      .subscribe({
        next: (scenes: Scene[]) => {
          this.scene.set(scenes.find(s => s.id === sceneId) || null);
        },
        error: (err) => {
          console.error('Ошибка загрузки Сцены', err);
          this.scene.set(null);
          this.toast.show('Ошибка загрузки Сцены', 'error');
        }
      });
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
