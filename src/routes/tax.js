const express = require('express');
const {
  calculateTax,
  getTaxSummary,
  exportTaxReport,
  getTaxRules,
  getTaxInfo,
} = require('../controllers/taxController');
const { validate, schemas } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tax/info
router.get('/info', getTaxInfo);

// @route   GET /api/tax/rules/:country/:year
// @route   GET /api/tax/rules/:country
router.get('/rules/:country/:year', getTaxRules);
router.get('/rules/:country', getTaxRules);

// Routes below require authentication
router.use(auth);

// @route   POST /api/tax/calculate
router.post('/calculate', validate(schemas.taxCalculation), calculateTax);

// @route   GET /api/tax/summary/:year
router.get('/summary/:year', getTaxSummary);

// @route   GET /api/tax/report/:year/export
router.get('/report/:year/export', exportTaxReport);

module.exports = router;
