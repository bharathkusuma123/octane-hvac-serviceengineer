import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts (optional, but recommended)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2" }, // Regular
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2", fontWeight: 700 }, // Bold
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },

  sectionTitle: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    marginLeft: 20,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
    marginLeft: 40,
  },

  bullet: {
    marginRight: 8,
    fontSize: 14,
    marginTop: 2,
  },

  label: {
    fontWeight: "bold",
    marginRight: 5,
    minWidth: 120,
  },

  underlineSmall: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginTop: 2,
    minHeight: 15,
  },

  // Table styles for Unit Parts Checklist
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },

  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    backgroundColor: "#f0f0f0",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 25,
  },

  lastTableRow: {
    flexDirection: "row",
    minHeight: 25,
  },

  // Column widths for Unit Parts Checklist - adjusted for better fit
  colPartName: {
    width: "30%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colCheck: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colStatus: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colClean: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colRepair: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colChange: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colRemarks: {
    width: "20%",
    padding: 3,
  },

  tableTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 0,
    padding: 5,
    color: "white",
  },

  headerText: {
    fontWeight: "bold",
    fontSize: 9,
  },

  cellText: {
    fontSize: 8,
  },

  // Description Section
  descriptionSection: {
    marginTop: 15,
  },

  descriptionBulletRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
    marginLeft: 20,
  },

  descriptionBullet: {
    marginRight: 8,
    fontSize: 14,
    marginTop: 2,
  },

  descriptionLabel: {
    fontWeight: "bold",
    marginTop: 2,
  },

  descriptionLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginLeft: 40,
    marginRight: 20,
    marginBottom: 8,
    minHeight: 15,
  },

  // Styles for Component Changed table
  componentTableContainer: {
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },

  componentTableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    backgroundColor: "#f0f0f0",
  },

  componentTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 25,
  },

  componentLastTableRow: {
    flexDirection: "row",
    minHeight: 25,
  },

  // Column widths for Component Changed table (5 columns)
  colItem: {
    width: "15%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colDescription: {
    width: "30%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colSerialNumber: {
    width: "20%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colPrice: {
    width: "15%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },

  colRemarksComponent: {
    width: "20%",
    padding: 3,
  },

  // Service Outcome section
  serviceOutcomeSection: {
    marginTop: 15,
  },

  serviceOutcomeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    marginLeft: 20,
  },

  checkboxRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    marginLeft: 40,
  },

  checkboxLabel: {
    fontWeight: "bold",
    marginRight: 10,
    minWidth: 130,
  },

  checkboxGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginRight: 5,
    marginLeft: 10,
  },

  checkboxText: {
    fontSize: 9,
    marginRight: 15,
  },

  commentsRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
    marginLeft: 40,
  },

  commentsLabel: {
    fontWeight: "bold",
    marginRight: 5,
    minWidth: 60,
  },

  // Technician Information
  technicianSection: {
    marginTop: 20,
  },

  technicianTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    marginLeft: 20,
  },

  technicianRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    marginLeft: 40,
  },

  technicianLabel: {
    fontWeight: "bold",
    marginRight: 5,
    minWidth: 100,
  },

  technicianUnderline: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginLeft: 5,
    minHeight: 15,
  },

  // Add raw note style
  addRawNote: {
    fontStyle: "italic",
    fontSize: 8,
    marginBottom: 10,
    marginLeft: 20,
  },

  // Page header
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  // For multi-line text
  multilineText: {
    marginLeft: 40,
    marginRight: 20,
    marginBottom: 8,
    fontSize: 9,
  },
});

// Data for the parts
const partsList = [
  "Indirect Air filters",
  "Direct Air filters",
  "Solenoid valve",
  "Water level sensor",
  "Float Valve",
  "Indirect Pump",
  "Direct Pump",
  "Drain Pump",
  "Blower Motor",
  "Secondary Fan",
  "Indirect Media Set",
  "Direct Media Set",
  "Control Board",
  "Thermostat",
  "Heat Exchanger",
  "Body"
];

// Data for component changed table (empty rows)
const componentRows = Array(3).fill({ item: "", description: "", serialNumber: "", price: "", remarks: "" });

