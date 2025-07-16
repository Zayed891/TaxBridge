"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Upload, 
  Shield, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  BarChart3,
  Download,
  Menu,
  X
} from "lucide-react";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 relative">
        <div className="container mx-auto px-6 lg:px-8 h-20 flex items-center">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-inter tracking-tight leading-none">
                  TaxBridge
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  CRYPTO TAX CALCULATOR
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/demo">
                <Button variant="ghost" className="font-medium">Live Demo</Button>
              </Link>
              <Link href="/auth">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <>
            {/* Full Screen Backdrop for Mobile Menu */}
            <div 
              className="md:hidden fixed inset-0 bg-black/10 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Content */}
            <div className="md:hidden absolute top-full left-0 right-0 z-50">
              <div className="container mx-auto px-6 py-4">
                <Card 
                  className="border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-900/95 animate-in slide-in-from-top-2 duration-200 relative z-50"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                        🚀 Open Source
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                      <button 
                        className="px-8 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 w-48 cursor-pointer rounded-md border border-transparent bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Live Demo clicked');
                          setIsMobileMenuOpen(false);
                          setTimeout(() => router.push('/demo'), 100);
                        }}
                      >
                        Live Demo
                      </button>
                      <button 
                        className="px-8 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 w-48 cursor-pointer rounded-md border border-transparent bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Sign In clicked');
                          setIsMobileMenuOpen(false);
                          setTimeout(() => router.push('/auth'), 100);
                        }}
                      >
                        Sign In
                      </button>
                      <button 
                        className="px-8 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-48 cursor-pointer rounded-md text-white transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Get Started clicked');
                          setIsMobileMenuOpen(false);
                          setTimeout(() => router.push('/auth'), 100);
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            🎯 Calculate Crypto Taxes in Seconds
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight pb-2 font-inter tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent block">
              Stop Overpaying Crypto Taxes
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-xl text-slate-600 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed font-inter font-medium max-w-3xl mx-auto px-2">
            Upload your transactions, choose your method (FIFO/LIFO/Average), and discover 
            <span className="font-semibold text-blue-600"> real tax savings</span> across 
            <span className="font-semibold"> 4 countries</span>. Professional-grade calculations, simplified.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-stretch sm:items-center mb-10 md:mb-12 px-4 sm:px-2">
            <Link href="/dashboard" className="w-4/5 max-w-xs mx-auto sm:mx-0 sm:w-auto sm:flex-1 sm:max-w-xs lg:max-w-sm">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 md:px-8 md:py-3 text-sm md:text-base w-full sm:w-full lg:w-auto lg:min-w-64">
                Start Calculating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo" className="w-4/5 max-w-xs mx-auto sm:mx-0 sm:w-auto sm:flex-1 sm:max-w-xs lg:max-w-sm">
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2 sm:px-6 md:px-8 md:py-3 text-sm md:text-base w-full sm:w-full lg:w-auto lg:min-w-64">
                View Live Demo
              </Button>
            </Link>
            <div className="w-4/5 max-w-xs mx-auto sm:mx-0 sm:w-auto sm:flex-1 sm:max-w-xs lg:max-w-sm">
              <Button variant="outline" size="sm" className="px-4 py-2 sm:px-6 md:px-8 md:py-3 text-sm md:text-base w-full sm:w-full lg:w-auto lg:min-w-64">
                <Download className="mr-2 h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-2">
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">$2.8M+</div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Tax Savings Identified</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Transactions Processed</div>
            </div>
            <div className="text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Countries Supported</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4 sm:px-6 md:px-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Upload className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Smart CSV Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Drag & drop CSV files from Coinbase, Binance, Kraken, or custom formats. 
                Automatic validation and error detection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Calculator className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Multiple Tax Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Compare FIFO, LIFO, and Average Cost methods side-by-side. 
                Find the method that saves you the most money.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Globe className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Global Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Accurate tax calculations for US, UK, Canada, and Australia. 
                Updated with 2024 tax rates and regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Visual Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Professional PDF reports, detailed breakdowns, and interactive charts. 
                Export in multiple formats.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Bank-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Your data is encrypted and secure. No personal information stored. 
                Open source and transparent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Get your tax calculations in seconds, not hours. 
                Real-time processing with detailed explanations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white mx-4 sm:mx-6 md:mx-8">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-3 sm:mb-4 font-inter tracking-tight">
            Ready to Optimize Your Crypto Taxes?
          </h2>
          <p className="text-lg sm:text-xl md:text-xl mb-6 sm:mb-8 text-blue-100">
            Join thousands of crypto investors who have saved money with TaxBridge
          </p>
          <Link href="/dashboard">
            <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base">
              Start Your Free Calculation
              <ArrowRight className="ml-1 sm:ml-2 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-6 md:gap-8">
            <div className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 text-center max-w-sm sm:max-w-none">
              <span className="block sm:inline">Built for the hackathon</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline">Open Source</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline">Professional Grade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
