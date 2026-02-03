import {Component} from '@angular/core';
import {ScenesGrid} from './scenes-grid/scenes-grid';
import {ScenesCard} from './scenes-card/scenes-card';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [ScenesGrid, ScenesGrid, ScenesCard],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
})
export class ScenesComponent {

  scenes = [
    {
      name: 'Домашний портрет',
      description: 'Мягкий свет, уют, естественность',
      image: 'assets/images/home-portrait.png'
    },
    {
      name: 'Студийный образ',
      description: 'Чистый фон, аккуратный свет',
      image: 'assets/images/studio-image.png'},
    {
      name: 'Городской вечер',
      description: 'Уличный свет, глубина, атмосфера',
      image: 'assets/images/city-evening.png'
    },
    {
      name: 'Зимний образ',
      description: 'Холодный свет, текстуры, объём',
      image: 'assets/images/winter-look.png'
    },
    {
      name: 'Профиль / Аватар',
      description: 'Идеально для соцсетей',
      image: 'assets/images/profile-avatar.png'
    },
    {
      name: 'Пара / Duo',
      description: 'Два человека в одном кадре',
      image: 'assets/images/pair-duo.png'},
  ];

  selectedScene: { name: string; description: string; image: string } | null = null;

  onSceneSelect(scene: any) {
    this.selectedScene = scene;
  }

  backToGrid() {
    this.selectedScene = null;
  }

}
