import React, { useState } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPreviewModal = ({ 
  show, 
  handleClose, 
  pdfData, 
  fileName,
  onDownload 
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfBlob, setPdfBlob] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  };

  // Generate PDF blob for preview
  React.useEffect(() => {
    if (show && pdfData) {
      // Here you would generate the PDF blob
      // For now, we'll create a mock blob or you can use your PDF generation logic
      const generatePDFForPreview = async () => {
        // You'll need to integrate your actual PDF generation here
        // This is just a placeholder
        // const blob = await generatePDFBlob(pdfData);
        // setPdfBlob(blob);
      };
      generatePDFForPreview();
    }
  }, [show, pdfData]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" fullscreen="md-down">
      <Modal.Header closeButton>
        <Modal.Title>PDF Preview - {fileName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row className="mb-3">
            <Col className="text-center">
              <div className="border rounded p-3 bg-light">
                <p className="mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  This is a preview of your PDF report. You can:
                </p>
                <ul className="text-start mb-0">
                  <li>Review all information before downloading</li>
                  <li>Check page layout and content</li>
                  <li>Make sure all details are correct</li>
                </ul>
              </div>
            </Col>
          </Row>
          
          {/* PDF Preview Area */}
          <Row>
            <Col className="text-center">
              <div className="border rounded p-2 bg-white shadow-sm">
                {pdfBlob ? (
                  <>
                    <div className="mb-2">
                      <Document
                        file={pdfBlob}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div>Loading PDF...</div>}
                      >
                        <Page 
                          pageNumber={pageNumber} 
                          scale={0.8}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                    
                    {numPages > 1 && (
                      <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                        >
                          <i className="bi bi-chevron-left"></i> Previous
                        </Button>
                        <span className="text-muted">
                          Page {pageNumber} of {numPages}
                        </span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                        >
                          Next <i className="bi bi-chevron-right"></i>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-5">
                    <i className="bi bi-file-earmark-pdf text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3">PDF Preview will be generated here</p>
                    <p className="text-muted small">
                      For now, this is a placeholder. Actual PDF preview requires 
                      server-side generation or client-side PDF rendering setup.
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          
          {/* PDF Details Summary */}
          <Row className="mt-4">
            <Col>
              <div className="border rounded p-3">
                <h6>PDF Report Details:</h6>
                <div className="row">
                  <div className="col-6">
                    <p className="mb-1"><strong>Filename:</strong> {fileName}</p>
                    <p className="mb-1"><strong>Pages:</strong> 3 pages (estimated)</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-1"><strong>Service ID:</strong> {pdfData?.serviceDetails?.serviceId}</p>
                    <p className="mb-1"><strong>Customer:</strong> {pdfData?.customerInfo?.name}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-circle me-1"></i> Cancel
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={() => {
            // Show print dialog
            window.print();
          }}
        >
          <i className="bi bi-printer me-1"></i> Print
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            onDownload();
            handleClose();
          }}
        >
          <i className="bi bi-download me-1"></i> Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDFPreviewModal;