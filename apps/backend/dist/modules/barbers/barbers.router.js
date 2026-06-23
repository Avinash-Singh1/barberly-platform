"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barbers_controller_1 = require("./barbers.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/barbers/featured:
 *   get:
 *     summary: Get featured barbers
 *     tags: [Barbers]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Featured barbers retrieved successfully
 */
router.get('/featured', barbers_controller_1.barbersController.getFeaturedBarbers);
/**
 * @swagger
 * /api/barbers/search:
 *   get:
 *     summary: Search barbers with filters
 *     tags: [Barbers]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term (name or bio)
 *       - in: query
 *         name: services
 *         schema:
 *           type: string
 *         description: Comma-separated service IDs
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, price, experience]
 *           default: rating
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Barbers retrieved successfully
 */
router.get('/search', barbers_controller_1.barbersController.searchBarbers);
/**
 * @swagger
 * /api/barbers/{id}:
 *   get:
 *     summary: Get barber profile
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Barber profile retrieved successfully
 *       404:
 *         description: Barber not found
 */
router.get('/:id', barbers_controller_1.barbersController.getBarberProfile);
/**
 * @swagger
 * /api/barbers/{id}/services:
 *   get:
 *     summary: Get barber services grouped by category
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get('/:id/services', barbers_controller_1.barbersController.getBarberServices);
/**
 * @swagger
 * /api/barbers/{id}/availability:
 *   get:
 *     summary: Get available time slots for a barber
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability retrieved successfully
 */
router.get('/:id/availability', barbers_controller_1.barbersController.getAvailability);
/**
 * @swagger
 * /api/barbers/{id}/reviews:
 *   get:
 *     summary: Get reviews for a barber
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/:id/reviews', barbers_controller_1.barbersController.getBarberReviews);
exports.default = router;
//# sourceMappingURL=barbers.router.js.map