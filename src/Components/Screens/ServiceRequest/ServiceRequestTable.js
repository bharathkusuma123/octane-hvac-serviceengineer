// import React, { useState, useEffect } from "react";
// import { Table, Button, Form, InputGroup } from "react-bootstrap";
// import Navbar from "../Navbar/Navbar";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./ServiceTable.css";
// import axios from "axios";

// const ServiceTable = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [acceptedServices, setAcceptedServices] = useState([]);
//   const [declinedServices, setDeclinedServices] = useState([]);
//   const userId = localStorage.getItem("userId");
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5); // Adjust based on mobile view
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [servicesRes, assignmentsRes] = await Promise.all([
//           axios.get(`${baseURL}/service-pools/`),
//           axios.get(`${baseURL}/assignment-history/`),
//         ]);

//         const allServices = Array.isArray(servicesRes.data)
//           ? servicesRes.data
//           : servicesRes.data.data || [];

//         const assignments = Array.isArray(assignmentsRes.data)
//           ? assignmentsRes.data
//           : assignmentsRes.data.data || [];

//         const assignmentMap = {};
//         const statusMap = {};
        
//         assignments.forEach((item) => {
//           assignmentMap[item.request] = item.assignment_id;
//           statusMap[item.request] = item.status;
          
//           if (item.status === "Declined") {
//             setDeclinedServices(prev => [...prev, item.request]);
//           }
//         });

//         const assignedToUser = allServices
//           .filter((service) => String(service.assigned_engineer) === userId)
//           .map((service) => ({
//             ...service,
//             assignment_id: assignmentMap[service.request_id] || null,
//             assignment_status: statusMap[service.request_id] || null,
//           }));

//         setServices(assignedToUser);
//         setFilteredServices(assignedToUser);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   // Apply search filter
//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter(service =>
//         Object.values(service).some(
//           val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//       setFilteredServices(filtered);
//     }
//     setCurrentPage(1); // Reset to first page on search
//   }, [searchTerm, services]);

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

//   const handleAcceptClick = async (serviceId, assignmentId) => {
//     if (!serviceId) {
//       console.error("Missing serviceId");
//       return;
//     }

//     try {
//       await axios.put(`${baseURL}/service-pools/${serviceId}/`, {
//         status: "Accepted",
//       });

//       if (assignmentId) {
//         await axios.put(
//           `${baseURL}/assignment-history/${assignmentId}/`,
//           { status: "Accepted" }
//         );
//       }

//       setAcceptedServices((prev) => [...prev, serviceId]);
//       setDeclinedServices((prev) => prev.filter(id => id !== serviceId));
//       alert("Service accepted successfully!");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to accept the service. Please try again.");
//     }
//   };

//   const handleRejectClick = (service) => {
//     navigate("/reject", { state: { service } });
//   };

//   const shouldShowButtons = (service) => {
//     return !(
//       service.status === "Accepted" || 
//       acceptedServices.includes(service.request_id) ||
//       service.assignment_status === "Declined" ||
//       declinedServices.includes(service.request_id)
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container-fluid px-4 pt-5 pb-5">
//         <div className="text-center mb-4">
//           <h2 className="fw-bold pt-5">Service Request Table</h2>
//         </div>

//         {/* Search Input */}
//         <div className="mb-3">
//           <InputGroup>
//             <Form.Control
//               type="text"
//               placeholder="Search services..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border-secondary"
//             />
//             <InputGroup.Text className="bg-light">
//               <i className="bi bi-search"></i>
//             </InputGroup.Text>
//           </InputGroup>
//         </div>

//         <div className="table-responsive rounded shadow-sm">
//           <Table
//             bordered
//             hover
//             responsive="md"
//             className="text-center align-middle service-table"
//           >
//             <thead className="table-light text-dark">
//               <tr>
//                 <th className="py-3 px-3">S.No</th>
//                 <th className="py-3 px-3">Service ID</th>
//                 <th className="py-3 px-3">Estimated Completion</th>
//                 <th className="py-3 px-3">Start Date & Time</th>
//                 <th className="py-3 px-3">End Date & Time</th>
//                 <th className="py-3 px-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">
//                     {searchTerm ? "No matching services found" : "No services assigned to you"}
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((service, index) => (
//                   <tr
//                     key={service.request_id || service.id}
//                     className="service-row"
//                   >
//                     <td className="py-3 px-3">
//                       {indexOfFirstItem + index + 1}
//                     </td>
//                     <td className="py-3 px-3">
//                       {service.request_id || service.id}
//                     </td>
//                     <td className="py-3 px-3">
//                       {service.estimated_completion_time}
//                     </td>
//                     <td className="py-3 px-3">{service.est_start_datetime}</td>
//                     <td className="py-3 px-3">{service.est_end_datetime}</td>
//                     <td className="py-3 px-3">
//                       {service.status === "Accepted" ||
//                       acceptedServices.includes(service.request_id) ? (
//                         <span className="text-success fw-bold">Accepted</span>
//                       ) : service.assignment_status === "Declined" ||
//                         declinedServices.includes(service.request_id) ? (
//                         <span className="text-danger fw-bold">Rejected</span>
//                       ) : shouldShowButtons(service) ? (
//                         <div className="d-flex justify-content-center gap-2">
//                           <Button
//                             variant="success"
//                             size="sm"
//                             onClick={() =>
//                               handleAcceptClick(
//                                 service.request_id,
//                                 service.assignment_id
//                               )
//                             }
//                             className="px-2"
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => handleRejectClick(service)}
//                             className="px-2"
//                           >
//                             Reject
//                           </Button>
//                         </div>
//                       ) : (
//                         <span className="text-secondary fw-bold">Pending</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         {filteredServices.length > itemsPerPage && (
//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div className="text-muted">
//               Showing {indexOfFirstItem + 1} to{" "}
//               {Math.min(indexOfLastItem, filteredServices.length)} of{" "}
//               {filteredServices.length} entries
//             </div>
//             <div>
//               <Button
//                 variant="outline-secondary"
//                 size="sm"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="me-2"
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant="outline-secondary"
//                 size="sm"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ServiceTable;



import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl";

const ServiceTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [declinedServices, setDeclinedServices] = useState([]);
  const userId = localStorage.getItem("userId");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
   const fetchData = async () => {
  try {
    const [servicesRes, assignmentsRes] = await Promise.all([
      axios.get(`${baseURL}/service-pools/`),
      axios.get(`${baseURL}/assignment-history/`),
    ]);

    const allServices = Array.isArray(servicesRes.data)
      ? servicesRes.data
      : servicesRes.data.data || [];

    const assignments = Array.isArray(assignmentsRes.data)
      ? assignmentsRes.data
      : assignmentsRes.data.data || [];

    // Create a map of the most recent assignment for each request per engineer
    const userAssignmentMap = {};
    
    assignments.forEach((item) => {
      const key = `${item.request}_${item.assigned_engineer}`;
      if (!userAssignmentMap[key] || new Date(item.assigned_at) > new Date(userAssignmentMap[key].assigned_at)) {
        userAssignmentMap[key] = item;
      }
    });

    // Get services assigned to current user
    const assignedToUser = allServices
      .filter((service) => {
        // Check both service pool assignment and assignment history
        return String(service.assigned_engineer) === userId || 
               Object.values(userAssignmentMap).some(
                 assignment => assignment.request === service.request_id && 
                              assignment.assigned_engineer === userId
               );
      })
      .map((service) => {
        // Find the current user's assignment for this request
        const userAssignment = Object.values(userAssignmentMap).find(
          assignment => assignment.request === service.request_id && 
                       assignment.assigned_engineer === userId
        );
        
        return {
          ...service,
          assignment_id: userAssignment?.assignment_id || null,
          assignment_status: userAssignment?.status || null,
          assigned_engineer: userAssignment?.assigned_engineer || service.assigned_engineer,
          is_current_user_assignment: userAssignment?.assigned_engineer === userId
        };
      });

    setServices(assignedToUser);
    setFilteredServices(assignedToUser);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

    fetchData();
  }, [userId]);

  // Apply search filter
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        Object.values(service).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredServices(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handleAcceptClick = async (serviceId, assignmentId) => {
    if (!serviceId) {
      console.error("Missing serviceId");
      return;
    }

    try {
      await axios.put(`${baseURL}/service-pools/${serviceId}/`, {
        status: "Accepted",
      });

      if (assignmentId) {
        await axios.put(
          `${baseURL}/assignment-history/${assignmentId}/`,
          { status: "Accepted" }
        );
      }

      setAcceptedServices((prev) => [...prev, serviceId]);
      setDeclinedServices((prev) => prev.filter(id => id !== serviceId));
      alert("Service accepted successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to accept the service. Please try again.");
    }
  };

  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  const handleServiceIdClick = (service) => {
    navigate("/service-details", { state: { service } });
  };

 const shouldShowButtons = (service) => {
  // Show buttons only if:
  // 1. It's assigned to current user
  // 2. The status is not Accepted
  // 3. The current user's assignment status is not Declined
  return (
    service.assigned_engineer === userId &&
    service.status !== "Accepted" &&
    service.assignment_status !== "Declined"
  );
};

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
        </div>

        {/* Search Input */}
        <div className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-secondary"
            />
            <InputGroup.Text className="bg-light">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="table-responsive rounded shadow-sm">
          <Table
            bordered
            hover
            responsive="md"
            className="text-center align-middle service-table"
          >
            <thead className="table-light text-dark">
              <tr>
                <th className="py-3 px-3">S.No</th>
                <th className="py-3 px-3">Service ID</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    {searchTerm ? "No matching services found" : "No services assigned to you"}
                  </td>
                </tr>
              ) : (
                currentItems.map((service, index) => (
                  <tr
                    key={service.request_id || service.id}
                    className="service-row"
                  >
                    <td className="py-3 px-3">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td 
                      className="py-3 px-3 text-primary"
                      style={{cursor: 'pointer', textDecoration: 'underline'}}
                      onClick={() => handleServiceIdClick(service)}
                    >
                      {service.request_id || service.id}
                    </td>
                   <td className="py-3 px-3">
  {service.status === "Accepted" ? (
    <span className="text-success fw-bold">Accepted</span>
  ) : service.assignment_status === "Declined" && service.assigned_engineer === userId ? (
    <span className="text-danger fw-bold">Rejected</span>
  ) : service.assignment_status === "Pending" && service.assigned_engineer === userId ? (
    <div className="d-flex justify-content-center gap-2">
      <Button
        variant="success"
        size="sm"
        onClick={() => handleAcceptClick(service.request_id, service.assignment_id)}
        className="px-2"
      >
        Accept
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleRejectClick(service)}
        className="px-2"
      >
        Reject
      </Button>
    </div>
  ) : (
    <span className="text-secondary fw-bold">Pending</span>
  )}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredServices.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredServices.length)} of{" "}
              {filteredServices.length} entries
            </div>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceTable;