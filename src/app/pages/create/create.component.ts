import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CreateGrid} from './create-grid/create-grid';
import {CreateDetail} from './create-detail/create-detail';
import { GenerationType } from '../../core/models/generation.model';
import { Router } from '@angular/router';

export interface CreateCard {
  id: string;
  title: string;
  icon: string;
  category: string;
  type: GenerationType
}

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, CreateGrid, CreateDetail],
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  selectedCard: CreateCard | null = null;
  initialPrompt: string = '';
  initialImageUrl: string | null = null;

  cards: CreateCard[] = [
    {
      id: 'photo-scene',
      title: 'Фото по сцене',
      icon: 'assets/icons/photo-camera-front.svg',
      category: 'Фото',
      type: GenerationType.PHOTO_BY_STAGE
    },
    {
      id: 'photo-reference',
      title: 'Фото по референсу (Image to Image)',
      icon: 'assets/icons/photo-based-on-reference.svg',
      category: 'Фото',
      type: GenerationType.PHOTO_BY_REFERENCE
    },
    {
      id: 'animate-photo',
      title: 'Оживление фото',
      icon: 'assets/icons/emotions.svg',
      category: 'Видео',
      type: GenerationType.PHOTO_ANIMATION
    },
    {
      id: 'lipsync',
      title: 'LipSync',
      icon: 'assets/icons/lips.svg',
      category: 'Видео',
      type: GenerationType.LIP_SYNC
    },
    {
      id: 'nano-banana',
      title: 'Nano Banana',
      icon: 'assets/icons/nano-banana.svg',
      category: 'Генерация',
      type: GenerationType.NANO_BANANA
    },
    {
      id: 'nano-banana-pro',
      title: 'Nano Banana PRO',
      icon: 'assets/icons/nano-banana-pro.svg',
      category: 'Генерация',
      type: GenerationType.NANO_BANANA_PRO
    },
    {
      id: 'female-style',
      title: 'Женский стиль',
      icon: 'assets/icons/wedding-dress.svg',
      category: 'Wardrobe',
      type: GenerationType.WOMEN_STYLE
    },
    {
      id: 'male-style',
      title: 'Мужской стиль',
      icon: 'assets/icons/suit.svg',
      category: 'Wardrobe',
      type: GenerationType.MEN_STYLE
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation?.();
    const state = navigation?.extras?.state ?? (history.state || null);

    if (state && state.type) {
      const matched = this.cards.find(c => c.type === state.type);
      if (matched) {
        this.selectedCard = matched;
        this.initialPrompt = state.prompt ?? '';
        this.initialImageUrl = state.imageUrl ?? state.imageURL ?? null;
      }
    }
  }

  selectCard(card: CreateCard) {
    this.selectedCard = card;
  }

  back() {
    this.selectedCard = null;
    this.initialPrompt = '';
    this.initialImageUrl = null;
  }
}
