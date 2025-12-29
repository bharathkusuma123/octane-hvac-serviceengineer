// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import Swal from 'sweetalert2';
// import PDFContent from './PDFContent'; // Import the fixed PDF layout

// const PdfReportButton = ({
//   service,
//   getCustomerName,
//   getResourceName,
//   formatDate,
//   formatDateTime,
//   getProblemTypeName,
//   serviceDate,
//   serviceTime,
//   problemType,
//   reportedIssue

// }) => {

//   // Prepare data for PDF
//   const preparePDFData = () => {
//     const currentDate = new Date();

//     return {
//       serviceDetails: {
//         serviceDate: formatDate(serviceDate),
//         serviceTime: serviceTime,
//         problemType: problemType,
//   reportedIssue: reportedIssue,
//           issueDescription: service.description || '',
//         issueDescription2: '',
//         issueDescription3: '',
//         workPerformed: service.resolution_notes || '',
//         workPerformed2: '',
//         workPerformed3: '',
//         outcomeComments: service.feedback || '',
//         visualInspectionComments: service.resolution_notes || '',
//       },
//       customerInfo: {
//         name: getCustomerName(service.customer),
//         address: `${service.location || ''}, ${service.city || ''}, ${service.state || ''}`,
//         contactPerson: getCustomerName(service.customer),
//         phone: service.phone || 'N/A',
//       },
//       serviceItemInfo: {
//         id: service.service_item || 'N/A',
//         address: `${service.location || ''}, ${service.city || ''}`,
//         warrantyStart: formatDate(service.created_at),
//         warrantyEnd: formatDate(service.closed_date) || 'Open',
//         underWarranty: service.status === 'Under Warranty',
//         totalRequests: 'N/A', // You might need to fetch this data
//       },
//       technicianInfo: {
//         // name: resourceData ? `${resourceData.first_name} ${resourceData.last_name}` : 'N/A',
//         date: formatDate(currentDate),
//       }
//     };
//   };

//   return (
//     <PDFDownloadLink
//       document={<PDFContent {...preparePDFData()} />}
//       fileName={`Service_Report_${service.request_id || 'report'}.pdf`}
//     >
//       {({ blob, url, loading, error }) => {
//         const handleClick = () => {
//           if (loading) {
//             Swal.fire({
//               title: 'Generating PDF...',
//               text: 'Please wait',
//               allowOutsideClick: false,
//               showConfirmButton: false,
//               willOpen: () => {
//                 Swal.showLoading();
//               }
//             });
//           } else if (error) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Failed to generate PDF',
//               text: error.message || 'Please try again',
//             });
//           }
//         };

//         return (
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={handleClick}
//             className="px-3"
//             title="Download PDF Report"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <i className="bi bi-hourglass-split me-1"></i> Generating...
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-download me-1"></i> Report
//               </>
//             )}
//           </Button>
//         );
//       }}
//     </PDFDownloadLink>
//   );
// };

// export default PdfReportButton;


// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import Swal from 'sweetalert2';
// import PDFContent from './PDFContent';

// const PdfReportButton = ({
//   service,
//   getCustomerName,
//   getResourceName,
//   formatDate,
//   formatDateTime,
//   getProblemTypeName,
//   serviceDate,
//   serviceTime,
//   problemType,
//   reportedIssue,
//   getServiceItemDetails, // Add this prop
//   serviceItemInfo // Add this prop
// }) => {

//   // Prepare data for PDF
//   const preparePDFData = () => {
//     const currentDate = new Date();
    
//     // Get service item details from either prop or function
//     const itemDetails = serviceItemInfo || 
//       (getServiceItemDetails && service.service_item ? 
//         getServiceItemDetails(service.service_item) : 
//         {
//           service_item_id: service.service_item || 'N/A',
//           service_item_address: 'N/A',
//           warranty_start_date: 'N/A',
//           warranty_end_date: 'N/A',
//           under_warranty: 'No',
//           pm_details: 'N/A',
//           service_request_count: 0
//         }
//       );

//     return {
//       serviceDetails: {
//         serviceDate: formatDate(serviceDate),
//         serviceTime: serviceTime,
//         problemType: problemType,
//         reportedIssue: reportedIssue,
//         issueDescription: service.description || '',
//         issueDescription2: '',
//         issueDescription3: '',
//         workPerformed: service.resolution_notes || '',
//         workPerformed2: '',
//         workPerformed3: '',
//         outcomeComments: service.feedback || '',
//         visualInspectionComments: service.resolution_notes || '',
//         // Additional service details
//         serviceId: service.request_id || service.id,
//         serviceName: service.service_name || 'N/A',
//         status: service.status || 'N/A',
//         priority: service.priority || 'N/A',
//         category: service.category || 'N/A',
//         subcategory: service.subcategory || 'N/A',
//         requestDate: formatDate(service.request_date),
//         closedDate: formatDate(service.closed_date),
//         createdDate: formatDateTime(service.created_at),
//         updatedDate: formatDateTime(service.updated_at),
//       },
//       customerInfo: {
//         name: getCustomerName(service.customer),
//         address: `${service.address || ''}, ${service.city || ''}, ${service.state || ''}, ${service.zip_code || ''}`,
//         contactPerson: getCustomerName(service.customer),
//         phone: service.mobile || 'N/A',
//         email: service.email || 'N/A',
//         customerId: service.customer || 'N/A',

//       },
//       serviceItemInfo: {
//         id: itemDetails.service_item_id,
//         name: itemDetails.service_item_name || 'N/A',
//         serialNumber: itemDetails.serial_number || 'N/A',
//         address: itemDetails.service_item_address,
//         warrantyStart: itemDetails.warranty_start_date,
//         warrantyEnd: itemDetails.warranty_end_date,
//         underWarranty: itemDetails.under_warranty === 'Yes',
//         pmDetails: itemDetails.pm_details,
//         totalRequests: itemDetails.service_request_count || 0,
//         installationDate: itemDetails.installation_date || 'N/A',
//         productDescription: itemDetails.product_description || 'N/A',
//         status: itemDetails.status || 'N/A',
//         iotStatus: itemDetails.iot_status || 'N/A',
//         location: service.location || 'N/A',
//         city: service.city || 'N/A',
//         state: service.state || 'N/A',
//         country: service.country || 'N/A',
//         zipCode: service.zip_code || 'N/A',
//       },
//       technicianInfo: {
//         name: getResourceName(service.assigned_engineer),
//         date: formatDate(currentDate),
//         time: currentDate.toLocaleTimeString('en-IN', { hour12: true }),
//         // Add resource details if available
//         engineerId: service.assigned_engineer || 'N/A',
//         company: service.company_name || 'N/A',
//       },
//       // Additional info for PDF
//       reportMetadata: {
//         generatedOn: formatDateTime(currentDate),
//         reportId: `REPORT_${service.request_id || 'UNKNOWN'}_${Date.now()}`,
//         companyName: 'Service Report',
//       }
//     };
//   };

//   return (
//     <PDFDownloadLink
//       document={<PDFContent {...preparePDFData()} />}
//       fileName={`Service_Report_${service.request_id || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`}
//     >
//       {({ blob, url, loading, error }) => {
//         const handleClick = () => {
//           if (loading) {
//             Swal.fire({
//               title: 'Generating PDF...',
//               text: 'Please wait',
//               allowOutsideClick: false,
//               showConfirmButton: false,
//               willOpen: () => {
//                 Swal.showLoading();
//               }
//             });
//           } else if (error) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Failed to generate PDF',
//               text: error.message || 'Please try again',
//             });
//           }
//         };

//         return (
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={handleClick}
//             className="px-3"
//             title="Download PDF Report"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <i className="bi bi-hourglass-split me-1"></i> Generating...
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-download me-1"></i> Report
//               </>
//             )}
//           </Button>
//         );
//       }}
//     </PDFDownloadLink>
//   );
// };

// export default PdfReportButton;



// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import Swal from 'sweetalert2';
// import PDFContent from './PDFContent';

// const PdfReportButton = ({
//   service,
//   getCustomerName,
//   getResourceName,
//   formatDate,
//   formatDateTime,
//   getProblemTypeName,
//   serviceDate,
//   serviceTime,
//   problemType,
//   reportedIssue,
//   getServiceItemDetails,
//   serviceItemInfo,
//   customerInfo // Add this prop
// }) => {

