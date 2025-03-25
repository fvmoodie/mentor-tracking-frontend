// pages/page_verifycode.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/page_login.css"; // Still using existing login styles
import { FaLock } from "react-icons/fa";

const PageVerifyCode = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://167.71.169.127:5000/api/password/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok && data.valid) {
        navigate("/reset-password", { state: { email, code } });
      } else {
        setErrorMessage(data.message || "Invalid or expired code.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/assets/MainLogo.png" alt="Company Logo" className="login-logo" />
        <h2>Verify Code</h2>
        <p className="login-subtext">Enter the code sent to your email</p>
        <p className="login-subtext"><strong>{email}</strong></p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="text"
              placeholder="6-digit code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button">
            Verify Code
          </button>

          <div className="login-links">
            <span onClick={() => navigate("/forgot-password")}>Back</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageVerifyCode;