const PDFContent = ({ 
  serviceDetails = {}, 
  customerInfo = {}, 
  serviceItemInfo = {}, 
  technicianInfo = {} 
}) => (
  <Document>
    {/* =========================
        PAGE 1: Basic Information
    ============================ */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Service Report</Text>
      
      <Text style={styles.sectionTitle}>Service Details</Text>

      {/* Service Date */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Service Date:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceDetails.serviceDate || "________________"}</Text>
        </View>
      </View>

      {/* Service Time */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Service Time:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceDetails.serviceTime || "________________"}</Text>
        </View>
      </View>

      {/* Type of Problem */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Type of problem:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceDetails.problemType || "________________"}</Text>
        </View>
      </View>

      {/* Reported Issue */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Reported issue:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceDetails.reportedIssue || "________________"}</Text>
        </View>
      </View>

      {/* =========================
          SERVICE ITEM INFORMATION
      ============================ */}
      <Text style={styles.sectionTitle}>Service item information</Text>

      {/* Service Item ID */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Service item id:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceItemInfo.id || "________________"}</Text>
        </View>
      </View>

      {/* Service Item Address */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Service item Address:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceItemInfo.address || "________________"}</Text>
        </View>
      </View>

      {/* Warranty Start */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Warranty starting date:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceItemInfo.warrantyStart || "________________"}</Text>
        </View>
      </View>

      {/* Warranty End */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Warranty ending date:</Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceItemInfo.warrantyEnd || "________________"}</Text>
        </View>
      </View>

      {/* Under Warranty */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Under warranty:</Text>
        <Text> {serviceItemInfo.underWarranty ? "Yes" : "No"}</Text>
      </View>

      {/* PM Details */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>PM DETAILS</Text>
      </View>

      {/* Number of service requests */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>
          Number service requests raised:
        </Text>
        <View style={styles.underlineSmall}>
          <Text>{serviceItemInfo.totalRequests || "________________"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Client information</Text>

      {/* Client Name */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Client Name:</Text>
        <View style={styles.underlineSmall}>
          <Text>{customerInfo.name || "________________"}</Text>
        </View>
      </View>
      
      {/* Client Address */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Client Address:</Text>
        <View style={styles.underlineSmall}>
          <Text>{customerInfo.address || "________________"}</Text>
        </View>
      </View> 
      
      {/* Contact Person */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Contact Person:</Text>
        <View style={styles.underlineSmall}>
          <Text>{customerInfo.contactPerson || "________________"}</Text>
        </View>
      </View> 
      
      {/* Phone Number */}
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Phone Number:</Text>
        <View style={styles.underlineSmall}>
          <Text>{customerInfo.phone || "________________"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Service Provided</Text>
      <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.label}>Check list:</Text>
      </View>
    </Page>

    {/* =========================
        PAGE 2: Unit Parts Checklist Table
    ============================ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.tableContainer}>
        {/* Table Title */}
        <View style={{padding: 5, backgroundColor: "#089e12ff"}}>
          <Text style={styles.tableTitle}>Unit Parts Checklist</Text>
        </View>
        
        {/* Table Header */}
        <View style={styles.tableHeaderRow}>
          <View style={styles.colPartName}>
            <Text style={styles.headerText}>Part name</Text>
          </View>
          <View style={styles.colCheck}>
            <Text style={styles.headerText}>Check</Text>
          </View>
          <View style={styles.colStatus}>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <View style={styles.colClean}>
            <Text style={styles.headerText}>Clean</Text>
          </View>
          <View style={styles.colRepair}>
            <Text style={styles.headerText}>Repair</Text>
          </View>
          <View style={styles.colChange}>
            <Text style={styles.headerText}>Change</Text>
          </View>
          <View style={styles.colRemarks}>
            <Text style={styles.headerText}>Remarks</Text>
          </View>
        </View>

        {/* Table Rows with Parts Data */}
        {partsList.map((part, index) => {
          const isLastRow = index === partsList.length - 1;
          return (
            <View key={index} style={isLastRow ? styles.lastTableRow : styles.tableRow}>
              <View style={styles.colPartName}>
                <Text style={styles.cellText}>{part}</Text>
              </View>
              <View style={styles.colCheck}>
                <Text style={styles.cellText}></Text>
              </View>
              <View style={styles.colStatus}>
                <Text style={styles.cellText}></Text>
              </View>
              <View style={styles.colClean}>
                <Text style={styles.cellText}></Text>
              </View>
              <View style={styles.colRepair}>
                <Text style={styles.cellText}></Text>
              </View>
              <View style={styles.colChange}>
                <Text style={styles.cellText}></Text>
              </View>
              <View style={[styles.colRemarks]}>
                <Text style={styles.cellText}></Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Add raw note */}
      <View>
        <Text style={styles.addRawNote}>(*should have option to add raw!)</Text>
      </View>

      {/* =========================
          DESCRIPTION SECTION
      ============================ */}
      <View style={styles.descriptionSection}>
        {/* Description of Issue - with bullet */}
        <View style={styles.descriptionBulletRow}>
          <Text style={styles.descriptionBullet}>•</Text>
          <Text style={styles.descriptionLabel}>Description of Issue:</Text>
        </View>
        <View style={styles.descriptionLine}>
          <Text>{serviceDetails.issueDescription || ""}</Text>
        </View>
        <View style={styles.descriptionLine}>
          <Text>{serviceDetails.issueDescription2 || ""}</Text>
        </View>
       
        
        {/* Description of Work Performed - with bullet */}
        <View style={styles.descriptionBulletRow}>
          <Text style={styles.descriptionBullet}>•</Text>
          <Text style={styles.descriptionLabel}>Description of Work Performed:</Text>
        </View>
        <View style={styles.descriptionLine}>
          <Text>{serviceDetails.workPerformed || ""}</Text>
        </View>
        <View style={styles.descriptionLine}>
          <Text>{serviceDetails.workPerformed2 || ""}</Text>
        </View>
       
        
        {/* Component changed title - with bullet */}
        <View style={styles.descriptionBulletRow}>
          <Text style={styles.descriptionBullet}>•</Text>
          <Text style={styles.descriptionLabel}>Component changed:</Text>
        </View>
        
        {/* Component Changed Table */}
        <View style={styles.componentTableContainer}>
          {/* Table Header */}
          <View style={styles.componentTableHeaderRow}>
            <View style={styles.colItem}>
              <Text style={[styles.headerText]}>Item</Text>
            </View>
            <View style={styles.colDescription}>
              <Text style={[styles.headerText]}>Description</Text>
            </View>
            <View style={styles.colSerialNumber}>
              <Text style={[styles.headerText]}>Serial number</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={[styles.headerText]}>Price</Text>
            </View>
            <View style={styles.colRemarksComponent}>
              <Text style={[styles.headerText]}>Remarks</Text>
            </View>
          </View>

          {/* Table Rows (3 empty rows) */}
          {componentRows.map((row, index) => {
            const isLastRow = index === componentRows.length - 1;
            return (
              <View key={index} style={isLastRow ? styles.componentLastTableRow : styles.componentTableRow}>
                <View style={styles.colItem}>
                  <Text style={styles.cellText}>{row.item || ""}</Text>
                </View>
                <View style={styles.colDescription}>
                  <Text style={styles.cellText}>{row.description || ""}</Text>
                </View>
                <View style={styles.colSerialNumber}>
                  <Text style={styles.cellText}>{row.serialNumber || ""}</Text>
                </View>
                <View style={styles.colPrice}>
                  <Text style={styles.cellText}>{row.price || ""}</Text>
                </View>
                <View style={[styles.colRemarksComponent]}>
                  <Text style={styles.cellText}>{row.remarks || ""}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Page>

    {/* =========================
        PAGE 3: Service Outcome & Technician Info
    ============================ */}
    <Page size="A4" style={styles.page}>
      
      {/* =========================
          SERVICE OUTCOME SECTION
      ============================ */}
      <View style={styles.serviceOutcomeSection}>
        <Text style={styles.serviceOutcomeTitle}>Service Outcome</Text>
        
        {/* Issue Resolved */}
        <View style={styles.checkboxRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.checkboxLabel}>Issue Resolved:</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>Yes</Text>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>No</Text>
          </View>
        </View>
        
        {/* Further Action Required */}
        <View style={styles.checkboxRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.checkboxLabel}>Further Action Required:</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>Yes</Text>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>No</Text>
          </View>
        </View>
        
        {/* Comments */}
        <View style={styles.commentsRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.commentsLabel}>Comments:</Text>
          <View style={styles.underlineSmall}>
            <Text>{serviceDetails.outcomeComments || ""}</Text>
          </View>
        </View>
        
        {/* Physical Damage in Visual Inspection */}
        <View style={styles.checkboxRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.checkboxLabel}>Any physical damage in visual inspection:</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>Yes</Text>
            <View style={styles.checkbox}></View>
            <Text style={styles.checkboxText}>No</Text>
          </View>
        </View>
        
        {/* Comments for Visual Inspection */}
        <View style={styles.commentsRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.commentsLabel}>Comments:</Text>
          <View style={styles.underlineSmall}>
            <Text>{serviceDetails.visualInspectionComments || ""}</Text>
          </View>
        </View>
      </View>

      {/* =========================
          TECHNICIAN INFORMATION
      ============================ */}
      <View style={styles.technicianSection}>
        <Text style={styles.technicianTitle}>Technician Information</Text>
        
        {/* Technician Name */}
        <View style={styles.technicianRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.technicianLabel}>Technician Name:</Text>
          <View style={styles.technicianUnderline}>
            <Text>{technicianInfo.name || "________________"}</Text>
          </View>
        </View>
        
        {/* Date */}
        <View style={styles.technicianRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.technicianLabel}>Date:</Text>
          <View style={styles.technicianUnderline}>
            <Text>{technicianInfo.date || "________________"}</Text>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.technicianRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.technicianLabel}>Signature:</Text>
          <View style={styles.technicianUnderline}>
            <Text>{" "}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Default props
PDFContent.defaultProps = {
  serviceDetails: {},
  customerInfo: {},
  serviceItemInfo: {},
  technicianInfo: {},
};

export default PDFContent;