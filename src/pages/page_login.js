import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/page_login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { debounce } from "lodash";

const PageLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear credentials when component unmounts
  useEffect(() => {
    return () => {
      setCredentials({ email: "", password: "" });
    };
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
  
    const API_BASE = process.env.REACT_APP_API_URL || "https://app.notesvia.com/api";
    console.log("🔗 Using API Base URL:", API_BASE);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response:", data); // Debugging

      if (data.user && !data.user.is_active) {
        setErrorMessage("Your account is inactive. Please contact the administrator.");
        return;
      }

      // Store user data securely
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.user_id);
        localStorage.setItem("role_id", data.user.role_id);
        localStorage.setItem("region_id", data.user.region_id || "");
        localStorage.setItem("full_name", data.user.full_name);

        // Redirect based on role
        const isAdmin = [1, 2].includes(data.user.role_id);
        navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message.includes("401")) {
        setErrorMessage("Invalid email or password");
      } else if (error.message.includes("403")) {
        setErrorMessage("Account is inactive");
      } else {
        setErrorMessage("Login failed. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debounced submit handler
  const debouncedSubmit = useCallback(
    debounce(handleSubmit, 300, { leading: true, trailing: false }),
    [credentials]
  );

  return (
    <div className="page-login-container">
      <div className="page-login-card">
        <img 
          src="/assets/MainLogo.png" 
          alt="Company Logo" 
          className="login-logo" 
        />
        <h2>Welcome Back</h2>
        <p className="page-login-subtext">Please sign in to continue</p>

        <form onSubmit={debouncedSubmit} className="page-login-form">
          <div className="page-login-input-group">
            <FaUser className="page-login-input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="email"
              autoFocus
              aria-label="Email address"
            />
          </div>

          <div className="page-login-input-group">
            <FaLock className="page-login-input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>

          {errorMessage && (
            <p className="page-login-error-message" role="alert">
              {errorMessage}
            </p>
          )}

          <button 
            type="submit" 
            className="page-login-button" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="page-login-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageLogin;