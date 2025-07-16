const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  country: {
    type: String,
    required: true,
    enum: ['US', 'UK', 'CA', 'AU'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true      // Keep automatic timestamp management
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const userModel = mongoose.model('users', userSchema);

// Export the model
module.exports = userModel;
