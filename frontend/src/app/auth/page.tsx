"use client";

import { useState } from "react";
import { AuthService } from "@/lib/auth";
import { Button } from "@/components/ui/button-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input-client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { Calculator, ArrowRight, ArrowLeft, Mail, Lock, User, Globe, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<{ email: string; password: string; country: string }>({
    email: "",
    password: "",
    country: ""
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Attempt login
      const response = await AuthService.login({
        email: loginData.email,
        password: loginData.password,
      });
      if (response.success) {
        alert("Login successful!");
      } else {
        alert(response.error?.message || "Login failed");
      }
    } else {
      // Registration logic
      const response = await AuthService.register({
        name: registerData.email.split("@")[0],
        email: registerData.email,
        password: registerData.password,
        country: registerData.country,
      });
      if (response.success) {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      } else {
        alert(response.error?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 relative">
        <div className="container mx-auto px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-inter tracking-tight leading-none">
                  TaxBridge
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  CRYPTO TAX CALCULATOR
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                  Back to Home
                </Button>
              </Link>
              <Button 
                onClick={() => setIsLogin(!isLogin)}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 text-sm"
              >
                {isLogin ? "Join now! 🚀" : "Sign in! 👋"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Content */}
      <div className="flex items-center justify-center h-screen overflow-hidden relative" style={{ height: 'calc(100vh - 64px)', paddingTop: '4px', paddingBottom: '2px' }}>
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative z-10 px-4 sm:px-6 md:px-8">
          {/* Auth Card */}
          <Card className="border-0 shadow-2xl bg-transparent hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center pb-3 px-6 pt-5">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                  {isLogin ? (
                    <Lock className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-inter tracking-tight">
                {isLogin ? "Welcome Back! 👋" : "Join TaxBridge! 🚀"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-6 pb-5">
              <form onSubmit={handleSubmit} className={`${isLogin ? 'space-y-3' : 'space-y-3'}`}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center font-inter">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email
                  </Label>
                  <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={isLogin ? loginData.email : registerData.email}
                  onChange={(e) => isLogin
                    ? setLoginData({ ...loginData, email: e.target.value })
                    : setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="pl-10 h-10 text-sm border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 font-inter"
                />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center font-inter">
                    <Lock className="h-4 w-4 mr-2 text-blue-600" />
                    Password
                  </Label>
                  <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={isLogin ? loginData.password : registerData.password}
                  onChange={(e) => isLogin
                    ? setLoginData({ ...loginData, password: e.target.value })
                    : setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  className="pl-10 h-10 text-sm border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 font-inter"
                />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center font-inter">
                      <Globe className="h-4 w-4 mr-2 text-blue-600" />
                      Country
                    </Label>
                    <Select
                      value={registerData.country}
                      onValueChange={(value) => setRegisterData({ ...registerData, country: value })}
                    >
                      <SelectTrigger className="h-10 border-2 border-slate-200 focus:border-blue-500 transition-all duration-300 font-inter">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">🇺🇸 United States</SelectItem>
                        <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                        <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                        <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Button type="submit" className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-4 font-inter">
                  {isLogin ? (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              
              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center mb-2">
                  <div className="p-1 bg-green-500 rounded-sm mr-2">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-inter">
                    Demo Access
                  </p>
                </div>
                <div className="space-y-1 text-sm font-inter">
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Email:</span> demo@taxbridge.com
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Pass:</span> demo123456
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
