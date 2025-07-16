const Transaction = require('../models/Transaction');
const csv = require('csv-parser');
const fs = require('fs');

// CSV number validation helper
const validateCSVNumber = (value, fieldName, min = 0) => {
  const num = parseFloat(value);
  if (isNaN(num) || num < min) {
    throw new Error(`Invalid ${fieldName}: ${value}`);
  }
  return num;
};

// CSV date validation helper
const validateCSVDate = (value) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
};

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    // Sanitize and validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const { type, asset } = req.query;

    // Build query object
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (asset) {
      query.$or = [
        { fromAsset: asset.toUpperCase() },
        { toAsset: asset.toUpperCase() }
      ];
    }

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      userId: req.user._id,
    };

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      success: true,
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        },
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        transaction: updatedTransaction,
      },
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        },
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {
        message: 'Transaction deleted successfully',
      },
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
};

// @desc    Import transactions from CSV
// @route   POST /api/transactions/import
// @access  Private
const importTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'CSV file is required',
        },
      });
    }

    const transactions = [];
    const errors = [];

    // Parse CSV file
    const stream = fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Map CSV columns to transaction schema with validation
          const transaction = {
            userId: req.user._id,
            date: validateCSVDate(row.date),
            type: row.type.toLowerCase(),
            fromAsset: row.fromAsset.toUpperCase(),
            toAsset: row.toAsset.toUpperCase(),
            fromAmount: validateCSVNumber(row.fromAmount, 'fromAmount', 0),
            toAmount: validateCSVNumber(row.toAmount, 'toAmount', 0),
            price: validateCSVNumber(row.price, 'price', 0),
            fees: validateCSVNumber(row.fees || '0', 'fees', 0),
            exchange: row.exchange,
          };

          // Validate required fields
          if (!transaction.date || !transaction.type || !transaction.fromAsset || 
              !transaction.toAsset || !transaction.exchange) {
            throw new Error('Missing required fields');
          }

          transactions.push(transaction);
        } catch (error) {
          errors.push({
            row: transactions.length + errors.length + 1,
            error: error.message,
          });
        }
      })
      .on('end', async () => {
        try {
          // Insert valid transactions
          let insertedCount = 0;
          if (transactions.length > 0) {
            const result = await Transaction.insertMany(transactions, {
              ordered: false,
            });
            insertedCount = result.length;
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            data: {
              imported: insertedCount,
              errors: errors.length,
              errorDetails: errors,
            },
          });
        } catch (error) {
          console.error('CSV import error:', error);
          fs.unlinkSync(req.file.path);
          res.status(500).json({
            success: false,
            error: {
              code: 'IMPORT_ERROR',
              message: 'Error importing transactions',
            },
          });
        }
      });
  } catch (error) {
    console.error('Import transactions error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
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
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
};