//   // Prepare data for PDF
//   const preparePDFData = () => {
//     const currentDate = new Date();
    
//     // Get service item details from either prop or function
//     const itemDetails = serviceItemInfo || 
//       (getServiceItemDetails && service.service_item ? 
//         getServiceItemDetails(service.service_item) : 
//         {
//           service_item_id: service.service_item || 'N/A',
//           service_item_address: 'N/A',
//           warranty_start_date: 'N/A',
//           warranty_end_date: 'N/A',
//           under_warranty: 'No',
//           pm_details: 'N/A',
//           service_request_count: 0
//         }
//       );

//     // Use the passed customerInfo or construct from service object
//     const pdfCustomerInfo = customerInfo || {
//       name: getCustomerName(service.customer || service.customer_id),
//       address: service.address || 'N/A',
//       contactPerson: getCustomerName(service.customer || service.customer_id),
//       phone: service.mobile || 'N/A',
//       email: service.email || 'N/A',
//       customerId: service.customer || service.customer_id || 'N/A',
//     };

//     return {
//       serviceDetails: {
//         serviceDate: formatDate(serviceDate),
//         serviceTime: serviceTime,
//         problemType: problemType,
//         reportedIssue: reportedIssue,
//         issueDescription: service.description || '',
//         issueDescription2: '',
//         issueDescription3: '',
//         workPerformed: service.resolution_notes || '',
//         workPerformed2: '',
//         workPerformed3: '',
//         outcomeComments: service.feedback || '',
//         visualInspectionComments: service.resolution_notes || '',
//         serviceId: service.request_id || service.id,
//         serviceName: service.service_name || 'N/A',
//         status: service.status || 'N/A',
//         priority: service.priority || 'N/A',
//         category: service.category || 'N/A',
//         subcategory: service.subcategory || 'N/A',
//         requestDate: formatDate(service.request_date),
//         closedDate: formatDate(service.closed_date),
//         createdDate: formatDateTime(service.created_at),
//         updatedDate: formatDateTime(service.updated_at),
//       },
//       customerInfo: pdfCustomerInfo, // Use the constructed customer info
//       serviceItemInfo: {
//         id: itemDetails.service_item_id,
//         name: itemDetails.service_item_name || 'N/A',
//         serialNumber: itemDetails.serial_number || 'N/A',
//         address: itemDetails.service_item_address,
//         warrantyStart: itemDetails.warranty_start_date,
//         warrantyEnd: itemDetails.warranty_end_date,
//         underWarranty: itemDetails.under_warranty === 'Yes',
//         pmDetails: itemDetails.pm_details,
//         totalRequests: itemDetails.service_request_count || 0,
//         installationDate: itemDetails.installation_date || 'N/A',
//         productDescription: itemDetails.product_description || 'N/A',
//         status: itemDetails.status || 'N/A',
//         iotStatus: itemDetails.iot_status || 'N/A',
//         location: service.location || 'N/A',
//         city: service.city || 'N/A',
//         state: service.state || 'N/A',
//         country: service.country || 'N/A',
//         zipCode: service.zip_code || 'N/A',
//       },
//       technicianInfo: {
//         name: getResourceName(service.assigned_engineer),
//         date: formatDate(currentDate),
//         time: currentDate.toLocaleTimeString('en-IN', { hour12: true }),
//         engineerId: service.assigned_engineer || 'N/A',
//         company: service.company_name || 'N/A',
//       },
//       reportMetadata: {
//         generatedOn: formatDateTime(currentDate),
//         reportId: `REPORT_${service.request_id || 'UNKNOWN'}_${Date.now()}`,
//         companyName: 'Service Report',
//       }
//     };
//   };

//   return (
//     <PDFDownloadLink
//       document={<PDFContent {...preparePDFData()} />}
//       fileName={`Service_Report_${service.request_id || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`}
//     >
//       {({ blob, url, loading, error }) => {
//         const handleClick = () => {
//           if (loading) {
//             Swal.fire({
//               title: 'Generating PDF...',
//               text: 'Please wait',
//               allowOutsideClick: false,
//               showConfirmButton: false,
//               willOpen: () => {
//                 Swal.showLoading();
//               }
//             });
//           } else if (error) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Failed to generate PDF',
//               text: error.message || 'Please try again',
//             });
//           }
//         };

