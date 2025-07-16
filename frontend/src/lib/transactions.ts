import { api } from '@/lib/api';

// Types
export interface Transaction {
  _id: string;
  userId: string;
  date: string;
  type: 'buy' | 'sell' | 'trade' | 'mining' | 'staking';
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  fees: number;
  exchange: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  date: string;
  type: 'buy' | 'sell' | 'trade' | 'mining' | 'staking';
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  fees: number;
  exchange: string;
}

export interface ImportResult {
  imported: number;
  errors: number;
  errorDetails: Array<{
    row: number;
    error: string;
  }>;
}

// Transaction Service
export class TransactionService {
  // Get all transactions for current user
  static async getTransactions() {
    return api.get<Transaction[]>('/api/transactions');
  }

  // Add new transaction
  static async addTransaction(transaction: TransactionInput) {
    return api.post<Transaction>('/api/transactions', transaction);
  }

  // Update transaction
  static async updateTransaction(id: string, transaction: Partial<TransactionInput>) {
    return api.put<Transaction>(`/api/transactions/${id}`, transaction);
  }

  // Delete transaction
  static async deleteTransaction(id: string) {
    return api.delete(`/api/transactions/${id}`);
  }

  // Import transactions from CSV file
  static async importFromCSV(file: File) {
    const formData = new FormData();
    formData.append('csvFile', file);
    
    return api.postFormData<ImportResult>('/api/transactions/import', formData);
  }

  // Get transaction statistics
  static async getTransactionStats() {
    return api.get('/api/transactions/stats');
  }
}

export default TransactionService;
