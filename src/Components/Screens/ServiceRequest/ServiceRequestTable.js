// import React, { useState, useEffect } from "react";
// import { Table, Button, Form, InputGroup, ButtonGroup } from "react-bootstrap";
// import Navbar from "../Navbar/Navbar";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./ServiceTable.css";
// import axios from "axios";
// import baseURL from "../../ApiUrl/Apiurl"; 
// import { useCompany } from "../../CompanyContext";
// import Swal from "sweetalert2";

// const ServiceTable = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [acceptedServices, setAcceptedServices] = useState([]);
//   const [declinedServices, setDeclinedServices] = useState([]);
//   const { selectedCompany, updateCompany } = useCompany();
//   const [resourceId, setResourceId] = useState(null);
//    const [resourceData, setResourceData] = useState(null);
//   const userId = localStorage.getItem("userId");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All"); // New state for active filter

//   // Status options based on your first image
//   const statusFilters = [
//     "All",
//     "Under Process",
//     "Waiting for Spares",
//     "Waiting for Quote",
//     "Waiting for Client Approval",
//     "Closed",
//     "Reopened"
//   ];

//   const fetchData = async () => {
//     try {
//       console.log("🔹 Selected Company:", selectedCompany);
//       console.log("🔹 User ID:", userId);

//       if (!selectedCompany || !userId) {
//         console.warn("selectedCompany or userId not ready yet");
//         return;
//       }

//       // ✅ Fetch resource by company_id and user_id
//       const resourceUrl = `${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`;
//       const resourceRes = await axios.get(resourceUrl);
//       const resourceData = resourceRes.data?.data || [];

//       const currentResource = resourceData.find(res => res.user === userId);
//       setResourceData(currentResource);
//       const extractedResourceId = currentResource?.resource_id;

//       setResourceId(extractedResourceId);
//       console.log("✅ Fetched Resource ID:", extractedResourceId);

//       if (!extractedResourceId) {
//         setServices([]);
//         return;
//       }

//       // ✅ Fetch service-pools and assignment-history in parallel
//       const [servicesRes, assignmentsRes] = await Promise.all([
//         axios.get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`),
//         axios.get(`${baseURL}/assignment-history/?user_id=${userId}&company_id=${selectedCompany}`)
//       ]);

//       const allServices = Array.isArray(servicesRes.data)
//         ? servicesRes.data
//         : servicesRes.data.data || [];

//       let assignments = Array.isArray(assignmentsRes.data)
//         ? assignmentsRes.data
//         : assignmentsRes.data.data || [];

//       // 🔽 Sort assignments by latest date
//       assignments.sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );

//       // ✅ Latest assignment per (request_id, assigned_engineer)
//       const userAssignmentMap = {};
//       assignments.forEach(item => {
//         const key = `${item.request}_${item.assigned_engineer}`;
//         if (!userAssignmentMap[key]) {
//           userAssignmentMap[key] = item;
//         }
//       });

//       const assignedToUser = allServices
//         .filter(service =>
//           service.assigned_engineer === extractedResourceId ||
//           Object.values(userAssignmentMap).some(
//             assignment =>
//               assignment.request === service.request_id &&
//               assignment.assigned_engineer === extractedResourceId
//           )
//         )
//         .map(service => {
//           const userAssignment = Object.values(userAssignmentMap).find(
//             assignment =>
//               assignment.request === service.request_id &&
//               assignment.assigned_engineer === extractedResourceId
//           );

//           return {
//             ...service,
//             assignment_id: userAssignment?.assignment_id || null,
//             assignment_status: userAssignment?.status || service.status || "Pending",
//             assigned_engineer: userAssignment?.assigned_engineer || service.assigned_engineer,
//             is_current_user_assignment:
//               userAssignment?.assigned_engineer === extractedResourceId,
//             // Add assignment created_at for sorting
//             assignment_created_at: userAssignment?.created_at || service.created_at
//           };
//         });

//       // 🔽 SORT SERVICES BY LATEST DATE (Most recent first)
//       assignedToUser.sort((a, b) => {
//         const dateA = new Date(a.assignment_created_at || a.created_at);
//         const dateB = new Date(b.assignment_created_at || b.created_at);
//         return dateB - dateA;
//       });

//       console.log("✅ Assigned services count:", assignedToUser.length);
//       setServices(assignedToUser);
//       setFilteredServices(assignedToUser);
//     } catch (error) {
//       console.error("🔴 Error fetching data:", error.response?.data || error.message || error);
//     }
//   };

//   useEffect(() => {
//     if (selectedCompany && userId) {
//       fetchData();
//     }
//   }, [selectedCompany, userId]);

//   // Filter services based on search term AND active status filter
//   useEffect(() => {
//     let filtered = services;

//     // Apply status filter
//     if (activeFilter !== "All") {
//       filtered = filtered.filter(service => 
//         service.status === activeFilter || 
//         service.assignment_status === activeFilter
//       );
//     }

//     // Apply search filter
//     if (searchTerm !== "") {
//       filtered = filtered.filter(service =>
//         Object.values(service).some(
//           val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }

//     setFilteredServices(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, services, activeFilter]);

//   // Handle filter button click
//   const handleFilterClick = (filter) => {
//     setActiveFilter(filter);
//   };

//   const handleAcceptClick = async (serviceId, assignmentId) => {
//     if (!serviceId || !assignmentId) {
//       Swal.fire({
//         icon: "error",
//         title: "Missing IDs",
//         text: "Missing serviceId or assignmentId.",
//       });
//       return;
//     }

//     try {
//       // 1. Update service-pools status
//       const serviceRes = await axios({
//         method: 'get',
//         url: `${baseURL}/service-pools/${serviceId}/`,
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });
      
//       const serviceData = serviceRes.data;
//       const updatedService = {
//         ...serviceData,
//         status: "Under Process",
//         user_id: userId,
//         company_id: selectedCompany,
//       };

//       await axios.put(`${baseURL}/service-pools/${serviceId}/`, updatedService);
//       console.log("✅ service-pools status updated");

//       // 2. Update assignment-history
//       const assignmentRes = await axios.get(`${baseURL}/assignment-history/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany,
//           assignment_id: assignmentId
//         }
//       });
      
//       const assignments = assignmentRes.data.data || assignmentRes.data || [];
//       const targetAssignment = Array.isArray(assignments) 
//         ? assignments.find(a => a.assignment_id === assignmentId)
//         : assignments;

//       if (!targetAssignment) {
//         Swal.fire({
//           icon: "error",
//           title: "Assignment Not Found",
//           text: `Assignment ID ${assignmentId} not found.`,
//         });
//         return;
//       }

//       const updatedAssignment = {
//         ...targetAssignment,
//         status: "Accepted",
//         updated_by: targetAssignment.updated_by || "system",
//         user_id: userId,
//         company_id: selectedCompany
//       };

//       await axios.put(`${baseURL}/assignment-history/${targetAssignment.id || assignmentId}/`, updatedAssignment);
//       console.log("✅ assignment-history updated");

//       // 3. REFRESH DATA
//       await fetchData();

//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: `Service ID ${serviceId} accepted successfully.`,
//         timer: 1500,
//         showConfirmButton: false
//       });

//     } catch (error) {
//       console.error("🔴 Error in handleAcceptClick:", error.response?.data || error.message);
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error.response?.data?.message || "Error updating status. Please try again.",
//       });
//     }
//   };

//   const handleRejectClick = (service) => {
//     navigate("/reject", { state: { service } });
//   };

//   const handleServiceIdClick = (service, userId, selectedCompany) => {
//     navigate("/service-details", {
//       state: {
//         service,
//         userId,
//         selectedCompany,
//         extractedResourceId: resourceId,
//         resourceData: resourceData
//       },
//     });
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

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

//         {/* Status Filter Buttons */}
//         <div className="mb-3">
//           <div className="d-flex flex-wrap gap-2 justify-content-center">
//             {statusFilters.map((filter) => (
//               <Button
//                 key={filter}
//                 variant={activeFilter === filter ? "primary" : "outline-primary"}
//                 size="sm"
//                 onClick={() => handleFilterClick(filter)}
//                 className="text-nowrap"
//               >
//                 {filter}
//               </Button>
//             ))}
//           </div>
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
//                 <th className="py-3 px-3">Customer</th>
//                 <th className="py-3 px-3">Status</th>
//                 <th className="py-3 px-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-4">
//                     {searchTerm || activeFilter !== "All" 
//                       ? "No matching services found" 
//                       : "No services assigned to you"}
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
//                       onClick={() => handleServiceIdClick(service, userId, selectedCompany)}
//                     >
//                       {service.request_id || service.id}
//                     </td>
//                     <td className="py-3 px-3">
//                       {service.customer || "N/A"}
//                     </td>
//                     <td className="py-3 px-3">
//                       {service.status || "N/A"}
//                     </td>
//                     <td className="py-3 px-3">
//                       {service.status === "Under Process" ? (
//                         <span className="text-success fw-bold">Accepted</span>
//                       ) : service.assignment_status === "Declined" && service.assigned_engineer === resourceId ? (
//                         <span className="text-danger fw-bold">Rejected</span>
//                       ) : (["Pending", "Assigned"].includes(service.assignment_status) &&
//                           service.assigned_engineer === resourceId) ? (
//                         <div className="d-flex justify-content-center gap-2">
//                           <Button
//                             variant="success"
//                             size="sm"
//                             onClick={() =>
//                               handleAcceptClick(service.request_id, service.assignment_id)
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



