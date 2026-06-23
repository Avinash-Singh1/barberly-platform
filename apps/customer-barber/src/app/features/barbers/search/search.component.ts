import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BarbersService } from '../../../core/services/barbers.service';
import { BarberProfile, BarberSearchFilters } from '../../../core/models/barber.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  barbers = signal<BarberProfile[]>([]);
  loading = signal(false);
  totalResults = signal(0);
  currentPage = signal(1);
  totalPages = signal(0);

  // Filters
  searchQuery = signal('');
  selectedCity = signal('');
  minRating = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<'rating' | 'price' | 'experience'>('rating');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // UI State
  filtersOpen = signal(false);

  // Cities list (could come from API)
  cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];

  constructor(
    private barbersService: BarbersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get query params
    this.route.queryParams.subscribe(params => {
      this.searchQuery.set(params['q'] || '');
      this.selectedCity.set(params['city'] || '');
      this.minRating.set(params['minRating'] ? parseFloat(params['minRating']) : null);
      this.minPrice.set(params['minPrice'] ? parseFloat(params['minPrice']) : null);
      this.maxPrice.set(params['maxPrice'] ? parseFloat(params['maxPrice']) : null);
      this.currentPage.set(params['page'] ? parseInt(params['page']) : 1);
      
      this.searchBarbers();
    });
  }

  searchBarbers(): void {
    this.loading.set(true);

    const filters: BarberSearchFilters = {
      q: this.searchQuery() || undefined,
      city: this.selectedCity() || undefined,
      minRating: this.minRating() || undefined,
      minPrice: this.minPrice() || undefined,
      maxPrice: this.maxPrice() || undefined,
      page: this.currentPage(),
      limit: 12,
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    this.barbersService.searchBarbers(filters).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        this.barbers.set(response.data || []);
        this.totalResults.set(response.pagination.total || 0);
        this.totalPages.set(response.pagination.totalPages || 0);
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  onSortChange(): void {
    this.updateQueryParams();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCity.set('');
    this.minRating.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.updateQueryParams();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.searchQuery()) queryParams.q = this.searchQuery();
    if (this.selectedCity()) queryParams.city = this.selectedCity();
    if (this.minRating()) queryParams.minRating = this.minRating();
    if (this.minPrice()) queryParams.minPrice = this.minPrice();
    if (this.maxPrice()) queryParams.maxPrice = this.maxPrice();
    if (this.currentPage() > 1) queryParams.page = this.currentPage();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  toggleFilters(): void {
    this.filtersOpen.set(!this.filtersOpen());
  }

  viewBarber(barberId: string): void {
    this.router.navigate(['/barbers', barberId]);
  }

  getBarberFullName(barber: BarberProfile): string {
    return `${barber.user?.firstName || ''} ${barber.user?.lastName || ''}`.trim();
  }

  getBarberImage(barber: BarberProfile): string {
    return barber.user?.profileImage || 'https://via.placeholder.com/300?text=Barber';
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  }
}
