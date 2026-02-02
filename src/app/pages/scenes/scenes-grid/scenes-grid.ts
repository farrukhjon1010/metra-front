import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {ScenesHeader} from '../scenes-header/scenes-header';
import {SceneService} from '../../../core/services/scene.service';
import {Scene} from '../../../core/models/scene.model';

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [ScenesHeader],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid implements OnInit {
  @Input() scenes: { name: string; description: string; image: string }[] = [];
  @Output() selectScene = new EventEmitter<{ name: string; description: string; image: string }>();

  loading = false;
  error: string | null = null;

  constructor(private sceneService: SceneService) {
  }

  ngOnInit(): void {
    this.loadScenes();
  }

  loadScenes(type?: string) {
    this.loading = true;
    this.error = null;
    this.sceneService.getScenes(type ? {type} : undefined).subscribe({
      next: (scenes: Scene[]) => {
        this.scenes = scenes.map(s => ({name: s.name, description: s.description || '', image: s.image || ''}));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load scenes', err);
        this.error = 'Не удалось загрузить сцены';
        this.loading = false;
      }
    });
  }

  select(scene: { name: string; description: string; image: string }) {
    this.selectScene.emit(scene);
  }

}
