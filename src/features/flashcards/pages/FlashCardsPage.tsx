import React, { useEffect } from 'react';
import { FlashCardProvider } from '../context/FlashCardContext';
import { DeckGrid } from '../components/DeckGrid';
import { UserStats } from '../components/UserStats';
import { useFlashCards } from '../context/FlashCardContext';

const FlashCardsContent: React.FC = () => {
  const { loadDecks } = useFlashCards();

  useEffect(() => {
    loadDecks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-100 mb-4 drop-shadow-lg">
            HVAC MEP Study Cards
          </h1>
          <p className="text-lg text-blue-200 mb-2">
            Master HVAC and MEP concepts with our comprehensive flash card system.<br />
            Test your knowledge across multiple disciplines and track your progress.
          </p>
        </div>

        <div className="mb-8">
          <UserStats />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Choose a Deck</h2>
          <DeckGrid />
        </div>
      </div>
    </div>
  );
};

export const FlashCardsPage: React.FC = () => {
  return (
    <FlashCardProvider>
      <FlashCardsContent />
    </FlashCardProvider>
  );
};
