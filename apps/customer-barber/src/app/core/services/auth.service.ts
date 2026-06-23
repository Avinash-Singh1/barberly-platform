import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public readonly signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  // Computed signals
  readonly isCustomer = computed(() => 
    this.currentUserSignal()?.role === UserRole.CUSTOMER
  );
  readonly isBarber = computed(() => 
    this.currentUserSignal()?.role === UserRole.BARBER
  );
  readonly userFullName = computed(() => {
    const user = this.currentUserSignal();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuth(): void {
    const token = this.storage.getAccessToken();
    const user = this.storage.getUser();
    
    if (token && user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/register`,
      request
    ).pipe(
      tap(response => {
        if (response.data) {
          this.handleAuthSuccess(response.data);
        }
      })
    );
  }

  /**
   * Login
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/login`,
      request
    ).pipe(
      tap(response => {
        if (response.data) {
          this.handleAuthSuccess(response.data);
        }
      })
    );
  }

  /**
   * Logout
   */
  logout(): Observable<ApiResponse> {
    const refreshToken = this.storage.getRefreshToken();
    
    return this.http.post<ApiResponse>(
      `${this.API_URL}/logout`,
      { refreshToken }
    ).pipe(
      tap(() => {
        this.handleLogout();
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<ApiResponse<{ accessToken: string }>> {
    const refreshToken = this.storage.getRefreshToken();
    
    return this.http.post<ApiResponse<{ accessToken: string }>>(
      `${this.API_URL}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.data) {
          this.storage.setAccessToken(response.data.accessToken);
        }
      })
    );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/profile`).pipe(
      tap(response => {
        if (response.data) {
          this.currentUserSignal.set(response.data);
          this.storage.setUser(response.data);
        }
      })
    );
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(authResponse: AuthResponse): void {
    this.storage.setAccessToken(authResponse.accessToken);
    this.storage.setRefreshToken(authResponse.refreshToken);
    this.storage.setUser(authResponse.user);
    this.currentUserSignal.set(authResponse.user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    this.storage.clearAll();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Force logout (called on 401 errors)
   */
  forceLogout(): void {
    this.handleLogout();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }
}
