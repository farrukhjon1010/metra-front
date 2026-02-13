import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneService } from '../../../core/services/scene.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenesCard } from '../scenes-card/scenes-card';
import { Location } from '@angular/common';
import { switchMap, map } from 'rxjs';

@Component({
  selector: 'app-scene-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard],
  templateUrl: './scenes-detail.html',
  styleUrls: ['./scenes-detail.scss']
})
export class SceneDetail {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sceneService = inject(SceneService);
  private location = inject(Location);

  scene$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.sceneService.getScenes().pipe(
        map(scenes => scenes.find(s => s.id === id) || null)
      );
    })
  );

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/scenes']);
    }
  }
}
