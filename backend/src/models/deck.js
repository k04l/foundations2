import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fundamentals', 'hvac-systems', 'plumbing', 'electrical', 'codes-standards', 'calculations', 'equipment', 'troubleshooting'],
    index: true
  },
  icon: {
    type: String,
    default: '📚'
  },
  cardCount: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'mixed'],
    default: 'mixed'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update card count when cards are added/removed
deckSchema.methods.updateCardCount = async function() {
  const FlashCard = (await import('./flashCard.js')).default;
  const count = await FlashCard.countDocuments({ deck: this._id });
  this.cardCount = count;
  await this.save();
};

export default mongoose.model('Deck', deckSchema);
