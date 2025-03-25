// pages/page_requestreset.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page_forgot_password.css";

const PageRequestReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

      try {
      const response = await fetch("http://167.71.169.127:5000/api/password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setMessage("If the email exists, a code has been sent.");
        setTimeout(() => navigate("/verify-code", { state: { email } }), 2000);
      } else {
        setMessage("Something went wrong.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/assets/MainLogo.png" alt="Company Logo" className="login-logo" />
        <h2>Forgot Password</h2>
        <p className="login-subtext">Enter your email to receive a reset code</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p className="info-message">{message}</p>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Code"}
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default PageRequestReset;
