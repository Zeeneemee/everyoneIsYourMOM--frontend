import express from 'express';
import { exchangeController } from '../controllers/exchangeController.js';

const router = express.Router();

// Get all exchange items
router.get('/', exchangeController.getAllItems.bind(exchangeController));

// Search items
router.get('/search', exchangeController.searchItems.bind(exchangeController));

// Get recommendations
router.get('/recommendations', exchangeController.getRecommendations.bind(exchangeController));

// Get nearby items
router.get('/nearby', exchangeController.getNearbyItems.bind(exchangeController));

// Get user's posted items
router.get('/my-items', exchangeController.getUserItems.bind(exchangeController));

// Get item by ID
router.get('/:id', exchangeController.getItemById.bind(exchangeController));

// Get item claims
router.get('/:id/claims', exchangeController.getItemClaims.bind(exchangeController));

// Post new item
router.post('/', exchangeController.postItem.bind(exchangeController));

// Claim an item
router.post('/claims', exchangeController.claimItem.bind(exchangeController));

// Update item
router.put('/:id', exchangeController.updateItem.bind(exchangeController));

// Delete item
router.delete('/:id', exchangeController.deleteItem.bind(exchangeController));

export default router;

