import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneService } from '../../../core/services/scene.service';
import { Scene } from '../../../core/models/scene.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenesCard } from '../scenes-card/scenes-card';

@Component({
  selector: 'app-scene-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard],
  templateUrl: './scenes-detail.html',
  styleUrls: ['./scenes-detail.scss']
})
export class SceneDetail implements OnInit {
  scene: Scene | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sceneService: SceneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sceneService.getScenes().subscribe({
        next: (scenes) => {
          this.scene = scenes.find(s => s.id === +id) || null;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }
  }

  backToList() {
    this.router.navigate(['/scenes']);
  }
}
