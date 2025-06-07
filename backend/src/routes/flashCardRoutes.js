import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import {
  getDecks,
  getDeckCards,
  recordAnswer,
  getUserStats
} from '../controllers/flashCardController.js';

// Public routes
router.get('/decks', getDecks);
router.get('/decks/:deckId/cards', getDeckCards);

// Protected routes (require authentication)
router.post('/cards/:cardId/answer', protect, recordAnswer);
router.get('/stats', protect, getUserStats);

export { router as flashCardRoutes };
