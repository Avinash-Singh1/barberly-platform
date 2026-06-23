import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  barberName: string;
  barberEmail: string;
  serviceName: string;
  servicePrice: number;
  date: Date;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  cancelReason?: string;
  createdAt: Date;
}

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type DateFilter = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  selectedStatus = signal<FilterStatus>('ALL');
  selectedDateFilter = signal<DateFilter>('ALL');
  searchQuery = signal('');
  selectedAppointment = signal<Appointment | null>(null);
  showDetailsModal = signal(false);
  processingAction = signal(false);

  // Computed filtered appointments
  filteredAppointments = computed(() => {
    let result = this.appointments();
    
    // Filter by status
    const status = this.selectedStatus();
    if (status !== 'ALL') {
      result = result.filter(a => a.status === status);
    }

    // Filter by date
    const dateFilter = this.selectedDateFilter();
    const now = new Date();
    if (dateFilter === 'TODAY') {
      result = result.filter(a => {
        const appDate = new Date(a.date);
        return appDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'WEEK') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = result.filter(a => {
        const appDate = new Date(a.date);
        return appDate >= weekAgo && appDate <= weekAhead;
      });
    } else if (dateFilter === 'MONTH') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      result = result.filter(a => {
        const appDate = new Date(a.date);
        return appDate >= monthAgo && appDate <= monthAhead;
      });
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(a => 
        a.customerName.toLowerCase().includes(query) ||
        a.barberName.toLowerCase().includes(query) ||
        a.serviceName.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Stats
  totalCount = computed(() => this.appointments().length);
  pendingCount = computed(() => this.appointments().filter(a => a.status === 'PENDING').length);
  confirmedCount = computed(() => this.appointments().filter(a => a.status === 'CONFIRMED').length);
  inProgressCount = computed(() => this.appointments().filter(a => a.status === 'IN_PROGRESS').length);
  completedCount = computed(() => this.appointments().filter(a => a.status === 'COMPLETED').length);
  cancelledCount = computed(() => this.appointments().filter(a => a.status === 'CANCELLED').length);

  ngOnInit(): void {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          customerName: 'Alex Johnson',
          customerEmail: 'alex.j@example.com',
          customerPhone: '+1 (555) 111-2222',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          serviceName: 'Classic Haircut',
          servicePrice: 65.00,
          date: new Date(Date.now() + 2 * 86400000),
          duration: 45,
          status: 'CONFIRMED',
          notes: 'Please use clippers on the sides',
          createdAt: new Date(Date.now() - 3 * 86400000)
        },
        {
          id: '2',
          customerName: 'Maria Garcia',
          customerEmail: 'maria.g@example.com',
          customerPhone: '+1 (555) 222-3333',
          barberName: 'David Brown',
          barberEmail: 'david.b@example.com',
          serviceName: 'Beard Trim',
          servicePrice: 35.00,
          date: new Date(Date.now() - 1 * 86400000),
          duration: 30,
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 5 * 86400000)
        },
        {
          id: '3',
          customerName: 'Robert Chen',
          customerEmail: 'robert.c@example.com',
          customerPhone: '+1 (555) 333-4444',
          barberName: 'Emma Davis',
          barberEmail: 'emma.d@example.com',
          serviceName: 'Hair Styling',
          servicePrice: 80.00,
          date: new Date(Date.now() + 1 * 86400000),
          duration: 60,
          status: 'PENDING',
          createdAt: new Date(Date.now() - 1 * 86400000)
        },
        {
          id: '4',
          customerName: 'Jennifer Smith',
          customerEmail: 'jennifer.s@example.com',
          customerPhone: '+1 (555) 444-5555',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          serviceName: 'Haircut + Beard',
          servicePrice: 85.00,
          date: new Date(Date.now() - 5 * 86400000),
          duration: 60,
          status: 'CANCELLED',
          cancelReason: 'Customer requested cancellation',
          createdAt: new Date(Date.now() - 7 * 86400000)
        },
        {
          id: '5',
          customerName: 'Sarah Wilson',
          customerEmail: 'sarah.w@example.com',
          customerPhone: '+1 (555) 666-7777',
          barberName: 'David Brown',
          barberEmail: 'david.b@example.com',
          serviceName: 'Classic Haircut',
          servicePrice: 65.00,
          date: new Date(),
          duration: 45,
          status: 'IN_PROGRESS',
          createdAt: new Date(Date.now() - 2 * 86400000)
        },
        {
          id: '6',
          customerName: 'David Lee',
          customerEmail: 'david.l@example.com',
          customerPhone: '+1 (555) 777-8888',
          barberName: 'Emma Davis',
          barberEmail: 'emma.d@example.com',
          serviceName: 'Beard Grooming',
          servicePrice: 45.00,
          date: new Date(Date.now() + 5 * 86400000),
          duration: 40,
          status: 'CONFIRMED',
          createdAt: new Date(Date.now() - 1 * 86400000)
        },
        {
          id: '7',
          customerName: 'Emily Davis',
          customerEmail: 'emily.d@example.com',
          customerPhone: '+1 (555) 888-9999',
          barberName: 'Mike Johnson',
          barberEmail: 'mike.j@example.com',
          serviceName: 'Premium Cut',
          servicePrice: 95.00,
          date: new Date(Date.now() - 10 * 86400000),
          duration: 75,
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 12 * 86400000)
        }
      ];

      this.appointments.set(mockAppointments);
      this.loading.set(false);
    }, 800);
  }

  setStatusFilter(status: FilterStatus): void {
    this.selectedStatus.set(status);
  }

  setDateFilter(filter: DateFilter): void {
    this.selectedDateFilter.set(filter);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewDetails(appointment: Appointment): void {
    this.selectedAppointment.set(appointment);
    this.showDetailsModal.set(true);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    setTimeout(() => this.selectedAppointment.set(null), 300);
  }

  cancelAppointment(appointment: Appointment): void {
    const reason = prompt(`Enter reason for cancelling this appointment:`);
    if (reason) {
      this.processingAction.set(true);

      // Simulate API call
      setTimeout(() => {
        const updated = this.appointments().map(a =>
          a.id === appointment.id 
            ? { ...a, status: 'CANCELLED' as const, cancelReason: reason } 
            : a
        );
        this.appointments.set(updated);
        this.processingAction.set(false);
        this.closeModal();
        alert('Appointment has been cancelled.');
      }, 1000);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'amber';
      case 'CONFIRMED': return 'blue';
      case 'IN_PROGRESS': return 'purple';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
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

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  formatDateTime(date: Date): string {
    return `${this.formatDate(date)} at ${this.formatTime(date)}`;
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
    return this.formatDate(date);
  }

  isUpcoming(date: Date): boolean {
    return date.getTime() > Date.now();
  }

  isPast(date: Date): boolean {
    return date.getTime() < Date.now();
  }
}

