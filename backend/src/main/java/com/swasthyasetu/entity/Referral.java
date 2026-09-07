package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.ReferralPriority;
import com.swasthyasetu.entity.enums.ReferralStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals", indexes = {
        @Index(name = "idx_ref_patient", columnList = "patientId"),
        @Index(name = "idx_ref_status", columnList = "status"),
        @Index(name = "idx_ref_from_fac", columnList = "fromFacilityId"),
        @Index(name = "idx_ref_to_fac", columnList = "toFacilityId")
})
public class Referral {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String referralCode;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String patientName;

    private Integer patientAge;

    @Column(length = 16)
    private String patientGender;

    @Column(length = 64)
    private String fromFacilityId;

    @Column(length = 150)
    private String originFacility;

    @Column(length = 64)
    private String toFacilityId;

    @Column(length = 150)
    private String destinationFacility;

    @Column(length = 100)
    private String department = "Specialist OPD";

    @Column(length = 64)
    private String createdBy;

    @Column(length = 64)
    private String referringDoctorId;

    @Column(length = 150)
    private String referringDoctorName;

    @Column(length = 150)
    private String receivingDoctorName;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ReferralPriority priority = ReferralPriority.ROUTINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ReferralStatus status = ReferralStatus.CREATED;

    @Column(nullable = false)
    private LocalDate referralDate;

    private LocalDate appointmentDate;
    private LocalDate completedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (referralDate == null) referralDate = LocalDate.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getFromFacilityId() { return fromFacilityId; }
    public void setFromFacilityId(String fromFacilityId) { this.fromFacilityId = fromFacilityId; }

    public String getOriginFacility() { return originFacility; }
    public void setOriginFacility(String originFacility) { this.originFacility = originFacility; }

    public String getToFacilityId() { return toFacilityId; }
    public void setToFacilityId(String toFacilityId) { this.toFacilityId = toFacilityId; }

    public String getDestinationFacility() { return destinationFacility; }
    public void setDestinationFacility(String destinationFacility) { this.destinationFacility = destinationFacility; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getReferringDoctorId() { return referringDoctorId; }
    public void setReferringDoctorId(String referringDoctorId) { this.referringDoctorId = referringDoctorId; }

    public String getReferringDoctorName() { return referringDoctorName; }
    public void setReferringDoctorName(String referringDoctorName) { this.referringDoctorName = referringDoctorName; }

    public String getReceivingDoctorName() { return receivingDoctorName; }
    public void setReceivingDoctorName(String receivingDoctorName) { this.receivingDoctorName = receivingDoctorName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ReferralPriority getPriority() { return priority; }
    public void setPriority(ReferralPriority priority) { this.priority = priority; }

    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }

    public LocalDate getReferralDate() { return referralDate; }
    public void setReferralDate(LocalDate referralDate) { this.referralDate = referralDate; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
