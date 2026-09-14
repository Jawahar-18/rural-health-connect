package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.FeedbackStatus;
import com.swasthyasetu.entity.enums.SatisfactionLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FeedbackDto {

    private String id;
    private String patientId;
    private String patientName;
    private String patientPhone;
    private String callId;
    private boolean callAttended;
    private SatisfactionLevel satisfactionLevel;
    private boolean refusesFollowUp;
    private String refusalReason;
    private String feedbackNotes;
    private String recordedByUserId;
    private String recordedByName;
    private String recordedByRole;
    private FeedbackStatus status;
    private String adminReviewNotes;
    private String reviewedByAdminId;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public static class CreateRequest {
        @NotBlank(message = "patientId is required")
        private String patientId;
        private String patientName;
        private String patientPhone;
        private String callId;
        private boolean callAttended = true;
        @NotNull(message = "satisfactionLevel is required")
        private SatisfactionLevel satisfactionLevel = SatisfactionLevel.SATISFIED;
        private boolean refusesFollowUp = false;
        private String refusalReason;
        private String feedbackNotes;
        private String recordedByName;
        private String recordedByRole;

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getPatientPhone() { return patientPhone; }
        public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }
        public String getCallId() { return callId; }
        public void setCallId(String callId) { this.callId = callId; }
        public boolean isCallAttended() { return callAttended; }
        public void setCallAttended(boolean callAttended) { this.callAttended = callAttended; }
        public SatisfactionLevel getSatisfactionLevel() { return satisfactionLevel; }
        public void setSatisfactionLevel(SatisfactionLevel satisfactionLevel) { this.satisfactionLevel = satisfactionLevel; }
        public boolean isRefusesFollowUp() { return refusesFollowUp; }
        public void setRefusesFollowUp(boolean refusesFollowUp) { this.refusesFollowUp = refusesFollowUp; }
        public String getRefusalReason() { return refusalReason; }
        public void setRefusalReason(String refusalReason) { this.refusalReason = refusalReason; }
        public String getFeedbackNotes() { return feedbackNotes; }
        public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }
        public String getRecordedByName() { return recordedByName; }
        public void setRecordedByName(String recordedByName) { this.recordedByName = recordedByName; }
        public String getRecordedByRole() { return recordedByRole; }
        public void setRecordedByRole(String recordedByRole) { this.recordedByRole = recordedByRole; }
    }

    public static class AdminReviewRequest {
        @NotNull(message = "status is required")
        private FeedbackStatus status;
        private String adminReviewNotes;

        public FeedbackStatus getStatus() { return status; }
        public void setStatus(FeedbackStatus status) { this.status = status; }
        public String getAdminReviewNotes() { return adminReviewNotes; }
        public void setAdminReviewNotes(String adminReviewNotes) { this.adminReviewNotes = adminReviewNotes; }
    }

    // Getters and Setters for FeedbackDto
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }
    public String getCallId() { return callId; }
    public void setCallId(String callId) { this.callId = callId; }
    public boolean isCallAttended() { return callAttended; }
    public void setCallAttended(boolean callAttended) { this.callAttended = callAttended; }
    public SatisfactionLevel getSatisfactionLevel() { return satisfactionLevel; }
    public void setSatisfactionLevel(SatisfactionLevel satisfactionLevel) { this.satisfactionLevel = satisfactionLevel; }
    public boolean isRefusesFollowUp() { return refusesFollowUp; }
    public void setRefusesFollowUp(boolean refusesFollowUp) { this.refusesFollowUp = refusesFollowUp; }
    public String getRefusalReason() { return refusalReason; }
    public void setRefusalReason(String refusalReason) { this.refusalReason = refusalReason; }
    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }
    public String getRecordedByUserId() { return recordedByUserId; }
    public void setRecordedByUserId(String recordedByUserId) { this.recordedByUserId = recordedByUserId; }
    public String getRecordedByName() { return recordedByName; }
    public void setRecordedByName(String recordedByName) { this.recordedByName = recordedByName; }
    public String getRecordedByRole() { return recordedByRole; }
    public void setRecordedByRole(String recordedByRole) { this.recordedByRole = recordedByRole; }
    public FeedbackStatus getStatus() { return status; }
    public void setStatus(FeedbackStatus status) { this.status = status; }
    public String getAdminReviewNotes() { return adminReviewNotes; }
    public void setAdminReviewNotes(String adminReviewNotes) { this.adminReviewNotes = adminReviewNotes; }
    public String getReviewedByAdminId() { return reviewedByAdminId; }
    public void setReviewedByAdminId(String reviewedByAdminId) { this.reviewedByAdminId = reviewedByAdminId; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
