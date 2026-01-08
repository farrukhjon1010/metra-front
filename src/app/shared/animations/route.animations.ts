import { trigger, transition, style, animate } from '@angular/animations';

export const routeAnimation =
  trigger('routeAnimation', [
    transition('* <=> *', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('250ms ease-out', style({ opacity: 1, transform: 'none' }))
    ])
  ]);
