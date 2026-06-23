import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isPublished: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

type ContentType = 'pages' | 'faqs' | 'banners';

@Component({
  selector: 'app-admin-cms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  pages = signal<ContentPage[]>([]);
  faqs = signal<FAQ[]>([]);
  banners = signal<Banner[]>([]);
  loading = signal(true);
  contentType = signal<ContentType>('pages');
  selectedPage = signal<ContentPage | null>(null);
  selectedFAQ = signal<FAQ | null>(null);
  selectedBanner = signal<Banner | null>(null);
  showPageModal = signal(false);
  showFAQModal = signal(false);
  showBannerModal = signal(false);
  processingAction = signal(false);
  isEditMode = signal(false);
  searchQuery = signal('');

  pageForm!: FormGroup;
  faqForm!: FormGroup;
  bannerForm!: FormGroup;

  faqCategories = ['General', 'Booking', 'Payments', 'Services', 'Account', 'Other'];

  // Filtered FAQs
  filteredFAQs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.faqs();
    
    return this.faqs().filter(f => 
      f.question.toLowerCase().includes(query) ||
      f.answer.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query)
    );
  });

  // Stats
  totalPages = computed(() => this.pages().length);
  publishedPages = computed(() => this.pages().filter(p => p.isPublished).length);
  totalFAQs = computed(() => this.faqs().length);
  publishedFAQs = computed(() => this.faqs().filter(f => f.isPublished).length);
  totalBanners = computed(() => this.banners().length);
  activeBanners = computed(() => this.banners().filter(b => b.isActive).length);

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private initForms(): void {
    this.pageForm = this.fb.group({
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      metaDescription: ['', [Validators.required, Validators.maxLength(160)]],
      isPublished: [false]
    });

    this.faqForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      answer: ['', [Validators.required, Validators.minLength(20)]],
      category: ['General', Validators.required],
      order: [0, Validators.required],
      isPublished: [true]
    });

    this.bannerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      imageUrl: ['', Validators.required],
      linkUrl: [''],
      isActive: [true],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  private loadData(): void {
    this.loading.set(true);

    setTimeout(() => {
      // Load pages
      const mockPages: ContentPage[] = [
        {
          id: '1',
          slug: 'about',
          title: 'About Us',
          content: 'Welcome to Barberly! We are a premier platform connecting customers with professional barbers...',
          metaDescription: 'Learn about Barberly, the leading barbershop booking platform.',
          isPublished: true,
          lastUpdated: new Date(Date.now() - 10 * 86400000),
          updatedBy: 'John Admin'
        },
        {
          id: '2',
          slug: 'terms',
          title: 'Terms & Conditions',
          content: 'These terms and conditions outline the rules and regulations for the use of Barberly...',
          metaDescription: 'Read our terms and conditions before using our platform.',
          isPublished: true,
          lastUpdated: new Date(Date.now() - 30 * 86400000),
          updatedBy: 'Sarah Manager'
        },
        {
          id: '3',
          slug: 'privacy',
          title: 'Privacy Policy',
          content: 'At Barberly, we take your privacy seriously. This policy describes how we collect and use your data...',
          metaDescription: 'Our privacy policy explains how we handle your personal information.',
          isPublished: true,
          lastUpdated: new Date(Date.now() - 45 * 86400000),
          updatedBy: 'John Admin'
        },
        {
          id: '4',
          slug: 'how-it-works',
          title: 'How It Works',
          content: 'Barberly makes it easy to book your next haircut. Follow these simple steps...',
          metaDescription: 'Learn how to use Barberly to book your appointments.',
          isPublished: true,
          lastUpdated: new Date(Date.now() - 15 * 86400000),
          updatedBy: 'Sarah Manager'
        },
        {
          id: '5',
          slug: 'contact',
          title: 'Contact Us',
          content: 'Get in touch with our team. We are here to help...',
          metaDescription: 'Contact Barberly support team for assistance.',
          isPublished: false,
          lastUpdated: new Date(Date.now() - 5 * 86400000),
          updatedBy: 'John Admin'
        }
      ];

      // Load FAQs
      const mockFAQs: FAQ[] = [
        { id: '1', question: 'How do I book an appointment?', answer: 'You can book an appointment by searching for barbers, selecting a barber, choosing a service, and selecting your preferred date and time.', category: 'Booking', order: 1, isPublished: true },
        { id: '2', question: 'Can I cancel my appointment?', answer: 'Yes, you can cancel your appointment up to 24 hours before the scheduled time without any charges.', category: 'Booking', order: 2, isPublished: true },
        { id: '3', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and digital payment methods like PayPal and Apple Pay.', category: 'Payments', order: 1, isPublished: true },
        { id: '4', question: 'How do I become a barber on Barberly?', answer: 'To join as a barber, sign up with your professional credentials and submit required verification documents.', category: 'General', order: 1, isPublished: true },
        { id: '5', question: 'Are there any fees for customers?', answer: 'No, customers can browse and book appointments for free. You only pay for the services you book.', category: 'Payments', order: 2, isPublished: true },
        { id: '6', question: 'How do I leave a review?', answer: 'After your appointment is completed, you will receive an email with a link to leave a review for your barber.', category: 'Services', order: 1, isPublished: true },
        { id: '7', question: 'Can I reschedule my appointment?', answer: 'Yes, you can reschedule by canceling your current appointment and booking a new time slot.', category: 'Booking', order: 3, isPublished: true },
        { id: '8', question: 'How do I update my profile?', answer: 'Go to your account settings and click on "Edit Profile" to update your information.', category: 'Account', order: 1, isPublished: true }
      ];

      // Load banners
      const mockBanners: Banner[] = [
        {
          id: '1',
          title: 'Summer Special Offer',
          description: 'Get 20% off on all services this summer!',
          imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
          linkUrl: '/promotions/summer',
          isActive: true,
          startDate: new Date(Date.now() - 10 * 86400000),
          endDate: new Date(Date.now() + 20 * 86400000)
        },
        {
          id: '2',
          title: 'New Barbers Welcome',
          description: 'Join our platform and grow your business',
          imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
          linkUrl: '/auth/register?role=barber',
          isActive: true,
          startDate: new Date(Date.now() - 30 * 86400000),
          endDate: new Date(Date.now() + 60 * 86400000)
        },
        {
          id: '3',
          title: 'Holiday Season Deals',
          description: 'Special pricing during the holidays',
          imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
          linkUrl: '/promotions/holiday',
          isActive: false,
          startDate: new Date(Date.now() - 90 * 86400000),
          endDate: new Date(Date.now() - 60 * 86400000)
        }
      ];

      this.pages.set(mockPages);
      this.faqs.set(mockFAQs);
      this.banners.set(mockBanners);
      this.loading.set(false);
    }, 800);
  }

  setContentType(type: ContentType): void {
    this.contentType.set(type);
    this.searchQuery.set('');
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  // Pages
  openCreatePage(): void {
    this.isEditMode.set(false);
    this.pageForm.reset({ isPublished: false });
    this.showPageModal.set(true);
  }

  openEditPage(page: ContentPage): void {
    this.isEditMode.set(true);
    this.selectedPage.set(page);
    this.pageForm.patchValue(page);
    this.showPageModal.set(true);
  }

  savePage(): void {
    if (this.pageForm.invalid) {
      Object.keys(this.pageForm.controls).forEach(key => {
        this.pageForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.pageForm.value;
      
      if (this.isEditMode()) {
        const updated = this.pages().map(p =>
          p.id === this.selectedPage()?.id
            ? { ...p, ...formValue, lastUpdated: new Date(), updatedBy: 'Current User' }
            : p
        );
        this.pages.set(updated);
        alert('Page updated successfully!');
      } else {
        const newPage: ContentPage = {
          id: Date.now().toString(),
          ...formValue,
          lastUpdated: new Date(),
          updatedBy: 'Current User'
        };
        this.pages.set([...this.pages(), newPage]);
        alert('Page created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  deletePage(page: ContentPage): void {
    if (confirm(`Delete page "${page.title}"? This cannot be undone.`)) {
      this.pages.set(this.pages().filter(p => p.id !== page.id));
      alert('Page deleted successfully.');
    }
  }

  // FAQs
  openCreateFAQ(): void {
    this.isEditMode.set(false);
    this.faqForm.reset({ category: 'General', order: 0, isPublished: true });
    this.showFAQModal.set(true);
  }

  openEditFAQ(faq: FAQ): void {
    this.isEditMode.set(true);
    this.selectedFAQ.set(faq);
    this.faqForm.patchValue(faq);
    this.showFAQModal.set(true);
  }

  saveFAQ(): void {
    if (this.faqForm.invalid) {
      Object.keys(this.faqForm.controls).forEach(key => {
        this.faqForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.faqForm.value;
      
      if (this.isEditMode()) {
        const updated = this.faqs().map(f =>
          f.id === this.selectedFAQ()?.id ? { ...f, ...formValue } : f
        );
        this.faqs.set(updated);
        alert('FAQ updated successfully!');
      } else {
        const newFAQ: FAQ = {
          id: Date.now().toString(),
          ...formValue
        };
        this.faqs.set([...this.faqs(), newFAQ]);
        alert('FAQ created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  deleteFAQ(faq: FAQ): void {
    if (confirm(`Delete FAQ: "${faq.question}"?`)) {
      this.faqs.set(this.faqs().filter(f => f.id !== faq.id));
      alert('FAQ deleted successfully.');
    }
  }

  // Banners
  openCreateBanner(): void {
    this.isEditMode.set(false);
    this.bannerForm.reset({ isActive: true });
    this.showBannerModal.set(true);
  }

  openEditBanner(banner: Banner): void {
    this.isEditMode.set(true);
    this.selectedBanner.set(banner);
    this.bannerForm.patchValue({
      ...banner,
      startDate: this.formatDateForInput(banner.startDate),
      endDate: this.formatDateForInput(banner.endDate)
    });
    this.showBannerModal.set(true);
  }

  saveBanner(): void {
    if (this.bannerForm.invalid) {
      Object.keys(this.bannerForm.controls).forEach(key => {
        this.bannerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.processingAction.set(true);

    setTimeout(() => {
      const formValue = this.bannerForm.value;
      const bannerData = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate)
      };
      
      if (this.isEditMode()) {
        const updated = this.banners().map(b =>
          b.id === this.selectedBanner()?.id ? { ...b, ...bannerData } : b
        );
        this.banners.set(updated);
        alert('Banner updated successfully!');
      } else {
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...bannerData
        };
        this.banners.set([...this.banners(), newBanner]);
        alert('Banner created successfully!');
      }

      this.processingAction.set(false);
      this.closeModals();
    }, 1000);
  }

  deleteBanner(banner: Banner): void {
    if (confirm(`Delete banner "${banner.title}"?`)) {
      this.banners.set(this.banners().filter(b => b.id !== banner.id));
      alert('Banner deleted successfully.');
    }
  }

  closeModals(): void {
    this.showPageModal.set(false);
    this.showFAQModal.set(false);
    this.showBannerModal.set(false);
    setTimeout(() => {
      this.selectedPage.set(null);
      this.selectedFAQ.set(null);
      this.selectedBanner.set(null);
    }, 300);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getContentCount(): number {
    switch (this.contentType()) {
      case 'pages': return this.pages().length;
      case 'faqs': return this.faqs().length;
      case 'banners': return this.banners().length;
      default: return 0;
    }
  }
}
