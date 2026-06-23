import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      // Check if ErrorEvent exists (browser only) and if error.error is an instance of it
      if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          // Validation errors from Zod
          const validationErrors = error.error.errors
            .map((e: any) => e.message)
            .join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = `Server error: ${error.status} - ${error.statusText}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);
      
      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        originalError: error
      }));
    })
  );
};
