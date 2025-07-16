# TaxBridge API - Quick Demo Script
# ===================================
# Purpose: Fast, focused demo for hackathon presentation
# Duration: ~30 seconds
# Use: Primary demo script for judges
#
# Features Demonstrated:
# - Authentication
# - Tax calculations (FIFO vs LIFO)
# - Multi-country comparison (US vs UK)
# - Clear ROI demonstration

# TaxBridge API Demo Script
Write-Host "TaxBridge API Demo" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

$baseUrl = "http://localhost:3000"

# 1. Health Check
Write-Host "1. API Health Check" -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
Write-Host "Status: $($health.message)" -ForegroundColor Green

# 2. Login Demo User
Write-Host "`n2. Demo User Login" -ForegroundColor Yellow
$loginBody = @{
    email = "demo@taxbridge.com"
    password = "demo123456"
} | ConvertTo-Json

$loginData = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginData.data.token
Write-Host "Logged in as: $($loginData.data.user.email)" -ForegroundColor Green

# Set headers
$headers = @{"Authorization" = "Bearer $token"}

# 3. Get Transactions
Write-Host "`n3. Transaction Summary" -ForegroundColor Yellow
$transactions = Invoke-RestMethod -Uri "$baseUrl/api/transactions" -Method GET -Headers $headers
Write-Host "Total transactions: $($transactions.data.transactions.Count)" -ForegroundColor Green

# 4. Tax Calculation Comparison
Write-Host "`n4. Tax Calculation Comparison" -ForegroundColor Yellow

# FIFO
$fifoBody = @{taxYear=2024; country="US"; method="FIFO"} | ConvertTo-Json
$fifoResult = Invoke-RestMethod -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $fifoBody -ContentType "application/json" -Headers $headers

# LIFO  
$lifoBody = @{taxYear=2024; country="US"; method="LIFO"} | ConvertTo-Json
$lifoResult = Invoke-RestMethod -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $lifoBody -ContentType "application/json" -Headers $headers

Write-Host "US Tax Results (2024):" -ForegroundColor Cyan
Write-Host "FIFO - Net Gains: `$$([math]::Round($fifoResult.data.summary.netGains, 2)), Tax: `$$([math]::Round($fifoResult.data.summary.taxOwed, 2))" -ForegroundColor White
Write-Host "LIFO - Net Gains: `$$([math]::Round($lifoResult.data.summary.netGains, 2)), Tax: `$$([math]::Round($lifoResult.data.summary.taxOwed, 2))" -ForegroundColor White

$savings = $fifoResult.data.summary.taxOwed - $lifoResult.data.summary.taxOwed
Write-Host "Tax Savings (LIFO vs FIFO): `$$([math]::Round($savings, 2))" -ForegroundColor Green

# 5. Multi-Country Comparison
Write-Host "`n5. Multi-Country Comparison" -ForegroundColor Yellow
$ukBody = @{taxYear=2024; country="UK"; method="FIFO"} | ConvertTo-Json
$ukResult = Invoke-RestMethod -Uri "$baseUrl/api/tax/calculate" -Method POST -Body $ukBody -ContentType "application/json" -Headers $headers

Write-Host "Country Comparison (FIFO, 2024):" -ForegroundColor Cyan
Write-Host "US Tax: `$$([math]::Round($fifoResult.data.summary.taxOwed, 2))" -ForegroundColor White
Write-Host "UK Tax: `$$([math]::Round($ukResult.data.summary.taxOwed, 2)) (with `$$($ukResult.data.exemptions.annualExemption) exemption)" -ForegroundColor White

Write-Host "`nDemo Complete! TaxBridge API working perfectly!" -ForegroundColor Green
