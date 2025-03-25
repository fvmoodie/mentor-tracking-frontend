// pages/page_resetpassword.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/page_login.css"; // Reuse original login styles
import { FaLock } from "react-icons/fa";

const PageResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://167.71.169.127:5000/api/password/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErrorMessage(data.message || "Reset failed.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/assets/MainLogo.png" alt="Company Logo" className="login-logo" />
        <h2>Reset Password</h2>
        <p className="login-subtext">Enter your new password</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="login-button">
            Reset Password
          </button>

          <div className="login-links">
            <span onClick={() => navigate("/verify-code", { state: { email } })}>Back</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageResetPassword;
