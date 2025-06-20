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

const screens = [
  { label: "Dashboard", name: "/dashboard", icon: <FaHome /> },
  { label: "Machines", name: "/machine", icon: <FaCogs /> },
  { label: "Requests", name: "/service-table", icon: <FaEnvelope /> },
];

const NavScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [userData, setUserData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(true);

   const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
      localStorage.removeItem("selectedCompany");
    navigate("/");
  };


  useEffect(() => {
    setActiveIcon(location.pathname);
  }, [location.pathname]);

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://175.29.21.7:8006/users/");
      const data = await response.json();
      
      const userId = localStorage.getItem("userId");
      const currentUser = data.find(user => user.user_id === userId && user.role === "Service Engineer");
      
      if (currentUser) {
        setUserData(currentUser);
        
        // Initialize selected company with proper fallback logic
        let initialCompany = "";
        
        // 1. Check if we have a saved company in localStorage
        const savedCompany = localStorage.getItem("selectedCompany");
        
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
        
        setSelectedCompany(initialCompany);
        
        // Store the initial selection if it wasn't in localStorage
        if (!savedCompany && initialCompany) {
          localStorage.setItem("selectedCompany", initialCompany);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);

  const handleIconClick = (path) => {
    navigate(path);
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    // Store selection in localStorage
    localStorage.setItem("selectedCompany", companyId);
    // You might want to add additional logic here when company changes
    // For example: refresh data, update context, etc.
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
            value={selectedCompany}
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