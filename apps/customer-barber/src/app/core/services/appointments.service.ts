import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest
} from '../models/appointment.model';
import { ApiResponse, PaginatedApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private readonly API_URL = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new appointment
   */
  createAppointment(request: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.API_URL, request);
  }

  /**
   * Get my appointments
   */
  getMyAppointments(
    status?: AppointmentStatus,
    from?: string,
    to?: string,
    page = 1,
    limit = 10
  ): Observable<PaginatedApiResponse<Appointment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) params = params.set('status', status);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<PaginatedApiResponse<Appointment>>(this.API_URL, { params });
  }

  /**
   * Get appointment details
   */
  getAppointmentDetails(appointmentId: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.API_URL}/${appointmentId}`);
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string, reason?: string): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.API_URL}/${appointmentId}/cancel`,
      { reason }
    );
  }

  /**
   * Reschedule appointment
   */
  rescheduleAppointment(
    appointmentId: string,
    newAppointmentDate: string
  ): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.API_URL}/${appointmentId}/reschedule`,
      { newAppointmentDate }
    );
  }

  /**
   * Confirm appointment (BARBER only)
   */
  confirmAppointment(appointmentId: string): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.API_URL}/${appointmentId}/confirm`,
      {}
    );
  }

  /**
   * Start appointment (BARBER only)
   */
  startAppointment(appointmentId: string): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.API_URL}/${appointmentId}/start`,
      {}
    );
  }

  /**
   * Complete appointment (BARBER only)
   */
  completeAppointment(appointmentId: string): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.API_URL}/${appointmentId}/complete`,
      {}
    );
  }
}
