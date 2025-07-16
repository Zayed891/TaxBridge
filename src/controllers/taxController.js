const { TaxCalculatorService, TAX_RULES } = require('../services/taxCalculator');
const TaxCalculation = require('../models/TaxCalculation');

// @desc    Calculate taxes for a given year
// @route   POST /api/tax/calculate
// @access  Private
const calculateTax = async (req, res) => {
  try {
    const { taxYear, country, method } = req.body;
    const userId = req.user._id;

    // Perform tax calculation
    const result = await TaxCalculatorService.calculateTax(userId, taxYear, country, method);

    // Save calculation to database
    const taxCalculation = await TaxCalculation.create({
      userId,
      taxYear,
      country,
      method,
      totalGains: result.summary.totalGains,
      totalLosses: result.summary.totalLosses,
      netGains: result.summary.netGains,
      taxOwed: result.summary.taxOwed,
      breakdown: result.breakdown,
    });

    res.json({
      success: true,
      data: {
        calculationId: taxCalculation._id,
        ...result,
      },
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: error.message || 'Error calculating taxes',
      },
    });
  }
};

// @desc    Get tax summary for a specific year
// @route   GET /api/tax/summary/:year
// @access  Private
const getTaxSummary = async (req, res) => {
  try {
    const { year } = req.params;
    const { country, method } = req.query;
    
    const query = {
      userId: req.user._id,
      taxYear: parseInt(year),
    };

    if (country) query.country = country;
    if (method) query.method = method;

    const calculations = await TaxCalculation.find(query)
      .sort({ calculatedAt: -1 });

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        calculations,
      },
    });
  } catch (error) {
    console.error('Get tax summary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Export tax report
// @route   GET /api/tax/report/:year/export
// @access  Private
const exportTaxReport = async (req, res) => {
  try {
    const { year } = req.params;
    const { country, method, format = 'json' } = req.query;

    // Get the most recent calculation for the year
    const query = {
      userId: req.user._id,
      taxYear: parseInt(year),
    };

    if (country) query.country = country;
    if (method) query.method = method;

    const calculation = await TaxCalculation.findOne(query)
      .sort({ calculatedAt: -1 });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No tax calculation found for the specified year',
        },
      });
    }

    // Recalculate to get detailed breakdown
    const detailedResult = await TaxCalculatorService.calculateTax(
      req.user._id,
      parseInt(year),
      calculation.country,
      calculation.method
    );

    if (format === 'csv') {
      // Generate CSV format
      const csvHeader = 'Date,Asset,Type,Amount,Cost Basis,Proceeds,Gain/Loss,Term\n';
      const csvRows = detailedResult.gainLossEvents.map(event => 
        `${event.date.toISOString().split('T')[0]},${event.asset},Sale,${event.amount},${event.costBasis.toFixed(2)},${event.proceeds.toFixed(2)},${event.gain.toFixed(2)},${event.holdingPeriod}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=tax-report-${year}.csv`);
      res.send(csvHeader + csvRows);
    } else {
      // JSON format
      res.json({
        success: true,
        data: {
          report: {
            taxYear: parseInt(year),
            country: calculation.country,
            method: calculation.method,
            generatedAt: new Date(),
            user: {
              email: req.user.email,
              country: req.user.country,
            },
            summary: detailedResult.summary,
            breakdown: detailedResult.breakdown,
            exemptions: detailedResult.exemptions,
            transactions: detailedResult.gainLossEvents,
          },
        },
      });
    }
  } catch (error) {
    console.error('Export tax report error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Error exporting tax report',
      },
    });
  }
};

// @desc    Get tax rules for a country
// @route   GET /api/tax/rules/:country/:year?
// @access  Public
const getTaxRules = async (req, res) => {
  try {
    const { country, year = new Date().getFullYear() } = req.params;
    
    const rules = TaxCalculatorService.getTaxRules(country.toUpperCase(), parseInt(year));
    
    if (!rules) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Tax rules not found for the specified country',
        },
      });
    }

    res.json({
      success: true,
      data: {
        country: country.toUpperCase(),
        year: parseInt(year),
        rules,
      },
    });
  } catch (error) {
    console.error('Get tax rules error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Get all available countries and methods
// @route   GET /api/tax/info
// @access  Public
const getTaxInfo = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        supportedCountries: Object.keys(TAX_RULES),
        supportedMethods: ['FIFO', 'LIFO', 'AVERAGE_COST'],
        countryDetails: Object.entries(TAX_RULES).map(([country, rules]) => ({
          country,
          shortTermRate: rules.capitalGains.shortTerm.taxRate,
          longTermRate: rules.capitalGains.longTerm.taxRate,
          threshold: rules.capitalGains.shortTerm.threshold,
          annualExemption: rules.exemptions.annualExemption,
        })),
      },
    });
  } catch (error) {
    console.error('Get tax info error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

module.exports = {
  calculateTax,
  getTaxSummary,
  exportTaxReport,
  getTaxRules,
  getTaxInfo,
};
