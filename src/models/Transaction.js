const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell', 'trade', 'mining', 'staking'],
  },
  fromAsset: {
    type: String,
    required: true,
    uppercase: true,
  },
  toAsset: {
    type: String,
    required: true,
    uppercase: true,
  },
  fromAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  toAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  fees: {
    type: Number,
    default: 0,
    min: 0,
  },
  exchange: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true             // Automatically manage createdAt and updatedAt
});

// Index for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });

// Create the Transaction model
const transactionModel = mongoose.model('transactions', transactionSchema);

// Export the model
module.exports = transactionModel;
