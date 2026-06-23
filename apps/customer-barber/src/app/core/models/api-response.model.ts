export interface ApiResponse<T = any> {
  success?: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