//         return (
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={handleClick}
//             className="px-3"
//             title="Download PDF Report"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <i className="bi bi-hourglass-split me-1"></i> Generating...
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-download me-1"></i> Report
//               </>
//             )}
//           </Button>
//         );
//       }}
//     </PDFDownloadLink>
//   );
// };

// export default PdfReportButton;

// //==============================
// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import Swal from 'sweetalert2';
// import PDFContent from './PDFContent';

// const PdfReportButton = ({
//   service,
//   getCustomerName,
//   getResourceName,
//   formatDate,
//   formatDateTime,
//   getProblemTypeName,
//   serviceDate,
//   serviceTime,
//   problemType,
//   reportedIssue,
//   getServiceItemDetails,
//   serviceItemInfo,
//   customerInfo, // Make sure this is being passed correctly from parent
//   customersData, // Add this prop to get customer data
//   usersData,
//   resourcesData,
//   resourceData,
//   getEngineerDetails // Add this for any user-related info
  
// }) => {

//   // Helper function to get complete customer details
//   const getCompleteCustomerInfo = () => {
//     // If customerInfo is already passed and contains all needed data, use it
//     if (customerInfo && customerInfo.name && customerInfo.phone) {
//       return customerInfo;
//     }
    
//     // Otherwise, find customer in customersData
//     const customerId = service.customer || service.customer_id;
//     if (!customerId || !customersData || customersData.length === 0) {
//       return {
//         name: getCustomerName(customerId),
//         address: 'N/A',
//         contactPerson: getCustomerName(customerId),
//         phone: 'N/A',
//         email: 'N/A',
//         customerId: customerId || 'N/A',
//       };
//     }
    
//     const customer = customersData.find(cust => cust.customer_id === customerId);
    
//     if (!customer) {
//       return {
//         name: getCustomerName(customerId),
//         address: 'N/A',
//         contactPerson: getCustomerName(customerId),
//         phone: 'N/A',
//         email: 'N/A',
//         customerId: customerId || 'N/A',
//       };
//     }
    
//     // Construct address from available fields
//     const addressParts = [
//       customer.address,
//       customer.location,
//       customer.city,
//       customer.state,
//       customer.country,
//       customer.zip_code
//     ].filter(part => part && part.trim() !== '');
    
//     const address = addressParts.join(', ') || 'N/A';
    
//     // Construct phone number with country code
//     const phone = customer.mobile ? 
//       `${customer.country_code || ''} ${customer.mobile}`.trim() : 'N/A';
    
//     return {
//       name: customer.full_name || customer.username || 'N/A',
//       address: customer.address,
//       contactPerson: customer.full_name || customer.username || 'N/A',
//       phone: phone,
//       email: customer.email || 'N/A',
//       customerId: customer.customer_id,
//       companyName: customer.company_name || 'N/A',
//       designation: customer.designation || 'N/A',
//       // Add any other fields you need
//     };
//   };

//   // Prepare data for PDF
//   const preparePDFData = () => {
//     const currentDate = new Date();
    
//     // Get complete customer info
//     const pdfCustomerInfo = getCompleteCustomerInfo();
    
//     // Get service item details from either prop or function
//     const itemDetails = serviceItemInfo || 
//       (getServiceItemDetails && service.service_item ? 
//         getServiceItemDetails(service.service_item) : 
//         {
//           service_item_id: service.service_item || 'N/A',
//           service_item_address: 'N/A',
//           warranty_start_date: 'N/A',
//           warranty_end_date: 'N/A',
//           under_warranty: 'No',
//           pm_details: 'N/A',
//           service_request_count: 0
//         }
//       );

//        // Get engineer name by matching ID
//  const getTechnicianName = () => {
//   const engineerId = service.assigned_engineer;
//   console.log("🛠️ Engineer ID:", engineerId);
  
//   if (!engineerId) return "Not Assigned";
  
