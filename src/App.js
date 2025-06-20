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

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
// import Dashboard from './Components/Screens/Dashboard'
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

function App() {
  return (
     <CompanyProvider>
    <Router>
       
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Login />} />

          {/* <Route path="/customer-dashboard" element={<Dashboard />} /> */}

          <Route path="/navbar" element={<Navbar />} />

          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/machine" element={<MachineScreen />} />
          <Route path="/request" element={<RequestScreen />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
            <Route path="/service-table" element={<ServiceRequestTable />} />
           <Route path="/reject" element={<RejectForm />} />
            <Route path="/service-details" element={<ServiceDetails />} />
            <Route path="/signup" element={<SignUpScreen />} /> {/* Added signup route */}
           <Route path="/signupset-password-screen" element={<SignupSetPassword />} /> {/* Added signup route */}

        </Routes>
      </div>
    </Router>
    </CompanyProvider>
  );
}

export default App;
