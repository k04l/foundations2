import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlashCard',
    required: true
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  timesReviewed: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  confidence: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  nextReviewDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userProgressSchema.index({ user: 1, card: 1 }, { unique: true });
userProgressSchema.index({ user: 1, deck: 1 });

export default mongoose.model('UserProgress', userProgressSchema);
