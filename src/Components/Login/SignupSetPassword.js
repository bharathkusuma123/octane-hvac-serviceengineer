import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import logo from "../../Logos/hvac-logo-new.jpg";
import "./SignupSetPassword.css";
import baseURL from '../ApiUrl/Apiurl';
import Swal from "sweetalert2";
const SECURITY_QUESTION_CHOICES = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const SignupSetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      navigate("/signup"); // Redirect to signup if no user data
    }
  }, [location, navigate]);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match!",
      });
      return;
    }

    if (!q1 || !q2) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Questions",
        text: "Please select both security questions.",
      });
      return;
    }

    if (!a1 || !a2) {
      Swal.fire({
        icon: "warning",
        title: "Missing Answers",
        text: "Please provide answers for both questions.",
      });
      return;
    }

    if (!user?.user_id) {
      Swal.fire({
        icon: "error",
        title: "User Data Missing",
        text: "Unable to identify user. Please start signup again.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${baseURL}/users/${user.user_id}/`, {
        password,
        security_question1: q1,
        security_question2: q2,
        security_answer1: a1,
        security_answer2: a2,
        is_registered_by_customer: true,
      });

      if (response.data && (response.data.success || response.data.status === "success")) {
        Swal.fire({
          icon: "success",
          title: "Registration Complete",
          text: "You have successfully completed your registration!",
        }).then(() => {
          navigate("/", { replace: true });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data?.message || "Failed to complete registration.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-container">
      <div className="security-card">
        <button 
          className="security-back-button" 
          onClick={() => navigate("/signup")} // Go back to signup page
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="security-logo-container">
          <img src={logo} alt="HVAC Logo" className="security-logo" />
        </div>

        <h4 className="security-title">Complete Your Registration</h4>
        {user && (
          <>
            <p className="user-id-display">Username: {user.username}</p>
            <p className="user-id-display">User ID: {user.user_id}</p>
          </>
        )}

        {error && (
          <div className="alert alert-danger mt-3 mb-3">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>
          <div className="security-section">
            <h5 className="security-label">Security Question 1</h5>
            <select
              className="security-select"
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              required
            >
              <option value="">Select Question 1</option>
              {SECURITY_QUESTION_CHOICES.map((question, idx) => (
                <option key={`q1-${idx}`} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="security-input"
              placeholder="Your answer"
              value={a1}
              onChange={(e) => setA1(e.target.value)}
              required
            />
          </div>

          <div className="security-section">
            <h5 className="security-label">Security Question 2</h5>
            <select
              className="security-select"
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              required
            >
              <option value="">Select Question 2</option>
              {SECURITY_QUESTION_CHOICES.map((question, idx) => (
                <option key={`q2-${idx}`} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="security-input"
              placeholder="Your answer"
              value={a2}
              onChange={(e) => setA2(e.target.value)}
              required
            />
          </div>

          <div className="password-section">
            <h5 className="security-label">Set Your Password</h5>
            <div className="set-input-wrapper">
              <FaLock className="input-icon-inside" />
              <input
                type={showPassword ? "text" : "password"}
                className="pass-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <span
                className="eye-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div className="set-input-wrapper">
              <FaLock className="input-icon-inside" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="pass-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              <span
                className="eye-icon-right"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="setpass-submit-button shadow mt-3"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupSetPassword;