import { cleaningModel } from '../models/cleaningModel.js';

export class CleaningController {
  /**
   * Get all cleaning slots
   */
  async getAllSlots(req, res) {
    try {
      const { available, petFriendly } = req.query;
      const filters = {};
      
      if (available !== undefined) {
        filters.available = available === 'true';
      }
      if (petFriendly !== undefined) {
        filters.petFriendly = petFriendly === 'true';
      }
      
      const slots = await cleaningModel.getAll(filters);
      
      res.json({
        success: true,
        data: slots,
        count: slots.length,
      });
    } catch (error) {
      console.error('Get all slots error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch cleaning slots',
      });
    }
  }

  /**
   * Get slot by ID
   */
  async getSlotById(req, res) {
    try {
      const { id } = req.params;
      const slot = await cleaningModel.getById(id);
      
      if (!slot) {
        return res.status(404).json({
          success: false,
          error: 'Cleaning slot not found',
        });
      }
      
      res.json({
        success: true,
        data: slot,
      });
    } catch (error) {
      console.error('Get slot by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch cleaning slot',
      });
    }
  }

  /**
   * Search cleaning slots
   */
  async searchSlots(req, res) {
    try {
      const { petFriendly, timeWindow, maxPrice, cleaner } = req.query;
      
      const preferences = {
        petFriendly: petFriendly === 'true',
        timeWindow,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        cleaner,
      };
      
      const results = await cleaningModel.searchByPreferences(preferences);
      
      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      console.error('Search slots error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search cleaning slots',
      });
    }
  }

  /**
   * Get cleaning recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { petFriendly, preferredTime } = req.query;
      
      const preferences = {
        petFriendly: petFriendly === 'true',
        preferredTime,
      };
      
      const recommendations = await cleaningModel.getRecommendations(userId, preferences);
      
      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
      });
    } catch (error) {
      console.error('Get cleaning recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations',
      });
    }
  }

  /**
   * Book a cleaning slot
   */
  async bookSlot(req, res) {
    try {
      const userId = req.user?.id;
      const { slotId, specialRequests, address, contactNumber } = req.body;
      
      if (!slotId) {
        return res.status(400).json({
          success: false,
          error: 'Slot ID is required',
        });
      }
      
      const bookingDetails = {
        specialRequests,
        address,
        contactNumber,
      };
      
      const booking = await cleaningModel.bookSlot(slotId, userId, bookingDetails);
      
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Cleaning slot booked successfully',
      });
    } catch (error) {
      console.error('Book slot error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to book cleaning slot',
      });
    }
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User authentication required',
        });
      }
      
      const bookings = await cleaningModel.getUserBookings(userId);
      
      res.json({
        success: true,
        data: bookings,
        count: bookings.length,
      });
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user bookings',
      });
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required',
        });
      }
      
      const updatedBooking = await cleaningModel.updateBookingStatus(id, status);
      
      res.json({
        success: true,
        data: updatedBooking,
        message: 'Booking status updated successfully',
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update booking status',
      });
    }
  }
}

export const cleaningController = new CleaningController();
export default cleaningController;

