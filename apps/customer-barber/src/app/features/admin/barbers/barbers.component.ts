import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  experience: number;
  profileImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  registeredAt: Date;
  documentsVerified: boolean;
  rating?: number;
  totalAppointments?: number;
  bio: string;
  address: string;
}

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

@Component({
  selector: 'app-admin-barbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barbers.component.html',
  styleUrls: ['./barbers.component.scss']
})
export class BarbersComponent implements OnInit {
  barbers = signal<Barber[]>([]);
  loading = signal(true);
  selectedFilter = signal<FilterStatus>('ALL');
  searchQuery = signal('');
  selectedBarber = signal<Barber | null>(null);
  showDetailsModal = signal(false);
  processingAction = signal(false);

  // Computed filtered barbers
  filteredBarbers = computed(() => {
    let result = this.barbers();
    
    // Filter by status
    const filter = this.selectedFilter();
    if (filter !== 'ALL') {
      result = result.filter(b => b.status === filter);
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.phone.includes(query)
      );
    }

    return result;
  });

  // Stats
  totalBarbers = computed(() => this.barbers().length);
  pendingCount = computed(() => this.barbers().filter(b => b.status === 'PENDING').length);
  approvedCount = computed(() => this.barbers().filter(b => b.status === 'APPROVED').length);
  rejectedCount = computed(() => this.barbers().filter(b => b.status === 'REJECTED').length);
  suspendedCount = computed(() => this.barbers().filter(b => b.status === 'SUSPENDED').length);

  ngOnInit(): void {
    this.loadBarbers();
  }

  private loadBarbers(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockBarbers: Barber[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          specialties: ['Classic Cuts', 'Beard Styling', 'Hot Towel Shave'],
          experience: 8,
          profileImage: 'https://i.pravatar.cc/150?img=12',
          status: 'PENDING',
          registeredAt: new Date(Date.now() - 2 * 86400000),
          documentsVerified: true,
          bio: 'Experienced barber specializing in classic cuts and modern styles. Passionate about delivering exceptional grooming experiences.',
          address: '123 Main St, New York, NY 10001'
        },
        {
          id: '2',
          name: 'Mike Johnson',
          email: 'mike.j@example.com',
          phone: '+1 (555) 234-5678',
          specialties: ['Modern Fades', 'Hair Coloring', 'Styling'],
          experience: 5,
          profileImage: 'https://i.pravatar.cc/150?img=13',
          status: 'APPROVED',
          registeredAt: new Date(Date.now() - 30 * 86400000),
          documentsVerified: true,
          rating: 4.8,
          totalAppointments: 156,
          bio: 'Modern stylist with expertise in contemporary cuts and color techniques.',
          address: '456 Oak Ave, Los Angeles, CA 90001'
        },
        {
          id: '3',
          name: 'David Brown',
          email: 'david.brown@example.com',
          phone: '+1 (555) 345-6789',
          specialties: ['Beard Grooming', 'Traditional Barbering'],
          experience: 12,
          profileImage: 'https://i.pravatar.cc/150?img=14',
          status: 'APPROVED',
          registeredAt: new Date(Date.now() - 60 * 86400000),
          documentsVerified: true,
          rating: 4.9,
          totalAppointments: 342,
          bio: 'Master barber with over a decade of experience in traditional barbering techniques.',
          address: '789 Elm St, Chicago, IL 60601'
        },
        {
          id: '4',
          name: 'Sarah Williams',
          email: 'sarah.w@example.com',
          phone: '+1 (555) 456-7890',
          specialties: ['Precision Cuts', 'Scalp Treatments'],
          experience: 6,
          profileImage: 'https://i.pravatar.cc/150?img=25',
          status: 'PENDING',
          registeredAt: new Date(Date.now() - 1 * 86400000),
          documentsVerified: false,
          bio: 'Detail-oriented stylist focused on precision cuts and scalp health.',
          address: '321 Pine Rd, Miami, FL 33101'
        },
        {
          id: '5',
          name: 'Chris Martinez',
          email: 'chris.m@example.com',
          phone: '+1 (555) 567-8901',
          specialties: ['Fade Specialist', 'Line Work'],
          experience: 4,
          profileImage: 'https://i.pravatar.cc/150?img=15',
          status: 'SUSPENDED',
          registeredAt: new Date(Date.now() - 90 * 86400000),
          documentsVerified: true,
          rating: 3.2,
          totalAppointments: 45,
          bio: 'Fade specialist with a focus on clean line work.',
          address: '654 Maple Dr, Houston, TX 77001'
        },
        {
          id: '6',
          name: 'Emma Davis',
          email: 'emma.d@example.com',
          phone: '+1 (555) 678-9012',
          specialties: ['Hair Design', 'Texture Styling'],
          experience: 7,
          profileImage: 'https://i.pravatar.cc/150?img=26',
          status: 'APPROVED',
          registeredAt: new Date(Date.now() - 45 * 86400000),
          documentsVerified: true,
          rating: 4.7,
          totalAppointments: 203,
          bio: 'Creative stylist specializing in textured hair and artistic designs.',
          address: '987 Birch Ln, Seattle, WA 98101'
        },
        {
          id: '7',
          name: 'James Wilson',
          email: 'james.w@example.com',
          phone: '+1 (555) 789-0123',
          specialties: ['Classic Barbering', 'Straight Razor'],
          experience: 15,
          profileImage: 'https://i.pravatar.cc/150?img=16',
          status: 'REJECTED',
          registeredAt: new Date(Date.now() - 20 * 86400000),
          documentsVerified: false,
          bio: 'Traditional barber with extensive experience in straight razor techniques.',
          address: '147 Cedar Ave, Boston, MA 02101'
        }
      ];

      this.barbers.set(mockBarbers);
      this.loading.set(false);
    }, 800);
  }

  setFilter(filter: FilterStatus): void {
    this.selectedFilter.set(filter);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewDetails(barber: Barber): void {
    this.selectedBarber.set(barber);
    this.showDetailsModal.set(true);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    setTimeout(() => this.selectedBarber.set(null), 300);
  }

  approveBarber(barber: Barber): void {
    if (confirm(`Are you sure you want to approve ${barber.name}?`)) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.barbers().map(b =>
          b.id === barber.id ? { ...b, status: 'APPROVED' as const } : b
        );
        this.barbers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${barber.name} has been approved!`);
      }, 1000);
    }
  }

  rejectBarber(barber: Barber): void {
    const reason = prompt(`Enter reason for rejecting ${barber.name}:`);
    if (reason) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.barbers().map(b =>
          b.id === barber.id ? { ...b, status: 'REJECTED' as const } : b
        );
        this.barbers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${barber.name} has been rejected.`);
      }, 1000);
    }
  }

  suspendBarber(barber: Barber): void {
    const reason = prompt(`Enter reason for suspending ${barber.name}:`);
    if (reason) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.barbers().map(b =>
          b.id === barber.id ? { ...b, status: 'SUSPENDED' as const } : b
        );
        this.barbers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${barber.name} has been suspended.`);
      }, 1000);
    }
  }

  unsuspendBarber(barber: Barber): void {
    if (confirm(`Are you sure you want to reactivate ${barber.name}?`)) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.barbers().map(b =>
          b.id === barber.id ? { ...b, status: 'APPROVED' as const } : b
        );
        this.barbers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${barber.name} has been reactivated!`);
      }, 1000);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'amber';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'SUSPENDED': return 'gray';
      default: return 'gray';
    }
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
    return this.formatDate(date);
  }
}
