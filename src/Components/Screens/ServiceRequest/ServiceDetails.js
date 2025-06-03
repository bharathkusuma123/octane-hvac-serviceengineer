import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const statusOptions = [
  // 'Assigned',
  'Under Process',
  'Waiting for Spareparts',
  'Waiting for Quote',
  'Waiting for Client Approval',
  'Service Completed',
  'Service Closed',
  'Re-Opened',
];

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};
  console.log("request id",service.request_id);
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

  console.log('Selected new status:', newStatus);
  console.log('Requesting service orders to find matching order...');

  try {
    const ordersRes = await axios.get('http://175.29.21.7:8006/service-orders/');
    console.log('Service Orders response:', ordersRes.data);

    // Access the nested data array and find the matching order
    const matchedOrder = ordersRes.data.data.find(
      (order) => order.service_request_id === service.request_id.toString()
    );

    if (!matchedOrder) {
      console.warn('No matching service order found for:', service.request_id);
      alert('Service Order not found for the given request ID.');
      setUpdating(false);
      return;
    }

    const serviceOrderId = matchedOrder.service_order_id; // Using service_order_id instead of id
    console.log('Found service_order_id:', serviceOrderId);

    console.log('Sending PUT request to update status...');
    console.log("service request id:", service.request_id);
    console.log("service order id:", serviceOrderId);

    // Update the service order status
    await axios.put(`http://175.29.21.7:8006/service-orders/${serviceOrderId}/`, {
      status: newStatus,
    });

    console.log('Status update successful!');
    alert('Status updated successfully!');
  } catch (err) {
    console.error('Error during status update:', err);
    alert('Failed to update status. Error: ' + (err.response?.data?.message || err.message));
  } finally {
    setUpdating(false);
  }
};

// const handleStatusChange = async (e) => {
//   const newStatus = e.target.value;
//   setStatus(newStatus);
//   setUpdating(true);

//   console.log('Selected new status:', newStatus);
//   console.log('Requesting service orders to find matching order...');

//   try {
//     // Get all service orders
//     const ordersRes = await axios.get('http://175.29.21.7:8006/service-orders/');
//     console.log('Service Orders response:', ordersRes.data);

//     // Find the matching order
//     const matchedOrder = ordersRes.data.data.find(
//       (order) => order.service_request_id === service.request_id.toString()
//     );

//     if (!matchedOrder) {
//       console.warn('No matching service order found for:', service.request_id);
//       alert('Service Order not found for the given request ID.');
//       setUpdating(false);
//       return;
//     }

//     const serviceOrderId = matchedOrder.service_order_id;
//     console.log('Found service_order_id:', serviceOrderId);

//     // Make both API calls simultaneously
//     await Promise.all([
//       // Update service order status
//       axios.put(`http://175.29.21.7:8006/service-orders/${serviceOrderId}/`, {
//         status: newStatus,
//       }),
      
//       // Update service pool status
//       axios.put(`http://175.29.21.7:8006/service-pools/${service.request_id}/`, {
//         status: newStatus,
//       })
//     ]);

//     console.log('Both status updates successful!');
//     alert('Status updated successfully in both systems!');
//   } catch (err) {
//     console.error('Error during status update:', err);
    
//     // Provide more detailed error information
//     const errorMessage = err.response?.data?.message || 
//                         err.response?.data?.detail || 
//                         err.message;
//     alert(`Failed to update status. Error: ${errorMessage}`);
//   } finally {
//     setUpdating(false);
//   }
// };

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
                  <p><strong>Estimated Completion:</strong> {service.estimated_completion_time || 'N/A'}</p>
                  <p><strong>Start Date & Time:</strong> {service.est_start_datetime || 'N/A'}</p>
                  <p><strong>End Date & Time:</strong> {service.est_end_datetime || 'N/A'}</p>
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
