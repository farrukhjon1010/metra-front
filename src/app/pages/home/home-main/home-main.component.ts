import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { Router } from '@angular/router';
import { HomeHeader } from '../home-header/home-header';
import { HomeRecommendation } from '../home-recommendation/home-recommendation';
import { SceneService } from '../../../core/services/scene.service';
import { Scene } from '../../../core/models/scene.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [CommonModule, PaidDialog, ScenesGrid, HomeHeader, HomeRecommendation],
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
})
export class HomeMainComponent implements OnInit {

  scenes: Scene[] = [];
  showPaidDialog = signal(true);
  loading: boolean = true;

  constructor(private router: Router, private sceneService: SceneService) {}

  ngOnInit() {
    this.sceneService.getScenes()
      .pipe(take(1))
      .subscribe({
        next: (data: Scene[]) => {
          this.scenes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load scenes', err);
          this.loading = false;
        }
      });
  }

  onSceneSelect(scene: Scene) {
    this.router.navigate(['/scenes', scene.id]);
  }

  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000);
  }
}
