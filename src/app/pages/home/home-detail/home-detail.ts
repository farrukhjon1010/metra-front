import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../../scenes/scenes-card/scenes-card';
import { HomeHeader } from '../home-header/home-header';
import { SceneService } from '../../../core/services/scene.service';
import { Scene } from '../../../core/models/scene.model';
import {Loading} from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-home-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard, HomeHeader, Loading],
  templateUrl: './home-detail.html',
  styleUrls: ['./home-detail.scss'],
})
export class HomeDetail implements OnInit {
  scene: Scene | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sceneService: SceneService
  ) {}

  ngOnInit() {
    const sceneId = Number(this.route.snapshot.paramMap.get('id'));
    if (sceneId) {
      this.sceneService.getScenes().subscribe({
        next: (scenes: Scene[]) => {
          this.scene = scenes.find(s => s.id === sceneId) || null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load scenes', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
