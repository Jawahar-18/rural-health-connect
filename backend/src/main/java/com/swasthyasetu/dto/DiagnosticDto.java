package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.DiagnosticOrderStatus;
import com.swasthyasetu.entity.enums.EquipmentStatus;

public class DiagnosticDto {

    public static class DiagnosticEquipmentDto {
        private String id;
        private String name;
        private String category;
        private EquipmentStatus status;
        private int turnaroundTimeHours;
        private int pendingReportsCount;
        private String facilityId;
        private String facilityName;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public EquipmentStatus getStatus() { return status; }
        public void setStatus(EquipmentStatus status) { this.status = status; }

        public int getTurnaroundTimeHours() { return turnaroundTimeHours; }
        public void setTurnaroundTimeHours(int turnaroundTimeHours) { this.turnaroundTimeHours = turnaroundTimeHours; }

        public int getPendingReportsCount() { return pendingReportsCount; }
        public void setPendingReportsCount(int pendingReportsCount) { this.pendingReportsCount = pendingReportsCount; }

        public String getFacilityId() { return facilityId; }
        public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
    }

    public static class DiagnosticOrderDto {
        private String id;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String facilityId;
        private String testId;
        private String testName;
        private String orderDate;
        private DiagnosticOrderStatus status;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

        public String getFacilityId() { return facilityId; }
        public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

        public String getTestId() { return testId; }
        public void setTestId(String testId) { this.testId = testId; }

        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }

        public String getOrderDate() { return orderDate; }
        public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

        public DiagnosticOrderStatus getStatus() { return status; }
        public void setStatus(DiagnosticOrderStatus status) { this.status = status; }
    }

    public static class CreateOrderRequest {
        private String patientId;
        private String testId;
        private String testName;

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getTestId() { return testId; }
        public void setTestId(String testId) { this.testId = testId; }

        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }
    }
}
