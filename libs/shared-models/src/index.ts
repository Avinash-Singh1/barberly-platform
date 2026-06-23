// ===== USER & AUTH =====

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BARBER = 'BARBER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// ===== BARBER =====

export enum BarberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export interface BarberProfile {
  id: string;
  userId: string;
  bio?: string;
  experience?: number;
  rating: number;
  reviewCount: number;
  status: BarberStatus;
  idProof?: string;
  idProofVerified: boolean;
  specialty?: string;
  commission: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  barberId: string;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: Date;
}

export interface Availability {
  id: string;
  barberId: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// ===== CUSTOMER =====

export interface CustomerProfile {
  id: string;
  userId: string;
  preferredLocation?: string;
  favoriteBarbers: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== SHOP =====

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  description?: string;
  openingHours?: Record<string, { open: string; close: string }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopImage {
  id: string;
  shopId: string;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: Date;
}

// ===== SERVICE =====

export interface Service {
  id: string;
  barberId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // minutes
  homeVisitAvailable: boolean;
  homeVisitSurcharge?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== APPOINTMENT =====

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentType {
  SHOP = 'SHOP',
  HOME_VISIT = 'HOME_VISIT',
}

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  shopId?: string;
  type: AppointmentType;
  dateTime: Date;
  duration: number;
  totalPrice: number;
  status: AppointmentStatus;
  notes?: string;
  homeAddress?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== REVIEW =====

export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  rating: number; // 1-5
  comment?: string;
  tags: string[];
  images: string[];
  barberReply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== EARNINGS =====

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export interface Earning {
  id: string;
  appointmentId: string;
  barberId: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  payoutStatus: PayoutStatus;
  payoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== NOTIFICATION =====

export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  BARBER_APPROVED = 'BARBER_APPROVED',
  BARBER_REJECTED = 'BARBER_REJECTED',
  PAYOUT_COMPLETED = 'PAYOUT_COMPLETED',
  GENERAL = 'GENERAL',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// ===== CMS =====

export enum CmsContentType {
  BANNER = 'BANNER',
  FAQ = 'FAQ',
  BLOG = 'BLOG',
  TESTIMONIAL = 'TESTIMONIAL',
}

export interface CmsContent {
  id: string;
  type: CmsContentType;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== SEARCH & FILTER =====

export interface SearchFilters {
  serviceType?: string;
  minPrice?: number;
  maxPrice?: number;
  distance?: number; // km
  rating?: number;
  availability?: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface BarberSearchResult {
  barber: BarberProfile & { user: User };
  distance?: number;
  nextAvailableSlot?: Date;
  services: Service[];
  shop?: Shop;
}
