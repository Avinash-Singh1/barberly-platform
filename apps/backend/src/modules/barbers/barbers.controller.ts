import { Request, Response } from 'express';
import { barbersService } from './barbers.service';

/**
 * Async handler wrapper
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export class BarbersController {
  /**
   * Search barbers with filters
   * GET /api/barbers/search
   */
  searchBarbers = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      searchTerm: req.query.q as string,
      serviceIds: req.query.services ? (req.query.services as string).split(',') : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      city: req.query.city as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: (req.query.sortBy as any) || 'rating',
      sortOrder: (req.query.sortOrder as any) || 'desc'
    };

    const result = await barbersService.searchBarbers(filters);

    res.json({
      success: true,
      message: 'Barbers retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  /**
   * Get barber profile
   * GET /api/barbers/:id
   */
  getBarberProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const barber = await barbersService.getBarberProfile(id);

    res.json({
      success: true,
      message: 'Barber profile retrieved successfully',
      data: barber
    });
  });

  /**
   * Get barber services
   * GET /api/barbers/:id/services
   */
  getBarberServices = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const services = await barbersService.getBarberServices(id);

    res.json({
      success: true,
      message: 'Services retrieved successfully',
      data: services
    });
  });

  /**
   * Get barber availability
   * GET /api/barbers/:id/availability
   */
  getAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const date = new Date(req.query.date as string);
    const serviceId = req.query.serviceId as string;

    if (!req.query.date || !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Date and serviceId are required'
      });
    }

    const result = await barbersService.getAvailability(id, { date, serviceId });

    res.json({
      success: true,
      message: 'Availability retrieved successfully',
      data: result
    });
  });

  /**
   * Get barber reviews
   * GET /api/barbers/:id/reviews
   */
  getBarberReviews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await barbersService.getBarberReviews(id, page, limit);

    res.json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: result.data,
      stats: result.stats,
      pagination: result.pagination
    });
  });

  /**
   * Get featured barbers
   * GET /api/barbers/featured
   */
  getFeaturedBarbers = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const barbers = await barbersService.getFeaturedBarbers(limit);

    res.json({
      success: true,
      message: 'Featured barbers retrieved successfully',
      data: barbers
    });
  });
}

export const barbersController = new BarbersController();
