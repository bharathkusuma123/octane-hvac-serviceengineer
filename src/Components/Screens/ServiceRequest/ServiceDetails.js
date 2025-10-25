// import React, { useState, useEffect } from 'react';
// import { Button, Form } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';
// import axios from 'axios';
// import baseURL from '../../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';
// const statusOptions = [
//   'Under Process',
//   'Waiting for Spares',
//   'Waiting for Quote',
//   'Waiting for Client Approval',
//   'Closed',
//   'Reopened',
// ];

// const ServiceDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { service } = location.state || {};
//   console.log("request id",service.request_id);
//   const [status, setStatus] = useState(service?.status || '');
//   const [updating, setUpdating] = useState(false);

//   if (!service) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mt-5">
//           <div className="alert alert-danger">No service data found</div>
//           <Button onClick={() => navigate(-1)}>Go Back</Button>
//         </div>
//       </>
//     );
//   }


// const handleStatusChange = async (e) => {
//   const newStatus = e.target.value;
//   setStatus(newStatus);
//   setUpdating(true);

//   console.log("Selected new status:", newStatus);
//   console.log("Sending PUT request to /service-pools/ to update status...");

//   try {
//     const requestId = service.request_id;

//     if (!requestId) {
//       alert("Missing service request ID");
//       setUpdating(false);
//       return;
//     }

//     await axios.put(`${baseURL}/service-pools/${requestId}/`, {
//       ...service, 
//       status: newStatus, 
//     });

//     // console.log("✅ Status updated successfully in service-pools!");
//     alert("Status updated successfully!");
//   } catch (err) {
//     console.error("Error updating status in service-pools:", err);
//     alert(
//       "Failed to update status. Error: " +
//         (err.response?.data?.message || err.message)
//     );
//   } finally {
//     setUpdating(false);
//   }
// };



//   return (
//     <>
//       <Navbar />
//       <div className="container mt-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h5 className="card-title">
//               Service ID: {service.request_id || service.id}
//             </h5>

//             <div className="mt-4">
//               <h6>Details:</h6>
//               <div className="row mt-3">
//                 <div className="col-md-6">
//                   <p><strong>Request Details:</strong> {service.request_details || 'N/A'}</p>
//                   <p><strong>Estimated Completion:</strong> {service.estimated_completion_time || 'N/A'}</p>
//                   <p><strong>Start Date & Time:</strong> {service.est_start_datetime || 'N/A'}</p>
//                   <p><strong>End Date & Time:</strong> {service.est_end_datetime || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <Form.Group>
//                 <Form.Label><strong>Status</strong></Form.Label>
//                 <Form.Select value={status} onChange={handleStatusChange} disabled={updating}>
//                   <option value="">-- Select Status --</option>
//                   {statusOptions.map((opt) => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </div>

//             <div className="mt-4 text-end">
//               <Button variant="primary" onClick={() => navigate(-1)} disabled={updating}>
//                 Back to Services
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ServiceDetails;




import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import baseURL from '../../ApiUrl/Apiurl';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

const statusOptions = [
  'Under Process',
  'Waiting for Spares',
  'Waiting for Quote',
  'Waiting for Client Approval',
  'Closed',
  'Reopened',
];

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
 const { service, userId, selectedCompany } = location.state || {};
 console.log("service details",JSON.stringify(service, null, 2));
  const [status, setStatus] = useState(service?.status || '');
  const [updating, setUpdating] = useState(false);

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger">No service data found</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </>
    );
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);

    const requestId = service.request_id;

    if (!requestId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Request ID',
        text: 'Service request ID is missing.',
      });
      setUpdating(false);
      return;
    }

    try {
      await axios.put(`${baseURL}/service-pools/${requestId}/`, {
        ...service,
        status: newStatus,
        user_id: userId,
        company_id: selectedCompany
      });

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Service status changed to "${newStatus}" successfully.`,
      });
    } catch (err) {
      console.error('Error updating status in service-pools:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong.',
      });
    } finally {
      setUpdating(false);
    }
  };
  const formatDateTime = (date, time) => {
  if (!date && !time) return 'N/A';
  
  try {
    // Handle combined datetime (ISO format)
    const dt = new Date(time ? `${date}T${time}` : date);

    // Format it nicely
    return dt.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return 'Invalid Date';
  }
};


  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              Service ID: {service.request_id || service.id}
            </h5>

            <div className="mt-4">
              <h6>Details:</h6> 
              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Request Details:</strong> {service.request_details || 'N/A'}</p>
                  <p><strong>Estimated Completion:</strong> {service.estimated_completion_time || 'N/A'}</p>
<p><strong>Preferred Date & Time:</strong> 
  {formatDateTime(service.preferred_date, service.preferred_time)}
</p>

<p><strong>Start Date & Time:</strong> 
  {formatDateTime(service.est_start_datetime)}
</p>

<p><strong>End Date & Time:</strong> 
  {formatDateTime(service.est_end_datetime)}
</p>

                </div>
              </div>
            </div>

            <div className="mt-4">
              <Form.Group>
                <Form.Label><strong>Status</strong></Form.Label>
                <Form.Select value={status} onChange={handleStatusChange} disabled={updating}>
                  <option value="">-- Select Status --</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="mt-4 text-end">
              <Button variant="primary" onClick={() => navigate(-1)} disabled={updating}>
                Back to Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;


