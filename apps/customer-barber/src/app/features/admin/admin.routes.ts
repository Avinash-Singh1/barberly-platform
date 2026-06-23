import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'barbers',
    loadComponent: () =>
      import('./barbers/barbers.component').then(m => m.BarbersComponent)
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'shops',
    loadComponent: () =>
      import('./shops/shops.component').then(m => m.ShopsComponent)
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews/reviews.component').then(m => m.ReviewsComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'cms',
    loadComponent: () =>
      import('./cms/cms.component').then(m => m.CmsComponent)
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./permissions/permissions.component').then(m => m.PermissionsComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then(m => m.SettingsComponent)
  }
];
