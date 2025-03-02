// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';  // Link component to navigate

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the HomePage</h1>
      <p>Click below to navigate to other pages:</p>
      
      {/* Link to LoginPage */}
      <Link to="/login">
        <button>Go to Login</button>
      </Link>

      {/* Link to DashboardPage */}
      <Link to="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
    </div>
  );
};

export default HomePage;
