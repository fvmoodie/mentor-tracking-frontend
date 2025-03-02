// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';  // Import Navigate instead of Redirect

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Check for token in localStorage

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}  // Use Navigate to redirect to login
    />
  );
};

export default PrivateRoute;
