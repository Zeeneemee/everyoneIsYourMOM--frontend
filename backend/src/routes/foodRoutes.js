import express from 'express';
import { foodController } from '../controllers/foodController.js';

const router = express.Router();

// Get all food items
router.get('/', foodController.getAllFood.bind(foodController));

// Search food
router.get('/search', foodController.searchFood.bind(foodController));

// Get recommendations
router.get('/recommendations', foodController.getRecommendations.bind(foodController));

// Get nearby food
router.get('/nearby', foodController.getNearbyFood.bind(foodController));

// Get food by ID
router.get('/:id', foodController.getFoodById.bind(foodController));

// Create food offering
router.post('/', foodController.createFood.bind(foodController));

// Update food offering
router.put('/:id', foodController.updateFood.bind(foodController));

// Delete food offering
router.delete('/:id', foodController.deleteFood.bind(foodController));

export default router;

