import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl";

const ServiceTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [declinedServices, setDeclinedServices] = useState([]);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both service-pools and assignment-history concurrently
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

        // Create maps for assignment data
        const assignmentMap = {};
        const statusMap = {};
        
        assignments.forEach((item) => {
          assignmentMap[item.request] = item.assignment_id;
          statusMap[item.request] = item.status;
          
          // Track declined services
          if (item.status === "Declined") {
            setDeclinedServices(prev => [...prev, item.request]);
          }
        });

        // Filter services assigned to the logged-in engineer and map assignment data
        const assignedToUser = allServices
          .filter((service) => String(service.assigned_engineer) === userId)
          .map((service) => ({
            ...service,
            assignment_id: assignmentMap[service.request_id] || null,
            assignment_status: statusMap[service.request_id] || null,
          }));

        setServices(assignedToUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleAcceptClick = async (serviceId, assignmentId) => {
    if (!serviceId) {
      console.error("Missing serviceId");
      return;
    }

    try {
      // Update service-pools
      await axios.put(`${baseURL}/service-pools/${serviceId}/`, {
        status: "Accepted",
      });

      // Update assignment-history if assignmentId is present
      if (assignmentId) {
        await axios.put(
          `${baseURL}/assignment-history/${assignmentId}/`,
          {
            status: "Accepted",
          }
        );
      } else {
        console.warn(`No assignmentId found for serviceId ${serviceId}`);
      }

      // Update UI
      setAcceptedServices((prev) => [...prev, serviceId]);
      setDeclinedServices((prev) => prev.filter(id => id !== serviceId));

      // Alert success only after both API calls succeed
      alert("Service accepted successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to accept the service. Please try again.");
    }
  };

  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  // Function to check if buttons should be shown
  const shouldShowButtons = (service) => {
    return !(
      service.status === "Accepted" || 
      acceptedServices.includes(service.request_id) ||
      service.assignment_status === "Declined" ||
      declinedServices.includes(service.request_id)
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
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
                <th className="py-3 px-4">Service ID</th>
                <th className="py-3 px-4">Estimated Completion</th>
                <th className="py-3 px-4">Start Date & Time</th>
                <th className="py-3 px-4">End Date & Time</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No services assigned to you.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.request_id || service.id}
                    className="service-row"
                  >
                    <td className="py-3 px-4">
                      {service.request_id || service.id}
                    </td>
                    <td className="py-3 px-4">
                      {service.estimated_completion_time}
                    </td>
                    <td className="py-3 px-4">{service.est_start_datetime}</td>
                    <td className="py-3 px-4">{service.est_end_datetime}</td>
                    <td className="py-3 px-4">
                      {service.status === "Accepted" ||
                      acceptedServices.includes(service.request_id) ? (
                        <span className="text-success fw-bold">Accepted</span>
                      ) : service.assignment_status === "Declined" ||
                        declinedServices.includes(service.request_id) ? (
                        <span className="text-danger fw-bold">Rejected</span>
                      ) : shouldShowButtons(service) ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleAcceptClick(
                                service.request_id,
                                service.assignment_id
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectClick(service)}
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
      </div>
    </>
  );
};

export default ServiceTable;









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
//   const [itemsPerPage] = useState(5);
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
//     setCurrentPage(1);
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

//   const handleServiceIdClick = (service) => {
//     navigate("/service-details", { state: { service } });
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
//                 <th className="py-3 px-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="text-center py-4">
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
//                     <td 
//                       className="py-3 px-3 text-primary"
//                       style={{cursor: 'pointer', textDecoration: 'underline'}}
//                       onClick={() => handleServiceIdClick(service)}
//                     >
//                       {service.request_id || service.id}
//                     </td>
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