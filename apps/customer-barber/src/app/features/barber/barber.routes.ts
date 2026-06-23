import { Routes } from '@angular/router';

export const BARBER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews/reviews.component').then(m => m.ReviewsComponent)
  },
  {
    path: 'earnings',
    loadComponent: () =>
      import('./earnings/earnings.component').then(m => m.EarningsComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
