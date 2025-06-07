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

  const groupedDecks = decks.reduce((acc, deck) => {
    if (!acc[deck.category]) {
      acc[deck.category] = [];
    }
    acc[deck.category].push(deck);
    return acc;
  }, {} as Record<string, typeof decks>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedDecks).map(([category, categoryDecks]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {category.replace('-', ' ')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDecks.map((deck) => (
              <div
                key={deck._id}
                onClick={() => handleDeckClick(deck._id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div className={`h-2 ${categoryColors[deck.category as keyof typeof categoryColors]}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{deck.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyBadgeColors[deck.difficulty]}`}>
                      {deck.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{deck.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {deck.cardCount} cards
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
