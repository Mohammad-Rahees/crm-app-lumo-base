const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection mapped to process.env.MONGO_URI configurations
connectDB();

/**
 * API LOGIC: Global Middleware
 * Setup express server configuration:
 * 1. Restrict CORS logic down strictly to the specific `CLIENT_URL` declared inside `.env` configuration.
 * 2. Configure Express to inherently parse incoming HTTP Request bodies into standard JSON.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

/**
 * API LOGIC: Route Mounts
 * Links root application paths mapping seamlessly to dedicated express.Router module imports.
 * e.g: Hit POST /api/auth/login => Redirects to authRoutes router logic
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

/**
 * FRONTEND STRUCTURE: Single-Page Application (SPA) Serving Context
 * Handles MERN deployment logic conditionally determined by standard `NODE_ENV` parameters.
 * When designated as production, standard React Vite builds (`dist/`) are served verbatim.
 * Because React handles inherent routing inside the browser DOM (`react-router-dom`), any backend route fallbacks 
 * are universally redirected seamlessly back into `index.html`.
 */
if (process.env.NODE_ENV === 'production') {
  // Define static fallback context
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Proxy non-API traffic verbatim directly back to the React DOM context
  app.get(/^.*$/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'));
  });
} else {
  // Provide raw API context during standard Node local development iterations
  app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', message: 'MERN CRM Backend running in development mode' });
  });
}

// Export the Express API for Vercel
module.exports = app;

// Start Server locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port: ${PORT}`);
    console.log('App initialized correctly!');
  });
}
