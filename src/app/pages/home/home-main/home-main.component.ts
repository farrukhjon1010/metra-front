import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { ScenesGrid } from '../../scenes/scenes-grid/scenes-grid';
import { Router } from '@angular/router';
import { SCENES, Scene } from '../home.data';
import {HomeHeader} from '../home-header/home-header';
import {HomeRecommendation} from '../home-recommendation/home-recommendation';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [CommonModule, PaidDialog, ScenesGrid, HomeHeader, HomeRecommendation],
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
})
export class HomeMainComponent {

  scenes = SCENES;

  constructor(private router: Router) {}

  onSceneSelect(scene: Scene) {
    this.router.navigate(['/home', scene.id]);
  }

  showPaidDialog = signal(true);

  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000);
  }

}
