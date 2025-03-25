import { useState } from "react";
import "../styles/page_register.css"; // ✅ Ensures styles are page-specific

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailMessage, setEmailMessage] = useState(""); // ✅ New: Email check message
  const [emailStatus, setEmailStatus] = useState(null); // ✅ "success" (green) or "error" (red)
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ✅ Password Strength Validation
    if (name === "password") {
      if (value.length < 6) {
        setPasswordStrength("Weak (Min 6 characters)");
      } else if (!/\d/.test(value)) {
        setPasswordStrength("Medium (Add numbers)");
      } else {
        setPasswordStrength("Strong");
      }
    }

    // ✅ Reset email message when typing a new email
    if (name === "email") {
      setEmailMessage("");
      setEmailStatus(null);
    }
  };

  // ✅ Validate Before Submission
  const isValidForm = () => {
    const { fullName, email, password, confirmPassword } = formData;
    return (
      fullName.length > 2 &&
      email.includes("@") &&
      password.length >= 6 &&
      password === confirmPassword
    );
  };

  // ✅ Check Email Availability
  const checkEmailAvailability = async () => {
    setEmailMessage(""); // Clear previous messages
    setEmailStatus(null);

    if (!formData.email.includes("@")) {
      setEmailMessage("Please enter a valid email.");
      setEmailStatus("error");
      return;
    }

    try {
      const response = await fetch("http://167.71.169.127:5000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          setEmailMessage("This email is already registered.");
          setEmailStatus("error"); // ✅ Red if email exists
        } else {
          setEmailMessage("Email is available.");
          setEmailStatus("success"); // ✅ Green if email is available
        }
      } else {
        setEmailMessage(data.error || "Error checking email.");
        setEmailStatus("error");
      }
    } catch (error) {
      setEmailMessage("Network error. Please try again.");
      setEmailStatus("error");
    }
  };

  // ✅ Handle Form Submission with Duplicate Check
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!isValidForm()) {
      setErrorMessage("Please fill in all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 🔹 Check for duplicate email before submitting
      const checkResponse = await fetch("http://167.71.169.127:5000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const checkData = await checkResponse.json();
      if (!checkResponse.ok || checkData.exists) {
        setErrorMessage("This email is already registered.");
        setIsSubmitting(false);
        return;
      }

      // 🔹 Proceed with Registration
      const response = await fetch("http://167.71.169.127:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
        window.location.href = "/login";
      } else if (data.message === "Already Exists") {
        setErrorMessage("This email is already registered.");
      } else {
        setErrorMessage(data.error || "Registration failed. Try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/assets/MainLogo.png" alt="Logo" className="register-logo" />
        <h2 className="register-title">Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            className="register-input"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="register-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            onBlur={checkEmailAvailability} // ✅ Check availability when user leaves field
            required
          />

          {/* ✅ Display Email Availability Message */}
          {emailMessage && (
            <p
              className={`email-message ${emailStatus}`}
              style={{ color: emailStatus === "success" ? "green" : "red", fontWeight: "bold" }}
            >
              {emailMessage}
            </p>
          )}

          <input
            type="password"
            name="password"
            className="register-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="password-strength">{passwordStrength}</p>

          <input
            type="password"
            name="confirmPassword"
            className="register-input"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ✅ Display general error messages */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="register-btn" disabled={isSubmitting || !isValidForm()}>
            {isSubmitting ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
