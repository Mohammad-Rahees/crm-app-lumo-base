import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * FRONTEND STRUCTURE: App Component Configuration
 * This defines the exact root-level component entrypoint, delegating conditional UX navigation
 * using `react-router-dom` standard routing trees enabling a modern React Single Page Application (SPA).
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Isolated API Logic handling Auth specific React view renders */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Authenticated Dashboard view encompassing core CRM endpoints */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Global base redirect conditionally pushing non-authenticated routing to the Dashboard logic flow handler */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
