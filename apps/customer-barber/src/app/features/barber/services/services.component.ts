import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BarbersService } from '../../../core/services/barbers.service';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt?: string;
}

type ModalMode = 'add' | 'edit';

@Component({
  selector: 'app-barber-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal(true);
  showModal = signal(false);
  modalMode = signal<ModalMode>('add');
  selectedService = signal<Service | null>(null);
  serviceForm!: FormGroup;
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Service categories
  categories = [
    'Haircut',
    'Beard',
    'Styling',
    'Coloring',
    'Treatment',
    'Grooming',
    'Special',
    'Other'
  ];

  constructor(
    private barbersService: BarbersService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadServices();
  }

  initForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: ['Haircut', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(1), Validators.max(9999)]],
      duration: ['30', [Validators.required, Validators.min(15), Validators.max(480)]],
      isActive: [true]
    });
  }

  loadServices(): void {
    this.loading.set(true);
    
    // Mock data for now - replace with actual API call
    // this.barbersService.getMyServices().subscribe(...)
    
    // Simulating API call with mock data
    setTimeout(() => {
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Classic Haircut',
          category: 'Haircut',
          description: 'Traditional haircut with scissors and clippers, includes wash and style',
          price: 35,
          duration: 45,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Beard Trim & Shape',
          category: 'Beard',
          description: 'Professional beard trimming and shaping to your preference',
          price: 20,
          duration: 30,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Hair & Beard Combo',
          category: 'Grooming',
          description: 'Complete grooming package with haircut and beard service',
          price: 50,
          duration: 60,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Kids Haircut',
          category: 'Haircut',
          description: 'Haircut for children under 12 years old',
          price: 25,
          duration: 30,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Hot Towel Shave',
          category: 'Grooming',
          description: 'Traditional straight razor shave with hot towel treatment',
          price: 40,
          duration: 45,
          isActive: false,
          createdAt: new Date().toISOString()
        }
      ];

      this.services.set(mockServices);
      this.loading.set(false);
    }, 800);
  }

  openAddModal(): void {
    this.modalMode.set('add');
    this.selectedService.set(null);
    this.serviceForm.reset({
      category: 'Haircut',
      duration: '30',
      isActive: true
    });
    this.showModal.set(true);
  }

  openEditModal(service: Service): void {
    this.modalMode.set('edit');
    this.selectedService.set(service);
    this.serviceForm.patchValue({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      isActive: service.isActive
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedService.set(null);
    this.serviceForm.reset();
    this.errorMessage.set(null);
  }

  submitForm(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const formData = this.serviceForm.value;
    const mode = this.modalMode();

    // Simulate API call
    setTimeout(() => {
      if (mode === 'add') {
        // Add new service
        const newService: Service = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        this.services.update(services => [...services, newService]);
        this.successMessage.set('Service added successfully! ✨');
      } else {
        // Update existing service
        const serviceId = this.selectedService()?.id;
        this.services.update(services =>
          services.map(s => s.id === serviceId ? { ...s, ...formData } : s)
        );
        this.successMessage.set('Service updated successfully! ✓');
      }

      this.closeModal();
      this.submitting.set(false);
      this.clearMessageAfterDelay();
    }, 500);
  }

  toggleServiceStatus(service: Service): void {
    const newStatus = !service.isActive;
    
    // Simulate API call
    this.services.update(services =>
      services.map(s => s.id === service.id ? { ...s, isActive: newStatus } : s)
    );

    const message = newStatus
      ? `"${service.name}" is now active`
      : `"${service.name}" is now inactive`;
    this.successMessage.set(message);
    this.clearMessageAfterDelay();
  }

  deleteService(service: Service): void {
    if (!confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      return;
    }

    // Simulate API call
    this.services.update(services => services.filter(s => s.id !== service.id));
    this.successMessage.set(`"${service.name}" has been deleted`);
    this.clearMessageAfterDelay();
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

  getActiveServices(): Service[] {
    return this.services().filter(s => s.isActive);
  }

  getInactiveServices(): Service[] {
    return this.services().filter(s => !s.isActive);
  }

  getServicesByCategory(category: string): Service[] {
    return this.services().filter(s => s.category === category && s.isActive);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  get name() {
    return this.serviceForm.get('name');
  }

  get category() {
    return this.serviceForm.get('category');
  }

  get description() {
    return this.serviceForm.get('description');
  }

  get price() {
    return this.serviceForm.get('price');
  }

  get duration() {
    return this.serviceForm.get('duration');
  }

  getDescriptionCharCount(): number {
    return this.description?.value?.length || 0;
  }
}
