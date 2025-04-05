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
      const response = await fetch("https://notesvia.duckdns.org/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Important for cookies/sessions
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data) {
        if (!data.is_active) {
          setErrorMessage("Your account is inactive. Please contact the administrator.");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role_id", data.role_id);
        localStorage.setItem("region_id", data.region_id);
        localStorage.setItem("full_name", data.full_name);

        const isAdmin = data.role_id === 1 || data.role_id === 2;

        setTimeout(() => {
          navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
        }, 100);
      } else {
        setErrorMessage(data?.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login failed:", error); // ✅ Optional debug log
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-login-container">
      <div className="page-login-card">
        <img src="/assets/MainLogo.png" alt="Company Logo" className="login-logo" />
        <h2>Welcome Back</h2>
        <p className="page-login-subtext">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="page-login-form">
          <div className="page-login-input-group">
            <FaUser className="page-login-input-icon" />
            <input
              type="text"
              name="email"
              placeholder="       Email Address"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="off"
              autoFocus // ✅ Helps user experience
            />
          </div>

          <div className="page-login-input-group">
            <FaLock className="page-login-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="        Password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {errorMessage && <p className="page-login-error-message">{errorMessage}</p>}

          <button type="submit" className="page-login-button" disabled={isSubmitting}>
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
