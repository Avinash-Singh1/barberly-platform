import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'bookings',
    loadComponent: () =>
      import('./bookings/bookings.component').then(m => m.BookingsComponent)
  },
  {
    path: 'reviews/write',
    loadComponent: () =>
      import('./reviews/reviews.component').then(m => m.ReviewsComponent)
  },
  {
    path: '',
    redirectTo: 'bookings',
    pathMatch: 'full'
  }
];
