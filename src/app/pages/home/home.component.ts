import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  scenes: any[] = [
    {
      title: 'Домашний портрет',
      description: 'Уютная атмосфера, естественный свет',
      image: null
    },
    {
      title: 'Студийный образ',
      description: 'Профессиональная съемка, четкие линии',
      image: null
    },
    {
      title: 'Городской вечер',
      description: 'Уличной свет, глубина, атмосфера',
      image: null
    },
    {
      title: 'Зимний образ',
      description: 'Холодный свет, текстуры, объём',
      image: null
    },
    {
      title: 'Профиль / Аватар',
      description: 'Портретное фото, фокус на лице',
      image: null
    },
    {
      title: 'Пара / Duo',
      description: 'Два человека, взаимодействие',
      image: null
    }
  ];

  recommendations = [
    { label: 'Домашний портрет', icon: 'home' },
    { label: 'Студийный образ', icon: 'studio' },
    { label: 'Городской вечер', icon: 'city' },
    { label: 'Зимний образ', icon: 'winter' },
    { label: 'Профиль / Аватар', icon: 'profile' },
    { label: 'Пара / Duo', icon: 'duo' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getScenes().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.scenes = data;
        }
      },
      error: (err) => {
        console.error('Error loading scenes:', err);
        // Используем дефолтные сцены при ошибке
      }
    });
  }
}
