import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

import "./SecurityQuestionsScreen.css";
import logo from "./hvac-logo-new.jpg";
import baseURL from "../ApiUrl/Apiurl";

const SECURITY_QUESTION_CHOICES = [
  "What is your mother’s maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const ForgotPassword = () => {

  const [login, setLogin] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const a2InputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔐 Service Manager Forgot Password Submit Triggered");

    if (!login || !q1 || !q2 || !a1 || !a2 || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (q1 === q2) {
      Swal.fire({
        icon: "error",
        title: "Invalid Questions",
        text: "Please select two different security questions.",
      });
      return;
    }

    const payload = {
      login,
      security_question1: q1,
      answer1: a1,
      security_question2: q2,
      answer2: a2,
      new_password: newPassword,
    };

    console.log("📤 Service Manager forgot password payload", {
      ...payload,
      new_password: "******",
    });

    try {

      const response = await fetch(`${baseURL}/user-forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response Status:", response.status);

      const result = await response.json();
      console.log("📥 Response Body:", result);

     if (!response.ok) {

  let errorMessage = "Please check your details and try again.";

  // case 1: password validation error (400)
  if (result?.errors?.new_password) {
    errorMessage = result.errors.new_password[0];
  }

  // case 2: user not found (404)
  else if (result?.message) {
    errorMessage = result.message;
  }

  // fallback
  else if (result?.error) {
    errorMessage = result.error;
  }

  Swal.fire({
    icon: "error",
    title: "Reset Failed",
    text: errorMessage,
  });

  return;
}

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password reset successfully!",
      }).then(() => navigate("/"));

    } catch (err) {

      console.error("🚨 Forgot password request crashed", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });

    }
  };

  return (
    <div className="security-container">

      <div className="security-card">

        <button
          className="security-back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="security-logo-container">
          <img src={logo} alt="HVAC Logo" className="security-logo" />
        </div>

        <h4 className="security-title">Service Manager Forgot Password</h4>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            className="security-input"
            placeholder="Enter Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <label className="security-label">Security Question 1</label>

          <select
            className="security-select"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            required
          >
            <option value="">Select Question 1</option>

            {SECURITY_QUESTION_CHOICES.map((q, i) => (
              <option key={i} value={q}>
                {q}
              </option>
            ))}

          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a1}
            onChange={(e) => setA1(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                a2InputRef.current?.focus();
              }
            }}
            required
          />

          <label className="security-label">Security Question 2</label>

          <select
            className="security-select"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            required
          >
            <option value="">Select Question 2</option>

            {SECURITY_QUESTION_CHOICES.map((q, i) => (
              <option key={i} value={q}>
                {q}
              </option>
            ))}

          </select>

          <input
            type="text"
            className="security-input"
            placeholder="Answer"
            value={a2}
            onChange={(e) => setA2(e.target.value)}
            ref={a2InputRef}
            required
          />

          <label className="security-label">New Password</label>

          <div className="set-input-wrapper">

            <FaLock className="input-icon-inside" />

            <input
              type={showPassword ? "text" : "password"}
              className="pass-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>

          </div>

          <button
            type="submit"
            className="security-submit-button shadow"
          >
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;