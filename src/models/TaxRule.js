const mongoose = require('mongoose');

const taxRuleSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    enum: ['US', 'UK', 'CA', 'AU'],
  },
  year: {
    type: Number,
    required: true,
  },
  rules: {
    capitalGains: {
      shortTerm: {
        threshold: { type: Number, required: true }, // days
        taxRate: { type: Number, required: true },   // percentage as decimal
      },
      longTerm: {
        threshold: { type: Number, required: true }, // days
        taxRate: { type: Number, required: true },   // percentage as decimal
      },
    },
    exemptions: {
      annualExemption: { type: Number, default: 0 },
      minTaxableAmount: { type: Number, default: 0 },
    },
  },
}, {
  timestamps: true         // Automatically manage createdAt and updatedAt
});

// Compound index for efficient lookups
taxRuleSchema.index({ country: 1, year: 1 }, { unique: true });

// Create the TaxRule model
const taxRuleModel = mongoose.model('taxrules', taxRuleSchema);

// Export the model
module.exports = taxRuleModel;
