package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.FeedbackStatus;
import com.swasthyasetu.entity.enums.SatisfactionLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_feedbacks", indexes = {
        @Index(name = "idx_feedback_patient", columnList = "patientId"),
        @Index(name = "idx_feedback_satisfaction", columnList = "satisfactionLevel"),
        @Index(name = "idx_feedback_refusal", columnList = "refusesFollowUp"),
        @Index(name = "idx_feedback_status", columnList = "status")
})
public class PatientFeedback {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String patientName;

    @Column(length = 32)
    private String patientPhone;

    @Column(length = 64)
    private String callId;

    private boolean callAttended = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SatisfactionLevel satisfactionLevel = SatisfactionLevel.SATISFIED;

    @Column(nullable = false)
    private boolean refusesFollowUp = false; // Patient stated: "I will not come"

    @Column(length = 255)
    private String refusalReason; // e.g. "Dissatisfied with treatment", "Medicines caused side-effects", "Travel distance"

    @Column(length = 1000)
    private String feedbackNotes; // verbatim patient remarks

    @Column(length = 64)
    private String recordedByUserId;

    @Column(length = 100)
    private String recordedByName;

    @Column(length = 32)
    private String recordedByRole; // HEALTH_WORKER, DOCTOR, PATIENT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private FeedbackStatus status = FeedbackStatus.NEW;

    @Column(length = 500)
    private String adminReviewNotes;

    @Column(length = 64)
    private String reviewedByAdminId;

    private LocalDateTime reviewedAt;

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
