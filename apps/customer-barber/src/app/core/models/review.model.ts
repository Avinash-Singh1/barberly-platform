export interface Review {
  id: string;
  customerId: string;
  barberId: string;
  appointmentId: string;
  serviceId: string;
  rating: number;
  comment: string;
  tags: string[];
  barberReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: any;
  barber?: any;
  service?: any;
}

export interface CreateReviewRequest {
  appointmentId: string;
  rating: number;
  comment: string;
  tags?: string[];
}

export interface ReplyToReviewRequest {
  reply: string;
}
