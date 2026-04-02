const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * DATABASE SCHEMA: User Profile
 * This defines the exact structure and validation rules for the Authentication User collection.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforces that no two users can register with the same email
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` timestamps to DB records
    timestamps: true,
  }
);

/**
 * AUTH FLOW: Password Hashing (Pre-Save Middleware)
 * Intercepts the database save operation. If the `.password` field was modified (like during registration),
 * it cryptographically salts and hashes the plaintext password using bcrypt before writing it to MongoDB.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * AUTH FLOW: Password Verification
 * A custom instance method attached to the User model.
 * Compares a user-provided plaintext password string against the hashed password string residing in the DB.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
