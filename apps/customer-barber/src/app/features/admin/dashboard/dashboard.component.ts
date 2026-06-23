import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
  route: string;
}

interface RecentActivity {
  id: string;
  type: 'barber' | 'customer' | 'appointment' | 'review';
  message: string;
  timestamp: Date;
}

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Signals for reactive state
  stats = signal<StatCard[]>([]);
  recentActivity = signal<RecentActivity[]>([]);
  revenueData = signal<ChartData[]>([]);
  loading = signal(true);

  // Make Math available to template
  Math = Math;

  // Computed values
  totalRevenue = computed(() => {
    return this.revenueData().reduce((sum, item) => sum + item.value, 0);
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    // Simulate API call with mock data
    setTimeout(() => {
      // Stats cards
      this.stats.set([
        {
          title: 'Total Users',
          value: 1284,
          change: 12.5,
          icon: '👥',
          color: 'blue',
          route: '/admin/customers'
        },
        {
          title: 'Active Barbers',
          value: 156,
          change: 8.3,
          icon: '✂️',
          color: 'purple',
          route: '/admin/barbers'
        },
        {
          title: 'Total Appointments',
          value: 3847,
          change: 15.7,
          icon: '📅',
          color: 'green',
          route: '/admin/appointments'
        },
        {
          title: 'Monthly Revenue',
          value: 45280,
          change: 23.1,
          icon: '💰',
          color: 'emerald',
          route: '/admin/settings'
        },
        {
          title: 'Pending Approvals',
          value: 12,
          change: -5.2,
          icon: '⏳',
          color: 'amber',
          route: '/admin/barbers'
        },
        {
          title: 'Active Shops',
          value: 48,
          change: 6.8,
          icon: '🏪',
          color: 'indigo',
          route: '/admin/shops'
        }
      ]);

      // Revenue data for last 7 days
      this.revenueData.set([
        { label: 'Mon', value: 5200 },
        { label: 'Tue', value: 6100 },
        { label: 'Wed', value: 5800 },
        { label: 'Thu', value: 7200 },
        { label: 'Fri', value: 8900 },
        { label: 'Sat', value: 6800 },
        { label: 'Sun', value: 5280 }
      ]);

      // Recent activity
      this.recentActivity.set([
        {
          id: '1',
          type: 'barber',
          message: 'New barber registration: John Smith',
          timestamp: new Date(Date.now() - 5 * 60000)
        },
        {
          id: '2',
          type: 'appointment',
          message: 'Appointment completed by Mike Johnson',
          timestamp: new Date(Date.now() - 15 * 60000)
        },
        {
          id: '3',
          type: 'customer',
          message: 'New customer registration: Sarah Williams',
          timestamp: new Date(Date.now() - 25 * 60000)
        },
        {
          id: '4',
          type: 'review',
          message: 'New 5-star review from David Brown',
          timestamp: new Date(Date.now() - 45 * 60000)
        },
        {
          id: '5',
          type: 'barber',
          message: 'Barber profile updated: Emma Davis',
          timestamp: new Date(Date.now() - 60 * 60000)
        },
        {
          id: '6',
          type: 'appointment',
          message: 'Appointment cancelled by customer',
          timestamp: new Date(Date.now() - 90 * 60000)
        },
        {
          id: '7',
          type: 'customer',
          message: 'Customer reported an issue',
          timestamp: new Date(Date.now() - 120 * 60000)
        },
        {
          id: '8',
          type: 'review',
          message: 'Review flagged for moderation',
          timestamp: new Date(Date.now() - 150 * 60000)
        }
      ]);

      this.loading.set(false);
    }, 800);
  }

  getMaxValue(): number {
    return Math.max(...this.revenueData().map(d => d.value));
  }

  getBarHeight(value: number): number {
    const max = this.getMaxValue();
    return max > 0 ? (value / max) * 100 : 0;
  }

  getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'barber': return '✂️';
      case 'customer': return '👤';
      case 'appointment': return '📅';
      case 'review': return '⭐';
      default: return '📌';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'barber': return 'purple';
      case 'customer': return 'blue';
      case 'appointment': return 'green';
      case 'review': return 'amber';
      default: return 'gray';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
