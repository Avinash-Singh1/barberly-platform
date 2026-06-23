import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewsService } from '../../../core/services/reviews.service';
import { AuthService } from '../../../core/services/auth.service';
import { Review } from '../../../core/models/review.model';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

@Component({
  selector: 'app-barber-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews = signal<Review[]>([]);
  loading = signal(true);
  sortBy = signal<SortOption>('newest');
  selectedReview = signal<Review | null>(null);
  showReplyModal = signal(false);
  replyForm!: FormGroup;
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Make Math available to template
  Math = Math;

  // Computed sorted reviews
  sortedReviews = computed(() => {
    const reviewsList = [...this.reviews()];
    const sort = this.sortBy();

    switch (sort) {
      case 'newest':
        return reviewsList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return reviewsList.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'highest':
        return reviewsList.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviewsList.sort((a, b) => a.rating - b.rating);
      default:
        return reviewsList;
    }
  });

  // Computed rating statistics
  ratingStats = computed(() => {
    const reviewsList = this.reviews();
    const total = reviewsList.length;
    
    if (total === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach(review => {
      distribution[review.rating]++;
    });

    const percentages: Record<number, number> = {};
    [5, 4, 3, 2, 1].forEach(rating => {
      percentages[rating] = (distribution[rating] / total) * 100;
    });

    return {
      average: Number(average.toFixed(1)),
      total,
      distribution,
      percentages
    };
  });

  // Computed filter counts
  filterCounts = computed(() => {
    const reviewsList = this.reviews();
    return {
      all: reviewsList.length,
      withReply: reviewsList.filter(r => r.barberReply).length,
      noReply: reviewsList.filter(r => !r.barberReply).length
    };
  });

  constructor(
    private reviewsService: ReviewsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initReplyForm();
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  initReplyForm(): void {
    this.replyForm = this.fb.group({
      reply: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  loadReviews(): void {
    this.loading.set(true);
    
    // Get barber's reviews
    this.reviewsService.getMyReviews().subscribe({
      next: (response) => {
        this.reviews.set(response.data || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.errorMessage.set('Failed to load reviews');
        this.loading.set(false);
      }
    });
  }

  setSortBy(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  openReplyModal(review: Review): void {
    this.selectedReview.set(review);
    this.showReplyModal.set(true);
    
    // Pre-fill if already replied
    if (review.barberReply) {
      this.replyForm.patchValue({ reply: review.barberReply });
    } else {
      this.replyForm.reset();
    }
  }

  closeReplyModal(): void {
    this.showReplyModal.set(false);
    this.selectedReview.set(null);
    this.replyForm.reset();
    this.errorMessage.set(null);
  }

  submitReply(): void {
    if (this.replyForm.invalid) {
      this.replyForm.markAllAsTouched();
      return;
    }

    const review = this.selectedReview();
    if (!review) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const replyData = {
      reply: this.replyForm.value.reply
    };

    this.reviewsService.replyToReview(review.id, replyData).subscribe({
      next: () => {
        this.successMessage.set('Reply posted successfully! 💬');
        this.loadReviews();
        this.closeReplyModal();
        this.submitting.set(false);
        this.clearMessageAfterDelay();
      },
      error: (error) => {
        console.error('Error posting reply:', error);
        this.errorMessage.set(error.message || 'Failed to post reply');
        this.submitting.set(false);
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

  getCustomerName(review: Review): string {
    const customer = review.customer?.user;
    if (!customer) return 'Customer';
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  }

  getCustomerImage(review: Review): string {
    return review.customer?.user?.profileImage || 'https://via.placeholder.com/60';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateRelative(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  hasReply(review: Review): boolean {
    return !!review.barberReply;
  }

  getReplyButtonText(review: Review): string {
    return this.hasReply(review) ? 'Edit Reply' : 'Reply';
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating === 3) return 'rating-medium';
    return 'rating-low';
  }

  getCharacterCount(): number {
    return this.replyForm.get('reply')?.value?.length || 0;
  }

  get reply() {
    return this.replyForm.get('reply');
  }
}
