// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Components/Login/Login";
// import "./App.css";
// import Dashboard from "./Components/Dashboard/Dashboard";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
 import ProfileDetails from './Components/Screens/Profile/ProfileDetails'
import Navbar from "./Components/Screens/Navbar/Navbar";
import DashboardScreen from "./Components/Screens/DashboardScreen/Dashboard";
import MachineScreen from "./Components/Screens/MachineScreen/Machine";
import RequestScreen from "./Components/Screens/RequestScreen/Request";
import FeedbackScreen from "./Components/Screens/FeedbackScreen/Feedback";
import ServiceRequestTable from "./Components/Screens/ServiceRequest/ServiceRequestTable";
import RejectForm from "./Components/Screens/ServiceRequest/RejectForm";
import ServiceDetails from "./Components/Screens/ServiceRequest/ServiceDetails";
import "./App.css";
import SignUpScreen from './Components/Login/SignUpScreen';
import SignupSetPassword from './Components/Login/SignupSetPassword'
import { CompanyProvider } from '../src/Components/CompanyContext';
import CustomerDetailsPage from "./Components/Screens/ServiceRequest/CustomerDetailsPage";
import ServiceItemDetailsPage from "./Components/Screens/ServiceRequest/ServiceItemDetailsPage";
import PdfReportButton from "./Components/Screens/ServiceRequest/PdfReportButton";

// 🔹 Wrapper component to handle auto-login check
function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/dashboard");  // ✅ Redirect to dashboard
    }
  }, [navigate]);

  return <Login />;
}

function App() {
  return (
    <CompanyProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* When user opens app, check if logged in */}
            <Route path="/" element={<AppWrapper />} />

            {/* Normal routes */}
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/profile-details" element={<ProfileDetails />} />

            <Route
  path="/serviceengineer/customer/:customerId"
  element={<CustomerDetailsPage />}
/>

<Route
  path="/serviceengineer/service-item/:serviceItemId"
  element={<ServiceItemDetailsPage />}
/>


            <Route path="/machine" element={<MachineScreen />} />
            <Route path="/request" element={<RequestScreen />} />
            <Route path="/feedback" element={<FeedbackScreen />} />
            <Route path="/service-table" element={<ServiceRequestTable />} />
                        <Route path="/service-table" element={<PdfReportButton />} />


            <Route path="/reject" element={<RejectForm />} />
            <Route path="/service-details" element={<ServiceDetails />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/signupset-password-screen" element={<SignupSetPassword />} />
          </Routes>
        </div>
      </Router>
    </CompanyProvider>
  );
}

export default App;
