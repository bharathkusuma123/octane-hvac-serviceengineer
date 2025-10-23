import React, { useState, useRef } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../Logos/hvac-logo-new.jpg';
import googleicon from '../../Logos/googleicon.png';
import greenaire from '../../Logos/greenAire.png';
import axios from "axios";
import baseURL from '../ApiUrl/Apiurl';

export default function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let fcmToken = '';

      // ✅ Use Expo-provided token if available
      if (window.ReactNativeWebView && window.fcmToken) {
        fcmToken = window.fcmToken;
        console.log("Using Expo token:", fcmToken);
      }

      const response = await axios.post(`${baseURL}/user-login/`, {
        username,
        password,
        fcm_token: fcmToken, // ✅ Send token to backend
      });

      const user = response.data.data;

      if (user.role === "Service Engineer") {
        // ✅ Store all necessary data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "service engineer");
        localStorage.setItem("userId", user.user_id);
        localStorage.setItem("userMobile", user.mobile_no);

        if (user.company_id) {
          localStorage.setItem("selectedCompany", user.company_id);
        }

        console.log("User data from API:", user);
        console.log("Stored userId:", localStorage.getItem("userId"));

        // ✅ Send login message to Expo for React Native WebView
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'login', userId: user.user_id })
          );
        }

        // Navigate to dashboard
        navigate("/dashboard", { 
          state: { 
            userMobile: user.mobile_no,
            userId: user.user_id,
            userData: user
          } 
        });
      } else {
        setError("User is not a Service Engineer");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid mobile number or password");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="logoContainer">
          <img src={logo} alt="AIRO Logo" className="logo" />
        </div>
        <h2 className="welcome">WELCOME BACK!</h2>
        <p className="subtitle">Please login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="inputWrapper">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') passwordRef.current.focus();
              }}
            />
          </div>

          <div className="inputWrapper">
            <FaLock className="icon" />
            <input
              type={secureText ? 'password' : 'text'}
              placeholder="Enter Password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setSecureText(!secureText)} className="eyeIcon">
              {secureText ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          <div className="checkboxContainer">
             <label className="switchLabel">
              {/* <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <span className="label">Auto Login</span> */}
            </label>
            <span className="forgot" onClick={() => navigate('/security')}>Forgot Password/Pin?</span>
          </div>

          {error && <p className="errorText">{error}</p>}

          <button type="submit" className="loginButton shadow">LOGIN</button>
           {/* <button type="button" className="socialButton">
            <img src={googleicon} alt="Google Icon" className="socialIcon" />
            <span className="socialText">Login with Google ID</span>
          </button>

          <button className="socialButton black">
            <FaApple className="socialIcon" color="#fff" />
            <span className="socialText white">Login with Apple ID</span>
          </button> */}
{/* 
          <p className="orText">Or</p>
          <p className="registerText">
            Don’t have an account?{' '}
            <span className="registerLink" onClick={() => navigate('/signup')}>Register</span>
          </p> */}

          <img src={greenaire} alt="Green Aire" className="footerLogo" />
        </form>
      </div>
    </div>
  );
}
