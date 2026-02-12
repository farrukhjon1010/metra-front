import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { ScenesHeader } from '../scenes-header/scenes-header';
import {Scene, SceneCategory} from '../../../core/models/scene.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {ApiService} from '../../../core/services/api.service';

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

  private api = inject(ApiService);
  public categories$!: Observable<SceneCategory[]>;

  ngOnInit() {
    this.categories$ = this.getCategories();
  }

  getCategories(): Observable<SceneCategory[]> {
    return this.api.getSceneCategories<SceneCategory[]>();
  }

  select(scene: Scene) {
    this.selectScene.emit(scene);
  }
}
