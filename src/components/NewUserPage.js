import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CustomLoginPage.css"; // Shared CSS file

const API_BASE_URL = "http://167.71.169.127:5000"; // Ensure correct API URL

const NewUserPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register user.");
      }

      setSuccessMessage("Registration successful!");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container new-user-container">
      {/* Top Row 1 */}
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" />
        </div>
        <div className="top-right">
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* Top Row 2 */}
      <div className="top-row-2">
        <h2>Create a New Account</h2>
      </div>

      {/* Middle Section */}
      <div className="middle-row">
        {/* Left Column (Sign Up Form) */}
        <div className="column login-column">
          <h2 className="welcome-back">Sign Up</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="new-user-form"
              placeholder="Enter your full name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="new-user-form"
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="new-user-form"
              placeholder="Create a password"
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="new-user-form"
              placeholder="Confirm your password"
              required
            />

            {error && <p className="password-error">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="login-button">Register</button>
          </form>
          <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>

        {/* Middle Column (Image) */}
        <div className="column middle-column">
          <img src="/assets/MiddleLogo.png" alt="Illustration" />
        </div>

        {/* Right Column (Support Links) */}
        <div className="column support-column">
          <h3>Need Help?</h3>
          <ul>
            <li><Link to="/">Forgot Password?</Link></li>
            <li><Link to="/">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        Privacy | Security | © 2025 NotesVia
      </div>
    </div>
  );
};

export default NewUserPage;
