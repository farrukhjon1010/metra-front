import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {ScenesGrid} from './scenes-grid/scenes-grid';
import {Loading} from '../../shared/components/loading/loading';
import {Scene} from '../../core/models/scene.model';
import {SceneService} from '../../core/services/scene.service';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [CommonModule, ScenesGrid, Loading, ScenesGrid, Loading],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss']
})
export class ScenesList implements OnInit {
  scenes: Scene[] = [];
  loading = signal(true);

  constructor(private sceneService: SceneService, private router: Router) {}

  ngOnInit() {
    this.sceneService.getScenes().subscribe({
      next: (data) => {
        this.scenes = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load scenes', err);
        this.loading.set(false);
      }
    });
  }

  onSceneSelect(scene: Scene) {
    this.router.navigate(['/scenes', scene.id]);
  }
}
