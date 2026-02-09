import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ScenesGrid} from './scenes-grid/scenes-grid';
import {ScenesCard} from './scenes-card/scenes-card';
import {ActivatedRoute, Router} from '@angular/router';
import {SCENES, Scene} from '../home/home.data';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [ScenesGrid, ScenesCard],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
})
export class ScenesComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  scenes = SCENES;
  private params = toSignal(this.route.paramMap);

  selectedScene = computed(() => {
    const p = this.params();
    const id = p?.get('id');
    return id ? this.scenes.find(s => s.id === id) || null : null;
  });

  onSceneSelect(scene: Scene) {
    this.router.navigate(['/scenes/detail', scene.id]);
  }

  backToGrid() {
    this.router.navigate(['/scenes']);
  }
}
