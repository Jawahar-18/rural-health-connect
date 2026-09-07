package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.FollowUpStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "followups", indexes = {
        @Index(name = "idx_followup_patient", columnList = "patientId"),
        @Index(name = "idx_followup_status", columnList = "status"),
        @Index(name = "idx_followup_date", columnList = "followUpDate")
})
public class FollowUp {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String patientName;

    @Column(length = 64)
    private String doctorId;

    @Column(length = 64)
    private String facilityId;

    @Column(length = 64)
    private String relatedMedicalRecordId;

    @Column(nullable = false)
    private LocalDate followUpDate;

    @Column(length = 255)
    private String reason;

    @Column(length = 50)
    private String frequency = "Bi-weekly";

    @Column(length = 50)
    private String treatmentDuration = "30 days";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private FollowUpStatus status = FollowUpStatus.PENDING;

    private LocalDate completedDate;

    @Column(length = 500)
    private String notes;

    private LocalDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
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

    public String getRelatedMedicalRecordId() { return relatedMedicalRecordId; }
    public void setRelatedMedicalRecordId(String relatedMedicalRecordId) { this.relatedMedicalRecordId = relatedMedicalRecordId; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTreatmentDuration() { return treatmentDuration; }
    public void setTreatmentDuration(String treatmentDuration) { this.treatmentDuration = treatmentDuration; }

    public FollowUpStatus getStatus() { return status; }
    public void setStatus(FollowUpStatus status) { this.status = status; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
