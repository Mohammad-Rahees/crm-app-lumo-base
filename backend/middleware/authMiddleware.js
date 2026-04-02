const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * AUTH FLOW: Route Protection Middleware
 * Used by Express routes to ensure the user executing the API call contains a signed, valid JSON Web Token (JWT).
 * Extrapolates the User's ID from the JWT payload, looks them up in the Database, 
 * and maps the exact User Object directly onto the generic `req.user` payload for downstream APIs to utilize.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Detect if the Authorization header exists and strictly starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract strictly the Base64 token payload
      token = req.headers.authorization.split(' ')[1];

      // 3. Cryptographically verify the token utilizing the overarching JWT_SECRET environment variable
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Fetch the authenticated user from MongoDB sans the password string for security
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Proceed to the originally requested Route logic
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no Bearer token was ever detected in the headers
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
