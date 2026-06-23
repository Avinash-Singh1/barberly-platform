import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Review,
  CreateReviewRequest,
  ReplyToReviewRequest
} from '../models/review.model';
import { ApiResponse, PaginatedApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly API_URL = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Create a review
   */
  createReview(request: CreateReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.API_URL, request);
  }

  /**
   * Get my reviews
   */
  getMyReviews(page = 1, limit = 10): Observable<PaginatedApiResponse<Review>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedApiResponse<Review>>(
      `${this.API_URL}/my-reviews`,
      { params }
    );
  }

  /**
   * Reply to a review (BARBER only)
   */
  replyToReview(reviewId: string, request: ReplyToReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(
      `${this.API_URL}/${reviewId}/reply`,
      request
    );
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${reviewId}`);
  }
}
