import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomLoginPage.css'; // Ensure CSS is correctly linked

const CustomLoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("🚀 Login page loaded. Checking initial values...");

    // ✅ Force clear session & local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('mentorName');
    sessionStorage.clear();

    setTimeout(() => {
        console.log("Checking storage after timeout...");
        console.log("Token:", localStorage.getItem('token'));
        console.log("UserRole:", localStorage.getItem('userRole'));

        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (token && userRole) {
            console.log("🔄 Redirecting back to dashboard...");
            navigate(userRole === 'admin' ? '/admin-dashboard' : '/mentor-dashboard');
        }
    }, 300); // Short delay to confirm values are cleared
  }, [navigate]);

  const handleLogin = async () => {
    try {
      if (!userId || !password) {
        alert("Please enter both Email and Password.");
        return;
      }

      console.log("🚀 Attempting login...");
      console.log("User ID:", userId);
      console.log("Password:", password);

      const loginData = { email: userId, password };

      const response = await fetch('http://167.71.169.127:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        console.log("✅ Login successful!");

        // ✅ Ensure `full_name` and `role` are properly stored
        const mentorName = data.full_name ? data.full_name : "Mentor";
        const userRole = data.role ? data.role.trim().toLowerCase() : "";

        console.log("✅ Processed Role:", userRole); // Debugging Line

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("mentorName", mentorName);

        // ✅ Redirect users based on role
        if (userRole === "admin") {
          console.log("🔄 Redirecting to Admin Dashboard");
          navigate("/admin-dashboard");
        } else if (userRole === "manager") {
          console.log("🔄 Redirecting to Manager Dashboard");
          navigate("/manager-dashboard");
        } else {
          console.log("🔄 Redirecting to Mentor Dashboard");
          navigate("/mentor-dashboard");
        }
      } else {
        console.log("❌ Login failed:", data.message);

        if (response.status === 403) {
          alert("Your account is inactive. Please contact an administrator for activation.");
        } else {
          alert(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" />
        </div>
        <div className="top-right">
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      <div className="top-row-2">
        <h2>Take and Share Notes</h2>
      </div>

      <div className="middle-row">
        <div className="column login-column">
          <h2 className="welcome-back">Welcome Back</h2>
          <div className="login-form">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID or Email"
              autoComplete="off"
            />

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoComplete="new-password"
            />

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

        <div className="column middle-column">
          <img src="/assets/MiddleLogo.png" alt="Middle Logo" className="middle-logo" />
        </div>

        <div className="column support-column">
          <h2>Help Needed?</h2>
          <ul>
            <li><a href="/mentor-dashboard">Forgot ID/Password?</a></li>
            <li><a href="/admin-dashboard">Problem logging in?</a></li>
            <li><a href="/register">New User? Sign Up</a></li>
          </ul>
        </div>
      </div>

      <div className="bottom-row">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
          <p className="admin-link"><a href="/admin-login">Administrator</a></p>
        </footer>
      </div>
    </div>
  );
};

export default CustomLoginPage;
