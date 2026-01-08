import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { CreateComponent } from './pages/create/create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'balance', loadComponent: () => import('./pages/balance/balance.component').then(m => m.BalanceComponent) },
  { path: 'create', component: CreateComponent },
  { path: 'history', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'scenes', loadComponent: () => import('./pages/scenes/scenes.component').then(m => m.ScenesComponent) },
  { path: '**', redirectTo: 'splash' }
];

