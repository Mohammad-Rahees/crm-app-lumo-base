const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * API LOGIC & AUTH FLOW: User Registration
 * @desc    Registers a new user, hashes their password, and issues an immediate JWT token
 * @route   POST /api/auth/register
 * @access  Public (No token required)
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation: ensure no empty fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Database validation: ensure the email is entirely unique across the system
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Database Write (will trigger pre-save hook to hash the password securely)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. Return success state containing safe User data + the generated JWT token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * API LOGIC & AUTH FLOW: User Login
 * @desc    Authenticates credentials against Database and dispenses a fresh JWT mapping to that User payload
 * @route   POST /api/auth/login
 * @access  Public (No token required)
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Extrapolate User from DB
    const user = await User.findOne({ email });

    // 3. Compare cryptographic hash. If successful, respond with Token
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
