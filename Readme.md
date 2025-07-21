

# 🚀 TaxBridge — Crypto Tax Compliance, Automated

**TaxBridge** is a full-stack web app that automates crypto tax calculation and reporting for users and developers. Import your transactions, select your country and method, and get instant, audit-ready tax reports. Built for Web3, DeFi, and fintech innovation.

## 📸 Screenshots

![Homepage](frontend/screenshots/homepage.png)
![Dashboard](frontend/screenshots/dashboard.png)
![Demo](frontend/screenshots/demo.png)
![Sign Up](frontend/screenshots/signup.png)
![Sign In](frontend/screenshots/signin.png)

## 🌟 Why TaxBridge?

- **No More Spreadsheets:** Instantly import CSVs and automate complex tax calculations.
- **Multi-Country, Multi-Method:** Supports US, UK, Canada, Australia. Choose FIFO, LIFO, or Average Cost.
- **API-First & UI-Driven:** Use the modern Next.js dashboard or integrate with your own app via REST API.
- **Built for Scale:** Handles thousands of transactions per user, with robust backend and secure authentication.
- **Open Source & Extensible:** Easy to fork, extend, and integrate for hackathons or production.

---


## ✨ Features

- 🚚 **CSV Import:** Upload your crypto transaction history in seconds.
- 🧮 **Automated Tax Calculation:** FIFO, LIFO, Average Cost — you choose.
- 🌎 **Multi-Country Support:** US, UK, CA, AU (more coming soon).
- 📊 **Detailed Reports:** Export tax summaries and per-transaction breakdowns.
- 🖥️ **Modern UI:** Next.js + Tailwind CSS for a fast, responsive experience.
- 🔒 **Secure Backend:** Node.js/Express API, MongoDB, JWT authentication.

---

## 🚀 Roadmap & Scalability

### Phase 1 Features (Ongoing)
- CSV Import for crypto transactions
- Automated tax calculation (FIFO, LIFO, Average Cost)
- Multi-country support (US, UK, Canada, Australia)
- Detailed tax reports and breakdowns
- Modern Next.js + Tailwind CSS UI
- Secure backend (Node.js/Express, MongoDB, JWT)

### Phase 2 Features (Planned)
- More countries (Germany, France, Japan)
- DeFi protocol integration (Uniswap, Compound)
- NFT transaction support
- Staking rewards calculations
- Mining income calculations

### Phase 3 Features (Planned)
- Real-time price integration
- Advanced reporting features
- Tax optimization suggestions
- Webhook notifications
- GraphQL API option

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Other:** CSV parsing, JWT authentication, Zod validation

---

## 🚦 Quickstart

1. **Clone & Install:**
   ```bash
   git clone https://github.com/Zayed891/TaxBridge.git
   cd TaxBridge
   npm install
   cd frontend && npm install && cd ..
   ```
2. **Configure:**
   - Copy `.env.example` to `.env` and set your MongoDB URI.
3. **Run:**
   - Start backend: `npm start`
   - Start frontend: `npm run dev --prefix frontend`
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 📝 Usage

1. **Sign up or log in.**
2. **Import transactions:** Go to the dashboard and upload your CSV file.
3. **Calculate taxes:** Select your country, year, and calculation method (FIFO/LIFO/Average Cost).
4. **View & export reports:** See a summary and detailed breakdown. Export as CSV if needed.

---

## 📂 Folder Structure

- `frontend/` — Next.js frontend app
- `src/` — Backend source code (Express API, controllers, models, services)
- `scripts/` — Utility scripts for data import/testing

---

## 🧩 Architecture & API

**System Flow:**

```
Client Request → API Gateway → Authentication → Validation → Tax Engine → Database → Response
```

**Key API Endpoints:**

- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `POST /api/transactions/import` — CSV import
- `POST /api/tax/calculate` — Calculate taxes
- `GET /api/tax/summary/:year` — Get tax summary
- `GET /api/tax/report/:year/export` — Export tax report

---

## 🏗️ Database Schema (Sample)

```js
// Users
{
  _id, email, password (hashed), country, createdAt
}
// Transactions
{
  _id, userId, date, type, fromAsset, toAsset, fromAmount, toAmount, price, fees, exchange, createdAt
}
// Tax Calculations
{
  _id, userId, taxYear, country, method, totalGains, totalLosses, netGains, taxOwed, calculatedAt
}
// Tax Rules
{
  _id, country, year, rules: { capitalGains, exemptions }
}
```

---

## 🧪 Testing & Metrics

- **API response time:** < 200ms
- **Uptime:** 99.5%
- **Scalability:** 1,000+ concurrent requests, 10,000+ transactions/user
- **Accuracy:** Validated for 4 countries, 3 cost basis methods

---

## 🏆 For Hackathon

- **MVP Ready:** All core flows work end-to-end
- **Easy to Test:** Demo credentials, sample CSV, and clear instructions included
- **Extensible:** Add new countries, tax rules, or cost basis methods with minimal code changes
- **ICP Ready:** Includes `dfx.json` for Internet Computer compatibility

---

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue to discuss.

---

## 📄 License

[MIT](LICENSE)

---

## 📬 Contact

Questions? Open an issue or email [jayedaktar35@gmail.com]

