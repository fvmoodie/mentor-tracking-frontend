// src/components/LoginPage.js
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dummy login function (for testing purposes)
  const handleLogin = () => {
    if (email === 'user@example.com' && password === 'password123') {
      // Simulate successful login
      localStorage.setItem('authToken', 'fake-jwt-token');  // Save token to localStorage
      window.location.href = '/dashboard';  // Redirect to Dashboard
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
