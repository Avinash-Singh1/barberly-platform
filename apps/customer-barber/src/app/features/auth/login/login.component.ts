import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        const user = response.data?.user;

        if (!user) {
          this.errorMessage.set('Login response did not include a user.');
          return;
        }

        const destination = this.returnUrl !== '/'
          ? this.returnUrl
          : this.getDefaultRoute(user.role);

        this.router.navigateByUrl(destination);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      }
    });
  }

  private getDefaultRoute(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.BARBER:
        return '/barber/dashboard';
      case UserRole.CUSTOMER:
        return '/my/bookings';
      default:
        return '/';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors?.['email']) {
        return 'Invalid email format';
      }
      if (control.errors?.['minlength']) {
        return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }
}
