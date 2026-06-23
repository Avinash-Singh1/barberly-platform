import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';

interface EarningSummary {
  total: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  pendingPayouts: number;
  completedAppointments: number;
}

interface Transaction {
  id: string;
  date: Date;
  customerName: string;
  serviceName: string;
  amount: number;
  status: 'completed' | 'pending';
}

type TimeRange = 'all' | 'today' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-barber-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  timeRange = signal<TimeRange>('all');

  // Computed earnings summary
  earningSummary = computed(() => {
    const appts = this.appointments().filter(
      a => a.status === AppointmentStatus.COMPLETED
    );

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = appts.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);
    
    const thisMonthAppts = appts.filter(a => 
      new Date(a.appointmentDate) >= monthStart
    );
    const thisMonth = thisMonthAppts.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

    const thisWeekAppts = appts.filter(a => 
      new Date(a.appointmentDate) >= weekStart
    );
    const thisWeek = thisWeekAppts.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

    const todayAppts = appts.filter(a => {
      const aptDate = new Date(a.appointmentDate);
      return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });
    const todayEarnings = todayAppts.reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

    return {
      total,
      thisMonth,
      thisWeek,
      today: todayEarnings,
      pendingPayouts: 0, // Future feature: track pending payouts
      completedAppointments: appts.length
    };
  });

  // Computed transactions list
  transactions = computed(() => {
    const appts = this.appointments().filter(
      a => a.status === AppointmentStatus.COMPLETED
    );

    const range = this.timeRange();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let filtered = appts;

    switch (range) {
      case 'today':
        filtered = appts.filter(a => {
          const aptDate = new Date(a.appointmentDate);
          return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });
        break;
      case 'week':
        filtered = appts.filter(a => new Date(a.appointmentDate) >= weekStart);
        break;
      case 'month':
        filtered = appts.filter(a => new Date(a.appointmentDate) >= monthStart);
        break;
      case 'year':
        filtered = appts.filter(a => new Date(a.appointmentDate) >= yearStart);
        break;
    }

    return filtered
      .map(apt => ({
        id: apt.id,
        date: new Date(apt.appointmentDate),
        customerName: this.getCustomerName(apt),
        serviceName: apt.service?.name || 'Service',
        amount: apt.service?.price || 0,
        status: 'completed' as const
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Computed chart data (for future chart implementation)
  chartData = computed(() => {
    const appts = this.appointments().filter(
      a => a.status === AppointmentStatus.COMPLETED
    );

    // Group by date
    const dailyEarnings: Record<string, number> = {};
    
    appts.forEach(apt => {
      const date = new Date(apt.appointmentDate).toISOString().split('T')[0];
      if (!dailyEarnings[date]) {
        dailyEarnings[date] = 0;
      }
      dailyEarnings[date] += apt.service?.price || 0;
    });

    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dailyEarnings[dateStr] || 0
      });
    }

    return last7Days;
  });

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEarnings();
  }

  loadEarnings(): void {
    this.loading.set(true);
    
    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        this.appointments.set(response.data || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading earnings:', error);
        this.loading.set(false);
      }
    });
  }

  setTimeRange(range: TimeRange): void {
    this.timeRange.set(range);
  }

  getCustomerName(appointment: Appointment): string {
    const customer = appointment.customer?.user;
    if (!customer) return 'Customer';
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  getMaxChartValue(): number {
    const data = this.chartData();
    if (data.length === 0) return 100;
    return Math.max(...data.map(d => d.amount), 100);
  }

  getChartBarHeight(amount: number): number {
    const max = this.getMaxChartValue();
    return (amount / max) * 100;
  }

  navigateToAppointments(): void {
    this.router.navigate(['/barber/appointments']);
  }

  requestPayout(): void {
    // Future feature: implement payout request
    alert('Payout request feature coming soon!');
  }

  getTotalTransactions(): number {
    return this.transactions().reduce((sum, t) => sum + t.amount, 0);
  }
}
