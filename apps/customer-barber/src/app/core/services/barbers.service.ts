import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BarberProfile,
  BarberSearchFilters,
  Service,
  PaginatedResponse
} from '../models/barber.model';
import { ApiResponse, PaginatedApiResponse } from '../models/api-response.model';
import { AvailabilityResponse } from '../models/appointment.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class BarbersService {
  private readonly API_URL = `${environment.apiUrl}/barbers`;

  constructor(private http: HttpClient) {}

  /**
   * Get featured barbers
   */
  getFeaturedBarbers(limit = 6): Observable<ApiResponse<BarberProfile[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<BarberProfile[]>>(
      `${this.API_URL}/featured`,
      { params }
    );
  }

  /**
   * Search barbers with filters
   */
  searchBarbers(filters: BarberSearchFilters): Observable<PaginatedApiResponse<BarberProfile>> {
    let params = new HttpParams();

    if (filters.q) params = params.set('q', filters.q);
    if (filters.services?.length) params = params.set('services', filters.services.join(','));
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
    if (filters.city) params = params.set('city', filters.city);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedApiResponse<BarberProfile>>(
      `${this.API_URL}/search`,
      { params }
    );
  }

  /**
   * Get barber profile by ID
   */
  getBarberProfile(barberId: string): Observable<ApiResponse<BarberProfile>> {
    return this.http.get<ApiResponse<BarberProfile>>(`${this.API_URL}/${barberId}`);
  }

  /**
   * Get barber services
   */
  getBarberServices(barberId: string): Observable<ApiResponse<Record<string, Service[]>>> {
    return this.http.get<ApiResponse<Record<string, Service[]>>>(
      `${this.API_URL}/${barberId}/services`
    );
  }

  /**
   * Get barber availability
   */
  getBarberAvailability(
    barberId: string,
    date: string,
    serviceId: string
  ): Observable<ApiResponse<AvailabilityResponse>> {
    const params = new HttpParams()
      .set('date', date)
      .set('serviceId', serviceId);

    return this.http.get<ApiResponse<AvailabilityResponse>>(
      `${this.API_URL}/${barberId}/availability`,
      { params }
    );
  }

  /**
   * Get barber reviews
   */
  getBarberReviews(
    barberId: string,
    page = 1,
    limit = 10
  ): Observable<ApiResponse<PaginatedResponse<Review>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Review>>>(
      `${this.API_URL}/${barberId}/reviews`,
      { params }
    );
  }
}
