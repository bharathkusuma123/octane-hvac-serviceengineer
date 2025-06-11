import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./SignUpScreen.css";
import baseURL from '../ApiUrl/Apiurl';

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user-login/`, {
        username,
        password
      });

      const user = response.data.data;

      if (user) {
        navigate("/signupset-password-screen", { 
          state: { user } 
        });
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error checking user details:", error);
      setError(
        error.response?.data?.message || 
        "Error checking user details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-card shadow">
        <button 
          className="otp-back-button" 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            position: 'absolute',
            left: '15px',
            top: '15px'
          }}
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="signup-logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ width: "150px", height: "80px" }} 
          />
          <h3 style={{ marginTop: '15px' }}>Sign Up</h3>
        </div>

        {error && (
          <div 
            className="alert alert-danger" 
            style={{ margin: '0 15px 15px 15px' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <i 
              className="bi bi-person-fill" 
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                color: '#6c757d'
              }}
            ></i>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 8px 8px 35px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <i 
              className="bi bi-lock-fill" 
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                color: '#6c757d'
              }}
            ></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              style={{
                width: '100%',
                padding: '8px 35px 8px 35px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="loginButton shadow" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#0096D6',
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;