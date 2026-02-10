import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScenesCard } from '../../scenes/scenes-card/scenes-card';
import { SCENES, Scene } from '../home.data';
import {HomeHeader} from '../home-header/home-header';

@Component({
  selector: 'app-home-detail',
  standalone: true,
  imports: [CommonModule, ScenesCard, HomeHeader],
  templateUrl: './home-detail.html',
  styleUrls: ['./home-detail.scss'],
})
export class HomeDetail implements OnInit {
  scene: Scene | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const sceneId = this.route.snapshot.paramMap.get('id');
    if (sceneId) {
      this.scene = SCENES.find(s => s.id === sceneId);
    }
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
