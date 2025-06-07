import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashCards } from '../context/FlashCardContext';
import { FlashCard } from './FlashCard';

export const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const {
    currentDeck,
    currentCards,
    currentCardIndex,
    isLoading,
    error,
    loadDeckCards,
    recordAnswer,
    nextCard,
    previousCard,
    resetDeck
  } = useFlashCards();

  useEffect(() => {
    if (deckId) {
      loadDeckCards(deckId);
    }
  }, [deckId]);

  const handleAnswer = async (isCorrect: boolean, confidence?: string) => {
    const currentCard = currentCards[currentCardIndex];
    if (currentCard) {
      await recordAnswer(currentCard._id, isCorrect, confidence);
      
      // Auto-advance to next card after a short delay
      setTimeout(() => {
        if (currentCardIndex < currentCards.length - 1) {
          nextCard();
        }
      }, 1000);
    }
  };

  const handleComplete = () => {
    navigate('/flashcards');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !currentDeck || currentCards.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error || 'No cards available'}</p>
        <button
          onClick={() => navigate('/flashcards')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  const currentCard = currentCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / currentCards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/flashcards')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Decks
          </button>
          
          <h1 className="text-3xl font-bold mb-2">{currentDeck.title}</h1>
          <p className="text-gray-600">{currentDeck.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentCardIndex + 1} of {currentCards.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flash card */}
        <FlashCard
          {...currentCard}
          onAnswer={handleAnswer}
        />

        {/* Navigation controls */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentCardIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {currentCardIndex === currentCards.length - 1 ? (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Session
            </button>
          ) : (
            <button
              onClick={nextCard}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Reset button */}
        <div className="mt-4 text-center">
          <button
            onClick={resetDeck}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};
