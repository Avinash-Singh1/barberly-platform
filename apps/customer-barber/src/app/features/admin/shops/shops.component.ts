import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  amenities: string[];
  assignedBarbers: ShopBarber[];
  totalBarbers: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  imageUrl: string;
}

interface ShopBarber {
  id: string;
  name: string;
  email: string;
}

interface AvailableBarber {
  id: string;
  name: string;
  email: string;
  isAssigned: boolean;
}

@Component({
  selector: 'app-admin-shops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops = signal<Shop[]>([]);
  availableBarbers = signal<AvailableBarber[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedShop = signal<Shop | null>(null);
  showDetailsModal = signal(false);
  showFormModal = signal(false);
  showBarbersModal = signal(false);
  processingAction = signal(false);
  isEditMode = signal(false);

  shopForm!: FormGroup;

  availableAmenities = [
    'WiFi',
    'Air Conditioning',
    'TV Entertainment',
    'Parking Available',
    'Wheelchair Accessible',
    'Kids Friendly',
    'Refreshments',
    'Music'
  ];

  // Computed filtered shops
  filteredShops = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.shops();
    
    return this.shops().filter(shop => 
      shop.name.toLowerCase().includes(query) ||
      shop.city.toLowerCase().includes(query) ||
      shop.address.toLowerCase().includes(query)
    );
  });

  // Stats
  totalShops = computed(() => this.shops().length);
  activeShops = computed(() => this.shops().filter(s => s.isActive).length);
  inactiveShops = computed(() => this.shops().filter(s => !s.isActive).length);
  totalBarbersAssigned = computed(() => {
    return this.shops().reduce((sum, shop) => sum + shop.totalBarbers, 0);
  });

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadShops();
    this.loadAvailableBarbers();
  }

  private initForm(): void {
    this.shopForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      openTime: ['09:00', Validators.required],
      closeTime: ['18:00', Validators.required],
      amenities: [[]],
      isActive: [true]
    });
  }

  private loadShops(): void {
    this.loading.set(true);

    setTimeout(() => {
      const mockShops: Shop[] = [
        {
          id: '1',
          name: 'Downtown Barbershop',
          description: 'Premium barbershop in the heart of downtown offering classic and modern cuts.',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1 (555) 111-2222',
          email: 'downtown@barberly.com',
          openTime: '09:00',
          closeTime: '20:00',
          amenities: ['WiFi', 'Air Conditioning', 'TV Entertainment', 'Refreshments'],
          assignedBarbers: [
            { id: '1', name: 'Mike Johnson', email: 'mike.j@example.com' },
            { id: '2', name: 'David Brown', email: 'david.b@example.com' }
          ],
          totalBarbers: 2,
          rating: 4.8,
          totalReviews: 156,
          isActive: true,
          createdAt: new Date(Date.now() - 180 * 86400000),
          imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400'
        },
        {
          id: '2',
          name: 'Westside Grooming',
          description: 'Modern grooming studio specializing in contemporary styles and beard care.',
          address: '456 West Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          phone: '+1 (555) 222-3333',
          email: 'westside@barberly.com',
          openTime: '10:00',
          closeTime: '19:00',
          amenities: ['WiFi', 'Parking Available', 'Music', 'Refreshments'],
          assignedBarbers: [
            { id: '3', name: 'Emma Davis', email: 'emma.d@example.com' }
          ],
          totalBarbers: 1,
          rating: 4.7,
          totalReviews: 89,
          isActive: true,
          createdAt: new Date(Date.now() - 90 * 86400000),
          imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
        },
        {
          id: '3',
          name: 'Classic Cuts & Shaves',
          description: 'Traditional barbershop offering timeless styles and hot towel shaves.',
          address: '789 Oak Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          phone: '+1 (555) 333-4444',
          email: 'classic@barberly.com',
          openTime: '08:00',
          closeTime: '18:00',
          amenities: ['WiFi', 'TV Entertainment', 'Wheelchair Accessible'],
          assignedBarbers: [],
          totalBarbers: 0,
          rating: 0,
          totalReviews: 0,
          isActive: false,
          createdAt: new Date(Date.now() - 30 * 86400000),
          imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400'
        }
      ];

      this.shops.set(mockShops);
      this.loading.set(false);
    }, 800);
  }

  private loadAvailableBarbers(): void {
    const mockBarbers: AvailableBarber[] = [
      { id: '1', name: 'Mike Johnson', email: 'mike.j@example.com', isAssigned: true },
      { id: '2', name: 'David Brown', email: 'david.b@example.com', isAssigned: true },
      { id: '3', name: 'Emma Davis', email: 'emma.d@example.com', isAssigned: true },
      { id: '4', name: 'John Smith', email: 'john.s@example.com', isAssigned: false },
      { id: '5', name: 'Sarah Williams', email: 'sarah.w@example.com', isAssigned: false }
    ];
    this.availableBarbers.set(mockBarbers);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewDetails(shop: Shop): void {
    this.selectedShop.set(shop);
    this.showDetailsModal.set(true);
  }

  openCreateForm(): void {
    this.isEditMode.set(false);
    this.shopForm.reset({
      openTime: '09:00',
      closeTime: '18:00',
      amenities: [],
      isActive: true
    });
    this.showFormModal.set(true);
  }

  openEditForm(shop: Shop): void {
    this.isEditMode.set(true);
    this.selectedShop.set(shop);
    this.shopForm.patchValue({
      name: shop.name,
      description: shop.description,
      address: shop.address,
      city: shop.city,
      state: shop.state,
      zipCode: shop.zipCode,
      phone: shop.phone,
      email: shop.email,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      amenities: shop.amenities,
      isActive: shop.isActive
    });
    this.showFormModal.set(true);
  }

  openBarberAssignment(shop: Shop): void {
    this.selectedShop.set(shop);
    this.showBarbersModal.set(true);
  }

  closeModals(): void {
    this.showDetailsModal.set(false);
    this.showFormModal.set(false);
    this.showBarbersModal.set(false);
    setTimeout(() => this.selectedShop.set(null), 300);
  }

  toggleAmenity(amenity: string): void {
    const currentAmenities = this.shopForm.get('amenities')?.value || [];
    const index = currentAmenities.indexOf(amenity);
    
    if (index > -1) {
      currentAmenities.splice(index, 1);
    } else {
      currentAmenities.push(amenity);
    }
    
    this.shopForm.patchValue({ amenities: currentAmenities });
  }

  isAmenitySelected(amenity: string): boolean {
    const amenities = this.shopForm.get('amenities')?.value || [];
    return amenities.includes(amenity);
  }

  saveShop(): void {
    if (this.shopForm.invalid) {
      Object.keys(this.shopForm.controls).forEach(key => {
        this.shopForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.shopForm.value;
      
      if (this.isEditMode()) {
        // Update existing shop
        const updated = this.shops().map(shop =>
          shop.id === this.selectedShop()?.id
            ? { ...shop, ...formValue }
            : shop
        );
        this.shops.set(updated);
        alert('Shop updated successfully!');
      } else {
        // Create new shop
        const newShop: Shop = {
          id: Date.now().toString(),
          ...formValue,
          assignedBarbers: [],
          totalBarbers: 0,
          rating: 0,
          totalReviews: 0,
          createdAt: new Date(),
          imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
        };
        this.shops.set([...this.shops(), newShop]);
        alert('Shop created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  toggleShopStatus(shop: Shop): void {
    const action = shop.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${shop.name}?`)) {
      const updated = this.shops().map(s =>
        s.id === shop.id ? { ...s, isActive: !s.isActive } : s
      );
      this.shops.set(updated);
      this.closeModals();
    }
  }

  deleteShop(shop: Shop): void {
    if (confirm(`Are you sure you want to delete ${shop.name}? This action cannot be undone.`)) {
      this.shops.set(this.shops().filter(s => s.id !== shop.id));
      this.closeModals();
      alert('Shop deleted successfully.');
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}

