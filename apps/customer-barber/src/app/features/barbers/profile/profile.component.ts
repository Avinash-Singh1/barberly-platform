import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BarbersService } from '../../../core/services/barbers.service';
import { AuthService } from '../../../core/services/auth.service';
import { BarberProfile, Service } from '../../../core/models/barber.model';
import { Review } from '../../../core/models/review.model';

type TabType = 'services' | 'about' | 'gallery' | 'reviews';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  barber = signal<BarberProfile | null>(null);
  services = signal<Record<string, Service[]>>({});
  reviews = signal<Review[]>([]);
  loading = signal(true);
  activeTab = signal<TabType>('services');
  
  reviewsLoading = signal(false);
  reviewsPage = signal(1);
  totalReviews = signal(0);
  hasMoreReviews = signal(true);

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private barbersService: BarbersService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const barberId = this.route.snapshot.paramMap.get('id');
    if (barberId) {
      this.loadBarberProfile(barberId);
      this.loadBarberServices(barberId);
      this.loadReviews(barberId);
    }
  }

  loadBarberProfile(barberId: string): void {
    this.barbersService.getBarberProfile(barberId).subscribe({
      next: (response) => {
        this.barber.set(response.data || null);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading barber:', error);
        this.loading.set(false);
        this.router.navigate(['/barbers/search']);
      }
    });
  }

  loadBarberServices(barberId: string): void {
    this.barbersService.getBarberServices(barberId).subscribe({
      next: (response) => {
        this.services.set(response.data || {});
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  loadReviews(barberId: string, page = 1): void {
    this.reviewsLoading.set(true);
    
    this.barbersService.getBarberReviews(barberId, page, 5).subscribe({
      next: (response) => {
        const newReviews = response.data?.data || [];
        
        if (page === 1) {
          this.reviews.set(newReviews);
        } else {
          this.reviews.set([...this.reviews(), ...newReviews]);
        }
        
        this.totalReviews.set(response.data?.pagination.total || 0);
        this.reviewsPage.set(page);
        this.hasMoreReviews.set(
          (response.data?.pagination.page || 0) < (response.data?.pagination.totalPages || 0)
        );
        this.reviewsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.reviewsLoading.set(false);
      }
    });
  }

  loadMoreReviews(): void {
    const barberId = this.barber()?.id;
    if (barberId && this.hasMoreReviews() && !this.reviewsLoading()) {
      this.loadReviews(barberId, this.reviewsPage() + 1);
    }
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  bookAppointment(service?: Service): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Navigate to booking with barber and service
    const barberId = this.barber()?.id;
    if (barberId) {
      const queryParams = service ? { serviceId: service.id } : {};
      this.router.navigate(['/booking', barberId], { queryParams });
    }
  }

  getBarberFullName(): string {
    const barber = this.barber();
    return `${barber?.user?.firstName || ''} ${barber?.user?.lastName || ''}`.trim();
  }

  getBarberImage(): string {
    return this.barber()?.user?.profileImage || 'https://via.placeholder.com/400?text=Barber';
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }

  getServiceCategories(): string[] {
    return Object.keys(this.services());
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getReviewerName(review: Review): string {
    const customer = review.customer;
    return customer?.user
      ? `${customer.user.firstName} ${customer.user.lastName}`
      : 'Anonymous';
  }

  getReviewerInitials(review: Review): string {
    const customer = review.customer;
    if (customer?.user) {
      return `${customer.user.firstName?.charAt(0)}${customer.user.lastName?.charAt(0)}`;
    }
    return 'A';
  }

  getRatingDistribution(star: number): number {
    const distribution = this.barber()?.reviewStats?.ratingDistribution;
    if (!distribution) return 0;
    return distribution[star as keyof typeof distribution] || 0;
  }
}
