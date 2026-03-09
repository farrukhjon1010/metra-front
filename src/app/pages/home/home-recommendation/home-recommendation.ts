import { Component, EventEmitter, Output, computed, signal } from '@angular/core';
import { SceneCategory } from '../../../core/models/scene.model';

@Component({
  selector: 'app-home-recommendation',
  standalone: true,
  templateUrl: './home-recommendation.html',
  styleUrls: ['./home-recommendation.scss'],
})
export class HomeRecommendation {

  @Output() selectCategory = new EventEmitter<SceneCategory>();

  recommendations = signal<SceneCategory[]>([
    { id: 1, name: 'Домашний портрет', createdAt: '', image: 'assets/icons/home-port-icon.svg', description: '' },
    { id: 2, name: 'Студийный образ', createdAt: '', image: 'assets/icons/studio-icon.svg', description: '' },
    { id: 3, name: 'Городской вечер', createdAt: '', image: 'assets/icons/city-night-icon.svg', description: '' },
    { id: 4, name: 'Зимний образ', createdAt: '', image: 'assets/icons/winter-look-icon.svg', description: '' },
    { id: 5, name: 'Профиль / Аватар', createdAt: '', image: 'assets/icons/profile-avatar-icon.svg', description: '' },
    { id: 6, name: 'Пара / Duo', createdAt: '', image: 'assets/icons/pair-duo-icon.svg', description: '' }
  ]);

  rows = computed(() => {
    const res: SceneCategory[][] = [];
    const recs = this.recommendations();
    for (let i = 0; i < recs.length; i += 2) {
      res.push(recs.slice(i, i + 2));
    }
    return res;
  });

  select(category: SceneCategory) {
    this.selectCategory.emit(category);
  }
}
