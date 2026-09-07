package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.FollowUpStatus;
import jakarta.validation.constraints.NotBlank;

public class FollowUpDto {

    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String facilityId;
    private String relatedMedicalRecordId;
    private String followUpDate;
    private String reason;
    private String frequency;
    private String treatmentDuration;
    private FollowUpStatus status;
    private String completedDate;
    private String notes;

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

    public String getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTreatmentDuration() { return treatmentDuration; }
    public void setTreatmentDuration(String treatmentDuration) { this.treatmentDuration = treatmentDuration; }

    public FollowUpStatus getStatus() { return status; }
    public void setStatus(FollowUpStatus status) { this.status = status; }

    public String getCompletedDate() { return completedDate; }
    public void setCompletedDate(String completedDate) { this.completedDate = completedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static class CreateRequest {
        @NotBlank(message = "Patient ID is required")
        private String patientId;

        @NotBlank(message = "Follow-up date is required")
        private String followUpDate;

        private String reason;
        private String frequency = "Bi-weekly";
        private String treatmentDuration = "30 days";
        private String notes;

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }

        public String getTreatmentDuration() { return treatmentDuration; }
        public void setTreatmentDuration(String treatmentDuration) { this.treatmentDuration = treatmentDuration; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
