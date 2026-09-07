package com.swasthyasetu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "diagnostic_reports", indexes = {
        @Index(name = "idx_report_patient", columnList = "patientId"),
        @Index(name = "idx_report_order", columnList = "diagnosticOrderId")
})
public class DiagnosticReport {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String diagnosticOrderId;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String testName;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(nullable = false)
    private LocalDate reportDate;

    @Column(length = 500)
    private String remarks;

    @PrePersist
    public void onPrePersist() {
        if (reportDate == null) reportDate = LocalDate.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDiagnosticOrderId() { return diagnosticOrderId; }
    public void setDiagnosticOrderId(String diagnosticOrderId) { this.diagnosticOrderId = diagnosticOrderId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
