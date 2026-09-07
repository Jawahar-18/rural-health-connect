package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.DiagnosticOrderStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "diagnostic_orders", indexes = {
        @Index(name = "idx_diag_patient", columnList = "patientId"),
        @Index(name = "idx_diag_facility", columnList = "facilityId")
})
public class DiagnosticOrder {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String patientName;

    @Column(nullable = false, length = 64)
    private String doctorId;

    @Column(nullable = false, length = 64)
    private String facilityId;

    @Column(nullable = false, length = 64)
    private String testId;

    @Column(length = 150)
    private String testName;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private DiagnosticOrderStatus status = DiagnosticOrderStatus.ORDERED;

    @PrePersist
    public void onPrePersist() {
        if (orderDate == null) orderDate = LocalDate.now();
    }

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

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public DiagnosticOrderStatus getStatus() { return status; }
    public void setStatus(DiagnosticOrderStatus status) { this.status = status; }
}
