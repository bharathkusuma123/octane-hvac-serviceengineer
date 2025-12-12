import React from 'react';
import { Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import PDFContent from './PDFContent'; // Import the fixed PDF layout

const PdfReportButton = ({ 
  service, 
  getCustomerName, 
  getResourceName, 
  formatDate,
  resourceData 
}) => {
  
  // Prepare data for PDF
  const preparePDFData = () => {
    const currentDate = new Date();
    
    return {
      serviceDetails: {
        serviceDate: formatDate(service.request_date),
        serviceTime: currentDate.toLocaleTimeString(),
        problemType: service.category || 'N/A',
        reportedIssue: service.description || 'No issue reported',
        issueDescription: service.description || '',
        issueDescription2: '',
        issueDescription3: '',
        workPerformed: service.resolution_notes || '',
        workPerformed2: '',
        workPerformed3: '',
        outcomeComments: service.feedback || '',
        visualInspectionComments: service.resolution_notes || '',
      },
      customerInfo: {
        name: getCustomerName(service.customer),
        address: `${service.location || ''}, ${service.city || ''}, ${service.state || ''}`,
        contactPerson: getCustomerName(service.customer),
        phone: service.phone || 'N/A',
      },
      serviceItemInfo: {
        id: service.service_item || 'N/A',
        address: `${service.location || ''}, ${service.city || ''}`,
        warrantyStart: formatDate(service.created_at),
        warrantyEnd: formatDate(service.closed_date) || 'Open',
        underWarranty: service.status === 'Under Warranty',
        totalRequests: 'N/A', // You might need to fetch this data
      },
      technicianInfo: {
        name: resourceData ? `${resourceData.first_name} ${resourceData.last_name}` : 'N/A',
        date: formatDate(currentDate),
      }
    };
  };

  return (
    <PDFDownloadLink
      document={<PDFContent {...preparePDFData()} />}
      fileName={`Service_Report_${service.request_id || 'report'}.pdf`}
    >
      {({ blob, url, loading, error }) => {
        const handleClick = () => {
          if (loading) {
            Swal.fire({
              title: 'Generating PDF...',
              text: 'Please wait',
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              }
            });
          } else if (error) {
            Swal.fire({
              icon: 'error',
              title: 'Failed to generate PDF',
              text: error.message || 'Please try again',
            });
          }
        };

        return (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleClick}
            className="px-3"
            title="Download PDF Report"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split me-1"></i> Generating...
              </>
            ) : (
              <>
                <i className="bi bi-download me-1"></i> Report
              </>
            )}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default PdfReportButton;