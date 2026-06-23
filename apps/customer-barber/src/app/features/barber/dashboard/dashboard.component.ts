import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-barber-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  todayAppointments = signal<Appointment[]>([]);
  loading = signal(true);
  stats = signal({
    todayTotal: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });

  readonly AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentsService: AppointmentsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTodayAppointments();
  }

  loadTodayAppointments(): void {
    this.loading.set(true);
    
    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        const allAppointments = response.data || [];
        
        // Filter today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppts = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && aptDate < tomorrow;
        });
        
        this.todayAppointments.set(todayAppts);
        
        // Calculate stats
        this.stats.set({
          todayTotal: todayAppts.length,
          pending: todayAppts.filter(a => a.status === AppointmentStatus.PENDING).length,
          confirmed: todayAppts.filter(a => a.status === AppointmentStatus.CONFIRMED).length,
          completed: todayAppts.filter(a => a.status === AppointmentStatus.COMPLETED).length
        });
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading.set(false);
      }
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getCustomerName(appointment: Appointment): string {
    const customer = appointment.customer?.user;
    if (!customer) return 'Customer';
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  }

  getCustomerImage(appointment: Appointment): string {
    return appointment.customer?.user?.profileImage || 'https://via.placeholder.com/60';
  }

  getStatusColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'status-pending';
      case AppointmentStatus.CONFIRMED:
        return 'status-confirmed';
      case AppointmentStatus.IN_PROGRESS:
        return 'status-in-progress';
      case AppointmentStatus.COMPLETED:
        return 'status-completed';
      default:
        return '';
    }
  }

  getStatusLabel(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'Pending';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmed';
      case AppointmentStatus.IN_PROGRESS:
        return 'In Progress';
      case AppointmentStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  }

  confirmAppointment(appointment: Appointment): void {
    this.appointmentsService.confirmAppointment(appointment.id).subscribe({
      next: () => {
        this.loadTodayAppointments();
      },
      error: (error) => {
        console.error('Error confirming appointment:', error);
      }
    });
  }

  startAppointment(appointment: Appointment): void {
    this.appointmentsService.startAppointment(appointment.id).subscribe({
      next: () => {
        this.loadTodayAppointments();
      },
      error: (error) => {
        console.error('Error starting appointment:', error);
      }
    });
  }
}
