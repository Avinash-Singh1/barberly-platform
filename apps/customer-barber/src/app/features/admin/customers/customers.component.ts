import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: Date;
  status: 'ACTIVE' | 'BLOCKED';
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  lastBooking?: Date;
  profileImage: string;
  address: string;
}

interface Booking {
  id: string;
  barberName: string;
  serviceName: string;
  date: Date;
  status: 'COMPLETED' | 'CANCELLED' | 'UPCOMING';
  amount: number;
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'BLOCKED';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  selectedFilter = signal<FilterStatus>('ALL');
  searchQuery = signal('');
  selectedCustomer = signal<Customer | null>(null);
  customerBookings = signal<Booking[]>([]);
  showDetailsModal = signal(false);
  loadingBookings = signal(false);
  processingAction = signal(false);

  // Computed filtered customers
  filteredCustomers = computed(() => {
    let result = this.customers();
    
    // Filter by status
    const filter = this.selectedFilter();
    if (filter !== 'ALL') {
      result = result.filter(c => c.status === filter);
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );
    }

    return result;
  });

  // Stats
  totalCustomers = computed(() => this.customers().length);
  activeCount = computed(() => this.customers().filter(c => c.status === 'ACTIVE').length);
  blockedCount = computed(() => this.customers().filter(c => c.status === 'BLOCKED').length);
  totalRevenue = computed(() => {
    return this.customers().reduce((sum, c) => sum + c.totalSpent, 0);
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.j@example.com',
          phone: '+1 (555) 111-2222',
          joinedDate: new Date(Date.now() - 180 * 86400000),
          status: 'ACTIVE',
          totalBookings: 24,
          completedBookings: 22,
          cancelledBookings: 2,
          totalSpent: 1580.00,
          lastBooking: new Date(Date.now() - 5 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=33',
          address: '123 Main St, New York, NY 10001'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          email: 'maria.g@example.com',
          phone: '+1 (555) 222-3333',
          joinedDate: new Date(Date.now() - 90 * 86400000),
          status: 'ACTIVE',
          totalBookings: 15,
          completedBookings: 14,
          cancelledBookings: 1,
          totalSpent: 980.00,
          lastBooking: new Date(Date.now() - 2 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=45',
          address: '456 Oak Ave, Los Angeles, CA 90001'
        },
        {
          id: '3',
          name: 'Robert Chen',
          email: 'robert.c@example.com',
          phone: '+1 (555) 333-4444',
          joinedDate: new Date(Date.now() - 365 * 86400000),
          status: 'ACTIVE',
          totalBookings: 48,
          completedBookings: 45,
          cancelledBookings: 3,
          totalSpent: 3240.00,
          lastBooking: new Date(Date.now() - 1 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=51',
          address: '789 Elm St, Chicago, IL 60601'
        },
        {
          id: '4',
          name: 'Jennifer Smith',
          email: 'jennifer.s@example.com',
          phone: '+1 (555) 444-5555',
          joinedDate: new Date(Date.now() - 30 * 86400000),
          status: 'ACTIVE',
          totalBookings: 6,
          completedBookings: 6,
          cancelledBookings: 0,
          totalSpent: 420.00,
          lastBooking: new Date(Date.now() - 7 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=48',
          address: '321 Pine Rd, Miami, FL 33101'
        },
        {
          id: '5',
          name: 'Michael Brown',
          email: 'michael.b@example.com',
          phone: '+1 (555) 555-6666',
          joinedDate: new Date(Date.now() - 200 * 86400000),
          status: 'BLOCKED',
          totalBookings: 12,
          completedBookings: 8,
          cancelledBookings: 4,
          totalSpent: 560.00,
          lastBooking: new Date(Date.now() - 60 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=52',
          address: '654 Maple Dr, Houston, TX 77001'
        },
        {
          id: '6',
          name: 'Sarah Wilson',
          email: 'sarah.w@example.com',
          phone: '+1 (555) 666-7777',
          joinedDate: new Date(Date.now() - 120 * 86400000),
          status: 'ACTIVE',
          totalBookings: 18,
          completedBookings: 17,
          cancelledBookings: 1,
          totalSpent: 1260.00,
          lastBooking: new Date(Date.now() - 3 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=47',
          address: '987 Birch Ln, Seattle, WA 98101'
        },
        {
          id: '7',
          name: 'David Lee',
          email: 'david.l@example.com',
          phone: '+1 (555) 777-8888',
          joinedDate: new Date(Date.now() - 45 * 86400000),
          status: 'ACTIVE',
          totalBookings: 9,
          completedBookings: 9,
          cancelledBookings: 0,
          totalSpent: 630.00,
          lastBooking: new Date(Date.now() - 4 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=56',
          address: '147 Cedar Ave, Boston, MA 02101'
        },
        {
          id: '8',
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          phone: '+1 (555) 888-9999',
          joinedDate: new Date(Date.now() - 10 * 86400000),
          status: 'ACTIVE',
          totalBookings: 2,
          completedBookings: 2,
          cancelledBookings: 0,
          totalSpent: 140.00,
          lastBooking: new Date(Date.now() - 1 * 86400000),
          profileImage: 'https://i.pravatar.cc/150?img=44',
          address: '258 Spruce St, Denver, CO 80201'
        }
      ];

      this.customers.set(mockCustomers);
      this.loading.set(false);
    }, 800);
  }

  private loadCustomerBookings(customerId: string): void {
    this.loadingBookings.set(true);

    // Simulate API call
    setTimeout(() => {
      const mockBookings: Booking[] = [
        {
          id: '1',
          barberName: 'Mike Johnson',
          serviceName: 'Classic Haircut',
          date: new Date(Date.now() - 5 * 86400000),
          status: 'COMPLETED',
          amount: 65.00
        },
        {
          id: '2',
          barberName: 'David Brown',
          serviceName: 'Beard Trim',
          date: new Date(Date.now() - 15 * 86400000),
          status: 'COMPLETED',
          amount: 35.00
        },
        {
          id: '3',
          barberName: 'Emma Davis',
          serviceName: 'Hair Styling',
          date: new Date(Date.now() - 30 * 86400000),
          status: 'COMPLETED',
          amount: 80.00
        },
        {
          id: '4',
          barberName: 'Mike Johnson',
          serviceName: 'Haircut + Beard',
          date: new Date(Date.now() - 45 * 86400000),
          status: 'CANCELLED',
          amount: 85.00
        },
        {
          id: '5',
          barberName: 'David Brown',
          serviceName: 'Classic Haircut',
          date: new Date(Date.now() + 5 * 86400000),
          status: 'UPCOMING',
          amount: 65.00
        }
      ];

      this.customerBookings.set(mockBookings);
      this.loadingBookings.set(false);
    }, 600);
  }

  setFilter(filter: FilterStatus): void {
    this.selectedFilter.set(filter);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewDetails(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.showDetailsModal.set(true);
    this.loadCustomerBookings(customer.id);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    setTimeout(() => {
      this.selectedCustomer.set(null);
      this.customerBookings.set([]);
    }, 300);
  }

  blockCustomer(customer: Customer): void {
    const reason = prompt(`Enter reason for blocking ${customer.name}:`);
    if (reason) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.customers().map(c =>
          c.id === customer.id ? { ...c, status: 'BLOCKED' as const } : c
        );
        this.customers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${customer.name} has been blocked.`);
      }, 1000);
    }
  }

  unblockCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to unblock ${customer.name}?`)) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.customers().map(c =>
          c.id === customer.id ? { ...c, status: 'ACTIVE' as const } : c
        );
        this.customers.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert(`${customer.name} has been unblocked!`);
      }, 1000);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'BLOCKED': return 'red';
      default: return 'gray';
    }
  }

  getBookingStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'UPCOMING': return 'blue';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  getCompletionRate(customer: Customer): number {
    if (customer.totalBookings === 0) return 0;
    return (customer.completedBookings / customer.totalBookings) * 100;
  }
}
