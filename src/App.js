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








import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Login from "./Components/Login/Login";
import Dashboard from './Components/Screens/Dashboard'
import Navbar from './Components/Screens/Navbar/Navbar';
import DashboardScreen from './Components/Screens/DashboardScreen/Dashboard';
import MachineScreen from './Components/Screens/MachineScreen/Machine';
import RequestScreen from './Components/Screens/RequestScreen/Request';
import FeedbackScreen from './Components/Screens/FeedbackScreen/Feedback';
import ServiceRequestForm from './Components/Screens/ServiceRequest/ServiceRequestForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
        
          <Route path="/customer-dashboard" element={<Dashboard />} />

<Route path="/navbar" element={<Navbar />} />

   <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/machine" element={<MachineScreen />} />
        <Route path="/request" element={<RequestScreen />} />
        <Route path="/feedback" element={<FeedbackScreen />} />
  <Route path="/service-form" element={<ServiceRequestForm />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;

