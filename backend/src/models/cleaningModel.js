import { convexClient } from '../utils/convexClient.js';
import { api } from '../../convex/_generated/api.js';

export class CleaningModel {
  /**
   * Get all cleaning slots
   */
  async getAll(filters = {}) {
    try {
      return await convexClient.query(api.cleaning.getAllSlots, {
        available: filters.available,
        petFriendly: filters.petFriendly,
      });
    } catch (error) {
      console.error('Error getting all cleaning slots:', error);
      throw error;
    }
  }

  /**
   * Get slot by ID
   */
  async getById(id) {
    try {
      return await convexClient.query(api.cleaning.getSlotById, { id });
    } catch (error) {
      console.error('Error getting slot by ID:', error);
      throw error;
    }
  }

  /**
   * Create new cleaning slot
   */
  async create(data) {
    try {
      return await convexClient.mutation(api.cleaning.createSlot, data);
    } catch (error) {
      console.error('Error creating cleaning slot:', error);
      throw error;
    }
  }

  /**
   * Update cleaning slot
   */
  async update(id, data) {
    try {
      const slot = await this.getById(id);
      return await convexClient.mutation(api.cleaning.createSlot, { ...slot, ...data });
    } catch (error) {
      console.error('Error updating cleaning slot:', error);
      throw error;
    }
  }

  /**
   * Get available cleaning slots
   */
  async getAvailableSlots(date = null) {
    try {
      return await this.getAll({ available: true });
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  /**
   * Search cleaning slots by preferences
   */
  async searchByPreferences(preferences = {}) {
    try {
      return await convexClient.query(api.cleaning.searchSlots, preferences);
    } catch (error) {
      console.error('Error searching cleaning slots:', error);
      throw error;
    }
  }

  /**
   * Book a cleaning slot
   */
  async bookSlot(slotId, userId, bookingDetails) {
    try {
      return await convexClient.mutation(api.cleaning.bookSlot, {
        slotId,
        userId,
        ...bookingDetails,
      });
    } catch (error) {
      console.error('Error booking cleaning slot:', error);
      throw error;
    }
  }

  /**
   * Get user's cleaning bookings
   */
  async getUserBookings(userId) {
    try {
      return await convexClient.query(api.cleaning.getUserBookings, { userId });
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }

  /**
   * Get cleaning recommendations based on user history
   */
  async getRecommendations(userId, preferences = {}) {
    try {
      const slots = await this.searchByPreferences(preferences);
      
      // Score and rank based on preferences
      const scored = slots.map(slot => {
        let score = 0;
        
        // Pet-friendly preference
        if (preferences.petFriendly && slot.petFriendly) {
          score += 10;
        }
        
        // Time preference
        if (preferences.preferredTime) {
          if (slot.time.toLowerCase().includes(preferences.preferredTime.toLowerCase())) {
            score += 15;
          }
        }
        
        // Price preference (lower is better)
        const price = parseFloat(slot.price.replace('$', '').replace('/hr', ''));
        if (price < 20) {
          score += 5;
        }
        
        return { ...slot, score };
      });
      
      return scored.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error getting cleaning recommendations:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status) {
    try {
      return await convexClient.mutation(api.cleaning.updateBookingStatus, {
        bookingId,
        status,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}

export const cleaningModel = new CleaningModel();
export default cleaningModel;
