export interface Deck {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  cardCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
}

export interface FlashCard {
  _id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  deck: string;
  userProgress?: {
    confidence: 'low' | 'medium' | 'high';
    timesReviewed: number;
    correctAnswers: number;
  };
}

export interface UserStats {
  totalCardsStudied: number;
  totalReviews: number;
  averageAccuracy: number;
  confidenceLevels: {
    low: number;
    medium: number;
    high: number;
  };
  deckProgress: {
    [deckId: string]: {
      title: string;
      category: string;
      cardsStudied: number;
      averageAccuracy: number;
      totalReviews: number;
    };
  };
}
