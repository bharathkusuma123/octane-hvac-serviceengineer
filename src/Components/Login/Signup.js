import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./hvac-logo-new.jpg";
import { FaArrowLeft } from "react-icons/fa";
import "./SignUpScreen.css";
import baseURL from "../ApiUrl/Apiurl";

const Signup = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username and Password are required");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${baseURL}/user-signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const result = await response.json();

      console.log("Signup Response:", result);

      if (response.ok) {

        if (result.redirect === "reset-password" && result.user_id) {

          const user = {
            user_id: result.user_id,
            username
          };

          navigate("/reset-password", { state: { user } });

        } else {
          alert(result.message || "User not found");
        }

      } else {
        alert(result.message || "Something went wrong");
      }

    } catch (error) {

      console.error("Signup Error:", error);
      alert("Server error");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-container">

      <div className="signup-card">

        <button className="otp-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>

        <div className="signup-logo-container">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h3 className="signup-title">Service Engineer Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="signup-input-wrapper">
            <i className="bi bi-person-fill input-icon"></i>

            <input
              type="text"
              placeholder="Enter Username"
              className="sign-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>

          <div className="signup-input-wrapper">
            <i className="bi bi-lock-fill input-icon"></i>

            <input
              type="password"
              placeholder="Enter Password"
              className="sign-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            className="sign-submit-button shadow"
            disabled={loading}
          >
            {loading ? "Checking..." : "Submit"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Signup;