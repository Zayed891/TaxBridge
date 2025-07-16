"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  Upload, 
  BarChart3, 
  FileText, 
  Settings, 
  User,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statsData] = useState({
    totalTransactions: 0,
    lastCalculation: null,
    taxSavings: 0,
    country: "US"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md dark:bg-slate-900/90 shadow-sm">
        <div className="container mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl shadow-lg">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-inter tracking-tight">
                TaxBridge
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
                DASHBOARD
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
              🎯 Tax Optimization Hub
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-inter tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Welcome back! 👋
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ready to optimize your crypto taxes? Start by uploading your transaction history and discover your potential savings.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {statsData.totalTransactions}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    ${statsData.taxSavings.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Potential Savings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {statsData.lastCalculation ? "FIFO" : "—"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Best Method
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    2024
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Tax Year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* CSV Upload Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 hover:shadow-3xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Import Transactions
                </span>
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Upload your CSV file from exchanges like Coinbase, Binance, or Kraken and let our AI validate your data automatically.
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 cursor-pointer group">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mt-2" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Drag & drop your CSV file
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-base">
                  or click to browse files
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Choose File
                </Button>
              </div>
              
              {uploadProgress > 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span className="font-medium">Uploading...</span>
                    <span className="font-bold">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="space-y-2 text-sm">
                  <p className="flex items-center text-green-700 dark:text-green-300 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Supported: Coinbase, Binance, Kraken, Custom Formats
                  </p>
                  <p className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 font-semibold">
                      Download sample CSV template
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Calculator Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 hover:shadow-3xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  Calculate Taxes
                </span>
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Compare different calculation methods and find the optimal tax strategy to maximize your savings.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-800 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      Ready to Calculate
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Upload transactions first to enable advanced tax calculations and optimization strategies.
                  </p>
                  <Button 
                    disabled={statsData.totalTransactions === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Calculation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-200">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2 tracking-wide">FIFO</p>
                    <p className="text-2xl font-bold text-blue-600">—</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-200">
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 tracking-wide">LIFO</p>
                    <p className="text-2xl font-bold text-purple-600">—</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-200">
                    <p className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-2 tracking-wide">AVG</p>
                    <p className="text-2xl font-bold text-orange-600">—</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tax Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Generate professional PDF reports for your accountant or tax filing with detailed breakdowns and compliance data.
              </p>
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 py-3 font-medium transition-all duration-300" disabled>
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                View, edit, and manage all your imported cryptocurrency transactions with smart categorization and validation.
              </p>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 py-3 font-medium transition-all duration-300" disabled>
                View Transactions
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Configure your country, tax year, and calculation preferences to get the most accurate results.
              </p>
              <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 py-3 font-medium transition-all duration-300">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
