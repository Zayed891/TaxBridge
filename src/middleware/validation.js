const { z } = require('zod');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: Array.isArray(error.errors)
              ? error.errors.map(err => ({
                  field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
                  message: err.message,
                }))
              : [],
          },
        });
      }
      next(error);
    }
  };
};

// Validation schemas
const schemas = {
  register: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    country: z.enum(['US', 'UK', 'CA', 'AU'], {
      errorMap: () => ({ message: 'Country must be one of: US, UK, CA, AU' }),
    }),
  }),

  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),

  transaction: z.object({
    date: z.string()
      .refine((str) => !isNaN(Date.parse(str)), { message: 'Invalid date format' })
      .transform(str => new Date(str)),
    type: z.enum(['buy', 'sell', 'trade', 'mining', 'staking']),
    fromAsset: z.string().min(1, 'From asset is required').max(10, 'Asset name too long'),
    toAsset: z.string().min(1, 'To asset is required').max(10, 'Asset name too long'),
    fromAmount: z.number().positive('From amount must be positive').finite('From amount must be finite'),
    toAmount: z.number().positive('To amount must be positive').finite('To amount must be finite'),
    price: z.number().positive('Price must be positive').finite('Price must be finite'),
    fees: z.number().min(0, 'Fees cannot be negative').finite('Fees must be finite').default(0),
    exchange: z.string().min(1, 'Exchange is required').max(50, 'Exchange name too long'),
  }),

  taxCalculation: z.object({
    taxYear: z.number().int().min(2009).max(new Date().getFullYear()),
    country: z.enum(['US', 'UK', 'CA', 'AU']),
    method: z.enum(['FIFO', 'LIFO', 'AVERAGE_COST']),
  }),
};

module.exports = {
  validate,
  schemas,
};
