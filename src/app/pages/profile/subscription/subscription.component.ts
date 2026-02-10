import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {CommonModule} from '@angular/common';

interface SubscriptionPlan {
  id: string;
  title: string;
  price: number;
  features: string[];
  examples: string[];
  isRecommended?: boolean;
  cardClass: string;
  spanClass: string;
  buttonType: 'primary' | 'danger' | 'green';
}

@Component({
  selector: 'app-subscription',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent {

  plans: SubscriptionPlan[] = [
    {id: 'basic', title: 'Metra Basic', price: 990,
      features: [
        '120 токенов в месяц',
        'Доступ к сценам METRA',
        'Доступ к Nano Banana'
      ],
      examples: [
        '~24 генераций в Nano Banana',
        'или 12 генераций в Nano Banana PRO',
        'комбинируйте режимы как удобно'
      ],
      cardClass: 'metra-basic-card',
      spanClass: 'span-card-basic',
      buttonType: 'primary'
    },
    {id: 'pro', title: 'Metra Pro', price: 2490, isRecommended: true,
      features: [
        '350 токенов в месяц',
        'Доступ к сценам METRA',
        'Доступ к Nano Banana Pro',
        'Видео-режимы',
        'Примерка одежды (Wardrobe)'
      ],
      examples: [
        '~70 генераций в Nano Banana',
        'или ~35 генераций в Nano Banana PRO',
        'или фото + видео + wardrobe в любом сочетании'
      ],
      cardClass: 'metra-pro-card',
      spanClass: 'span-card-pro',
      buttonType: 'danger'
    },
    {id: 'max', title: 'Metra Max', price: 4990,
      features: [
        '800 токенов в месяц',
        'Доступ к сценам METRA',
        'Доступ к Nano Banana Pro',
        'Видео-режимы',
        'Примерка одежды (Wardrobe)',
        'Upscale',
        'Приоритет в очереди'
      ],
      examples: [
        '~160 генераций в Nano Banana',
        'или ~80 генераций в Nano Banana PRO',
        'или активное использование всех функций'
      ],
      cardClass: 'metra-max-card',
      spanClass: 'span-card-max',
      buttonType: 'green'
    }
  ];

  constructor(private router: Router) {
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  selectPlan(plan: SubscriptionPlan) {
    console.log('Selected plan:', plan);
  }
}
