const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

const sampleTransactions = [
  // Buy BTC at different times and prices
  {
    date: new Date('2024-01-15'),
    type: 'buy',
    fromAsset: 'USD',
    toAsset: 'BTC',
    fromAmount: 21000,
    toAmount: 0.5,
    price: 42000,
    fees: 25,
    exchange: 'Coinbase'
  },
  {
    date: new Date('2024-02-20'),
    type: 'buy',
    fromAsset: 'USD',
    toAsset: 'BTC',
    fromAmount: 14400,
    toAmount: 0.3,
    price: 48000,
    fees: 20,
    exchange: 'Kraken'
  },
  {
    date: new Date('2024-03-10'),
    type: 'buy',
    fromAsset: 'USD',
    toAsset: 'ETH',
    fromAmount: 5600,
    toAmount: 2.0,
    price: 2800,
    fees: 15,
    exchange: 'Binance'
  },
  
  // Sell some BTC (this should generate capital gains/losses)
  {
    date: new Date('2024-04-05'),
    type: 'sell',
    fromAsset: 'BTC',
    toAsset: 'USD',
    fromAmount: 0.2,
    toAmount: 9000,
    price: 45000,
    fees: 30,
    exchange: 'Coinbase'
  },
  
  // More ETH purchases
  {
    date: new Date('2024-05-15'),
    type: 'buy',
    fromAsset: 'USD',
    toAsset: 'ETH',
    fromAmount: 6400,
    toAmount: 2.0,
    price: 3200,
    fees: 20,
    exchange: 'Binance'
  },
  
  // Sell ETH (short-term gain/loss)
  {
    date: new Date('2024-06-20'),
    type: 'sell',
    fromAsset: 'ETH',
    toAsset: 'USD',
    fromAmount: 1.0,
    toAmount: 3500,
    price: 3500,
    fees: 25,
    exchange: 'Binance'
  },
  
  // More BTC trading
  {
    date: new Date('2024-07-10'),
    type: 'sell',
    fromAsset: 'BTC',
    toAsset: 'USD',
    fromAmount: 0.3,
    toAmount: 15000,
    price: 50000,
    fees: 35,
    exchange: 'Kraken'
  },
  
  // Mining income
  {
    date: new Date('2024-08-15'),
    type: 'mining',
    fromAsset: 'BTC',
    toAsset: 'BTC',
    fromAmount: 0.05,
    toAmount: 0.05,
    price: 52000,
    fees: 0,
    exchange: 'Mining Pool'
  },
  
  // Staking rewards
  {
    date: new Date('2024-09-10'),
    type: 'staking',
    fromAsset: 'ETH',
    toAsset: 'ETH',
    fromAmount: 0.1,
    toAmount: 0.1,
    price: 3100,
    fees: 0,
    exchange: 'Staking Pool'
  },
  
  // Recent sell for long-term gains
  {
    date: new Date('2024-12-01'),
    type: 'sell',
    fromAsset: 'BTC',
    toAsset: 'USD',
    fromAmount: 0.25,
    toAmount: 12500,
    price: 50000,
    fees: 40,
    exchange: 'Coinbase'
  }
];

const addSampleData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find or create a test user
    let testUser = await User.findOne({ email: 'demo@taxbridge.com' });
    
    if (!testUser) {
      testUser = await User.create({
        email: 'demo@taxbridge.com',
        password: 'demo123456',
        country: 'US'
      });
      console.log('✅ Created demo user: demo@taxbridge.com');
    } else {
      console.log('✅ Found existing demo user');
    }

    // Clear existing transactions for this user
    await Transaction.deleteMany({ userId: testUser._id });
    console.log('🗑️  Cleared existing transactions');

    // Add sample transactions
    const transactionsWithUserId = sampleTransactions.map(tx => ({
      ...tx,
      userId: testUser._id
    }));

    const insertedTransactions = await Transaction.insertMany(transactionsWithUserId);
    console.log(`✅ Added ${insertedTransactions.length} sample transactions`);

    // Summary of added data
    console.log('\n📊 Sample Data Summary:');
    console.log(`User: ${testUser.email} (${testUser.country})`);
    console.log(`User ID: ${testUser._id}`);
    console.log(`Transactions: ${insertedTransactions.length}`);
    
    const buys = insertedTransactions.filter(tx => tx.type === 'buy').length;
    const sells = insertedTransactions.filter(tx => tx.type === 'sell').length;
    const mining = insertedTransactions.filter(tx => tx.type === 'mining').length;
    const staking = insertedTransactions.filter(tx => tx.type === 'staking').length;
    
    console.log(`- Buys: ${buys}`);
    console.log(`- Sells: ${sells}`);
    console.log(`- Mining: ${mining}`);
    console.log(`- Staking: ${staking}`);
    
    console.log('\n🎯 Demo Ready! Use these credentials:');
    console.log('Email: demo@taxbridge.com');
    console.log('Password: demo123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();
