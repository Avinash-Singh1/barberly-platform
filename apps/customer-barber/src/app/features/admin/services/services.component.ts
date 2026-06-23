import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface ServiceTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  suggestedPrice: {
    min: number;
    max: number;
  };
  suggestedDuration: {
    min: number;
    max: number;
  };
  isActive: boolean;
  usageCount: number; // How many barbers use this template
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
  isActive: boolean;
}

type FilterCategory = 'ALL' | string;
type ModalMode = 'service' | 'category' | null;

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services = signal<ServiceTemplate[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  selectedCategory = signal<FilterCategory>('ALL');
  searchQuery = signal('');
  selectedService = signal<ServiceTemplate | null>(null);
  selectedCategoryItem = signal<Category | null>(null);
  showServiceModal = signal(false);
  showCategoryModal = signal(false);
  showServiceDetails = signal(false);
  processingAction = signal(false);
  isEditMode = signal(false);
  isCategoryEdit = signal(false);

  serviceForm!: FormGroup;
  categoryForm!: FormGroup;

  // Category icons options
  categoryIcons = ['✂️', '💈', '🧔', '💇', '🎨', '✨', '👔', '🪒'];

  // Computed filtered services
  filteredServices = computed(() => {
    let result = this.services();
    
    // Filter by category
    const category = this.selectedCategory();
    if (category !== 'ALL') {
      result = result.filter(s => s.category === category);
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    return result;
  });

  // Stats
  totalServices = computed(() => this.services().length);
  activeServices = computed(() => this.services().filter(s => s.isActive).length);
  inactiveServices = computed(() => this.services().filter(s => !s.isActive).length);
  totalCategories = computed(() => this.categories().length);
  totalUsage = computed(() => this.services().reduce((sum, s) => sum + s.usageCount, 0));

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private initForms(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      minPrice: ['', [Validators.required, Validators.min(1)]],
      maxPrice: ['', [Validators.required, Validators.min(1)]],
      minDuration: ['', [Validators.required, Validators.min(15)]],
      maxDuration: ['', [Validators.required, Validators.min(15)]],
      isActive: [true]
    });

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      icon: ['✂️', Validators.required],
      isActive: [true]
    });
  }

  private loadData(): void {
    this.loading.set(true);

    setTimeout(() => {
      // Load categories
      const mockCategories: Category[] = [
        { id: '1', name: 'Haircut', description: 'Hair cutting and styling services', icon: '✂️', serviceCount: 5, isActive: true },
        { id: '2', name: 'Beard', description: 'Beard trimming and grooming services', icon: '🧔', serviceCount: 3, isActive: true },
        { id: '3', name: 'Styling', description: 'Hair styling and treatment services', icon: '💇', serviceCount: 4, isActive: true },
        { id: '4', name: 'Coloring', description: 'Hair coloring and highlights', icon: '🎨', serviceCount: 2, isActive: true },
        { id: '5', name: 'Grooming', description: 'Complete grooming packages', icon: '💈', serviceCount: 3, isActive: true },
        { id: '6', name: 'Treatment', description: 'Hair and scalp treatment services', icon: '✨', serviceCount: 2, isActive: true }
      ];

      // Load service templates
      const mockServices: ServiceTemplate[] = [
        {
          id: '1',
          name: 'Classic Haircut',
          category: 'Haircut',
          description: 'Traditional haircut with scissors and clippers, includes wash and basic styling',
          suggestedPrice: { min: 25, max: 50 },
          suggestedDuration: { min: 30, max: 60 },
          isActive: true,
          usageCount: 45,
          createdAt: new Date(Date.now() - 180 * 86400000),
          updatedAt: new Date(Date.now() - 30 * 86400000)
        },
        {
          id: '2',
          name: 'Fade Haircut',
          category: 'Haircut',
          description: 'Modern fade cut with precise transitions and clean lines',
          suggestedPrice: { min: 30, max: 60 },
          suggestedDuration: { min: 45, max: 75 },
          isActive: true,
          usageCount: 38,
          createdAt: new Date(Date.now() - 150 * 86400000),
          updatedAt: new Date(Date.now() - 20 * 86400000)
        },
        {
          id: '3',
          name: 'Beard Trim & Shape',
          category: 'Beard',
          description: 'Professional beard trimming and shaping to client preference',
          suggestedPrice: { min: 15, max: 35 },
          suggestedDuration: { min: 20, max: 40 },
          isActive: true,
          usageCount: 42,
          createdAt: new Date(Date.now() - 160 * 86400000),
          updatedAt: new Date(Date.now() - 25 * 86400000)
        },
        {
          id: '4',
          name: 'Beard Sculpting',
          category: 'Beard',
          description: 'Detailed beard sculpting with hot towel and premium products',
          suggestedPrice: { min: 25, max: 50 },
          suggestedDuration: { min: 30, max: 60 },
          isActive: true,
          usageCount: 28,
          createdAt: new Date(Date.now() - 140 * 86400000),
          updatedAt: new Date(Date.now() - 15 * 86400000)
        },
        {
          id: '5',
          name: 'Hot Towel Shave',
          category: 'Grooming',
          description: 'Traditional straight razor shave with hot towel treatment and aftershave',
          suggestedPrice: { min: 30, max: 60 },
          suggestedDuration: { min: 30, max: 60 },
          isActive: true,
          usageCount: 25,
          createdAt: new Date(Date.now() - 170 * 86400000),
          updatedAt: new Date(Date.now() - 35 * 86400000)
        },
        {
          id: '6',
          name: 'Hair Styling',
          category: 'Styling',
          description: 'Professional hair styling for special occasions and events',
          suggestedPrice: { min: 40, max: 80 },
          suggestedDuration: { min: 45, max: 90 },
          isActive: true,
          usageCount: 18,
          createdAt: new Date(Date.now() - 120 * 86400000),
          updatedAt: new Date(Date.now() - 10 * 86400000)
        },
        {
          id: '7',
          name: 'Hair & Beard Combo',
          category: 'Grooming',
          description: 'Complete grooming package with haircut and full beard service',
          suggestedPrice: { min: 45, max: 90 },
          suggestedDuration: { min: 60, max: 90 },
          isActive: true,
          usageCount: 32,
          createdAt: new Date(Date.now() - 130 * 86400000),
          updatedAt: new Date(Date.now() - 18 * 86400000)
        },
        {
          id: '8',
          name: 'Kids Haircut',
          category: 'Haircut',
          description: 'Haircut service for children under 12 years old',
          suggestedPrice: { min: 18, max: 35 },
          suggestedDuration: { min: 20, max: 40 },
          isActive: true,
          usageCount: 35,
          createdAt: new Date(Date.now() - 155 * 86400000),
          updatedAt: new Date(Date.now() - 22 * 86400000)
        },
        {
          id: '9',
          name: 'Hair Coloring',
          category: 'Coloring',
          description: 'Full hair coloring service with premium color products',
          suggestedPrice: { min: 60, max: 150 },
          suggestedDuration: { min: 90, max: 180 },
          isActive: true,
          usageCount: 12,
          createdAt: new Date(Date.now() - 100 * 86400000),
          updatedAt: new Date(Date.now() - 8 * 86400000)
        },
        {
          id: '10',
          name: 'Highlights',
          category: 'Coloring',
          description: 'Partial highlights or lowlights for natural-looking dimension',
          suggestedPrice: { min: 70, max: 180 },
          suggestedDuration: { min: 120, max: 240 },
          isActive: true,
          usageCount: 8,
          createdAt: new Date(Date.now() - 90 * 86400000),
          updatedAt: new Date(Date.now() - 5 * 86400000)
        },
        {
          id: '11',
          name: 'Scalp Treatment',
          category: 'Treatment',
          description: 'Deep cleansing scalp treatment with massage and conditioning',
          suggestedPrice: { min: 35, max: 70 },
          suggestedDuration: { min: 30, max: 60 },
          isActive: true,
          usageCount: 15,
          createdAt: new Date(Date.now() - 110 * 86400000),
          updatedAt: new Date(Date.now() - 12 * 86400000)
        },
        {
          id: '12',
          name: 'Hair Treatment',
          category: 'Treatment',
          description: 'Restorative hair treatment with keratin and protein infusion',
          suggestedPrice: { min: 50, max: 100 },
          suggestedDuration: { min: 60, max: 90 },
          isActive: true,
          usageCount: 10,
          createdAt: new Date(Date.now() - 95 * 86400000),
          updatedAt: new Date(Date.now() - 7 * 86400000)
        },
        {
          id: '13',
          name: 'Blowout Styling',
          category: 'Styling',
          description: 'Professional blowout with volume and smoothing treatment',
          suggestedPrice: { min: 35, max: 65 },
          suggestedDuration: { min: 30, max: 60 },
          isActive: true,
          usageCount: 20,
          createdAt: new Date(Date.now() - 105 * 86400000),
          updatedAt: new Date(Date.now() - 9 * 86400000)
        },
        {
          id: '14',
          name: 'Senior Haircut',
          category: 'Haircut',
          description: 'Discounted haircut service for seniors 65 and older',
          suggestedPrice: { min: 20, max: 40 },
          suggestedDuration: { min: 30, max: 50 },
          isActive: false,
          usageCount: 22,
          createdAt: new Date(Date.now() - 200 * 86400000),
          updatedAt: new Date(Date.now() - 45 * 86400000)
        }
      ];

      this.categories.set(mockCategories);
      this.services.set(mockServices);
      this.loading.set(false);
    }, 800);
  }

  setCategoryFilter(category: FilterCategory): void {
    this.selectedCategory.set(category);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewServiceDetails(service: ServiceTemplate): void {
    this.selectedService.set(service);
    this.showServiceDetails.set(true);
  }

  openCreateService(): void {
    this.isEditMode.set(false);
    this.serviceForm.reset({
      category: this.categories()[0]?.name || '',
      isActive: true
    });
    this.showServiceModal.set(true);
  }

  openEditService(service: ServiceTemplate): void {
    this.isEditMode.set(true);
    this.selectedService.set(service);
    this.serviceForm.patchValue({
      name: service.name,
      category: service.category,
      description: service.description,
      minPrice: service.suggestedPrice.min,
      maxPrice: service.suggestedPrice.max,
      minDuration: service.suggestedDuration.min,
      maxDuration: service.suggestedDuration.max,
      isActive: service.isActive
    });
    this.showServiceModal.set(true);
  }

  openCreateCategory(): void {
    this.isCategoryEdit.set(false);
    this.categoryForm.reset({
      icon: '✂️',
      isActive: true
    });
    this.showCategoryModal.set(true);
  }

  openEditCategory(category: Category): void {
    this.isCategoryEdit.set(true);
    this.selectedCategoryItem.set(category);
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive
    });
    this.showCategoryModal.set(true);
  }

  closeModals(): void {
    this.showServiceModal.set(false);
    this.showCategoryModal.set(false);
    this.showServiceDetails.set(false);
    setTimeout(() => {
      this.selectedService.set(null);
      this.selectedCategoryItem.set(null);
    }, 300);
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      Object.keys(this.serviceForm.controls).forEach(key => {
        this.serviceForm.get(key)?.markAsTouched();
      });
      return;
    }

    const minPrice = parseFloat(this.serviceForm.value.minPrice);
    const maxPrice = parseFloat(this.serviceForm.value.maxPrice);
    if (minPrice > maxPrice) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }

    const minDuration = parseInt(this.serviceForm.value.minDuration);
    const maxDuration = parseInt(this.serviceForm.value.maxDuration);
    if (minDuration > maxDuration) {
      alert('Minimum duration cannot be greater than maximum duration');
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.serviceForm.value;
      
      if (this.isEditMode()) {
        const updated = this.services().map(s =>
          s.id === this.selectedService()?.id
            ? {
                ...s,
                name: formValue.name,
                category: formValue.category,
                description: formValue.description,
                suggestedPrice: { min: minPrice, max: maxPrice },
                suggestedDuration: { min: minDuration, max: maxDuration },
                isActive: formValue.isActive,
                updatedAt: new Date()
              }
            : s
        );
        this.services.set(updated);
        alert('Service template updated successfully!');
      } else {
        const newService: ServiceTemplate = {
          id: Date.now().toString(),
          name: formValue.name,
          category: formValue.category,
          description: formValue.description,
          suggestedPrice: { min: minPrice, max: maxPrice },
          suggestedDuration: { min: minDuration, max: maxDuration },
          isActive: formValue.isActive,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.services.set([...this.services(), newService]);
        alert('Service template created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.categoryForm.value;
      
      if (this.isCategoryEdit()) {
        const updated = this.categories().map(c =>
          c.id === this.selectedCategoryItem()?.id
            ? { ...c, ...formValue }
            : c
        );
        this.categories.set(updated);
        alert('Category updated successfully!');
      } else {
        const newCategory: Category = {
          id: Date.now().toString(),
          ...formValue,
          serviceCount: 0
        };
        this.categories.set([...this.categories(), newCategory]);
        alert('Category created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  toggleServiceStatus(service: ServiceTemplate): void {
    const updated = this.services().map(s =>
      s.id === service.id ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s
    );
    this.services.set(updated);
    this.closeModals();
  }

  deleteService(service: ServiceTemplate): void {
    if (confirm(`Are you sure you want to delete "${service.name}"? This template is used by ${service.usageCount} barber(s).`)) {
      this.services.set(this.services().filter(s => s.id !== service.id));
      this.closeModals();
      alert('Service template deleted successfully.');
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"? This will affect ${category.serviceCount} service template(s).`)) {
      this.categories.set(this.categories().filter(c => c.id !== category.id));
      this.closeModals();
      alert('Category deleted successfully.');
    }
  }

  formatPrice(amount: number): string {
    return `$${amount}`;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Helper method to get category icon
  getCategoryIcon(categoryName: string): string {
    const category = this.categories().find(c => c.name === categoryName);
    return category?.icon || '✂️';
  }
}
