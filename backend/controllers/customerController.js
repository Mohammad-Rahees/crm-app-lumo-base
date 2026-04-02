const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    // Optionally, if customers belong to a specific user, we would use `user: req.user._id` in the filter.
    // For a generic CRM, we might just list all.
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching customers', error: error.message });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required parameters' });
    }

    // Checking if customer exists by email (optional logic based on CRM semantics)
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res.status(400).json({ message: 'Customer with this email address already exists' });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating customer', error: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone !== undefined ? req.body.phone : customer.phone;
    customer.company = req.body.company !== undefined ? req.body.company : customer.company;

    const updatedCustomer = await customer.save();

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating customer', error: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.deleteOne();
    
    res.json({ message: 'Customer successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting customer', error: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
