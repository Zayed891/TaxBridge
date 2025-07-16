<<<<<<< HEAD
# TaxBridge (ChainTax)

A full-stack web application for cryptocurrency tax calculation and reporting. Easily import your crypto transactions, calculate your tax liability using FIFO, LIFO, or Average Cost methods, and export detailed tax reports.

## Features
- **CSV Import:** Upload your crypto transaction history in CSV format.
- **Automated Tax Calculation:** Supports FIFO, LIFO, and Average Cost methods for multiple countries (US, UK, CA, AU).
- **Detailed Reports:** View and export tax summaries and per-transaction breakdowns.
- **Modern UI:** Built with Next.js and Tailwind CSS for a fast, responsive experience.
- **Secure Backend:** Node.js/Express API with MongoDB for data storage.

## Tech Stacks
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Other:** CSV parsing, JWT authentication

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation
1. **Clone the repository:**
   ```bash
   git clone git@github.com:Zayed891/TaxBridge.git
   cd TaxBridge
   ```
2. **Install backend dependencies:**
   ```bash
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the root and fill in your MongoDB URI and other secrets.

### Running the App
- **Start the backend:**
  ```bash
  npm start
  ```
- **Start the frontend:**
  ```bash
  npm run dev --prefix frontend
  ```
- The frontend will be available at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is in use).

## Usage
1. **Sign up or log in.**
2. **Import your transactions:** Go to the dashboard and upload your CSV file.
3. **Calculate taxes:** Select your country, year, and calculation method (FIFO/LIFO/Average Cost).
4. **View and export reports:** See a summary and detailed breakdown. Export as CSV if needed.

## Folder Structure
- `frontend/` — Next.js frontend app
- `src/` — Backend source code (Express API, controllers, models, services)
- `scripts/` — Utility scripts for data import/testing

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

## Contact
For questions or support, open an issue or contact the maintainer at [your-email@example.com].
=======
# TaxBridge - Crypto Tax Compliance API

## Project Overview

**TaxBridge** is a RESTful API that automates cryptocurrency tax calculations for multiple countries, enabling Web3 applications to integrate tax compliance features seamlessly. It processes crypto transaction data and generates accurate tax reports following country-specific regulations.

## Problem Statement

### The Problem
- **Manual Tax Calculations**: Crypto traders spend hours manually calculating capital gains/losses
- **Complex Tax Rules**: Different countries have different tax regulations (holding periods, rates, exemptions)
- **Multiple Exchanges**: Users trade across different platforms, making consolidation difficult
- **Web3 Adoption Barrier**: Tax compliance complexity prevents mainstream crypto adoption
- **Developer Pain**: Web3 apps lack infrastructure to offer tax compliance features

### Target Users
- **Primary**: Web3 developers building wallets, DeFi apps, portfolio trackers
- **Secondary**: Crypto traders, tax professionals, compliance teams
- **Tertiary**: Traditional fintech apps adding crypto features

## Solution: TaxBridge API

### Core Value Proposition
"The tax compliance infrastructure that Web3 applications need to help users stay compliant across multiple countries"

### Key Features
1. **Multi-Country Tax Calculations** (US, UK, Canada, Australia)
2. **Multiple Cost Basis Methods** (FIFO, LIFO, Average Cost)
3. **Transaction Import/Export** (CSV, JSON formats)
4. **Real-time Tax Calculations** via API endpoints
5. **Detailed Tax Reports** with breakdown by transaction type
6. **Developer-Friendly** JSON API responses

## Technical Architecture

### Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB for transaction storage
- **Authentication**: JWT tokens
- **Validation**: Zod for input validation
- **Security**: bcrypt for password hashing
- **File Processing**: multer for CSV uploads
- **External APIs**: CoinGecko for historical crypto prices

### System Architecture
```
Client Request → API Gateway → Authentication → Validation → Tax Engine → Database → Response
```

### Database Schema
```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  country: String,
  createdAt: Date
}

