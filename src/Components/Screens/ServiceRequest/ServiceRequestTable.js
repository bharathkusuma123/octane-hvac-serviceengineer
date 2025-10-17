import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
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
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [declinedServices, setDeclinedServices] = useState([]);
  const { selectedCompany, updateCompany } = useCompany();
  const [resourceId, setResourceId] = useState(null);
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");


const fetchData = async () => {
  try {
    console.log("🔹 Selected Company:", selectedCompany);
    console.log("🔹 User ID:", userId);

    if (!selectedCompany || !userId) {
      console.warn("selectedCompany or userId not ready yet");
      return;
    }

    // ✅ Fetch resource by company_id and user_id
    const resourceUrl = `${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`;
    // console.log("Fetching Resource from:", resourceUrl);

    const resourceRes = await axios.get(resourceUrl);
    const resourceData = resourceRes.data?.data || [];

    const currentResource = resourceData.find(res => res.user === userId);
    const extractedResourceId = currentResource?.resource_id;

    // console.log("Extracted resource_id:", extractedResourceId);

    setResourceId(extractedResourceId);

    if (!extractedResourceId) {
      // console.warn("No matching resource_id found for this user.");
      setServices([]);
      return;
    }

    // ✅ Fetch service-pools and assignment-history in parallel
    const [servicesRes, assignmentsRes] = await Promise.all([
      axios.get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`),
      axios.get(`${baseURL}/assignment-history/?user_id=${userId}&company_id=${selectedCompany}`)
    ]);

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
      // Prioritize assignment date, fallback to service creation date
      const dateA = new Date(a.assignment_created_at || a.created_at);
      const dateB = new Date(b.assignment_created_at || b.created_at);
      return dateB - dateA; // Descending order (newest first)
    });

    console.log("✅ Assigned services count:", assignedToUser.length);
    console.log("📅 Services sorted by latest date (most recent first)");
    
    setServices(assignedToUser);
    setFilteredServices(assignedToUser);
  } catch (error) {
    console.error("🔴 Error fetching data:", error.response?.data || error.message || error);
  }
};

useEffect(() => {
  if (selectedCompany && userId) {
    fetchData();
  }
}, [selectedCompany, userId]);


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

    // 2. Update assignment-history - FIXED ENDPOINT
    // First, get all assignments to find the correct one
    const assignmentRes = await axios.get(`${baseURL}/assignment-history/`, {
      params: {
        user_id: userId,
        company_id: selectedCompany,
        assignment_id: assignmentId // Filter by assignment_id if supported
      }
    });
    
    const assignments = assignmentRes.data.data || assignmentRes.data || [];
    
    // Find the specific assignment
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

    // Update the assignment - use the correct identifier (might be 'id' instead of 'assignment_id')
    const updatedAssignment = {
      ...targetAssignment,
      status: "Accepted",
      updated_by: targetAssignment.updated_by || "system",
      user_id: userId,
      company_id: selectedCompany
    };

    // Use the correct identifier for the PUT request
    // Try using the assignment's ID if assignment_id doesn't work
    await axios.put(`${baseURL}/assignment-history/${targetAssignment.id || assignmentId}/`, updatedAssignment);
    console.log("✅ assignment-history updated");

    // 3. REFRESH DATA - Call the same fetch logic as in useEffect
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
    },
  });
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
                <th className="py-3 px-3">Customer</th>
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
                      onClick={() => handleServiceIdClick(service, userId, selectedCompany)}
                    >
                      {service.request_id || service.id}
                    </td>

                    <td 
                      className="py-3 px-3 text-primary"
                     
                    >
                     {service.customer || "N/A"}
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