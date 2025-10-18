import express from 'express';
import { cleaningController } from '../controllers/cleaningController.js';

const router = express.Router();

// Get all cleaning slots
router.get('/slots', cleaningController.getAllSlots.bind(cleaningController));

// Search slots
router.get('/slots/search', cleaningController.searchSlots.bind(cleaningController));

// Get recommendations
router.get('/slots/recommendations', cleaningController.getRecommendations.bind(cleaningController));

// Get slot by ID
router.get('/slots/:id', cleaningController.getSlotById.bind(cleaningController));

// Book a slot
router.post('/bookings', cleaningController.bookSlot.bind(cleaningController));

// Get user's bookings
router.get('/bookings/my', cleaningController.getUserBookings.bind(cleaningController));

// Update booking status
router.patch('/bookings/:id/status', cleaningController.updateBookingStatus.bind(cleaningController));

export default router;

