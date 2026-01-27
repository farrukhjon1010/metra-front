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
      title: 'Домашний портрет',
      description: 'Мягкий свет, уют, естественность',
      image: 'assets/images/home-portrait.png'
    },
    {
      title: 'Студийный образ',
      description: 'Чистый фон, аккуратный свет',
      image: 'assets/images/studio-image.png'},
    {
      title: 'Городской вечер',
      description: 'Уличный свет, глубина, атмосфера',
      image: 'assets/images/city-evening.png'
    },
    {
      title: 'Зимний образ',
      description: 'Холодный свет, текстуры, объём',
      image: 'assets/images/winter-look.png'
    },
    {
      title: 'Профиль / Аватар',
      description: 'Идеально для соцсетей',
      image: 'assets/images/profile-avatar.png'
    },
    {
      title: 'Пара / Duo',
      description: 'Два человека в одном кадре',
      image: 'assets/images/pair-duo.png'},
  ];

  selectedScene: { title: string; description: string; image: string } | null = null;

  onSceneSelect(scene: { title: string; description: string; image: string }) {
    this.selectedScene = scene;
  }

  backToGrid() {
    this.selectedScene = null;
  }

}
