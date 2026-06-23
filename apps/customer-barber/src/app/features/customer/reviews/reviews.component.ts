import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewsService } from '../../../core/services/reviews.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviewForm!: FormGroup;
  appointment = signal<Appointment | null>(null);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  hoveredStar = signal<number | null>(null);
  
  // Predefined tags
  availableTags = [
    'Professional',
    'Friendly',
    'Skilled',
    'Punctual',
    'Clean',
    'Great Value',
    'Highly Recommend',
    'Excellent Service'
  ];

  selectedTags = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Get appointment ID from query params
    this.route.queryParams.subscribe(params => {
      const appointmentId = params['appointmentId'];
      if (appointmentId) {
        this.loadAppointment(appointmentId);
      } else {
        this.errorMessage.set('No appointment specified');
        this.loading.set(false);
      }
    });
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  loadAppointment(appointmentId: string): void {
    this.loading.set(true);
    
    this.appointmentsService.getAppointmentDetails(appointmentId).subscribe({
      next: (response) => {
        this.appointment.set(response.data || null);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.errorMessage.set('Failed to load appointment details');
        this.loading.set(false);
      }
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  setHoveredStar(star: number | null): void {
    this.hoveredStar.set(star);
  }

  getDisplayRating(): number {
    const hovered = this.hoveredStar();
    if (hovered !== null) return hovered;
    return this.reviewForm.get('rating')?.value || 0;
  }

  toggleTag(tag: string): void {
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const appointment = this.appointment();
    if (!appointment) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const reviewData = {
      appointmentId: appointment.id,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      tags: this.selectedTags()
    };

    this.reviewsService.createReview(reviewData).subscribe({
      next: () => {
        // Navigate back to bookings with success message
        this.router.navigate(['/my/bookings'], {
          queryParams: { reviewSuccess: 'true' }
        });
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.errorMessage.set(error.message || 'Failed to submit review');
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/my/bookings']);
  }

  getBarberFullName(): string {
    const appointment = this.appointment();
    if (!appointment || !appointment.barber?.user) return 'Barber';
    const user = appointment.barber.user;
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  getBarberImage(): string {
    const appointment = this.appointment();
    return appointment?.barber?.user?.profileImage || 'https://via.placeholder.com/100';
  }

  getServiceName(): string {
    const appointment = this.appointment();
    return appointment?.service?.name || 'Service';
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

  get rating() {
    return this.reviewForm.get('rating');
  }

  get comment() {
    return this.reviewForm.get('comment');
  }

  getCharacterCount(): number {
    return this.comment?.value?.length || 0;
  }
}
