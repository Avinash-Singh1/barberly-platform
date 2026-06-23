import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';

type ViewMode = 'list' | 'calendar';
type FilterStatus = 'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

@Component({
  selector: 'app-barber-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  viewMode = signal<ViewMode>('list');
  filterStatus = signal<FilterStatus>('all');
  selectedAppointment = signal<Appointment | null>(null);
  showModal = signal(false);
  actionLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Calendar state
  currentMonth = signal(new Date());
  calendarDays = signal<CalendarDay[]>([]);

  readonly AppointmentStatus = AppointmentStatus;

  // Computed filtered appointments
  filteredAppointments = computed(() => {
    const filter = this.filterStatus();
    const appts = this.appointments();

    if (filter === 'all') return appts;

    if (filter === 'cancelled') {
      return appts.filter(a => 
        a.status === AppointmentStatus.CANCELLED || 
        a.status === AppointmentStatus.NO_SHOW
      );
    }

    return appts.filter(a => a.status === filter.toUpperCase());
  });

  // Computed stats
  stats = computed(() => {
    const appts = this.appointments();
    return {
      total: appts.length,
      pending: appts.filter(a => a.status === AppointmentStatus.PENDING).length,
      confirmed: appts.filter(a => a.status === AppointmentStatus.CONFIRMED).length,
      inProgress: appts.filter(a => a.status === AppointmentStatus.IN_PROGRESS).length,
      completed: appts.filter(a => a.status === AppointmentStatus.COMPLETED).length,
      cancelled: appts.filter(a => 
        a.status === AppointmentStatus.CANCELLED || 
        a.status === AppointmentStatus.NO_SHOW
      ).length
    };
  });

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.generateCalendar();
  }

  loadAppointments(): void {
    this.loading.set(true);
    
    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        this.appointments.set(response.data || []);
        this.generateCalendar(); // Regenerate calendar with new data
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.errorMessage.set('Failed to load appointments');
        this.loading.set(false);
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'calendar') {
      this.generateCalendar();
    }
  }

  setFilterStatus(status: FilterStatus): void {
    this.filterStatus.set(status);
  }

  generateCalendar(): void {
    const current = this.currentMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate calendar days
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        appointments: this.getAppointmentsForDate(date)
      });
    }
    
    // Add current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        appointments: this.getAppointmentsForDate(date)
      });
    }
    
    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        appointments: this.getAppointmentsForDate(date)
      });
    }
    
    this.calendarDays.set(days);
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments().filter(apt => {
      const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
      return aptDate === dateStr;
    });
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.generateCalendar();
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.generateCalendar();
  }

  getMonthYearLabel(): string {
    const date = this.currentMonth();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  openAppointmentModal(appointment: Appointment): void {
    this.selectedAppointment.set(appointment);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedAppointment.set(null);
    this.errorMessage.set(null);
  }

  confirmAppointment(appointment: Appointment): void {
    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.confirmAppointment(appointment.id).subscribe({
      next: () => {
        this.successMessage.set('Appointment confirmed successfully');
        this.loadAppointments();
        this.closeModal();
        this.actionLoading.set(false);
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to confirm appointment');
        this.actionLoading.set(false);
      }
    });
  }

  startAppointment(appointment: Appointment): void {
    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.startAppointment(appointment.id).subscribe({
      next: () => {
        this.successMessage.set('Service started successfully');
        this.loadAppointments();
        this.closeModal();
        this.actionLoading.set(false);
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to start service');
        this.actionLoading.set(false);
      }
    });
  }

  completeAppointment(appointment: Appointment): void {
    if (!confirm('Mark this appointment as completed? This will create an earning record.')) {
      return;
    }

    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.completeAppointment(appointment.id).subscribe({
      next: () => {
        this.successMessage.set('Appointment completed successfully! 🎉');
        this.loadAppointments();
        this.closeModal();
        this.actionLoading.set(false);
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to complete appointment');
        this.actionLoading.set(false);
      }
    });
  }

  cancelAppointment(appointment: Appointment): void {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.cancelAppointment(appointment.id, reason).subscribe({
      next: () => {
        this.successMessage.set('Appointment cancelled');
        this.loadAppointments();
        this.closeModal();
        this.actionLoading.set(false);
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to cancel appointment');
        this.actionLoading.set(false);
      }
    });
  }

  clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage.set(null);
    }, 5000);
  }

  closeMessage(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  getCustomerName(appointment: Appointment): string {
    const customer = appointment.customer?.user;
    if (!customer) return 'Customer';
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  }

  getCustomerImage(appointment: Appointment): string {
    return appointment.customer?.user?.profileImage || 'https://via.placeholder.com/80';
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

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
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

  canConfirm(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.PENDING;
  }

  canStart(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.CONFIRMED;
  }

  canComplete(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.IN_PROGRESS;
  }

  canCancel(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.PENDING || 
           appointment.status === AppointmentStatus.CONFIRMED;
  }
}
