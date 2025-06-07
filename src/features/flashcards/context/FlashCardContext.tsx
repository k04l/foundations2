import React, { createContext, useContext, useState, ReactNode } from 'react';
import { flashCardApi } from '../api/flashCardApi';
import { Deck, FlashCard, UserStats } from '../types';

interface FlashCardContextType {
  decks: Deck[];
  currentDeck: Deck | null;
  currentCards: FlashCard[];
  currentCardIndex: number;
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  
  loadDecks: () => Promise<void>;
  loadDeckCards: (deckId: string) => Promise<void>;
  recordAnswer: (cardId: string, isCorrect: boolean, confidence?: string) => Promise<void>;
  nextCard: () => void;
  previousCard: () => void;
  resetDeck: () => void;
  loadUserStats: () => Promise<void>;
}

const FlashCardContext = createContext<FlashCardContextType | undefined>(undefined);

export const useFlashCards = () => {
  const context = useContext(FlashCardContext);
  if (!context) {
    throw new Error('useFlashCards must be used within FlashCardProvider');
  }
  return context;
};

interface FlashCardProviderProps {
  children: ReactNode;
}

export const FlashCardProvider: React.FC<FlashCardProviderProps> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [currentCards, setCurrentCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await flashCardApi.getDecks();
      setDecks(response.data);
    } catch (err) {
      setError('Failed to load decks');
      console.error('Error loading decks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeckCards = async (deckId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await flashCardApi.getDeckCards(deckId);
      setCurrentDeck(response.data.deck);
      setCurrentCards(response.data.cards);
      setCurrentCardIndex(0);
    } catch (err) {
      setError('Failed to load cards');
      console.error('Error loading cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recordAnswer = async (cardId: string, isCorrect: boolean, confidence?: string) => {
    try {
      await flashCardApi.recordAnswer(cardId, isCorrect, confidence);
      
      // Update local card progress
      setCurrentCards(prevCards =>
        prevCards.map(card =>
          card._id === cardId
            ? {
                ...card,
                userProgress: {
                  ...card.userProgress,
                  timesReviewed: (card.userProgress?.timesReviewed || 0) + 1,
                  correctAnswers: (card.userProgress?.correctAnswers || 0) + (isCorrect ? 1 : 0),
                  confidence: confidence || card.userProgress?.confidence || 'low'
                }
              }
            : card
        )
      );
    } catch (err) {
      console.error('Error recording answer:', err);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const resetDeck = () => {
    setCurrentCardIndex(0);
  };

  const loadUserStats = async () => {
    try {
      const response = await flashCardApi.getUserStats();
      setUserStats(response.data);
    } catch (err) {
      console.error('Error loading user stats:', err);
    }
  };

  return (
    <FlashCardContext.Provider
      value={{
        decks,
        currentDeck,
        currentCards,
        currentCardIndex,
        userStats,
        isLoading,
        error,
        loadDecks,
        loadDeckCards,
        recordAnswer,
        nextCard,
        previousCard,
        resetDeck,
        loadUserStats
      }}
    >
      {children}
    </FlashCardContext.Provider>
  );
};