// Transactions Collection
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  type: String, // 'buy', 'sell', 'trade', 'mining', 'staking'
  fromAsset: String,
  toAsset: String,
  fromAmount: Number,
  toAmount: Number,
  price: Number,
  fees: Number,
  exchange: String,
  createdAt: Date
}

// Tax Calculations Collection
{
  _id: ObjectId,
  userId: ObjectId,
  taxYear: Number,
  country: String,
  method: String, // 'FIFO', 'LIFO', 'AVERAGE_COST'
  totalGains: Number,
  totalLosses: Number,
  netGains: Number,
  taxOwed: Number,
  calculatedAt: Date
}

// Tax Rules Collection
{
  _id: ObjectId,
  country: String,
  year: Number,
  rules: {
    capitalGains: {
      shortTerm: { threshold: Number, taxRate: Number },
      longTerm: { threshold: Number, taxRate: Number }
    },
    exemptions: {
      annualExemption: Number,
      minTaxableAmount: Number
    }
  }
}
```

## Implementation Steps

### Phase 1: Foundation (Days 1-3)
**Goal**: Set up basic API structure with authentication

#### Step 1.1: Project Setup
```bash
# Initialize project
npm init -y
npm install express mongoose bcryptjs jsonwebtoken zod cors helmet morgan dotenv multer csv-parser
npm install --save-dev nodemon jest supertest
```

#### Step 1.2: Create Project Structure
```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   └── taxController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── TaxRule.js
├── routes/
│   ├── auth.js
│   ├── transactions.js
│   └── tax.js
├── services/
│   ├── taxCalculator.js
│   └── priceService.js
├── utils/
│   ├── csvParser.js
│   └── validators.js
└── server.js
```

#### Step 1.3: Authentication System
- User registration/login endpoints
- JWT token generation and validation
- Password hashing with bcrypt
- Protected route middleware

### Phase 2: Transaction Management (Days 4-6)
**Goal**: Build transaction import and management system

#### Step 2.1: Transaction Schema & Validation
```javascript
// Zod validation schema
const TransactionSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  type: z.enum(['buy', 'sell', 'trade', 'mining', 'staking']),
  fromAsset: z.string(),
  toAsset: z.string(),
  fromAmount: z.number().positive(),
  toAmount: z.number().positive(),
  price: z.number().positive(),
  fees: z.number().min(0),
  exchange: z.string()
});
```

#### Step 2.2: CSV Import System
- File upload endpoint using multer
- CSV parsing and validation
- Bulk transaction insertion
- Error handling for invalid data

#### Step 2.3: Transaction CRUD Operations
- GET /api/transactions - List user transactions
- POST /api/transactions - Add single transaction
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction
- POST /api/transactions/import - CSV import

### Phase 3: Tax Calculation Engine (Days 7-10)
**Goal**: Implement core tax calculation logic

#### Step 3.1: Tax Rules Configuration
```javascript
// Tax rules for different countries
const TAX_RULES = {
  US: {
    capitalGains: {
      shortTerm: { threshold: 365, taxRate: 0.22 },
      longTerm: { threshold: 365, taxRate: 0.15 }
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  },
  UK: {
    capitalGains: {
      shortTerm: { threshold: 0, taxRate: 0.20 },
      longTerm: { threshold: 0, taxRate: 0.20 }
    },
    exemptions: { annualExemption: 6000, minTaxableAmount: 0 }
  },
  CA: {
    capitalGains: {
      shortTerm: { threshold: 0, taxRate: 0.50 },
      longTerm: { threshold: 0, taxRate: 0.50 }
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  },
  AU: {
    capitalGains: {
      shortTerm: { threshold: 365, taxRate: 0.45 },
      longTerm: { threshold: 365, taxRate: 0.225 }
    },
    exemptions: { annualExemption: 0, minTaxableAmount: 0 }
  }
};
```

#### Step 3.2: Cost Basis Calculation Methods
```javascript
// FIFO (First In, First Out) implementation
class FIFOCalculator {
  calculateGains(sellTransaction, purchases) {
    // Implementation for FIFO cost basis calculation
  }
}

// LIFO (Last In, First Out) implementation
class LIFOCalculator {
  calculateGains(sellTransaction, purchases) {
    // Implementation for LIFO cost basis calculation
  }
}

// Average Cost implementation
class AverageCostCalculator {
  calculateGains(sellTransaction, purchases) {
    // Implementation for average cost calculation
  }
}
```

#### Step 3.3: Tax Calculation Service
```javascript
class TaxCalculatorService {
  async calculateTax(userId, taxYear, country, method) {
    // 1. Get user transactions for tax year
    // 2. Apply cost basis method (FIFO/LIFO/Average)
    // 3. Calculate capital gains/losses
    // 4. Apply country-specific tax rules
    // 5. Generate tax summary
  }
}
```

### Phase 4: API Endpoints (Days 11-12)
**Goal**: Create comprehensive API endpoints

#### Step 4.1: Tax Calculation Endpoints
```javascript
// POST /api/tax/calculate
{
  "taxYear": 2024,
  "country": "US",
  "method": "FIFO"
}

// GET /api/tax/summary/:year
// GET /api/tax/report/:year/export
// GET /api/tax/rules/:country/:year
```

#### Step 4.2: Response Format Standardization
```javascript
// Success response format
{
  "success": true,
  "data": {
    "taxYear": 2024,
    "country": "US",
    "method": "FIFO",
    "summary": {
      "totalGains": 12500.00,
      "totalLosses": -3200.00,
      "netGains": 9300.00,
      "taxOwed": 1395.00,
      "effectiveRate": 0.15
    },
    "breakdown": {
      "shortTermGains": 5000.00,
      "longTermGains": 4300.00,
      "transactions": [...]
    }
  }
}

// Error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid transaction data",
    "details": [...]
  }
}
```

### Phase 5: Testing & Documentation (Days 13-15)
**Goal**: Ensure reliability and create comprehensive documentation

#### Step 5.1: Testing Suite
- Unit tests for tax calculation logic
- Integration tests for API endpoints
- Test data for different scenarios
- Edge case testing

#### Step 5.2: API Documentation
- Comprehensive endpoint documentation
- Request/response examples
- Authentication guide
- Error code reference

#### Step 5.3: Demo Preparation
- Sample transaction data for each country
- Postman collection for API testing
- Demo script showcasing key features

## API Endpoints Overview

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Token refresh

### Transactions
- GET /api/transactions - List transactions
- POST /api/transactions - Add transaction
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction
- POST /api/transactions/import - CSV import

### Tax Calculations
- POST /api/tax/calculate - Calculate taxes
- GET /api/tax/summary/:year - Get tax summary
- GET /api/tax/report/:year/export - Export tax report
- GET /api/tax/rules/:country/:year - Get tax rules

### Utility
- GET /api/health - Health check
- GET /api/docs - API documentation

## Success Metrics

### Technical Metrics
- API response time < 200ms
- 99.5% uptime
- Handles 1000+ concurrent requests
- Supports 10,000+ transactions per user

### Business Metrics
- Accurate tax calculations for 4 countries
- Support for 3 cost basis methods
- CSV import/export functionality
- Developer-friendly JSON API

## Deployment Strategy

### Environment Setup
- Development: Local MongoDB, Node.js server
- Production: MongoDB Atlas, Railway/Render deployment
- Environment variables for API keys and secrets

### Monitoring & Logging
- Request/response logging
- Error tracking and alerting
- Performance monitoring
- API usage analytics

## Demo Script

### Demo Flow
1. **User Registration** - Create account via API
2. **Transaction Import** - Upload CSV file with crypto transactions
3. **Tax Calculation** - Calculate taxes for US, UK, Canada
4. **Report Generation** - Export tax summary in JSON/CSV
5. **Different Methods** - Show FIFO vs LIFO differences
6. **Multi-Country** - Same transactions, different tax outcomes

### Key Talking Points
- "Solves real Web3 adoption barrier"
- "Enables other developers to build compliant apps"
- "Handles complex tax calculations automatically"
- "Supports multiple countries and methods"
- "Clean, developer-friendly API"


>>>>>>> 2d206ce0b01270aa36df786e34f391284c44c1b4
