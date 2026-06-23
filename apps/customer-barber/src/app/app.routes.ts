import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'barbers',
    loadChildren: () =>
      import('./features/barbers/barbers.routes').then(m => m.BARBERS_ROUTES)
  },

  // Booking (requires auth - CUSTOMER only)
  {
    path: 'booking/:id',
    canActivate: [authGuard, roleGuard([UserRole.CUSTOMER])],
    loadComponent: () =>
      import('./features/booking/booking.component').then(m => m.BookingComponent)
  },

  // Customer protected routes
  {
    path: 'my',
    canActivate: [authGuard, roleGuard([UserRole.CUSTOMER])],
    loadChildren: () =>
      import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },

  // Barber protected routes
  {
    path: 'barber',
    canActivate: [authGuard, roleGuard([UserRole.BARBER])],
    loadChildren: () =>
      import('./features/barber/barber.routes').then(m => m.BARBER_ROUTES)
  },

  // Admin protected routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