//   // **DIRECT APPROACH: Search in resourcesData for full name**
//   if (resourcesData && resourcesData.length > 0) {
//     console.log("📋 Available resources:", resourcesData);
    
//     // Convert engineerId to string for comparison
//     const engineerIdStr = String(engineerId);
    
//     // Try to find the engineer in resourcesData
//     const engineer = resourcesData.find(res => {
//       // Check all possible ID fields
//       const resId = res.resource_id ? String(res.resource_id) : '';
//       const resId2 = res.id ? String(res.id) : '';
//       const resUserId = res.user ? String(res.user) : '';
      
//       console.log(`Comparing ${engineerIdStr} with:`, {
//         resource_id: resId,
//         id: resId2,
//         user: resUserId,
//         first_name: res.first_name,
//         last_name: res.last_name
//       });
      
//       return resId === engineerIdStr || 
//              resId2 === engineerIdStr || 
//              resUserId === engineerIdStr;
//     });
    
//     if (engineer) {
//       console.log("✅ Found engineer:", engineer);
      
//       // Get first name and last name
//       const firstName = engineer.first_name || '';
//       const lastName = engineer.last_name || '';
//       const fullName = `${firstName} ${lastName}`.trim();
      
//       console.log("📝 Full name would be:", fullName);
      
//       // If we have a full name, return it
//       if (fullName) {
//         return fullName;
//       }
      
//       // If no full name but we have email, check if getResourceName returns email
//       if (engineer.email) {
//         console.log("ℹ️ Engineer has email:", engineer.email);
//       }
//     } else {
//       console.log("❌ Engineer not found in resourcesData");
//     }
//   }
  
//   // **Check resourceData as fallback**
//   if (resourceData) {
//     console.log("🔄 Checking resourceData:", resourceData);
//     const resId = resourceData.resource_id ? String(resourceData.resource_id) : '';
//     if (resId === String(engineerId)) {
//       const fullName = `${resourceData.first_name || ''} ${resourceData.last_name || ''}`.trim();
//       if (fullName) {
//         console.log("✅ Found in resourceData:", fullName);
//         return fullName;
//       }
//     }
//   }
  
//   // **Try getEngineerDetails function**
//   if (getEngineerDetails) {
//     console.log("🔍 Trying getEngineerDetails function");
//     const engineer = getEngineerDetails(engineerId);
//     if (engineer && engineer.fullName) {
//       console.log("✅ From getEngineerDetails:", engineer.fullName);
//       return engineer.fullName;
//     }
//   }
  
//   // **Try getResourceName function**
//   if (getResourceName) {
//     console.log("🔍 Trying getResourceName function");
//     const name = getResourceName(engineerId);
//     console.log("From getResourceName:", name);
    
//     // Check if it's returning email instead of name
//     if (name && name.includes('@')) {
//       console.log("⚠️ getResourceName returned email, trying to find name from resourcesData");
      
//       // Search again for full name
//       if (resourcesData && resourcesData.length > 0) {
//         const engineer = resourcesData.find(res => {
//           const resId = res.resource_id ? String(res.resource_id) : '';
//           return resId === String(engineerId);
//         });
        
//         if (engineer) {
//           const fullName = `${engineer.first_name || ''} ${engineer.last_name || ''}`.trim();
//           if (fullName) return fullName;
//         }
//       }
//     }
    
//     if (name && name !== "Not Assigned" && !name.includes("undefined")) {
//       return name;
//     }
//   }
  
//   // **Final fallback**
//   console.log("⚠️ Using fallback for engineer name");
//   return `Engineer ${engineerId}`;
// };


