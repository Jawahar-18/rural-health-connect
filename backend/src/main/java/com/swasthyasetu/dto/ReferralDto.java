package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.ReferralPriority;
import com.swasthyasetu.entity.enums.ReferralStatus;
import jakarta.validation.constraints.NotBlank;

public class ReferralDto {

    private String id;
    private String referralCode;
    private String patientId;
    private String patientName;
    private int patientAge;
    private String patientGender;
    private String originFacility;
    private String destinationFacility;
    private String department;
    private String reason;
    private ReferralPriority priority;
    private ReferralStatus status;
    private String createdDate;
    private String appointmentDate;
    private String completedDate;
    private String referringDoctorId;
    private String referringDoctorName;
    private String receivingDoctorName;
    private String notes;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public int getPatientAge() { return patientAge; }
    public void setPatientAge(int patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getOriginFacility() { return originFacility; }
    public void setOriginFacility(String originFacility) { this.originFacility = originFacility; }

    public String getDestinationFacility() { return destinationFacility; }
    public void setDestinationFacility(String destinationFacility) { this.destinationFacility = destinationFacility; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ReferralPriority getPriority() { return priority; }
    public void setPriority(ReferralPriority priority) { this.priority = priority; }

    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getCompletedDate() { return completedDate; }
    public void setCompletedDate(String completedDate) { this.completedDate = completedDate; }

    public String getReferringDoctorId() { return referringDoctorId; }
    public void setReferringDoctorId(String referringDoctorId) { this.referringDoctorId = referringDoctorId; }

    public String getReferringDoctorName() { return referringDoctorName; }
    public void setReferringDoctorName(String referringDoctorName) { this.referringDoctorName = referringDoctorName; }

    public String getReceivingDoctorName() { return receivingDoctorName; }
    public void setReceivingDoctorName(String receivingDoctorName) { this.receivingDoctorName = receivingDoctorName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static class CreateRequest {
        @NotBlank(message = "Patient ID is required")
        private String patientId;

        private String patientName;
        private int patientAge;
        private String patientGender;
        private String originFacility;

        @NotBlank(message = "Destination facility is required")
        private String destinationFacility;

        private String department;

        @NotBlank(message = "Reason is required")
        private String reason;

        private ReferralPriority priority = ReferralPriority.URGENT;
        private String referringDoctorId;
        private String referringDoctorName;

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public int getPatientAge() { return patientAge; }
        public void setPatientAge(int patientAge) { this.patientAge = patientAge; }

        public String getPatientGender() { return patientGender; }
        public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

        public String getOriginFacility() { return originFacility; }
        public void setOriginFacility(String originFacility) { this.originFacility = originFacility; }

        public String getDestinationFacility() { return destinationFacility; }
        public void setDestinationFacility(String destinationFacility) { this.destinationFacility = destinationFacility; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public ReferralPriority getPriority() { return priority; }
        public void setPriority(ReferralPriority priority) { this.priority = priority; }

        public String getReferringDoctorId() { return referringDoctorId; }
        public void setReferringDoctorId(String referringDoctorId) { this.referringDoctorId = referringDoctorId; }

        public String getReferringDoctorName() { return referringDoctorName; }
        public void setReferringDoctorName(String referringDoctorName) { this.referringDoctorName = referringDoctorName; }
    }

    public static class StatusUpdateRequest {
        private ReferralStatus status;
        private String notes;

        public ReferralStatus getStatus() { return status; }
        public void setStatus(ReferralStatus status) { this.status = status; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
