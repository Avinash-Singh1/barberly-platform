import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';

type TabType = 'upcoming' | 'completed' | 'cancelled';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  activeTab = signal<TabType>('upcoming');
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Computed filtered appointments
  upcomingAppointments = computed(() =>
    this.appointments().filter(apt =>
      apt.status === AppointmentStatus.PENDING ||
      apt.status === AppointmentStatus.CONFIRMED ||
      apt.status === AppointmentStatus.IN_PROGRESS
    )
  );

  completedAppointments = computed(() =>
    this.appointments().filter(apt => apt.status === AppointmentStatus.COMPLETED)
  );

  cancelledAppointments = computed(() =>
    this.appointments().filter(apt =>
      apt.status === AppointmentStatus.CANCELLED ||
      apt.status === AppointmentStatus.NO_SHOW
    )
  );

  readonly AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for success messages
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        this.successMessage.set('Appointment booked successfully! 🎉');
        // Clear query params
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      } else if (params['reviewSuccess'] === 'true') {
        this.successMessage.set('Review submitted successfully! Thank you for your feedback! ⭐');
        // Clear query params
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading.set(true);
    
    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        this.appointments.set(response.data || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.errorMessage.set('Failed to load appointments');
        this.loading.set(false);
      }
    });
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  getDisplayedAppointments(): Appointment[] {
    switch (this.activeTab()) {
      case 'upcoming':
        return this.upcomingAppointments();
      case 'completed':
        return this.completedAppointments();
      case 'cancelled':
        return this.cancelledAppointments();
      default:
        return [];
    }
  }

  cancelAppointment(appointment: Appointment): void {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.appointmentsService.cancelAppointment(appointment.id, 'Cancelled by customer').subscribe({
      next: () => {
        this.successMessage.set('Appointment cancelled successfully');
        this.loadAppointments();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to cancel appointment');
      }
    });
  }

  viewBarberProfile(barberId: string): void {
    this.router.navigate(['/barbers', barberId]);
  }

  getBarberFullName(appointment: Appointment): string {
    return `${appointment.barber?.user?.firstName || ''} ${appointment.barber?.user?.lastName || ''}`.trim();
  }

  getBarberImage(appointment: Appointment): string {
    return appointment.barber?.user?.profileImage || 'https://via.placeholder.com/80';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return 'status-cancelled';
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
      case AppointmentStatus.CANCELLED:
        return 'Cancelled';
      case AppointmentStatus.NO_SHOW:
        return 'No Show';
      default:
        return status;
    }
  }

  canCancelAppointment(appointment: Appointment): boolean {
    // Can cancel if pending or confirmed and at least 2 hours before
    if (appointment.status !== AppointmentStatus.PENDING &&
        appointment.status !== AppointmentStatus.CONFIRMED) {
      return false;
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    
    return appointmentDate > twoHoursFromNow;
  }

  canWriteReview(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.COMPLETED;
  }

  writeReview(appointment: Appointment): void {
    // Navigate to write review page/modal
    this.router.navigate(['/my/reviews/write'], {
      queryParams: { appointmentId: appointment.id }
    });
  }

  closeMessage(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
