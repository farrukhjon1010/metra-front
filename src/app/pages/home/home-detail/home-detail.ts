import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../../scenes/scenes-card/scenes-card';
import { SceneService } from '../../../core/services/scene.service';
import { Scene } from '../../../core/models/scene.model';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard],
  templateUrl: './home-detail.html',
  styleUrls: ['./home-detail.scss'],
})
export class HomeDetail implements OnInit {
  scene: Scene | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sceneService: SceneService,
    private location: Location
  ) {}

  ngOnInit() {
    const sceneId = Number(this.route.snapshot.paramMap.get('id'));
    if (sceneId) {
      this.sceneService.getScenes()
        .pipe(take(1))
        .subscribe({
          next: (scenes: Scene[]) => {
            this.scene = scenes.find(s => s.id === sceneId) || null;
          },
          error: (err) => {
            console.error('Failed to load scenes', err);
            this.scene = null;
          }
        });
    }
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
