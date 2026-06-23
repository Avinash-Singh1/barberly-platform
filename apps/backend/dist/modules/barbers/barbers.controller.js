"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barbersController = exports.BarbersController = void 0;
const barbers_service_1 = require("./barbers.service");
/**
 * Async handler wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
class BarbersController {
    /**
     * Search barbers with filters
     * GET /api/barbers/search
     */
    searchBarbers = asyncHandler(async (req, res) => {
        const filters = {
            searchTerm: req.query.q,
            serviceIds: req.query.services ? req.query.services.split(',') : undefined,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
            minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
            city: req.query.city,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            sortBy: req.query.sortBy || 'rating',
            sortOrder: req.query.sortOrder || 'desc'
        };
        const result = await barbers_service_1.barbersService.searchBarbers(filters);
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
    getBarberProfile = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const barber = await barbers_service_1.barbersService.getBarberProfile(id);
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
    getBarberServices = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const services = await barbers_service_1.barbersService.getBarberServices(id);
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
    getAvailability = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const date = new Date(req.query.date);
        const serviceId = req.query.serviceId;
        if (!req.query.date || !serviceId) {
            return res.status(400).json({
                success: false,
                message: 'Date and serviceId are required'
            });
        }
        const result = await barbers_service_1.barbersService.getAvailability(id, { date, serviceId });
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
    getBarberReviews = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await barbers_service_1.barbersService.getBarberReviews(id, page, limit);
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
    getFeaturedBarbers = asyncHandler(async (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 6;
        const barbers = await barbers_service_1.barbersService.getFeaturedBarbers(limit);
        res.json({
            success: true,
            message: 'Featured barbers retrieved successfully',
            data: barbers
        });
    });
}
exports.BarbersController = BarbersController;
exports.barbersController = new BarbersController();
//# sourceMappingURL=barbers.controller.js.map