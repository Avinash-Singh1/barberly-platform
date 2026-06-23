import { BarberProfile, Service } from './barber.model';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  status: AppointmentStatus;
  totalPrice: number;
  notes: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  barber?: BarberProfile;
  service?: Service;
  customer?: any;
}

export interface CreateAppointmentRequest {
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  notes?: string;
}

export interface AvailabilityResponse {
  availableSlots: string[];
}
