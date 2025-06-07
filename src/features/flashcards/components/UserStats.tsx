import React, { useEffect } from 'react';
import { useFlashCards } from '../context/FlashCardContext';
// FIX: Import useAuth from the correct location
import { useAuth } from '../../auth/hooks/useAuth';

export const UserStats: React.FC = () => {
  const { userStats, loadUserStats } = useFlashCards();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">Log in to track your progress</p>
      </div>
    );
  }

  if (!userStats || !userStats.confidenceLevels) {
    return null;
  }

  const accuracyPercentage = Math.round(userStats.averageAccuracy * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
      
      {/* Overall stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-semibold">Cards Studied</p>
          <p className="text-2xl font-bold text-blue-800">{userStats.totalCardsStudied}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-semibold">Total Reviews</p>
          <p className="text-2xl font-bold text-green-800">{userStats.totalReviews}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-semibold">Average Accuracy</p>
          <p className="text-2xl font-bold text-purple-800">{accuracyPercentage}%</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-semibold">Confidence Level</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{
                  width: `${
                    ((userStats.confidenceLevels.high * 3 +
                      userStats.confidenceLevels.medium * 2 +
                      userStats.confidenceLevels.low) /
                      (userStats.totalCardsStudied * 3)) *
                    100
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confidence breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Confidence Breakdown</h3>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Low: {userStats.confidenceLevels.low}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Medium: {userStats.confidenceLevels.medium}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">High: {userStats.confidenceLevels.high}</span>
          </div>
        </div>
      </div>

      {/* Deck progress */}
      {Object.keys(userStats.deckProgress).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Progress by Deck</h3>
          <div className="space-y-3">
            {Object.entries(userStats.deckProgress).map(([deckId, deck]) => (
              <div key={deckId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{deck.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{deck.category.replace('-', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{deck.cardsStudied} cards</p>
                    <p className="text-sm font-semibold text-green-600">
                      {Math.round(deck.averageAccuracy * 100)}% accuracy
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${deck.averageAccuracy * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
