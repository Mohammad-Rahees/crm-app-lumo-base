const mongoose = require('mongoose');

/**
 * DATABASE SCHEMA: CRM Customer
 * Maps directly to the MongoDB collection storing the actual CRM business leads/contacts.
 * Links basic required fields (name, email) with optional contextual data (phone, company).
 */
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
  },
  {
    // Auto-generates standard timestamps, useful for analytics like "New Customers this Month"
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
