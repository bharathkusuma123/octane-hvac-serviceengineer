import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};

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
                {/* Left Column */}
                <div className="col-md-6">
                  <p>
                    <strong>Estimated Completion:</strong>{' '}
                    {service.estimated_completion_time || 'N/A'}
                  </p>
                  <p>
                    <strong>Start Date & Time:</strong>{' '}
                    {service.est_start_datetime || 'N/A'}
                  </p>
                  <p>
                    <strong>End Date & Time:</strong>{' '}
                    {service.est_end_datetime || 'N/A'}
                  </p>
                </div>

                {/* Right Column */}
                {/* <div className="col-md-6">
                  <p>
                    <strong>Status:</strong>{' '}
                    {service.status || 'N/A'}
                  </p>
                  <p>
                    <strong>Assigned Engineer:</strong>{' '}
                    {service.assigned_engineer || 'N/A'}
                  </p>
                  <p>
                    <strong>Source Type:</strong>{' '}
                    {service.source_type || 'N/A'}
                  </p>
                </div> */}
              </div>
            </div>

            <div className="mt-4 text-end">
              <Button variant="primary" onClick={() => navigate(-1)}>
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