//==========================================================================

// After fixing filter -Global search issue 



import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Form, InputGroup, ButtonGroup } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl"; 
import { useCompany } from "../../CompanyContext";
import Swal from "sweetalert2";

const ServiceTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [serviceItemsData, setServiceItemsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const { selectedCompany, updateCompany } = useCompany();
  const [resourceId, setResourceId] = useState(null);
  const [resourceData, setResourceData] = useState(null);
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Status options based on your first image
  const statusFilters = [
    "All",
    "Under Process",
    "Waiting for Spares",
    "Waiting for Quote",
    "Waiting for Client Approval",
    "Closed",
    "Reopened"
  ];

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/`);
      if (response.data && Array.isArray(response.data)) {
        setUsersData(response.data);
      }
    } catch (error) {
      console.error("Failed to load users data", error);
    }
  };

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      if (response.data.status === "success") {
        setCustomersData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load customers data", error);
    }
  };

  // Fetch resources data
  const fetchResources = async () => {
    try {
      const response = await axios.get(`${baseURL}/resources/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      if (response.data.status === "success") {
        setResourcesData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load resources data", error);
    }
  };

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}/companies/`);
      if (response.data.status === "success") {
        setCompaniesData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load companies data", error);
    }
  };

  // Fetch products data
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/products/`);
      if (response.data.status === "success") {
        setProductsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load products data", error);
    }
  };

  // Fetch service items data
  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      if (response.data.status === "success") {
        setServiceItemsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load service items data", error);
    }
  };

  // Function to get username from user ID
  const getUsernameById = (userId) => {
    if (!userId || usersData.length === 0) return userId;
    
    const user = usersData.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = usersData.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username} ${user.email || ''}` : userId;
  };

  // Function to get customer name by customer ID
  const getCustomerName = (customerId) => {
    if (!customerId || customersData.length === 0) return customerId;
    
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer ? `${customer.full_name} (${customer.username})` : customerId;
  };

  // Function to get customer search data
  const getCustomerSearchData = (customerId) => {
    if (!customerId) return '';
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
  };

  // Function to get resource name by resource ID
  const getResourceName = (resourceId) => {
    if (!resourceId || resourcesData.length === 0) return resourceId;
    
    const resource = resourcesData.find(res => res.resource_id === resourceId);
    return resource ? `${resource.first_name} ${resource.last_name}` : resourceId;
  };

  // Function to get resource search data
  const getResourceSearchData = (resourceId) => {
    if (!resourceId) return '';
    const resource = resourcesData.find(res => res.resource_id === resourceId);
    return resource ? `${resourceId} ${resource.first_name} ${resource.last_name} ${resource.email}` : resourceId;
  };

  // Function to get company name by company ID
  const getCompanyName = (companyId) => {
    if (!companyId || companiesData.length === 0) return companyId;
    
    const company = companiesData.find(comp => comp.company_id === companyId);
    return company ? company.company_name : companyId;
  };

  // Function to get product name by product ID
  const getProductName = (productId) => {
    if (!productId || productsData.length === 0) return productId;
    
    const product = productsData.find(prod => prod.product_id === productId);
    return product ? product.product_name : productId;
  };

  // Function to get service item info by service item ID
  const getServiceItemInfo = (serviceItemId) => {
    if (!serviceItemId || serviceItemsData.length === 0) return serviceItemId;
    
    const serviceItem = serviceItemsData.find(item => item.service_item_id === serviceItemId);
    if (!serviceItem) return serviceItemId;
    
    return `${serviceItemId} ${serviceItem.serial_number || ''} ${serviceItem.service_item_name || ''}`.trim();
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to format date-time for detailed timestamps
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
    ].join(' ');
  };

  const fetchData = async () => {
    try {
      console.log("🔹 Selected Company:", selectedCompany);
      console.log("🔹 User ID:", userId);

      if (!selectedCompany || !userId) {
        console.warn("selectedCompany or userId not ready yet");
        return;
      }

      // Fetch all relational data first
      await Promise.all([
        fetchUsers(),
        fetchCustomers(),
        fetchResources(),
        fetchCompanies(),
        fetchProducts(),
        fetchServiceItems()
      ]);

      // ✅ Fetch resource by company_id and user_id
      const resourceUrl = `${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`;
      const resourceRes = await axios.get(resourceUrl);
      const resourceData = resourceRes.data?.data || [];

      const currentResource = resourceData.find(res => res.user === userId);
      setResourceData(currentResource);
      const extractedResourceId = currentResource?.resource_id;

      setResourceId(extractedResourceId);
      console.log("✅ Fetched Resource ID:", extractedResourceId);

      if (!extractedResourceId) {
        setServices([]);
        return;
      }

      // ✅ Fetch service-pools and assignment-history in parallel
      const [servicesRes, assignmentsRes] = await Promise.all([
        axios.get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`),
        axios.get(`${baseURL}/assignment-history/?user_id=${userId}&company_id=${selectedCompany}`)
      ]);
      console.log("✅ Fetched service-pools", servicesRes);

      const allServices = Array.isArray(servicesRes.data)
        ? servicesRes.data
        : servicesRes.data.data || [];

      let assignments = Array.isArray(assignmentsRes.data)
        ? assignmentsRes.data
        : assignmentsRes.data.data || [];

      // 🔽 Sort assignments by latest date
      assignments.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // ✅ Latest assignment per (request_id, assigned_engineer)
      const userAssignmentMap = {};
      assignments.forEach(item => {
        const key = `${item.request}_${item.assigned_engineer}`;
        if (!userAssignmentMap[key]) {
          userAssignmentMap[key] = item;
        }
      });

      const assignedToUser = allServices
        .filter(service =>
          service.assigned_engineer === extractedResourceId ||
          Object.values(userAssignmentMap).some(
            assignment =>
              assignment.request === service.request_id &&
              assignment.assigned_engineer === extractedResourceId
          )
        )
        .map(service => {
          const userAssignment = Object.values(userAssignmentMap).find(
            assignment =>
              assignment.request === service.request_id &&
              assignment.assigned_engineer === extractedResourceId
          );

          return {
            ...service,
            assignment_id: userAssignment?.assignment_id || null,
            assignment_status: userAssignment?.status || service.status || "Pending",
            assigned_engineer: userAssignment?.assigned_engineer || service.assigned_engineer,
            is_current_user_assignment:
              userAssignment?.assigned_engineer === extractedResourceId,
            // Add assignment created_at for sorting
            assignment_created_at: userAssignment?.created_at || service.created_at
          };
        });

      // 🔽 SORT SERVICES BY LATEST DATE (Most recent first)
      assignedToUser.sort((a, b) => {
        const dateA = new Date(a.assignment_created_at || a.created_at);
        const dateB = new Date(b.assignment_created_at || b.created_at);
        return dateB - dateA;
      });

      console.log("✅ Assigned services count:", assignedToUser.length);
      setServices(assignedToUser);
    } catch (error) {
      console.error("🔴 Error fetching data:", error.response?.data || error.message || error);
    }
  };

  useEffect(() => {
    if (selectedCompany && userId) {
      fetchData();
    }
  }, [selectedCompany, userId]);

  // Enhanced global search functionality
  const enhancedFilteredServices = useMemo(() => {
    let filtered = services;

    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(service => 
        service.status === activeFilter || 
        service.assignment_status === activeFilter
      );
    }

    // Apply search filter if search term exists
    if (!searchTerm.trim()) {
      return filtered;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return filtered.filter((service) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(service.created_by);
      const updatedBySearch = getUserSearchData(service.updated_by);
      
      // Get other relational data for search
      const customerSearch = getCustomerSearchData(service.customer);
      const assignedEngineerSearch = getResourceSearchData(service.assigned_engineer);
      const companySearch = getCompanyName(service.company);
      const productSearch = getProductName(service.product);
      const serviceItemSearch = getServiceItemInfo(service.service_item);
      
      // Get dates in multiple formats for search
      const requestedDateFormats = formatDateForSearch(service.request_date);
      const closedDateFormats = formatDateForSearch(service.closed_date);
      const createdDateFormats = formatDateForSearch(service.created_at);
      const updatedDateFormats = formatDateForSearch(service.updated_at);
      const assignmentCreatedFormats = formatDateForSearch(service.assignment_created_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw service data
        service.request_id || '',
        service.service_name || '',
        service.status || '',
        service.priority || '',
        service.description || '',
        service.resolution_notes || '',
        service.feedback || '',
        service.rating || '',
        service.category || '',
        service.subcategory || '',
        service.location || '',
        service.city || '',
        service.state || '',
        service.country || '',
        service.zip_code || '',
        service.phone || '',
        service.email || '',
        service.customer || '',
        service.assigned_engineer || '',
        service.company || '',
        service.product || '',
        service.service_item || '',
        service.request_date || '',
        service.closed_date || '',
        service.created_at || '',
        service.updated_at || '',
        service.assignment_status || '',
        service.assignment_id || '',
        
        // Formatted relational data
        createdBySearch,
        updatedBySearch,
        customerSearch,
        assignedEngineerSearch,
        companySearch,
        productSearch,
        serviceItemSearch,
        
        // Dates in multiple formats
        requestedDateFormats,
        closedDateFormats,
        createdDateFormats,
        updatedDateFormats,
        assignmentCreatedFormats,
        
        // Display values (exactly as shown in table)
        formatDate(service.request_date),
        formatDate(service.closed_date),
        formatDateTime(service.created_at),
        formatDateTime(service.updated_at),
        getUsernameById(service.created_by),
        getUsernameById(service.updated_by),
        getCustomerName(service.customer),
        getResourceName(service.assigned_engineer),
        getCompanyName(service.company),
        getProductName(service.product),
        
        // Status variations for search
        service.status === 'Under Process' ? 'under process processing in progress ongoing' : '',
        service.status === 'Waiting for Spares' ? 'waiting for spares parts waiting pending spares' : '',
        service.status === 'Waiting for Quote' ? 'waiting for quote quotation price estimate' : '',
        service.status === 'Waiting for Client Approval' ? 'waiting for client approval customer approval pending approval' : '',
        service.status === 'Closed' ? 'closed completed finished done resolved' : '',
        service.status === 'Reopened' ? 'reopened reopened restarted again' : '',
        service.status === 'Assigned' ? 'assigned allocated given' : '',
        service.status === 'Pending' ? 'pending waiting queued' : '',
        
        // Priority variations
        service.priority === 'High' ? 'high urgent critical emergency' : '',
        service.priority === 'Medium' ? 'medium normal regular standard' : '',
        service.priority === 'Low' ? 'low minor trivial' : '',
        
        // Category variations
        service.category === 'Installation' ? 'installation install setup' : '',
        service.category === 'Repair' ? 'repair fix maintenance service' : '',
        service.category === 'Preventive Maintenance' ? 'preventive maintenance pm checkup' : '',
        service.category === 'Emergency' ? 'emergency urgent critical' : '',
        
        // Assignment status variations
        service.assignment_status === 'Accepted' ? 'accepted approved confirmed taken' : '',
        service.assignment_status === 'Declined' ? 'declined rejected refused' : '',
        service.assignment_status === 'Pending' ? 'pending assignment waiting assignment' : '',
        
        // Rating variations
        service.rating === 5 ? '5 five excellent outstanding perfect' : '',
        service.rating === 4 ? '4 four good great satisfied' : '',
        service.rating === 3 ? '3 three average okay neutral' : '',
        service.rating === 2 ? '2 two poor bad dissatisfied' : '',
        service.rating === 1 ? '1 one terrible awful horrible' : '',
        
        // Add any other properties that might exist
        ...Object.values(service).filter(val => 
          val !== null && val !== undefined
        ).map(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val);
          }
          if (typeof val === 'boolean') {
            return val ? 'true yes active' : 'false no inactive';
          }
          if (Array.isArray(val)) {
            return val.join(' ');
          }
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return '';
        })
      ]
      .join(' ')                    // Combine into one string
      .toLowerCase()                // Make case-insensitive
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
      
      return searchableText.includes(searchLower);
    });
  }, [searchTerm, services, activeFilter, usersData, customersData, resourcesData, companiesData, productsData, serviceItemsData]);

  // Update filteredServices when enhancedFilteredServices changes
  useEffect(() => {
    setFilteredServices(enhancedFilteredServices);
    setCurrentPage(1);
  }, [enhancedFilteredServices]);

  // Handle filter button click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleAcceptClick = async (serviceId, assignmentId) => {
    if (!serviceId || !assignmentId) {
      Swal.fire({
        icon: "error",
        title: "Missing IDs",
        text: "Missing serviceId or assignmentId.",
      });
      return;
    }

    try {
      // 1. Update service-pools status
      const serviceRes = await axios({
        method: 'get',
        url: `${baseURL}/service-pools/${serviceId}/`,
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      
      const serviceData = serviceRes.data;
      const updatedService = {
        ...serviceData,
        status: "Under Process",
        user_id: userId,
        company_id: selectedCompany,
      };

      await axios.put(`${baseURL}/service-pools/${serviceId}/`, updatedService);
      console.log("✅ service-pools status updated");

      // 2. Update assignment-history
      const assignmentRes = await axios.get(`${baseURL}/assignment-history/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany,
          assignment_id: assignmentId
        }
      });
      
      const assignments = assignmentRes.data.data || assignmentRes.data || [];
      const targetAssignment = Array.isArray(assignments) 
        ? assignments.find(a => a.assignment_id === assignmentId)
        : assignments;

      if (!targetAssignment) {
        Swal.fire({
          icon: "error",
          title: "Assignment Not Found",
          text: `Assignment ID ${assignmentId} not found.`,
        });
        return;
      }

      const updatedAssignment = {
        ...targetAssignment,
        status: "Accepted",
        updated_by: targetAssignment.updated_by || "system",
        user_id: userId,
        company_id: selectedCompany
      };

      await axios.put(`${baseURL}/assignment-history/${targetAssignment.id || assignmentId}/`, updatedAssignment);
      console.log("✅ assignment-history updated");

      // 3. REFRESH DATA
      await fetchData();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Service ID ${serviceId} accepted successfully.`,
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("🔴 Error in handleAcceptClick:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Error updating status. Please try again.",
      });
    }
  };

  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  const handleServiceIdClick = (service, userId, selectedCompany) => {
    navigate("/service-details", {
      state: {
        service,
        userId,
        selectedCompany,
        extractedResourceId: resourceId,
        resourceData: resourceData
      },
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
        </div>

        {/* Search Input with Clear Button */}
        <div className="mb-3">
          <div className="d-flex gap-2">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search in all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-secondary"
              />
              <InputGroup.Text className="bg-light">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
            </InputGroup>
            {searchTerm && (
              <Button 
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
                size="sm"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="alert alert-info mb-3 py-2">
            <strong>Search Results:</strong> Found {filteredServices.length} service(s) matching "{searchTerm}"
          </div>
        )}

        {/* Status Filter Buttons */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => handleFilterClick(filter)}
                className="text-nowrap"
              >
                {filter}
              </Button>
            ))}
          </div>
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
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {searchTerm || activeFilter !== "All" 
                      ? `No services found matching "${searchTerm}"` 
                      : "No services assigned to you"}
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
                      onClick={() => handleServiceIdClick(service, userId, selectedCompany)}
                      title={`Click to view details. ID: ${service.request_id || service.id}`}
                    >
                      {service.request_id || service.id}
                    </td>
                    <td className="py-3 px-3" title={`Customer ID: ${service.customer}`}>
                      {getCustomerName(service.customer)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`badge ${
                        service.status === 'Under Process' ? 'bg-info' :
                        service.status === 'Waiting for Spares' ? 'bg-warning text-dark' :
                        service.status === 'Waiting for Quote' ? 'bg-warning text-dark' :
                        service.status === 'Waiting for Client Approval' ? 'bg-warning text-dark' :
                        service.status === 'Closed' ? 'bg-success' :
                        service.status === 'Reopened' ? 'bg-primary' :
                        'bg-secondary'
                      }`}>
                        {service.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {service.status === "Under Process" ? (
                        <span className="text-success fw-bold">Accepted</span>
                      ) : service.assignment_status === "Declined" && service.assigned_engineer === resourceId ? (
                        <span className="text-danger fw-bold">Rejected</span>
                      ) : (["Pending", "Assigned"].includes(service.assignment_status) &&
                          service.assigned_engineer === resourceId) ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleAcceptClick(service.request_id, service.assignment_id)
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