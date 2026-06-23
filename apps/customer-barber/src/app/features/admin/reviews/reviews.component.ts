import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  customerImage: string;
  barberName: string;
  barberEmail: string;
  rating: number;
  comment: string;
  serviceName: string;
  appointmentDate: Date;
  createdAt: Date;
  status: 'PUBLISHED' | 'FLAGGED' | 'REMOVED';
  flagReason?: string;
  reportCount: number;
  helpful: number;
  notHelpful: number;
  response?: BarberResponse;
}

interface BarberResponse {
  text: string;
  respondedAt: Date;
}

type FilterStatus = 'ALL' | 'PUBLISHED' | 'FLAGGED' | 'REMOVED';
type RatingFilter = 'ALL' | '5' | '4' | '3' | '2' | '1';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews = signal<Review[]>([]);
  loading = signal(true);
  selectedStatus = signal<FilterStatus>('ALL');
  selectedRating = signal<RatingFilter>('ALL');
  searchQuery = signal('');
  selectedReview = signal<Review | null>(null);
  showDetailsModal = signal(false);
  processingAction = signal(false);

  // Rating filter options for template
  ratingFilters: RatingFilter[] = ['5', '4', '3', '2', '1'];

  // Computed filtered reviews
  filteredReviews = computed(() => {
    let result = this.reviews();
    
    // Filter by status
    const status = this.selectedStatus();
    if (status !== 'ALL') {
      result = result.filter(r => r.status === status);
    }

    // Filter by rating
    const rating = this.selectedRating();
    if (rating !== 'ALL') {
      result = result.filter(r => r.rating === parseInt(rating));
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(r => 
        r.customerName.toLowerCase().includes(query) ||
        r.barberName.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query) ||
        r.serviceName.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  // Stats
  totalCount = computed(() => this.reviews().length);
  publishedCount = computed(() => this.reviews().filter(r => r.status === 'PUBLISHED').length);
  flaggedCount = computed(() => this.reviews().filter(r => r.status === 'FLAGGED').length);
  removedCount = computed(() => this.reviews().filter(r => r.status === 'REMOVED').length);
  averageRating = computed(() => {
    const published = this.reviews().filter(r => r.status === 'PUBLISHED');
    if (published.length === 0) return 0;
    const sum = published.reduce((acc, r) => acc + r.rating, 0);
    return sum / published.length;
  });
  reportedCount = computed(() => this.reviews().filter(r => r.reportCount > 0).length);

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.loading.set(true);

    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          customerName: 'Alex Johnson',
          customerEmail: 'alex.j@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=33',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          rating: 5,
          comment: 'Excellent service! Mike is very professional and gave me exactly the haircut I wanted. The atmosphere was great and I felt very comfortable. Will definitely come back!',
          serviceName: 'Classic Haircut',
          appointmentDate: new Date(Date.now() - 5 * 86400000),
          createdAt: new Date(Date.now() - 4 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 12,
          notHelpful: 1,
          response: {
            text: 'Thank you so much for the kind words! Looking forward to seeing you again.',
            respondedAt: new Date(Date.now() - 3 * 86400000)
          }
        },
        {
          id: '2',
          customerName: 'Maria Garcia',
          customerEmail: 'maria.g@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=45',
          barberName: 'David Brown',
          barberEmail: 'david.b@example.com',
          rating: 4,
          comment: 'Great haircut, though I had to wait a bit longer than expected. David did a fantastic job once we got started.',
          serviceName: 'Beard Trim',
          appointmentDate: new Date(Date.now() - 10 * 86400000),
          createdAt: new Date(Date.now() - 9 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 8,
          notHelpful: 0
        },
        {
          id: '3',
          customerName: 'Robert Chen',
          customerEmail: 'robert.c@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=51',
          barberName: 'Emma Davis',
          barberEmail: 'emma.d@example.com',
          rating: 1,
          comment: 'This is completely unacceptable! Terrible service and rude staff. I demand a refund immediately!',
          serviceName: 'Hair Styling',
          appointmentDate: new Date(Date.now() - 2 * 86400000),
          createdAt: new Date(Date.now() - 1 * 86400000),
          status: 'FLAGGED',
          flagReason: 'Inappropriate language and tone',
          reportCount: 3,
          helpful: 0,
          notHelpful: 15
        },
        {
          id: '4',
          customerName: 'Jennifer Smith',
          customerEmail: 'jennifer.s@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=48',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          rating: 5,
          comment: 'Best barber experience I\'ve had in years! Mike is incredibly skilled and pays attention to every detail. The shop is clean and modern.',
          serviceName: 'Haircut + Beard',
          appointmentDate: new Date(Date.now() - 15 * 86400000),
          createdAt: new Date(Date.now() - 14 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 24,
          notHelpful: 2,
          response: {
            text: 'Thank you Jennifer! Your feedback means a lot to me.',
            respondedAt: new Date(Date.now() - 13 * 86400000)
          }
        },
        {
          id: '5',
          customerName: 'Michael Brown',
          customerEmail: 'michael.b@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=52',
          barberName: 'David Brown',
          barberEmail: 'david.b@example.com',
          rating: 2,
          comment: 'Not happy with the cut. Had to go elsewhere to fix it.',
          serviceName: 'Classic Haircut',
          appointmentDate: new Date(Date.now() - 20 * 86400000),
          createdAt: new Date(Date.now() - 19 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 3,
          notHelpful: 8
        },
        {
          id: '6',
          customerName: 'Sarah Wilson',
          customerEmail: 'sarah.w@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=47',
          barberName: 'Emma Davis',
          barberEmail: 'emma.d@example.com',
          rating: 5,
          comment: 'Emma is amazing! She really knows how to style hair and gave me great recommendations. Love my new look!',
          serviceName: 'Hair Styling',
          appointmentDate: new Date(Date.now() - 7 * 86400000),
          createdAt: new Date(Date.now() - 6 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 18,
          notHelpful: 0,
          response: {
            text: 'So glad you love it! Thanks for trusting me with your hair!',
            respondedAt: new Date(Date.now() - 5 * 86400000)
          }
        },
        {
          id: '7',
          customerName: 'David Lee',
          customerEmail: 'david.l@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=56',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          rating: 4,
          comment: 'Good service overall. Mike is skilled and the pricing is fair. Would recommend!',
          serviceName: 'Beard Grooming',
          appointmentDate: new Date(Date.now() - 12 * 86400000),
          createdAt: new Date(Date.now() - 11 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 6,
          notHelpful: 1
        },
        {
          id: '8',
          customerName: 'Anonymous User',
          customerEmail: 'spam@fake.com',
          customerImage: 'https://i.pravatar.cc/150?img=60',
          barberName: 'Emma Davis',
          barberEmail: 'emma.d@example.com',
          rating: 1,
          comment: 'SPAM SPAM SPAM - Click here for discounts! Visit our website now!!!',
          serviceName: 'Premium Cut',
          appointmentDate: new Date(Date.now() - 3 * 86400000),
          createdAt: new Date(Date.now() - 2 * 86400000),
          status: 'REMOVED',
          flagReason: 'Spam content',
          reportCount: 8,
          helpful: 0,
          notHelpful: 25
        },
        {
          id: '9',
          customerName: 'Emily Davis',
          customerEmail: 'emily.d@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=44',
          barberName: 'David Brown',
          barberEmail: 'david.b@example.com',
          rating: 3,
          comment: 'It was okay. Nothing special but not bad either. The barber was friendly.',
          serviceName: 'Classic Haircut',
          appointmentDate: new Date(Date.now() - 8 * 86400000),
          createdAt: new Date(Date.now() - 7 * 86400000),
          status: 'PUBLISHED',
          reportCount: 0,
          helpful: 4,
          notHelpful: 2
        },
        {
          id: '10',
          customerName: 'John Williams',
          customerEmail: 'john.w@example.com',
          customerImage: 'https://i.pravatar.cc/150?img=11',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          rating: 2,
          comment: 'The barber was rude and unprofessional.',
          serviceName: 'Haircut + Beard',
          appointmentDate: new Date(Date.now() - 4 * 86400000),
          createdAt: new Date(Date.now() - 3 * 86400000),
          status: 'FLAGGED',
          flagReason: 'Under investigation',
          reportCount: 1,
          helpful: 2,
          notHelpful: 12
        }
      ];

      this.reviews.set(mockReviews);
      this.loading.set(false);
    }, 800);
  }

  setStatusFilter(status: FilterStatus): void {
    this.selectedStatus.set(status);
  }

  setRatingFilter(rating: RatingFilter): void {
    this.selectedRating.set(rating);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewDetails(review: Review): void {
    this.selectedReview.set(review);
    this.showDetailsModal.set(true);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    setTimeout(() => this.selectedReview.set(null), 300);
  }

  flagReview(review: Review): void {
    const reason = prompt('Enter reason for flagging this review:');
    if (reason) {
      this.processingAction.set(true);

      setTimeout(() => {
        const updated = this.reviews().map(r =>
          r.id === review.id 
            ? { ...r, status: 'FLAGGED' as const, flagReason: reason } 
            : r
        );
        this.reviews.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert('Review has been flagged for investigation.');
      }, 1000);
    }
  }

  removeReview(review: Review): void {
    const reason = prompt('Enter reason for removing this review:');
    if (reason) {
      this.processingAction.set(true);

      setTimeout(() => {
        const updated = this.reviews().map(r =>
          r.id === review.id 
            ? { ...r, status: 'REMOVED' as const, flagReason: reason } 
            : r
        );
        this.reviews.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert('Review has been removed from public view.');
      }, 1000);
    }
  }

  publishReview(review: Review): void {
    if (confirm('Are you sure you want to publish this review?')) {
      this.processingAction.set(true);

      setTimeout(() => {
        const updated = this.reviews().map(r =>
          r.id === review.id 
            ? { ...r, status: 'PUBLISHED' as const, flagReason: undefined } 
            : r
        );
        this.reviews.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert('Review has been published.');
      }, 1000);
    }
  }

  deleteReview(review: Review): void {
    if (confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      this.processingAction.set(true);

      setTimeout(() => {
        this.reviews.set(this.reviews().filter(r => r.id !== review.id));
        this.processingAction.set(false);
        this.closeModal();
        alert('Review has been permanently deleted.');
      }, 1000);
    }
  }

  getStars(rating: number): string[] {
    return Array(5).fill(0).map((_, i) => i < rating ? '★' : '☆');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'green';
      case 'FLAGGED': return 'amber';
      case 'REMOVED': return 'red';
      default: return 'gray';
    }
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return 'green';
    if (rating === 3) return 'amber';
    return 'red';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    const days = Math.floor(seconds / 86400);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }
}
