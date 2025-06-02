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
//           axios.get("http://175.29.21.7:8006/service-pools/"),
//           axios.get("http://175.29.21.7:8006/assignment-history/"),
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
//       await axios.put(`http://175.29.21.7:8006/service-pools/${serviceId}/`, {
//         status: "Accepted",
//       });

//       if (assignmentId) {
//         await axios.put(
//           `http://175.29.21.7:8006/assignment-history/${assignmentId}/`,
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
        axios.get("http://175.29.21.7:8006/service-pools/"),
        axios.get("http://175.29.21.7:8006/assignment-history/"),
      ]);

      const allServices = Array.isArray(servicesRes.data)
        ? servicesRes.data
        : servicesRes.data.data || [];

      const assignments = Array.isArray(assignmentsRes.data)
        ? assignmentsRes.data
        : assignmentsRes.data.data || [];

      const assignmentMap = {};
      const statusMap = {};

      assignments.forEach((item) => {
        assignmentMap[item.request] = item.assignment_id;
        statusMap[item.request] = item.status;

        if (item.status === "Declined") {
          setDeclinedServices((prev) => [...prev, item.request]);
        }
      });

      const assignedToUser = allServices
        .filter((service) => String(service.assigned_engineer) === userId)
        .map((service) => {
          // Extract service_item and customer for each service
          const { service_item, customer } = service;

          // Log or use them as needed
          console.log("Service Item:", service_item, "Customer:", customer);

          return {
            ...service,
            assignment_id: assignmentMap[service.request_id] || null,
            assignment_status: statusMap[service.request_id] || null,
            service_item,
            customer
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

const handleAcceptClick = async (serviceId, assignmentId, customer, service_item) => {
  console.log('handleAcceptClick triggered', { serviceId, assignmentId });
  
  if (!serviceId) {
    console.error("Missing serviceId - cannot proceed with acceptance");
    return;
  }

  try {
    console.log('Starting service acceptance process...');
    
    // First, update the service pool status
    console.log(`Updating service-pools/${serviceId} status to "Accepted"`);
    const servicePoolResponse = await axios.put(`http://175.29.21.7:8006/service-pools/${serviceId}/`, {
      status: "Accepted",
    });
    console.log('Service pool update successful:', servicePoolResponse.data);

    // Then update the assignment history status
    if (assignmentId) {
      console.log(`Updating assignment-history/${assignmentId} status to "Accepted"`);
      const assignmentResponse = await axios.put(
        `http://175.29.21.7:8006/assignment-history/${assignmentId}/`,
        { status: "Accepted" }
      );
      console.log('Assignment history update successful:', assignmentResponse.data);
    } else {
      console.warn('No assignmentId provided - skipping assignment history update');
    }

    // Create a new service order
    const serviceOrderData = {
      dynamics_service_order_no: `SO-${Date.now()}`,
      source: "IoT Alert",
      request_details: "Service request accepted by engineer",
      alert_details: "Service alert",
      status: "Assigned",
      resource_accepted: true,
      service_request_id: serviceId.toString(),
      resource: userId.toString(),
      created_by: "Service Manager",
      customer: customer,
      service_item: service_item,
      updated_by: "Service Manager"
    };

    console.log('Creating new service order with data:', serviceOrderData);
    const serviceOrderResponse = await axios.post(
      "http://175.29.21.7:8006/service-orders/",
      serviceOrderData
    );
    console.log('Service order creation successful:', serviceOrderResponse.data);

    // Update local state
    console.log(`Adding serviceId ${serviceId} to acceptedServices`);
    setAcceptedServices((prev) => [...prev, serviceId]);
    console.log(`Removing serviceId ${serviceId} from declinedServices if present`);
    setDeclinedServices((prev) => prev.filter(id => id !== serviceId));
    
    console.log('All operations completed successfully');
    alert("Service accepted and order created successfully!");
  } catch (error) {
    console.error("Error in handleAcceptClick:", {
      error: error.response ? error.response.data : error.message,
      config: error.config,
    });
    
    if (error.response) {
      console.error('Server responded with:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    alert("Failed to accept the service. Please try again.");
  } finally {
    console.log('handleAcceptClick execution completed');
  }
};

  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  const handleServiceIdClick = (service) => {
    navigate("/service-details", { state: { service } });
  };

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
                                service.assignment_id,
                                service.customer,
                                service.service_item
                              )
                            }
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