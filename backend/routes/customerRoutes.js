const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes mapped to corresponding controllers
// All customer routes enforce the JWT `protect` middleware
router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;
