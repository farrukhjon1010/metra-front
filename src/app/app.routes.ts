import {Routes} from '@angular/router';
import {SplashComponent} from './pages/splash/splash.component';
import {CreateComponent} from './pages/create/create.component';

export const routes: Routes = [
  {path: '', redirectTo: 'splash', pathMatch: 'full'},
  {path: 'splash', component: SplashComponent, data: { title: 'Splash', showHeader: false }},
  {
    path: 'create',
    component: CreateComponent,
    data: { title: 'Создать', showHeader: true },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/create/create-grid/create-grid')
            .then(m => m.CreateGrid)
      },
      {
        path: ':type',
        data: { title: 'Создать', showHeader: false },
        loadComponent: () =>
          import('./pages/create/create-detail/create-detail')
            .then(m => m.CreateDetail)
      }
    ]
  },
  {
    path: 'profile',
    data: { title: 'Профиль', showHeader: true },
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: '',
        data: { title: 'Профиль', showHeader: true },
        loadComponent: () =>
          import('./pages/profile/profile-main/profile-main-component')
            .then(m => m.ProfileMainComponent)
      },
      {
        path: 'add-avatar',
        data: { title: 'Профиль', showHeader: false },
        loadComponent: () =>
          import('./pages/profile/add-avatar/add-avatar.component')
            .then(m => m.AddAvatarComponent)
      },
      {
        path: 'balance',
        data: { title: 'Профиль', showHeader: false },
        loadComponent: () =>
          import('./pages/profile/balance/balance.component')
            .then(m => m.BalanceComponent)
      },
      {
        path: 'affiliate-program',
        data: { title: 'Профиль', showHeader: false },
        loadComponent: () =>
          import('./pages/profile/affiliate-program/affiliate-program.component')
            .then(m => m.AffiliateProgramComponent)
      },
      {
        path: 'subscription',
        data: { title: 'Профиль', showHeader: false },
        loadComponent: () =>
          import('./pages/profile/subscription/subscription.component')
            .then(m => m.SubscriptionComponent)
      }
    ]
  },

  {
    path: 'history',
    data: { title: 'История', showHeader: true },
    loadComponent: () =>
      import('./pages/history/history.component').then(m => m.HistoryComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/history/history-list/history-list.component')
            .then(m => m.HistoryListComponent)
      },
      {
        path: 'improving-quality',
        data: { title: 'История', showHeader: false },
        loadComponent: () =>
          import('./pages/history/improving-quality/improving-quality')
            .then(m => m.ImprovingQuality)
      }
    ]
  },

  {
    path: 'home',
    data: { title: 'Главная', showHeader: false },
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'scenes',
    data: { title: 'Сцены', showHeader: false },
    loadComponent: () =>
      import('./pages/scenes/scenes.component').then(m => m.ScenesComponent)
  },

  { path: '**', redirectTo: 'splash' }
];