//     return {
//       serviceDetails: {
//         serviceDate: formatDate(serviceDate),
//         serviceTime: serviceTime,
//         problemType: problemType,
//         reportedIssue: reportedIssue,
//         issueDescription: service.description || '',
//         issueDescription2: '',
//         issueDescription3: '',
//         workPerformed: service.resolution_notes || '',
//         workPerformed2: '',
//         workPerformed3: '',
//         outcomeComments: service.feedback || '',
//         visualInspectionComments: service.resolution_notes || '',
//         serviceId: service.request_id || service.id,
//         serviceName: service.service_name || 'N/A',
//         status: service.status || 'N/A',
//         priority: service.priority || 'N/A',
//         category: service.category || 'N/A',
//         subcategory: service.subcategory || 'N/A',
//         requestDate: formatDate(service.request_date),
//         closedDate: formatDate(service.closed_date),
//         createdDate: formatDateTime(service.created_at),
//         updatedDate: formatDateTime(service.updated_at),
//       },
//       customerInfo: pdfCustomerInfo, // Use the constructed customer info
//       serviceItemInfo: {
//         id: itemDetails.service_item_id,
//         name: itemDetails.service_item_name || 'N/A',
//         serialNumber: itemDetails.serial_number || 'N/A',
//         address: itemDetails.service_item_address,
//         warrantyStart: itemDetails.warranty_start_date,
//         warrantyEnd: itemDetails.warranty_end_date,
//         underWarranty: itemDetails.under_warranty === 'Yes',
//         pmDetails: itemDetails.pm_details,
//         totalRequests: itemDetails.service_request_count || 0,
//         installationDate: itemDetails.installation_date || 'N/A',
//         productDescription: itemDetails.product_description || 'N/A',
//         status: itemDetails.status || 'N/A',
//         iotStatus: itemDetails.iot_status || 'N/A',
//         location: service.location || 'N/A',
//         city: service.city || 'N/A',
//         state: service.state || 'N/A',
//         country: service.country || 'N/A',
//         zipCode: service.zip_code || 'N/A',
//       },
//        technicianInfo: {
//     name: getTechnicianName(), // Remove the duplicate line below this!
//     date: formatDate(currentDate),
//     time: currentDate.toLocaleTimeString('en-IN', { hour12: true }),
//     engineerId: service.assigned_engineer || 'N/A',
//     company: service.company_name || 'N/A',
//   },
//       reportMetadata: {
//         generatedOn: formatDateTime(currentDate),
//         reportId: `REPORT_${service.request_id || 'UNKNOWN'}_${Date.now()}`,
//         companyName: 'Service Report',
//       }
//     };
//   };

//   return (
//     <PDFDownloadLink
//       document={<PDFContent {...preparePDFData()} />}
//       fileName={`Service_Report_${service.request_id || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`}
//     >
//       {({ blob, url, loading, error }) => {
//         const handleClick = () => {
//           if (loading) {
//             Swal.fire({
//               title: 'Generating PDF...',
//               text: 'Please wait',
//               allowOutsideClick: false,
//               showConfirmButton: false,
//               willOpen: () => {
//                 Swal.showLoading();
//               }
//             });
//           } else if (error) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Failed to generate PDF',
//               text: error.message || 'Please try again',
//             });
//           }
//         };

//         return (
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={handleClick}
//             className="px-3"
//             title="Download PDF Report"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <i className="bi bi-hourglass-split me-1"></i> Generating...
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-download me-1"></i> Report
//               </>
//             )}
//           </Button>
//         );
//       }}
//     </PDFDownloadLink>
//   );
// };

// export default PdfReportButton;




