import { Routes } from '@angular/router';

export const BARBERS_ROUTES: Routes = [
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search.component').then(m => m.SearchComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  }
];
