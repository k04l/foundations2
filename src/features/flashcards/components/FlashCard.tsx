import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

interface FlashCardProps {
  question: string;
  answer: string;
  explanation?: string;
  difficulty: string;
  tags: string[];
  userProgress?: {
    confidence: string;
    timesReviewed: number;
    correctAnswers: number;
  };
  onAnswer: (isCorrect: boolean, confidence?: string) => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  question,
  answer,
  explanation,
  difficulty,
  tags,
  userProgress,
  onAnswer
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { user } = useAuth();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowAnswer(true);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!user) {
      // Show login prompt
      alert('Please log in to track your progress');
      return;
    }

    // Ask for confidence level
    const confidence = prompt('How confident are you? (low/medium/high)', userProgress?.confidence || 'medium');
    if (confidence && ['low', 'medium', 'high'].includes(confidence)) {
      onAnswer(isCorrect, confidence);
    } else {
      onAnswer(isCorrect);
    }
  };

  const difficultyColors = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-red-600'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[400px] relative">
        {/* Progress indicator */}
        {userProgress && (
          <div className="absolute top-4 right-4 text-sm text-gray-500">
            <div>Reviews: {userProgress.timesReviewed}</div>
            <div>Accuracy: {userProgress.timesReviewed > 0 
              ? Math.round((userProgress.correctAnswers / userProgress.timesReviewed) * 100)
              : 0}%
            </div>
            <div className="capitalize">Confidence: {userProgress.confidence}</div>
          </div>
        )}

        {/* Difficulty badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-sm font-semibold ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
            {difficulty}
          </span>
        </div>

        {/* Card content */}
        <div className="mt-12">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Question:</h3>
            <p className="text-xl">{question}</p>
          </div>

          {!showAnswer ? (
            <button
              onClick={handleFlip}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Answer:</h3>
                <p className="text-xl text-green-700">{answer}</p>
              </div>

              {explanation && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Explanation:</h3>
                  <p className="text-gray-600">{explanation}</p>
                </div>
              )}

              {/* Answer feedback buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Incorrect
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Correct
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
