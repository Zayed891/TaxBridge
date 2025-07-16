const Transaction = require('../models/Transaction');

// Tax rules for different countries (2024 rates)
const TAX_RULES = {
  US: {
    capitalGains: {
      shortTerm: { threshold: 365, taxRate: 0.37 },  // Ordinary income rate (max bracket)
      longTerm: { threshold: 365, taxRate: 0.20 }    // Long-term capital gains (max bracket)
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  },
  UK: {
    capitalGains: {
      shortTerm: { threshold: 30, taxRate: 0.20 },   // Basic rate
      longTerm: { threshold: 30, taxRate: 0.20 }     // Higher rate: 20%
    },
    exemptions: { annualExemption: 6000, minTaxableAmount: 0 }  // £6,000 annual allowance
  },
  CA: {
    capitalGains: {
      shortTerm: { threshold: 0, taxRate: 0.267 },   // 50% taxable × 53.3% max rate
      longTerm: { threshold: 0, taxRate: 0.267 }     // 50% inclusion rate
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  },
  AU: {
    capitalGains: {
      shortTerm: { threshold: 365, taxRate: 0.45 },  // Full marginal rate
      longTerm: { threshold: 365, taxRate: 0.225 }   // 50% CGT discount (45% × 50%)
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  }
};

class FIFOCalculator {
  constructor() {
    this.holdings = new Map(); // asset -> [{ amount, price, date, fees }]
  }

  processTransaction(transaction) {
    const { type, fromAsset, toAsset, fromAmount, toAmount, price, date, fees } = transaction;
    
    if (type === 'buy') {
      this.addHolding(toAsset, toAmount, price, date, fees);
      return null; // No gain/loss on buy
    } else if (type === 'sell') {
      return this.calculateSaleGains(fromAsset, fromAmount, price, date, fees);
    }
    
    return null;
  }

  addHolding(asset, amount, price, date, fees) {
    if (!this.holdings.has(asset)) {
      this.holdings.set(asset, []);
    }
    
    this.holdings.get(asset).push({
      amount,
      costBasis: price,
      date,
      fees: fees || 0
    });
  }

  calculateSaleGains(asset, sellAmount, sellPrice, sellDate, fees = 0) {
    const holdings = this.holdings.get(asset) || [];
    let remainingSellAmount = sellAmount;
    let totalCostBasis = 0;
    let totalGains = 0;
    let isShortTerm = false;

    while (remainingSellAmount > 0 && holdings.length > 0) {
      const holding = holdings[0];
      const useAmount = Math.min(remainingSellAmount, holding.amount);
      
      // Calculate holding period
      const holdingPeriod = (sellDate - holding.date) / (1000 * 60 * 60 * 24);
      if (holdingPeriod <= 365) isShortTerm = true;
      
      // Calculate gains for this portion
      const costBasis = useAmount * holding.costBasis + (holding.fees * (useAmount / holding.amount));
      const proceeds = useAmount * sellPrice - (fees * (useAmount / sellAmount));
      const gain = proceeds - costBasis;
      
      totalCostBasis += costBasis;
      totalGains += gain;
      
      // Update holdings
      holding.amount -= useAmount;
      if (holding.amount <= 0) {
        holdings.shift();
      }
      
      remainingSellAmount -= useAmount;
    }

    return {
      asset,
      amount: sellAmount,
      costBasis: totalCostBasis,
      proceeds: sellAmount * sellPrice - fees,
      gain: totalGains,
      isShortTerm,
      holdingPeriod: isShortTerm ? 'short' : 'long'
    };
  }
}

class LIFOCalculator {
  constructor() {
    this.holdings = new Map(); // asset -> [{ amount, price, date, fees }]
  }

  processTransaction(transaction) {
    const { type, fromAsset, toAsset, fromAmount, toAmount, price, date, fees } = transaction;
    
    if (type === 'buy') {
      this.addHolding(toAsset, toAmount, price, date, fees);
      return null;
    } else if (type === 'sell') {
      return this.calculateSaleGains(fromAsset, fromAmount, price, date, fees);
    }
    
    return null;
  }

  addHolding(asset, amount, price, date, fees) {
    if (!this.holdings.has(asset)) {
      this.holdings.set(asset, []);
    }
    
    this.holdings.get(asset).push({
      amount,
      costBasis: price,
      date,
      fees: fees || 0
    });
  }

  calculateSaleGains(asset, sellAmount, sellPrice, sellDate, fees = 0) {
    const holdings = this.holdings.get(asset) || [];
    let remainingSellAmount = sellAmount;
    let totalCostBasis = 0;
    let totalGains = 0;
    let isShortTerm = false;

    // LIFO: Start from the last (most recent) purchase
    while (remainingSellAmount > 0 && holdings.length > 0) {
      const holding = holdings[holdings.length - 1];
      const useAmount = Math.min(remainingSellAmount, holding.amount);
      
      // Calculate holding period
      const holdingPeriod = (sellDate - holding.date) / (1000 * 60 * 60 * 24);
      if (holdingPeriod <= 365) isShortTerm = true;
      
      // Calculate gains for this portion
      const costBasis = useAmount * holding.costBasis + (holding.fees * (useAmount / holding.amount));
      const proceeds = useAmount * sellPrice - (fees * (useAmount / sellAmount));
      const gain = proceeds - costBasis;
      
      totalCostBasis += costBasis;
      totalGains += gain;
      
      // Update holdings
      holding.amount -= useAmount;
      if (holding.amount <= 0) {
        holdings.pop();
      }
      
      remainingSellAmount -= useAmount;
    }

    return {
      asset,
      amount: sellAmount,
      costBasis: totalCostBasis,
      proceeds: sellAmount * sellPrice - fees,
      gain: totalGains,
      isShortTerm,
      holdingPeriod: isShortTerm ? 'short' : 'long'
    };
  }
}

class AverageCostCalculator {
  constructor() {
    this.holdings = new Map(); // asset -> { totalAmount, totalCost, transactions: [] }
  }

  processTransaction(transaction) {
    const { type, fromAsset, toAsset, fromAmount, toAmount, price, date, fees } = transaction;
    
    if (type === 'buy') {
      this.addHolding(toAsset, toAmount, price, date, fees);
      return null;
    } else if (type === 'sell') {
      return this.calculateSaleGains(fromAsset, fromAmount, price, date, fees);
    }
    
    return null;
  }

  addHolding(asset, amount, price, date, fees) {
    if (!this.holdings.has(asset)) {
      this.holdings.set(asset, {
        totalAmount: 0,
        totalCost: 0,
        transactions: []
      });
    }
    
    const holding = this.holdings.get(asset);
    holding.totalAmount += amount;
    holding.totalCost += (amount * price) + fees;
    holding.transactions.push({ amount, price, date, fees });
  }

  calculateSaleGains(asset, sellAmount, sellPrice, sellDate, fees = 0) {
    const holding = this.holdings.get(asset);
    if (!holding || holding.totalAmount <= 0) {
      throw new Error(`No holdings available for ${asset}`);
    }
    if (holding.totalAmount < sellAmount) {
      throw new Error(`Insufficient ${asset} balance for sale`);
    }

    // Calculate average cost basis (protected from division by zero)
    const avgCostBasis = holding.totalCost / holding.totalAmount;
    const totalCostBasis = sellAmount * avgCostBasis;
    const proceeds = sellAmount * sellPrice - fees;
    const gain = proceeds - totalCostBasis;

    // Determine if short-term (check if any purchases were within 365 days)
    const isShortTerm = holding.transactions.some(tx => {
      const holdingPeriod = (sellDate - tx.date) / (1000 * 60 * 60 * 24);
      return holdingPeriod <= 365;
    });

    // Update holdings
    holding.totalAmount -= sellAmount;
    holding.totalCost -= totalCostBasis;

    return {
      asset,
      amount: sellAmount,
      costBasis: totalCostBasis,
      proceeds,
      gain,
      isShortTerm,
      holdingPeriod: isShortTerm ? 'short' : 'long'
    };
  }
}

class TaxCalculatorService {
  static async calculateTax(userId, taxYear, country, method) {
    try {
      // Get user transactions for the tax year
      const startDate = new Date(`${taxYear}-01-01`);
      const endDate = new Date(`${taxYear}-12-31`);
      
      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });

      // Initialize calculator based on method
      let calculator;
      switch (method) {
        case 'FIFO':
          calculator = new FIFOCalculator();
          break;
        case 'LIFO':
          calculator = new LIFOCalculator();
          break;
        case 'AVERAGE_COST':
          calculator = new AverageCostCalculator();
          break;
        default:
          throw new Error('Invalid calculation method');
      }

      // Process transactions and calculate gains/losses
      const gainLossEvents = [];
      let shortTermGains = 0;
      let longTermGains = 0;
      let shortTermLosses = 0;
      let longTermLosses = 0;

      for (const transaction of transactions) {
        const result = calculator.processTransaction(transaction);
        if (result) {
          gainLossEvents.push({
            ...result,
            transactionId: transaction._id,
            date: transaction.date
          });

          if (result.gain > 0) {
            if (result.isShortTerm) {
              shortTermGains += result.gain;
            } else {
              longTermGains += result.gain;
            }
          } else {
            if (result.isShortTerm) {
              shortTermLosses += Math.abs(result.gain);
            } else {
              longTermLosses += Math.abs(result.gain);
            }
          }
        }
      }

      // Apply tax rules
      const taxRules = TAX_RULES[country];
      if (!taxRules) {
        throw new Error('Tax rules not found for country');
      }

      const totalGains = shortTermGains + longTermGains;
      const totalLosses = shortTermLosses + longTermLosses;
      const netGains = totalGains - totalLosses;

      // Apply exemptions
      const taxableGains = Math.max(0, netGains - taxRules.exemptions.annualExemption);
      
      // Calculate tax owed
      let taxOwed = 0;
      if (taxableGains > 0) {
        const shortTermTaxable = Math.max(0, shortTermGains - shortTermLosses);
        const longTermTaxable = Math.max(0, longTermGains - longTermLosses);
        
        taxOwed = (shortTermTaxable * taxRules.capitalGains.shortTerm.taxRate) +
                  (longTermTaxable * taxRules.capitalGains.longTerm.taxRate);
      }

      return {
        taxYear,
        country,
        method,
        summary: {
          totalGains,
          totalLosses,
          netGains,
          taxOwed,
          effectiveRate: netGains > 0 ? taxOwed / netGains : 0
        },
        breakdown: {
          shortTermGains,
          longTermGains,
          shortTermLosses,
          longTermLosses
        },
        gainLossEvents,
        exemptions: {
          annualExemption: taxRules.exemptions.annualExemption,
          exemptionUsed: Math.min(netGains, taxRules.exemptions.annualExemption)
        }
      };
    } catch (error) {
      console.error('Tax calculation error:', error);
      throw error;
    }
  }

  static getTaxRules(country, year = new Date().getFullYear()) {
    return TAX_RULES[country] || null;
  }
}

module.exports = {
  TaxCalculatorService,
  FIFOCalculator,
  LIFOCalculator,
  AverageCostCalculator,
  TAX_RULES
};
