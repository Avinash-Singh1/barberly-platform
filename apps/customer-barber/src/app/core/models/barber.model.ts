import { User } from './user.model';

export interface BarberProfile {
  id: string;
  userId: string;
  bio: string | null;
  specialties: string[];
  yearsOfExperience: number;
  rating: number;
  totalReviews: number;
  licenseNumber: string | null;
  idProofUrl: string | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  city: string | null;
  state: string | null;
  zipCode: string | null;
  user?: User;
  services?: Service[];
  gallery?: GalleryImage[];
  reviewStats?: ReviewStats;
}

export interface Service {
  id: string;
  barberId: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  isActive: boolean;
}

export interface GalleryImage {
  id: string;
  barberId: string;
  imageUrl: string;
  caption: string | null;
  uploadedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface BarberSearchFilters {
  q?: string;
  services?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'price' | 'experience';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
