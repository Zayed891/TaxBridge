# TaxBridge API - Comprehensive Demo Script
# ==========================================
# Purpose: Detailed feature showcase for technical evaluation
# Duration: ~2-3 minutes
# Use: Technical deep-dive, documentation, or Q&A sessions
#
# Features Demonstrated:
# - Full API health checks
# - Detailed transaction analysis
# - Multiple calculation methods
# - Multi-country tax rules
# - CSV export functionality
# - Professional reporting

# TaxBridge API Demo Script
# This script demonstrates the key features of the TaxBridge API

Write-Host "🚀 TaxBridge API Demo" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""

# Base URL
$baseUrl = "http://localhost:3000"

Write-Host "1. Testing API Health" -ForegroundColor Yellow
$healthResponse = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
$health = ($healthResponse.Content | ConvertFrom-Json)
Write-Host "✅ API Status: $($health.message)" -ForegroundColor Green
Write-Host ""

Write-Host "2. Testing Supported Countries & Methods" -ForegroundColor Yellow
$infoResponse = Invoke-WebRequest -Uri "$baseUrl/api/tax/info" -Method GET
$info = ($infoResponse.Content | ConvertFrom-Json).data
Write-Host "✅ Supported Countries: $($info.supportedCountries -join ', ')" -ForegroundColor Green
Write-Host "✅ Supported Methods: $($info.supportedMethods -join ', ')" -ForegroundColor Green
Write-Host ""

Write-Host "3. Demo User Login" -ForegroundColor Yellow
$loginBody = @{
    email = "demo@taxbridge.com"
    password = "demo123456"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$loginData = ($loginResponse.Content | ConvertFrom-Json).data
$token = $loginData.token
Write-Host "✅ Login successful for: $($loginData.user.email)" -ForegroundColor Green
Write-Host "✅ User Country: $($loginData.user.country)" -ForegroundColor Green
Write-Host ""

# Set headers for authenticated requests
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "4. Fetching Transactions" -ForegroundColor Yellow
$transactionsResponse = Invoke-WebRequest -Uri "$baseUrl/api/transactions" -Method GET -Headers $headers
$transactions = ($transactionsResponse.Content | ConvertFrom-Json).data
Write-Host "✅ Found $($transactions.transactions.Count) transactions" -ForegroundColor Green

# Show transaction summary
$buys = ($transactions.transactions | Where-Object {$_.type -eq "buy"}).Count
$sells = ($transactions.transactions | Where-Object {$_.type -eq "sell"}).Count
$mining = ($transactions.transactions | Where-Object {$_.type -eq "mining"}).Count
$staking = ($transactions.transactions | Where-Object {$_.type -eq "staking"}).Count

Write-Host "   - Buys: $buys, Sells: $sells, Mining: $mining, Staking: $staking" -ForegroundColor Cyan
Write-Host ""

Write-Host "5. Tax Calculations - FIFO vs LIFO Comparison" -ForegroundColor Yellow

# FIFO Calculation
$fifoBody = @{
    taxYear = 2024
    country = "US"
    method = "FIFO"
} | ConvertTo-Json

$fifoResponse = Invoke-WebRequest -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $fifoBody -ContentType "application/json" -Headers $headers
$fifoData = ($fifoResponse.Content | ConvertFrom-Json).data

# LIFO Calculation
$lifoBody = @{
    taxYear = 2024
    country = "US"
    method = "LIFO"
} | ConvertTo-Json

$lifoResponse = Invoke-WebRequest -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $lifoBody -ContentType "application/json" -Headers $headers
$lifoData = ($lifoResponse.Content | ConvertFrom-Json).data

Write-Host "📊 US Tax Results (2024):" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "FIFO Method:" -ForegroundColor White
Write-Host "  Net Gains: `$$([math]::Round($fifoData.summary.netGains, 2))" -ForegroundColor White
Write-Host "  Tax Owed: `$$([math]::Round($fifoData.summary.taxOwed, 2))" -ForegroundColor White
Write-Host ""
Write-Host "LIFO Method:" -ForegroundColor White
Write-Host "  Net Gains: `$$([math]::Round($lifoData.summary.netGains, 2))" -ForegroundColor White
Write-Host "  Tax Owed: `$$([math]::Round($lifoData.summary.taxOwed, 2))" -ForegroundColor White
Write-Host ""
$savings = $fifoData.summary.taxOwed - $lifoData.summary.taxOwed
Write-Host "Tax Savings (LIFO vs FIFO): `$$([math]::Round($savings, 2))" -ForegroundColor Green
Write-Host ""

Write-Host "6. Multi-Country Comparison" -ForegroundColor Yellow

# UK Calculation
$ukBody = @{
    taxYear = 2024
    country = "UK"
    method = "FIFO"
} | ConvertTo-Json

$ukResponse = Invoke-WebRequest -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $ukBody -ContentType "application/json" -Headers $headers
$ukData = ($ukResponse.Content | ConvertFrom-Json).data

Write-Host "Country Comparison (FIFO, 2024):" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "United States:" -ForegroundColor White
Write-Host "  Net Gains: `$$([math]::Round($fifoData.summary.netGains, 2))" -ForegroundColor White
Write-Host "  Tax Owed: `$$([math]::Round($fifoData.summary.taxOwed, 2))" -ForegroundColor White
Write-Host "  Rate: $([math]::Round($fifoData.summary.effectiveRate * 100, 1))%" -ForegroundColor White
Write-Host ""
Write-Host "United Kingdom:" -ForegroundColor White
Write-Host "  Net Gains: `$$([math]::Round($ukData.summary.netGains, 2))" -ForegroundColor White
Write-Host "  Tax Owed: `$$([math]::Round($ukData.summary.taxOwed, 2))" -ForegroundColor White
Write-Host "  Rate: $([math]::Round($ukData.summary.effectiveRate * 100, 1))%" -ForegroundColor White
Write-Host "  Exemption Used: `$$($ukData.exemptions.exemptionUsed)" -ForegroundColor White
Write-Host ""

Write-Host "7. Export Tax Report (CSV)" -ForegroundColor Yellow
$exportUrl = "$baseUrl/api/tax/report/2024/export?country=US`&method=FIFO`&format=csv"
$exportResponse = Invoke-WebRequest -Uri $exportUrl -Method GET -Headers $headers
Write-Host "✅ CSV Report Generated:" -ForegroundColor Green
Write-Host $exportResponse.Content -ForegroundColor Gray
Write-Host ""

Write-Host "Demo Complete!" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host "✅ User Authentication" -ForegroundColor Green
Write-Host "✅ Transaction Management" -ForegroundColor Green  
Write-Host "✅ Multi-Country Tax Calculations" -ForegroundColor Green
Write-Host "✅ Multiple Cost Basis Methods" -ForegroundColor Green
Write-Host "✅ Tax Report Export" -ForegroundColor Green
Write-Host ""
Write-Host "TaxBridge API: Solving Web3 Tax Compliance!" -ForegroundColor Yellow