import React from 'react';
import { Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import PDFContent from './PDFContent';

const PdfReportButton = ({
  service,
  getCustomerName,
  getResourceName,
  formatDate,
  formatDateTime,
  getProblemTypeName,
  serviceDate,
  serviceTime,
  problemType,
  reportedIssue,
  getServiceItemDetails,
  serviceItemInfo,
  customerInfo,
  customersData,
  usersData,
  resourcesData,
  resourceData,
  getEngineerDetails
}) => {

  // Helper function to get complete customer details
  const getCompleteCustomerInfo = () => {
    if (customerInfo && customerInfo.name && customerInfo.phone) {
      return customerInfo;
    }
    
    const customerId = service.customer || service.customer_id;
    if (!customerId || !customersData || customersData.length === 0) {
      return {
        name: getCustomerName(customerId),
        address: 'N/A',
        contactPerson: getCustomerName(customerId),
        phone: 'N/A',
        email: 'N/A',
        customerId: customerId || 'N/A',
      };
    }
    
    const customer = customersData.find(cust => cust.customer_id === customerId);
    
    if (!customer) {
      return {
        name: getCustomerName(customerId),
        address: 'N/A',
        contactPerson: getCustomerName(customerId),
        phone: 'N/A',
        email: 'N/A',
        customerId: customerId || 'N/A',
      };
    }
    
    const addressParts = [
      customer.address,
      customer.location,
      customer.city,
      customer.state,
      customer.country,
      customer.zip_code
    ].filter(part => part && part.trim() !== '');
    
    const address = addressParts.join(', ') || 'N/A';
    const phone = customer.mobile ? 
      `${customer.country_code || ''} ${customer.mobile}`.trim() : 'N/A';
    
    return {
      name: customer.full_name || customer.username || 'N/A',
      address: customer.address,
      contactPerson: customer.full_name || customer.username || 'N/A',
      phone: phone,
      email: customer.email || 'N/A',
      customerId: customer.customer_id,
      companyName: customer.company_name || 'N/A',
      designation: customer.designation || 'N/A',
    };
  };

  // **SIMPLIFIED FUNCTION TO GET TECHNICIAN NAME**
  const getTechnicianName = () => {
    const engineerId = service.assigned_engineer;
    
    console.log("=== DEBUG TECHNICIAN INFO ===");
    console.log("Service assigned_engineer:", engineerId);
    console.log("Service object:", service);
    
    if (!engineerId) {
      console.log("No engineer ID found");
      return "Not Assigned";
    }
    
    // **METHOD 1: Check if service already has engineer name**
    if (service.engineer_name || service.assigned_to_name || service.technician_name) {
      const name = service.engineer_name || service.assigned_to_name || service.technician_name;
      console.log("Found engineer name in service:", name);
      return name;
    }
    
    // **METHOD 2: Direct lookup in resourcesData**
    if (resourcesData && resourcesData.length > 0) {
      console.log("Resources data available:", resourcesData.length, "records");
      
      // Convert engineerId to string for comparison
      const engineerIdStr = String(engineerId);
      
      // Try different matching strategies
      let engineer = null;
      
      // Try exact match with resource_id
      engineer = resourcesData.find(res => {
        if (res.resource_id) {
          return String(res.resource_id) === engineerIdStr;
        }
        return false;
      });
      
      // If not found, try with id field
      if (!engineer) {
        engineer = resourcesData.find(res => {
          if (res.id) {
            return String(res.id) === engineerIdStr;
          }
          return false;
        });
      }
      
      // If not found, try with user field
      if (!engineer) {
        engineer = resourcesData.find(res => {
          if (res.user) {
            return String(res.user) === engineerIdStr;
          }
          return false;
        });
      }
      
      // If still not found, try partial match
      if (!engineer) {
        engineer = resourcesData.find(res => {
          const resIdStr = String(res.resource_id || res.id || res.user || '');
          return resIdStr.includes(engineerIdStr) || engineerIdStr.includes(resIdStr);
        });
      }
      
      if (engineer) {
        console.log("✅ Engineer found in resourcesData:", engineer);
        
        // Extract full name
        const firstName = engineer.first_name || engineer.firstName || '';
        const lastName = engineer.last_name || engineer.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        console.log("Full name extracted:", fullName);
        
        if (fullName) {
          return fullName;
        }
        
        // If no name, return email (but we want to avoid this)
        if (engineer.email) {
          console.log("No full name, email found:", engineer.email);
        }
      } else {
        console.log("❌ Engineer not found in resourcesData");
        console.log("Available resource IDs:", resourcesData.map(r => ({
          resource_id: r.resource_id,
          id: r.id,
          user: r.user,
          first_name: r.first_name,
          last_name: r.last_name
        })));
      }
    }
    
    // **METHOD 3: Use getResourceName function**
    if (getResourceName) {
      const name = getResourceName(engineerId);
      console.log("From getResourceName:", name);
      
      // If getResourceName returns email, try to get name differently
      if (name && name.includes('@')) {
        console.log("getResourceName returned email, will use engineer ID");
      } else if (name && !name.includes("undefined")) {
        return name;
      }
    }
    
    // **METHOD 4: Check resourceData (current user)**
    if (resourceData) {
      console.log("Checking resourceData:", resourceData);
      const resId = resourceData.resource_id ? String(resourceData.resource_id) : '';
      if (resId === String(engineerId)) {
        const fullName = `${resourceData.first_name || ''} ${resourceData.last_name || ''}`.trim();
        if (fullName) {
          console.log("Found in resourceData:", fullName);
          return fullName;
        }
      }
    }
    
    // **METHOD 5: Use getEngineerDetails function**
    if (getEngineerDetails) {
      console.log("Trying getEngineerDetails");
      const engineer = getEngineerDetails(engineerId);
      if (engineer && engineer.fullName) {
        console.log("From getEngineerDetails:", engineer.fullName);
        return engineer.fullName;
      }
    }
    
    // **FINAL FALLBACK**
    console.log("⚠️ Using fallback: Engineer ID only");
    return `Engineer (ID: ${engineerId})`;
  };

  // Prepare data for PDF
  const preparePDFData = () => {
    const currentDate = new Date();
    
    // Get complete customer info
    const pdfCustomerInfo = getCompleteCustomerInfo();
    
    // Get service item details
    const itemDetails = serviceItemInfo || 
      (getServiceItemDetails && service.service_item ? 
        getServiceItemDetails(service.service_item) : 
        {
          service_item_id: service.service_item || 'N/A',
          service_item_address: 'N/A',
          warranty_start_date: 'N/A',
          warranty_end_date: 'N/A',
          under_warranty: 'No',
          pm_details: 'N/A',
          service_request_count: 0
        }
      );

    // Get technician name
    const technicianName = getTechnicianName();
    console.log("📄 Final technician name for PDF:", technicianName);

    return {
      serviceDetails: {
        serviceDate: formatDate(serviceDate),
        serviceTime: serviceTime,
        problemType: problemType,
        reportedIssue: reportedIssue,
        issueDescription: service.description || '',
        issueDescription2: '',
        issueDescription3: '',
        workPerformed: service.resolution_notes || '',
        workPerformed2: '',
        workPerformed3: '',
        outcomeComments: service.feedback || '',
        visualInspectionComments: service.resolution_notes || '',
        serviceId: service.request_id || service.id,
        serviceName: service.service_name || 'N/A',
        status: service.status || 'N/A',
        priority: service.priority || 'N/A',
        category: service.category || 'N/A',
        subcategory: service.subcategory || 'N/A',
        requestDate: formatDate(service.request_date),
        closedDate: formatDate(service.closed_date),
        createdDate: formatDateTime(service.created_at),
        updatedDate: formatDateTime(service.updated_at),
      },
      customerInfo: pdfCustomerInfo,
      serviceItemInfo: {
        id: itemDetails.service_item_id,
        name: itemDetails.service_item_name || 'N/A',
        serialNumber: itemDetails.serial_number || 'N/A',
        address: itemDetails.service_item_address,
        warrantyStart: itemDetails.warranty_start_date,
        warrantyEnd: itemDetails.warranty_end_date,
        underWarranty: itemDetails.under_warranty === 'Yes',
        pmDetails: itemDetails.pm_details,
        totalRequests: itemDetails.service_request_count || 0,
        installationDate: itemDetails.installation_date || 'N/A',
        productDescription: itemDetails.product_description || 'N/A',
        status: itemDetails.status || 'N/A',
        iotStatus: itemDetails.iot_status || 'N/A',
        location: service.location || 'N/A',
        city: service.city || 'N/A',
        state: service.state || 'N/A',
        country: service.country || 'N/A',
        zipCode: service.zip_code || 'N/A',
      },
      technicianInfo: {
        name: technicianName,
        date: formatDate(currentDate),
        time: currentDate.toLocaleTimeString('en-IN', { hour12: true }),
        engineerId: service.assigned_engineer || 'N/A',
        company: service.company_name || 'N/A',
      },
      reportMetadata: {
        generatedOn: formatDateTime(currentDate),
        reportId: `REPORT_${service.request_id || 'UNKNOWN'}_${Date.now()}`,
        companyName: 'Service Report',
      }
    };
  };

  return (
    <PDFDownloadLink
      document={<PDFContent {...preparePDFData()} />}
      fileName={`Service_Report_${service.request_id || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`}
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