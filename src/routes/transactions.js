const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
} = require("../controllers/transactionController");
const { validate, schemas } = require("../middleware/validation");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Enhanced MIME type and extension validation
    const allowedMimes = ["text/csv", "application/csv", "text/plain"];
    const allowedExtensions = [".csv"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimes.includes(file.mimetype) &&
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only 1 file at a time
    fieldSize: 1024 * 1024, // 1MB field size limit
  },
});

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// All routes require authentication
router.use(auth);

// @route   GET /api/transactions
router.get("/", getTransactions);

// @route   POST /api/transactions
router.post("/", validate(schemas.transaction), createTransaction);

// @route   PUT /api/transactions/:id
router.put("/:id", validate(schemas.transaction), updateTransaction);

// @route   DELETE /api/transactions/:id
router.delete("/:id", deleteTransaction);

// @route   POST /api/transactions/import
router.post("/import", upload.single("csvFile"), importTransactions);

module.exports = router;
