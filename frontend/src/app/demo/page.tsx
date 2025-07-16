"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input-client";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, TrendingUp, BarChart3, ArrowLeft, Home, Sparkles, Shield, Globe } from "lucide-react";
import CSVUpload from "@/components/CSVUpload";
import { AuthService } from "@/lib/auth";
import { TaxService, TaxCalculationResult } from "@/lib/tax";
import { TransactionService } from "@/lib/transactions";

interface TaxResult {
  totalGainLoss: number;
  taxOwed: number;
  effectiveRate: number;
  processedTransactions: number;
  method: string;
  country: string;
  breakdown?: {
    shortTermGains: number;
    longTermGains: number;
    shortTermLosses: number;
    longTermLosses: number;
  };
}

export default function DemoPage() {
  const [authToken, setAuthToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [taxResults, setTaxResults] = useState<TaxResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [selectedMethod, setSelectedMethod] = useState<string>("FIFO");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    // Don't auto-login on demo page to prevent loops
    if (authenticated) {
      console.log('User already authenticated for demo');
    }
  }, []);
  
  const handleLogin = async () => {
    try {
      const response = await AuthService.login({
        email: 'demo@taxbridge.com',
        password: 'demo123456'
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        setAuthToken(response.data?.token || '');
        console.log('Demo login successful');
        return true;
      } else {
        console.error('Demo login failed:', response.error?.message);
        alert('Demo login failed. Please try again or check if the backend is running.');
        return false;
      }
    } catch (error) {
      console.error('Demo login error:', error);
      alert('Unable to connect to server. Please check if the backend is running on port 3000.');
      return false;
    }
  };

  const handleCalculateTaxes = async () => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      // Show a message and try to authenticate
      setIsCalculating(true);
      const loginSuccess = await handleLogin();
      if (!loginSuccess) {
        setIsCalculating(false);
        return;
      }
    }

    setIsCalculating(true);
    try {
      const response = await TaxService.calculateTaxes({
        taxYear: selectedYear,
        country: selectedCountry as any,
        method: selectedMethod as any,
      });

      if (response.success && response.data) {
        const result = response.data;
        setTaxResults({
          totalGainLoss: result.summary.netGains,
          taxOwed: result.summary.taxOwed,
          effectiveRate: result.summary.effectiveRate,
          processedTransactions: result.metadata?.transactionCount ?? 0,
          method: result.metadata?.method ?? '',
          country: result.metadata?.country ?? '',
          breakdown: result.breakdown,
        });
      } else {
        console.error('Tax calculation failed:', response.error?.message);
        alert('Tax calculation failed: ' + (response.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Tax calculation error:', error);
      alert('Tax calculation failed. Please check your connection.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-800 overflow-hidden">
      {/* Enhanced Header with Back Button */}
      <nav className="border-b bg-white/90 backdrop-blur-md dark:bg-slate-900/90 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-inter tracking-tight leading-tight pb-0.5">
                  TaxBridge Demo
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
                  LIVE DEMONSTRATION
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300 hidden sm:flex items-center space-x-1 px-3 py-1.5 font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Live Demo</span>
            </Badge>
            <Badge variant="secondary" className="text-xs sm:hidden bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300">
              <Sparkles className="h-3 w-3" />
            </Badge>
            {isAuthenticated && (
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 text-xs flex items-center space-x-1 px-2 sm:px-3 py-1.5 font-semibold shadow-sm">
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline">Connected to API</span>
                <span className="sm:hidden">✓</span>
              </Badge>
            )}
            
            {/* Back to Home Button */}
            <div className="hidden sm:flex">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                  Back to Home
                </Button>
              </Link>
            </div>
            
            {/* Mobile Back to Home Button */}
            <div className="sm:hidden">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {isAuthenticated ? (
        <div className="h-[calc(100vh-64px)] overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* CSV Upload Section */}
            <div className="mb-4">
              <CSVUpload />
            </div>
            {/* Tax Calculation Section */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 mt-1 mb-0.5">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Tax Calculator
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Professional calculations
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 px-2 py-1 font-semibold text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Settings */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="taxYear" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Tax Year
                        </Label>
                        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-9 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>Country</span>
                        </Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-9 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">🇺🇸 US</SelectItem>
                            <SelectItem value="UK">🇬🇧 UK</SelectItem>
                            <SelectItem value="CA">🇨🇦 CA</SelectItem>
                            <SelectItem value="AU">🇦🇺 AU</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="method" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Method</span>
                      </Label>
                      <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                        <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-9 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIFO">📈 FIFO</SelectItem>
                          <SelectItem value="LIFO">📉 LIFO</SelectItem>
                          <SelectItem value="AVERAGE_COST">📊 Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2">
                      <Button 
                        onClick={handleCalculateTaxes} 
                        disabled={isCalculating}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                            <span>Calculating...</span>
                          </>
                        ) : (
                          <>
                            <Calculator className="h-3 w-3" />
                            <span>Calculate</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* Right Column - Results */}
                  {taxResults ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          Results
                        </h3>
                        <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-300 px-2 py-1 font-semibold text-xs">
                          {taxResults.method}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-md">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                                <DollarSign className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                  ${taxResults.totalGainLoss?.toLocaleString() ?? 'N/A'}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                  Gain/Loss
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-md">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                                <TrendingUp className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                  ${taxResults.taxOwed?.toLocaleString() ?? 'N/A'}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                  Tax Owed
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                                <BarChart3 className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                  {taxResults.processedTransactions?.toLocaleString() ?? '0'}
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                                  Transactions
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[150px]">
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-inner">
                          <Calculator className="h-6 w-6 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                            Click Calculate to see results
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto mt-8 mb-8">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 hover:shadow-3xl transition-all duration-300 mt-1 mb-0.5">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl shadow-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Connect to Backend
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Authenticate with the TaxBridge API to access live features
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center justify-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Demo Credentials</span>
                      </p>
                      <div className="space-y-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-mono bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                        <p><span className="font-semibold">Email:</span> demo@taxbridge.com</p>
                        <p><span className="font-semibold">Password:</span> demo123456</p>
                      </div>
                    </div>
                  </div>
                  {/* Authentication Status and rest of the card... */}
                  {/* ...existing code... */}
                  {!isAuthenticated && (
                    <Button 
                      onClick={handleLogin} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Connect to API</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
