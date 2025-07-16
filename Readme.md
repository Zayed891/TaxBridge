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
- The frontend will be available at [http://localhost:3001](http://localhost:3001) (or another port if 3000 is in use).

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
For questions or support, open an issue or contact the maintainer at jayedaktar35@gmail.com.
