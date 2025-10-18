import express from 'express';
import { foodController } from '../controllers/foodController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// Get food card data by query (e.g., ?query=chicken rice)
// This is specifically for searching and displaying food card details
router.get('/card', foodController.getFoodCard.bind(foodController));

// Get all food items (with optional filters)
// Query params: available, diet, tags, minPrice, maxPrice, cuisine, rating
router.get('/', foodController.getAllFood.bind(foodController));

// Search food by query
// Query params: q (search term), diet, tags, excludeAllergens, maxPrice, maxEta
router.get('/search', foodController.searchFood.bind(foodController));

// Get food recommendations based on user preferences
// Query params: diet, tags, allergens, maxDistance
router.get('/recommendations', foodController.getRecommendations.bind(foodController));

// Get nearby food by location/block
// Query params: block (required), radius
router.get('/nearby', foodController.getNearbyFood.bind(foodController));

// Get food by category/cuisine
// Query params: category (e.g., 'chinese', 'indian', 'western')
router.get('/category/:category', foodController.getFoodByCategory.bind(foodController));

// Get food by dietary preference
// Params: diet (e.g., 'vegan', 'vegetarian', 'halal', 'gluten-free')
router.get('/diet/:diet', foodController.getFoodByDiet.bind(foodController));

// Get food by price range
// Query params: min, max
router.get('/price-range', foodController.getFoodByPriceRange.bind(foodController));

// Get featured/popular food items
router.get('/featured', foodController.getFeaturedFood.bind(foodController));

// Get trending food items
router.get('/trending', foodController.getTrendingFood.bind(foodController));

// Get food by specific ID (handles both itemId and Convex _id with smart detection)
router.get('/:id', foodController.getFoodById.bind(foodController));

// ==================== AUTHENTICATED ROUTES ====================

// Create new food offering (requires authentication)
router.post('/', requireAuth, foodController.createFood.bind(foodController));

// Update food offering (requires authentication)
router.put('/:id', requireAuth, foodController.updateFood.bind(foodController));

// Delete food offering (requires authentication)
router.delete('/:id', requireAuth, foodController.deleteFood.bind(foodController));

// Get user's own food listings
router.get('/user/my-listings', requireAuth, foodController.getUserFoodListings.bind(foodController));

// Toggle food availability
router.patch('/:id/availability', requireAuth, foodController.toggleAvailability.bind(foodController));

// Update food quantity
router.patch('/:id/quantity', requireAuth, foodController.updateQuantity.bind(foodController));

// Bulk operations
router.post('/bulk/create', requireAuth, foodController.bulkCreateFood.bind(foodController));
router.patch('/bulk/update', requireAuth, foodController.bulkUpdateFood.bind(foodController));
router.delete('/bulk/delete', requireAuth, foodController.bulkDeleteFood.bind(foodController));

export default router;

