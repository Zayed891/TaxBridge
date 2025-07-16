const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', validate(schemas.register), register);

// @route   POST /api/auth/login
router.post('/login', validate(schemas.login), login);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;
