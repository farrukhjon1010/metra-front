import {Routes} from '@angular/router';
import {SplashComponent} from './pages/splash/splash.component';
import {CreateComponent} from './pages/create/create.component';

export const routes: Routes = [
  {path: '', redirectTo: 'splash', pathMatch: 'full'},
  {path: 'splash', component: SplashComponent},
  {path: 'create', component: CreateComponent},
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.component')
      .then(m => m.HistoryComponent)
  },
  {
    path: 'history/improving-quality',
    loadComponent: () => import('./pages/history/improving-quality/improving-quality')
      .then(m => m.ImprovingQuality)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'profile/add-avatar',
    loadComponent: () => import('./pages/profile/add-avatar/add-avatar.component')
      .then(m => m.AddAvatarComponent)
  },
  {
    path: 'profile/balance',
    loadComponent: () => import('./pages/profile/balance/balance.component')
      .then(m => m.BalanceComponent)
  },
  {
    path: 'profile/affiliate-program',
    loadComponent: () => import('./pages/profile/affiliate-program/affiliate-program.component')
      .then(m => m.AffiliateProgramComponent)
  },
  {
    path: 'profile/subscription',
    loadComponent: () => import('./pages/profile/subscription/subscription.component')
      .then(m => m.SubscriptionComponent)
  },
  {
    path: 'scenes',
    loadComponent: () => import('./pages/scenes/scenes.component')
      .then(m => m.ScenesComponent)
  },
  {path: '**', redirectTo: 'splash'}
];

