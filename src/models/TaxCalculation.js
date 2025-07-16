const mongoose = require('mongoose');

const taxCalculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taxYear: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
    enum: ['US', 'UK', 'CA', 'AU'],
  },
  method: {
    type: String,
    required: true,
    enum: ['FIFO', 'LIFO', 'AVERAGE_COST'],
  },
  totalGains: {
    type: Number,
    default: 0,
  },
  totalLosses: {
    type: Number,
    default: 0,
  },
  netGains: {
    type: Number,
    default: 0,
  },
  taxOwed: {
    type: Number,
    default: 0,
  },
  breakdown: {
    shortTermGains: { type: Number, default: 0 },
    longTermGains: { type: Number, default: 0 },
    shortTermLosses: { type: Number, default: 0 },
    longTermLosses: { type: Number, default: 0 },
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true                // Automatically manage createdAt and updatedAt
});

// Index for efficient queries
taxCalculationSchema.index({ userId: 1, taxYear: -1 });

// Create the TaxCalculation model
const taxCalculationModel = mongoose.model('taxcalculations', taxCalculationSchema);

// Export the model
module.exports = taxCalculationModel;
