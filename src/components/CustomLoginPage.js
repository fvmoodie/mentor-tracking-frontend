import React, { useState } from 'react';
import '../styles/CustomLoginPage.css'; // Ensure the correct CSS file is linked

const CustomLoginPage = () => {
  // State for User ID, Password, and Save Checkbox
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log('User ID:', userId);
    console.log('Password:', password);
    console.log('Save to this computer:', rememberMe);
    // Add authentication logic here
  };

  return (
    <div className="container">
      {/* Top Row 1: Two Independent Columns */}
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/mainlogo.png" alt="Main Logo" className="main-logo" />
        </div>
        <div className="top-right">
          <img src="/assets/toplogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* Top Row 2: Full Width */}
      <div className="top-row-2">
        <h2>Take and Share Notes</h2>
      </div>

      {/* Middle Section: Three Equal Columns */}
      <div className="middle-row">
        {/* Column 1: Login Form */}
        <div className="column login-column">
          <h2 className="welcome-back">Welcome Back</h2>

          <div className="login-form">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />

            {/* Save to this computer Checkbox */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Save to this computer</label>
            </div>

            <button className="login-button" onClick={handleLogin}>Log In</button>
          </div>
        </div>

        {/* Column 2: Middle Logo */}
        <div className="column middle-column">
          <img src="/assets/MiddleLogo.png" alt="Middle Logo" className="middle-logo" />
        </div>

        {/* Column 3: Support Links */}
        <div className="column support-column">
          <h2>Help Needed?</h2>
          <ul>
            <li><a href="/forgot-password">Forgot ID/Password?</a></li>
            <li><a href="/problem-logging-in">Problem logging in?</a></li>
            <li><a href="/register">New User? Sign Up</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default CustomLoginPage;
