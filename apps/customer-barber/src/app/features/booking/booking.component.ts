import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BarbersService } from '../../core/services/barbers.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { BarberProfile, Service } from '../../core/models/barber.model';

type BookingStep = 1 | 2 | 3;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  // State
  currentStep = signal<BookingStep>(1);
  barber = signal<BarberProfile | null>(null);
  services = signal<Service[]>([]);
  availableSlots = signal<string[]>([]);
  
  // Selections
  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTimeSlot = signal<string | null>(null);
  customerNotes = signal('');

  // UI State
  loadingBarber = signal(true);
  loadingSlots = signal(false);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Date picker
  minDate = signal<string>('');
  maxDate = signal<string>('');

  // Computed
  canProceedToStep2 = computed(() => this.selectedService() !== null);
  canProceedToStep3 = computed(() => this.selectedDate() !== null && this.selectedTimeSlot() !== null);
  totalPrice = computed(() => this.selectedService()?.price || 0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barbersService: BarbersService,
    private appointmentsService: AppointmentsService
  ) {
    // Set min and max dates
    const today = new Date();
    const maxBookingDate = new Date();
    maxBookingDate.setMonth(maxBookingDate.getMonth() + 3); // 3 months ahead

    this.minDate.set(this.formatDateForInput(today));
    this.maxDate.set(this.formatDateForInput(maxBookingDate));
  }

  ngOnInit(): void {
    const barberId = this.route.snapshot.paramMap.get('id');
    const preSelectedServiceId = this.route.snapshot.queryParams['serviceId'];

    if (barberId) {
      this.loadBarberAndServices(barberId, preSelectedServiceId);
    } else {
      this.router.navigate(['/barbers/search']);
    }
  }

  loadBarberAndServices(barberId: string, preSelectedServiceId?: string): void {
    this.barbersService.getBarberProfile(barberId).subscribe({
      next: (response) => {
        this.barber.set(response.data || null);
        this.loadingBarber.set(false);
      },
      error: (error) => {
        console.error('Error loading barber:', error);
        this.errorMessage.set('Failed to load barber information');
        this.loadingBarber.set(false);
      }
    });

    this.barbersService.getBarberServices(barberId).subscribe({
      next: (response) => {
        const servicesMap = response.data || {};
        const allServices: Service[] = [];
        
        Object.values(servicesMap).forEach(categoryServices => {
          allServices.push(...categoryServices);
        });
        
        this.services.set(allServices);

        // Pre-select service if provided
        if (preSelectedServiceId) {
          const service = allServices.find(s => s.id === preSelectedServiceId);
          if (service) {
            this.selectedService.set(service);
          }
        }
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  selectService(service: Service): void {
    this.selectedService.set(service);
  }

  goToStep(step: BookingStep): void {
    if (step === 2 && !this.canProceedToStep2()) return;
    if (step === 3 && !this.canProceedToStep3()) return;
    
    this.currentStep.set(step);
    this.errorMessage.set(null);
  }

  nextStep(): void {
    const current = this.currentStep();
    if (current === 1 && this.canProceedToStep2()) {
      this.currentStep.set(2);
    } else if (current === 2 && this.canProceedToStep3()) {
      this.currentStep.set(3);
    }
  }

  previousStep(): void {
    const current = this.currentStep();
    if (current > 1) {
      this.currentStep.set((current - 1) as BookingStep);
      this.errorMessage.set(null);
    }
  }

  onDateChange(dateString: string): void {
    const date = new Date(dateString);
    this.selectedDate.set(date);
    this.selectedTimeSlot.set(null); // Reset time slot
    this.loadAvailableSlots(date);
  }

  loadAvailableSlots(date: Date): void {
    const barberId = this.barber()?.id;
    const serviceId = this.selectedService()?.id;

    if (!barberId || !serviceId) return;

    this.loadingSlots.set(true);
    this.availableSlots.set([]);

    const dateString = date.toISOString().split('T')[0];

    this.barbersService.getBarberAvailability(barberId, dateString, serviceId).subscribe({
      next: (response) => {
        this.availableSlots.set(response.data?.availableSlots || []);
        this.loadingSlots.set(false);
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.errorMessage.set('Failed to load available time slots');
        this.loadingSlots.set(false);
      }
    });
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  confirmBooking(): void {
    const barberId = this.barber()?.id;
    const serviceId = this.selectedService()?.id;
    const timeSlot = this.selectedTimeSlot();

    if (!barberId || !serviceId || !timeSlot) {
      this.errorMessage.set('Please complete all required fields');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const bookingData = {
      barberId,
      serviceId,
      appointmentDate: timeSlot,
      notes: this.customerNotes().trim() || undefined
    };

    this.appointmentsService.createAppointment(bookingData).subscribe({
      next: (response) => {
        this.submitting.set(false);
        // Navigate to bookings page with success message
        this.router.navigate(['/my/bookings'], {
          queryParams: { success: 'true', appointmentId: response.data?.id }
        });
      },
      error: (error) => {
        this.submitting.set(false);
        this.errorMessage.set(error.message || 'Failed to create appointment. Please try again.');
      }
    });
  }

  getBarberFullName(): string {
    const barber = this.barber();
    return `${barber?.user?.firstName || ''} ${barber?.user?.lastName || ''}`.trim();
  }

  formatDateForDisplay(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTimeSlot(slot: string): string {
    const date = new Date(slot);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  groupSlotsByPeriod(slots: string[]): Record<string, string[]> {
    const groups: Record<string, string[]> = { morning: [], afternoon: [], evening: [] };
    
    slots.forEach(slot => {
      const date = new Date(slot);
      const hour = date.getHours();
      
      if (hour < 12) {
        groups['morning'].push(slot);
      } else if (hour < 17) {
        groups['afternoon'].push(slot);
      } else {
        groups['evening'].push(slot);
      }
    });

    return groups;
  }

  getSlotGroups(): Record<string, string[]> {
    return this.groupSlotsByPeriod(this.availableSlots());
  }
}
