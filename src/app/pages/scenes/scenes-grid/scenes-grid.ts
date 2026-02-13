import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { ScenesHeader } from '../scenes-header/scenes-header';
import {Scene, SceneCategory} from '../../../core/models/scene.model';
import { SceneService } from '../../../core/services/scene.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-scenes-grid',
  standalone: true,
  imports: [ScenesHeader, AsyncPipe],
  templateUrl: './scenes-grid.html',
  styleUrls: ['./scenes-grid.scss'],
})
export class ScenesGrid implements OnInit {
  @Input() scenes: Scene[] = [];
  @Output() selectScene = new EventEmitter<Scene>();

  private sceneService = inject(SceneService);
  public categories$!: Observable<SceneCategory[]>;

  ngOnInit() {
    this.categories$ = this.getCategories();
  }

  getCategories(): Observable<SceneCategory[]> {
    return this.sceneService.getCategories();
  }

  select(scene: Scene) {
    this.selectScene.emit(scene);
  }
}
