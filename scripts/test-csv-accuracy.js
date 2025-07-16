const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data expectations
const expectedTransactions = [
  {
    date: '2024-01-15',
    type: 'buy',
    fromAsset: 'USD',
    toAsset: 'BTC',
    fromAmount: 10000,
    toAmount: 0.4,
    price: 25000,
    fees: 25,
    exchange: 'Coinbase'
  },
  {
    date: '2024-02-20',
    type: 'sell',
    fromAsset: 'BTC',
    toAsset: 'USD',
    fromAmount: 0.2,
    toAmount: 5200,
    price: 26000,
    fees: 20,
    exchange: 'Binance'
  }
];

// Helper function to authenticate
async function authenticate() {
  try {
    console.log('🔐 Authenticating with test user...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'demo@taxbridge.com',
      password: 'demo123456'
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Authentication successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    return false;
  }
}

// Test CSV upload with valid data
async function testValidCSVUpload() {
  try {
    console.log('\n📄 Testing valid CSV upload...');
    
    const form = new FormData();
    const csvPath = path.join(__dirname, '../test-data/test-transactions.csv');
    form.append('csvFile', fs.createReadStream(csvPath));

    const response = await axios.post(`${BASE_URL}/transactions/import`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('📊 Upload Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log(`✅ Successfully uploaded ${response.data.data.insertedCount} transactions`);
      if (response.data.data.errors.length > 0) {
        console.log(`⚠️  ${response.data.data.errors.length} errors found:`, response.data.data.errors);
      }
      return response.data.data.insertedCount;
    }
  } catch (error) {
    console.error('❌ Valid CSV upload failed:', error.response?.data || error.message);
    return 0;
  }
}

// Test CSV upload with invalid data
async function testInvalidCSVUpload() {
  try {
    console.log('\n🚫 Testing invalid CSV upload...');
    
    const form = new FormData();
    const csvPath = path.join(__dirname, '../test-data/test-transactions-invalid.csv');
    form.append('csvFile', fs.createReadStream(csvPath));

    const response = await axios.post(`${BASE_URL}/transactions/import`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('📊 Invalid Upload Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data.errors.length > 0) {
      console.log(`✅ Correctly caught ${response.data.data.errors.length} validation errors`);
      response.data.data.errors.forEach((error, index) => {
        console.log(`   Error ${index + 1}: Row ${error.row} - ${error.error}`);
      });
    }
    
    return response.data.data.errors.length;
  } catch (error) {
    console.error('❌ Invalid CSV test failed:', error.response?.data || error.message);
    return 0;
  }
}

// Verify uploaded transactions
async function verifyUploadedTransactions() {
  try {
    console.log('\n🔍 Verifying uploaded transactions...');
    
    const response = await axios.get(`${BASE_URL}/transactions?limit=20`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      const transactions = response.data.data.transactions;
      console.log(`📊 Found ${transactions.length} transactions in database`);
      
      // Verify first two transactions match expected data
      let accuracyScore = 0;
      const totalChecks = expectedTransactions.length * 9; // 9 fields per transaction
      
      expectedTransactions.forEach((expected, index) => {
        const actual = transactions.find(t => 
          new Date(t.date).toISOString().split('T')[0] === expected.date &&
          t.type === expected.type
        );
        
        if (actual) {
          console.log(`\n✅ Transaction ${index + 1} found:`);
          
          // Check each field
          const checks = [
            { field: 'type', expected: expected.type, actual: actual.type },
            { field: 'fromAsset', expected: expected.fromAsset, actual: actual.fromAsset },
            { field: 'toAsset', expected: expected.toAsset, actual: actual.toAsset },
            { field: 'fromAmount', expected: expected.fromAmount, actual: actual.fromAmount },
            { field: 'toAmount', expected: expected.toAmount, actual: actual.toAmount },
            { field: 'price', expected: expected.price, actual: actual.price },
            { field: 'fees', expected: expected.fees, actual: actual.fees },
            { field: 'exchange', expected: expected.exchange, actual: actual.exchange },
            { field: 'date', expected: expected.date, actual: new Date(actual.date).toISOString().split('T')[0] }
          ];
          
          checks.forEach(check => {
            if (check.expected === check.actual) {
              console.log(`   ✅ ${check.field}: ${check.actual}`);
              accuracyScore++;
            } else {
              console.log(`   ❌ ${check.field}: Expected ${check.expected}, got ${check.actual}`);
            }
          });
        } else {
          console.log(`❌ Transaction ${index + 1} not found in database`);
        }
      });
      
      const accuracyPercentage = (accuracyScore / totalChecks * 100).toFixed(1);
      console.log(`\n📊 Overall Accuracy: ${accuracyScore}/${totalChecks} (${accuracyPercentage}%)`);
      
      return { accuracyScore, totalChecks, accuracyPercentage };
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data || error.message);
    return { accuracyScore: 0, totalChecks: 0, accuracyPercentage: '0' };
  }
}

// Test tax calculation with uploaded data
async function testTaxCalculation() {
  try {
    console.log('\n💰 Testing tax calculation with uploaded data...');
    
    const response = await axios.post(`${BASE_URL}/tax/calculate`, {
      taxYear: 2024,
      country: 'US',
      method: 'FIFO'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      console.log('📊 Tax Calculation Results:');
      console.log(`   Total Gain/Loss: $${response.data.data.totalGainLoss}`);
      console.log(`   Tax Owed: $${response.data.data.taxOwed}`);
      console.log(`   Transactions Processed: ${response.data.data.processedTransactions}`);
      console.log('✅ Tax calculation successful with CSV data');
      return true;
    }
  } catch (error) {
    console.error('❌ Tax calculation failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runCSVAccuracyTest() {
  console.log('🚀 Starting CSV Reading Accuracy Test\n');
  console.log('=' * 50);
  
  // Step 1: Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    console.log('❌ Test failed - Could not authenticate');
    return;
  }
  
  // Step 2: Test valid CSV upload
  const uploadedCount = await testValidCSVUpload();
  
  // Step 3: Test invalid CSV upload
  const errorCount = await testInvalidCSVUpload();
  
  // Step 4: Verify data accuracy
  const verification = await verifyUploadedTransactions();
  
  // Step 5: Test tax calculation
  const taxCalculated = await testTaxCalculation();
  
  // Final report
  console.log('\n' + '=' * 50);
  console.log('📋 FINAL TEST REPORT');
  console.log('=' * 50);
  console.log(`✅ Valid transactions uploaded: ${uploadedCount}`);
  console.log(`🚫 Validation errors caught: ${errorCount}`);
  console.log(`📊 Data accuracy: ${verification.accuracyPercentage}%`);
  console.log(`💰 Tax calculation: ${taxCalculated ? 'PASSED' : 'FAILED'}`);
  
  if (verification.accuracyPercentage === '100.0' && errorCount > 0 && taxCalculated) {
    console.log('\n🎉 CSV READING TEST: PASSED');
    console.log('Your CSV processing is working accurately!');
  } else {
    console.log('\n⚠️  CSV READING TEST: NEEDS ATTENTION');
    console.log('Some issues found in CSV processing.');
  }
}

// Run the test
runCSVAccuracyTest().catch(console.error);
