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

    const rawRows = [];
    const errors = [];

    // Parse CSV file and collect all rows first
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        rawRows.push(row);
      })
      .on('end', async () => {
        try {
          // Map and validate all rows
          const transactions = [];
          for (let i = 0; i < rawRows.length; i++) {
            try {
              const row = rawRows[i];
              // Normalize date to midnight UTC
              let dateObj = validateCSVDate(row.date);
              dateObj = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
              const transaction = {
                userId: req.user._id,
                date: dateObj,
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
                row: i + 1,
                error: error.message,
              });
            }
          }

          // Deduplication: batch query for existing transactions
          const orQueries = transactions.map(tx => ({
            userId: tx.userId,
            date: tx.date, // already normalized to midnight UTC
            type: tx.type,
            fromAsset: tx.fromAsset,
            toAsset: tx.toAsset,
            fromAmount: tx.fromAmount,
            toAmount: tx.toAmount,
            price: tx.price,
            fees: tx.fees,
            exchange: tx.exchange,
          }));

          let existing = [];
          if (orQueries.length > 0) {
            existing = await Transaction.find({ $or: orQueries }, null, { lean: true });
          }

          // Create a Set of stringified existing transactions for fast lookup
          const existingSet = new Set(existing.map(e => JSON.stringify([
            e.userId?.toString?.() ?? '',
            // Normalize date to midnight UTC for comparison
            new Date(Date.UTC(new Date(e.date).getUTCFullYear(), new Date(e.date).getUTCMonth(), new Date(e.date).getUTCDate())).toISOString(),
            e.type,
            e.fromAsset,
            e.toAsset,
            e.fromAmount,
            e.toAmount,
            e.price,
            e.fees,
            e.exchange
          ])));

          // Filter out duplicates
          const uniqueTransactions = transactions.filter(tx => {
            const key = JSON.stringify([
              tx.userId?.toString?.() ?? '',
              // Already normalized to midnight UTC
              tx.date.toISOString(),
              tx.type,
              tx.fromAsset,
              tx.toAsset,
              tx.fromAmount,
              tx.toAmount,
              tx.price,
              tx.fees,
              tx.exchange
            ]);
            return !existingSet.has(key);
          });

          // Insert only unique transactions
          let insertedCount = 0;
          if (uniqueTransactions.length > 0) {
            const result = await Transaction.insertMany(uniqueTransactions, {
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
