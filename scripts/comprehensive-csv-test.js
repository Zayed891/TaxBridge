const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

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

// Clear existing transactions
async function clearExistingTransactions() {
  try {
    console.log('🧹 Clearing existing transactions...');
    
    // Get all transactions
    const response = await axios.get(`${BASE_URL}/transactions?limit=100`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.data.success && response.data.data.transactions.length > 0) {
      // Delete each transaction
      const deletePromises = response.data.data.transactions.map(transaction =>
        axios.delete(`${BASE_URL}/transactions/${transaction._id}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ Cleared ${response.data.data.transactions.length} existing transactions`);
    } else {
      console.log('✅ No existing transactions to clear');
    }
  } catch (error) {
    console.error('❌ Failed to clear transactions:', error.response?.data || error.message);
  }
}

// Test CSV import accuracy
async function testCSVImportAccuracy() {
  try {
    console.log('\n📊 Testing CSV Import Accuracy...');
    
    const form = new FormData();
    const csvPath = path.join(__dirname, '../test-data/test-transactions.csv');
    form.append('csvFile', fs.createReadStream(csvPath));

    const response = await axios.post(`${BASE_URL}/transactions/import`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('📄 Import Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      return {
        imported: response.data.data.imported,
        errors: response.data.data.errors,
        errorDetails: response.data.data.errorDetails
      };
    }
    return { imported: 0, errors: 0, errorDetails: [] };
  } catch (error) {
    console.error('❌ CSV import failed:', error.response?.data || error.message);
    return { imported: 0, errors: 0, errorDetails: [] };
  }
}

// Verify specific transaction data accuracy
async function verifyTransactionAccuracy() {
  try {
    console.log('\n🔍 Verifying transaction data accuracy...');
    
    const response = await axios.get(`${BASE_URL}/transactions?limit=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.data.success) {
      const transactions = response.data.data.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log('\n📋 Uploaded Transactions:');
      transactions.forEach((tx, index) => {
        console.log(`${index + 1}. ${tx.date.split('T')[0]} | ${tx.type.toUpperCase()} | ${tx.fromAmount} ${tx.fromAsset} → ${tx.toAmount} ${tx.toAsset} | $${tx.price} | ${tx.exchange}`);
      });

      // Check specific data points
      const btcBuy = transactions.find(tx => tx.type === 'buy' && tx.toAsset === 'BTC');
      const btcSell = transactions.find(tx => tx.type === 'sell' && tx.fromAsset === 'BTC');
      const ethTrade = transactions.find(tx => tx.type === 'trade' && tx.toAsset === 'ETH');
      
      let accuracyChecks = 0;
      let totalChecks = 0;

      // Verify BTC buy transaction
      if (btcBuy) {
        totalChecks += 6;
        console.log('\n✅ BTC Buy Transaction Found:');
        if (btcBuy.fromAmount === 10000) { console.log('   ✅ fromAmount: $10,000'); accuracyChecks++; } else { console.log(`   ❌ fromAmount: Expected 10000, got ${btcBuy.fromAmount}`); }
        if (btcBuy.toAmount === 0.4) { console.log('   ✅ toAmount: 0.4 BTC'); accuracyChecks++; } else { console.log(`   ❌ toAmount: Expected 0.4, got ${btcBuy.toAmount}`); }
        if (btcBuy.price === 25000) { console.log('   ✅ price: $25,000'); accuracyChecks++; } else { console.log(`   ❌ price: Expected 25000, got ${btcBuy.price}`); }
        if (btcBuy.fees === 25) { console.log('   ✅ fees: $25'); accuracyChecks++; } else { console.log(`   ❌ fees: Expected 25, got ${btcBuy.fees}`); }
        if (btcBuy.exchange === 'Coinbase') { console.log('   ✅ exchange: Coinbase'); accuracyChecks++; } else { console.log(`   ❌ exchange: Expected Coinbase, got ${btcBuy.exchange}`); }
        if (btcBuy.date.includes('2024-01-15')) { console.log('   ✅ date: 2024-01-15'); accuracyChecks++; } else { console.log(`   ❌ date: Expected 2024-01-15, got ${btcBuy.date}`); }
      }

      // Verify BTC sell transaction
      if (btcSell) {
        totalChecks += 6;
        console.log('\n✅ BTC Sell Transaction Found:');
        if (btcSell.fromAmount === 0.2) { console.log('   ✅ fromAmount: 0.2 BTC'); accuracyChecks++; } else { console.log(`   ❌ fromAmount: Expected 0.2, got ${btcSell.fromAmount}`); }
        if (btcSell.toAmount === 5200) { console.log('   ✅ toAmount: $5,200'); accuracyChecks++; } else { console.log(`   ❌ toAmount: Expected 5200, got ${btcSell.toAmount}`); }
        if (btcSell.price === 26000) { console.log('   ✅ price: $26,000'); accuracyChecks++; } else { console.log(`   ❌ price: Expected 26000, got ${btcSell.price}`); }
        if (btcSell.fees === 20) { console.log('   ✅ fees: $20'); accuracyChecks++; } else { console.log(`   ❌ fees: Expected 20, got ${btcSell.fees}`); }
        if (btcSell.exchange === 'Binance') { console.log('   ✅ exchange: Binance'); accuracyChecks++; } else { console.log(`   ❌ exchange: Expected Binance, got ${btcSell.exchange}`); }
        if (btcSell.date.includes('2024-02-20')) { console.log('   ✅ date: 2024-02-20'); accuracyChecks++; } else { console.log(`   ❌ date: Expected 2024-02-20, got ${btcSell.date}`); }
      }

      const accuracyPercentage = totalChecks > 0 ? (accuracyChecks / totalChecks * 100).toFixed(1) : '0';
      console.log(`\n📊 Data Accuracy: ${accuracyChecks}/${totalChecks} (${accuracyPercentage}%)`);
      
      return { 
        transactions: transactions.length, 
        accuracyChecks, 
        totalChecks, 
        accuracyPercentage 
      };
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data || error.message);
    return { transactions: 0, accuracyChecks: 0, totalChecks: 0, accuracyPercentage: '0' };
  }
}

// Test error handling with invalid CSV
async function testErrorHandling() {
  try {
    console.log('\n🚫 Testing error handling with invalid data...');
    
    const form = new FormData();
    const csvPath = path.join(__dirname, '../test-data/test-transactions-invalid.csv');
    form.append('csvFile', fs.createReadStream(csvPath));

    const response = await axios.post(`${BASE_URL}/transactions/import`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success && response.data.data.errorDetails) {
      console.log(`✅ Correctly caught ${response.data.data.errors} validation errors:`);
      response.data.data.errorDetails.forEach((error, index) => {
        console.log(`   ${index + 1}. Row ${error.row}: ${error.error}`);
      });
      return response.data.data.errors;
    }
    return 0;
  } catch (error) {
    console.error('❌ Error handling test failed:', error.response?.data || error.message);
    return 0;
  }
}

// Main test function
async function runComprehensiveCSVTest() {
  console.log('🎯 TaxBridge CSV Reading Accuracy Test');
  console.log('=' * 50);
  
  // Step 1: Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    console.log('❌ Test failed - Could not authenticate');
    return;
  }
  
  // Step 2: Clear existing data
  await clearExistingTransactions();
  
  // Step 3: Test CSV import
  const importResult = await testCSVImportAccuracy();
  
  // Step 4: Verify data accuracy
  const verificationResult = await verifyTransactionAccuracy();
  
  // Step 5: Test error handling
  const errorsCaught = await testErrorHandling();
  
  // Final report
  console.log('\n' + '=' * 50);
  console.log('📋 COMPREHENSIVE TEST RESULTS');
  console.log('=' * 50);
  console.log(`📥 Transactions imported: ${importResult.imported}/7`);
  console.log(`🔍 Data accuracy: ${verificationResult.accuracyPercentage}%`);
  console.log(`🚫 Validation errors caught: ${errorsCaught}/5`);
  console.log(`💾 Total transactions in DB: ${verificationResult.transactions}`);
  
  // Overall assessment
  const importSuccess = importResult.imported === 7;
  const dataAccurate = parseFloat(verificationResult.accuracyPercentage) >= 95;
  const errorHandling = errorsCaught >= 4; // Should catch at least 4/5 errors
  
  if (importSuccess && dataAccurate && errorHandling) {
    console.log('\n🎉 CSV READING TEST: ✅ PASSED');
    console.log('Your CSV processing is highly accurate and reliable!');
    console.log('✅ Import functionality works correctly');
    console.log('✅ Data parsing is accurate');  
    console.log('✅ Error validation is robust');
  } else {
    console.log('\n⚠️  CSV READING TEST: ❌ NEEDS IMPROVEMENT');
    if (!importSuccess) console.log('❌ Import count mismatch');
    if (!dataAccurate) console.log('❌ Data accuracy below 95%');
    if (!errorHandling) console.log('❌ Error handling needs improvement');
  }
  
  console.log('\n🚀 Ready for hackathon demonstration!');
}

// Run the comprehensive test
runComprehensiveCSVTest().catch(console.error);
