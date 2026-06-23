import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BarbersService } from '../../core/services/barbers.service';
import { AuthService } from '../../core/services/auth.service';
import { BarberProfile } from '../../core/models/barber.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchQuery = signal('');
  featuredBarbers = signal<BarberProfile[]>([]);
  loading = signal(true);

  constructor(
    public authService: AuthService,
    private barbersService: BarbersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedBarbers();
  }

  loadFeaturedBarbers(): void {
    this.barbersService.getFeaturedBarbers(6).subscribe({
      next: (response) => {
        this.featuredBarbers.set(response.data || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured barbers:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/barbers/search'], {
        queryParams: { q: query }
      });
    } else {
      this.router.navigate(['/barbers/search']);
    }
  }

  viewBarberProfile(barberId: string): void {
    this.router.navigate(['/barbers', barberId]);
  }

  getBarberFullName(barber: BarberProfile): string {
    return `${barber.user?.firstName || ''} ${barber.user?.lastName || ''}`.trim();
  }

  getBarberImage(barber: BarberProfile): string {
    return barber.user?.profileImage || 'https://via.placeholder.com/150?text=Barber';
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }
}
