import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashCards } from '../context/FlashCardContext';

const categoryColors = {
  fundamentals: 'bg-blue-500',
  'hvac-systems': 'bg-green-500',
  plumbing: 'bg-cyan-500',
  electrical: 'bg-yellow-500',
  'codes-standards': 'bg-purple-500',
  calculations: 'bg-red-500',
  equipment: 'bg-orange-500',
  troubleshooting: 'bg-pink-500'
};

const difficultyBadgeColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
  mixed: 'bg-gray-100 text-gray-800'
};

export const DeckGrid: React.FC = () => {
  const navigate = useNavigate();
  const { decks, isLoading, error } = useFlashCards();

  const handleDeckClick = (deckId: string) => {
    navigate(`/flashcards/deck/${deckId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  // Group decks by category with proper typing
  const groupedDecks: Record<string, typeof decks> = decks.reduce((acc, deck) => {
    if (!acc[deck.category]) {
      acc[deck.category] = [];
    }
    acc[deck.category].push(deck);
    return acc;
  }, {} as Record<string, typeof decks>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedDecks).map(([category, decksInCategory]) => (
        <div key={category}>
          <h3 className="text-xl font-bold text-blue-200 mb-4 pl-2 border-l-4 border-blue-500 uppercase tracking-wide">
            {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {decksInCategory.map((deck: any) => (
              <button
                key={deck._id}
                onClick={() => handleDeckClick(deck._id)}
                className="w-full text-left bg-primary-800 border-2 border-blue-400 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all duration-200 p-6 flex flex-col gap-2 group focus:outline-none focus:ring-4 focus:ring-blue-400/40 ring-offset-2 ring-offset-primary-900"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">
                    {deck.icon || '📚'}
                  </span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${(difficultyBadgeColors as any)[deck.difficulty] || 'bg-gray-100 text-gray-800'}`}>{deck.difficulty}</span>
                </div>
                <div className="text-lg font-bold text-blue-100 mb-1 group-hover:text-blue-300 transition-colors">
                  {deck.title}
                </div>
                <div className="text-blue-300 text-sm mb-2">
                  {deck.description}
                </div>
                <div className="text-blue-400 text-xs font-medium">
                  {deck.cardCount} card{deck.cardCount === 1 ? '' : 's'}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
