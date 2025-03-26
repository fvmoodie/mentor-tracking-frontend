// pages/page_login.js
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/page_login.css";
import { FaUser, FaLock } from "react-icons/fa";

const PageLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCredentials({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://notesvia.duckdns.org/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (response.ok) {
        if (!data.IsActive) {
          setErrorMessage("Your account is inactive. Please contact the administrator.");
          setIsSubmitting(false);
          return;
        }

        if (data.role === "Admin" || data.role === "Manager") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setErrorMessage(data.error || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/assets/MainLogo.png" alt="Company Logo" className="login-logo" />
        <h2>Welcome Back</h2>
        <p className="login-subtext">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="email"
              placeholder="       Email Address"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="        Password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="login-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageLogin;
