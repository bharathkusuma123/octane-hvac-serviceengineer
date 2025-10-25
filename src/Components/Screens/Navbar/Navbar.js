// NavScreen.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCogs,
  FaEnvelope,
  FaBell,
  FaSignOutAlt
} from "react-icons/fa";
import "./Navbar.css";
import logo from "../../../Logos/hvac-logo-new.jpg";
import baseURL from "../../ApiUrl/Apiurl";
import { useCompany } from "../../CompanyContext"; // Import the context

const screens = [
  { label: "Dashboard", name: "/dashboard", icon: <FaHome /> },
  { label: "Requests", name: "/service-table", icon: <FaEnvelope /> },
    { label: "Profile", name: "/profile-details", icon: <FaCogs /> },

];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use CompanyContext instead of local state
  const { selectedCompany, updateCompany } = useCompany();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setActiveIcon(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}/users/`);
        const data = await response.json();
        
        const userId = localStorage.getItem("userId");
        const currentUser = data.find(user => user.user_id === userId && user.role === "Service Engineer");
        
        if (currentUser) {
          setUserData(currentUser);
          
          // Initialize selected company with proper fallback logic
          let initialCompany = "";
          
          // 1. Check if we have a saved company in context/localStorage
          const savedCompany = selectedCompany;
          
          // 2. If not, use the user's default_company
          if (!savedCompany) {
            initialCompany = currentUser.default_company || "";
          } else {
            // Verify the saved company exists in the user's companies
            if (currentUser.companies.includes(savedCompany)) {
              initialCompany = savedCompany;
            } else {
              // If saved company is invalid, fall back to default
              initialCompany = currentUser.default_company || "";
            }
          }
          
          // 3. Final fallback - use first company if nothing else is set
          if (!initialCompany && currentUser.companies?.length > 0) {
            initialCompany = currentUser.companies[0];
          }
          
          // Update the context with the initial company
          if (initialCompany && initialCompany !== selectedCompany) {
            updateCompany(initialCompany);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Remove selectedCompany from dependencies

  const handleIconClick = (path) => {
    navigate(path);
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    // Use the context function to update company
    updateCompany(companyId);
    // No need to manually set localStorage - it's handled in the context
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Top Navbar */}
      <div className="top-navbar">
        <img src={logo} alt="Logo" className="logo-img" />
        
        {/* Company Dropdown as Select */}
        {userData && (
          <select
            className="form-select ms-3"
            value={selectedCompany} // Use from context
            onChange={handleCompanyChange}
            style={{ minWidth: "150px" }}
          >
            {userData.default_company && (
              <option value={userData.default_company}>
                {userData.default_company}
              </option>
            )}
            {Array.isArray(userData.companies) &&
              userData.companies
                .filter(comp => comp !== userData.default_company)
                .map(comp => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
          </select>
        )}

        <div className="top-icons">
          <FaBell
            className="top-icon"
            onClick={() => alert("Notifications Clicked!")}
          />
          <FaSignOutAlt className="top-icon" onClick={handleLogout} /> 
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="navbar-container">
        {screens.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${activeIcon === item.name ? "active" : ""}`}
            onClick={() => handleIconClick(item.name)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default NavScreen;