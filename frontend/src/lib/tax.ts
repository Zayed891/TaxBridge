import { api } from '@/lib/api';

// Types
export interface TaxCalculationRequest {
  taxYear: number;
  country: 'US' | 'UK' | 'CA' | 'AU';
  method: 'FIFO' | 'LIFO' | 'AVERAGE_COST';
  transactions?: string[]; // Transaction IDs, if not provided uses all transactions
}

export interface TaxCalculationResult {
  summary: {
    totalGain: number;
    totalLoss: number;
    netGain: number;
    taxOwed: number;
    effectiveRate: number;
  };
  breakdown: {
    shortTermGains: number;
    longTermGains: number;
    shortTermLosses: number;
    longTermLosses: number;
  };
  transactions: Array<{
    id: string;
    asset: string;
    type: string;
    gain: number;
    isShortTerm: boolean;
    holdingPeriod: number;
  }>;
  metadata: {
    year: number;
    country: string;
    method: string;
    calculatedAt: string;
    transactionCount: number;
  };
}

export interface TaxSummary {
  year: number;
  country: string;
  method: string;
  totalGain: number;
  totalLoss: number;
  netGain: number;
  taxOwed: number;
  effectiveRate: number;
  createdAt: string;
}

export interface TaxRules {
  country: string;
  year: number;
  shortTermRate: number;
  longTermRate: number;
  holdingPeriodDays: number;
  exemptionAmount: number;
  currency: string;
}

export interface SupportedCountriesAndMethods {
  countries: Array<{
    code: string;
    name: string;
    currency: string;
  }>;
  methods: Array<{
    code: string;
    name: string;
    description: string;
  }>;
}

// Tax Service
export class TaxService {
  // Calculate taxes for a specific year
  static async calculateTaxes(request: TaxCalculationRequest) {
    return api.post<TaxCalculationResult>('/api/tax/calculate', request);
  }

  // Get tax summary for a year
  static async getTaxSummary(year: number) {
    return api.get<TaxSummary[]>(`/api/tax/summary/${year}`);
  }

  // Export tax report
  static async exportTaxReport(year: number, format: 'pdf' | 'csv' = 'pdf') {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/tax/report/${year}/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    // Handle file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-report-${year}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  }

  // Get tax rules for a country and year
  static async getTaxRules(country: string, year: number) {
    return api.get<TaxRules>(`/api/tax/rules/${country}/${year}`);
  }

  // Get supported countries and methods
  static async getSupportedCountriesAndMethods() {
    return api.get<SupportedCountriesAndMethods>('/api/tax/info');
  }

  // Compare different calculation methods
  static async compareCalculationMethods(year: number, country: string) {
    const methods = ['FIFO', 'LIFO', 'AVERAGE_COST'];
    const comparisons = await Promise.all(
      methods.map(async (method) => {
        const result = await this.calculateTaxes({
          taxYear : year,
          country: country as any,
          method: method as any,
        });
        return {
          method,
          ...result,
        };
      })
    );

    return {
      success: true,
      data: comparisons,
    };
  }
}

export default TaxService;
