import FlashCard from '../models/flashCard.js';
import Deck from '../models/deck.js';
import UserProgress from '../models/userProgress.js';

// Get all decks with their card counts
export const getDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ isActive: true })
      .select('title description category icon cardCount difficulty')
      .sort('category title');
    
    res.json({
      success: true,
      data: decks
    });
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch decks'
    });
  }
};

// Get cards for a specific deck
export const getDeckCards = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user?._id;
    
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }
    
    const cards = await FlashCard.find({ deck: deckId })
      .select('question answer explanation difficulty tags');
    
    // If user is logged in, get their progress
    let userProgress = {};
    if (userId) {
      const progress = await UserProgress.find({
        user: userId,
        deck: deckId
      }).select('card confidence timesReviewed correctAnswers');
      
      progress.forEach(p => {
        userProgress[p.card.toString()] = {
          confidence: p.confidence,
          timesReviewed: p.timesReviewed,
          correctAnswers: p.correctAnswers
        };
      });
    }
    
    res.json({
      success: true,
      data: {
        deck,
        cards: cards.map(card => ({
          ...card.toObject(),
          userProgress: userProgress[card._id.toString()] || null
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching deck cards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cards'
    });
  }
};

// Record user's answer and update progress
export const recordAnswer = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { isCorrect, confidence } = req.body;
    const userId = req.user._id;
    
    const card = await FlashCard.findById(cardId).populate('deck');
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    // Find or create user progress
    let progress = await UserProgress.findOne({
      user: userId,
      card: cardId
    });
    
    if (!progress) {
      progress = new UserProgress({
        user: userId,
        card: cardId,
        deck: card.deck._id
      });
    }
    
    // Update progress
    progress.timesReviewed += 1;
    if (isCorrect) {
      progress.correctAnswers += 1;
    }
    progress.confidence = confidence || progress.confidence;
    progress.lastReviewed = new Date();
    
    // Calculate next review date based on spaced repetition
    const daysSinceLastReview = progress.timesReviewed === 1 ? 0 : 
      Math.floor((new Date() - progress.lastReviewed) / (1000 * 60 * 60 * 24));
    
    let interval = 1; // Default 1 day
    if (isCorrect) {
      if (progress.confidence === 'high') {
        interval = Math.min(daysSinceLastReview * 2.5, 90);
      } else if (progress.confidence === 'medium') {
        interval = Math.min(daysSinceLastReview * 1.5, 30);
      }
    }
    
    progress.nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
    
    await progress.save();
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error recording answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record answer'
    });
  }
};

// Get user's study statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deckId } = req.query;
    
    const query = { user: userId };
    if (deckId) {
      query.deck = deckId;
    }
    
    const progress = await UserProgress.find(query)
      .populate('deck', 'title category')
      .populate('card', 'difficulty');
    
    // Calculate statistics
    const stats = {
      totalCardsStudied: progress.length,
      totalReviews: progress.reduce((sum, p) => sum + p.timesReviewed, 0),
      averageAccuracy: progress.length > 0 
        ? progress.reduce((sum, p) => sum + (p.correctAnswers / p.timesReviewed), 0) / progress.length
        : 0,
      confidenceLevels: {
        low: progress.filter(p => p.confidence === 'low').length,
        medium: progress.filter(p => p.confidence === 'medium').length,
        high: progress.filter(p => p.confidence === 'high').length
      },
      deckProgress: {}
    };
    
    // Group by deck
    progress.forEach(p => {
      if (!stats.deckProgress[p.deck._id]) {
        stats.deckProgress[p.deck._id] = {
          title: p.deck.title,
          category: p.deck.category,
          cardsStudied: 0,
          averageAccuracy: 0,
          totalReviews: 0
        };
      }
      
      const deckStats = stats.deckProgress[p.deck._id];
      deckStats.cardsStudied += 1;
      deckStats.totalReviews += p.timesReviewed;
      deckStats.averageAccuracy += (p.correctAnswers / p.timesReviewed);
    });
    
    // Calculate average accuracy per deck
    Object.values(stats.deckProgress).forEach(deck => {
      deck.averageAccuracy = deck.cardsStudied > 0 
        ? deck.averageAccuracy / deck.cardsStudied 
        : 0;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
