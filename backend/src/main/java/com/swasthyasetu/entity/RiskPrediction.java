package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.InterventionPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_predictions", indexes = {
        @Index(name = "idx_risk_patient", columnList = "patientId"),
        @Index(name = "idx_risk_level", columnList = "riskLevel")
})
public class RiskPrediction {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 64)
    private String followUpId;

    @Column(nullable = false)
    private Integer riskScore; // 0 - 100

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private RiskLevel riskLevel = RiskLevel.LOW;

    private Integer clinicalPriorityScore;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private InterventionPriority interventionPriority = InterventionPriority.LOW;

    private Integer previousAppointmentScore;
    private Integer missedAppointmentScore;
    private Integer distanceScore;
    private Integer treatmentDurationScore;
    private Integer appointmentFrequencyScore;
    private Integer followUpCompletionScore;

    @Column(length = 1000)
    private String explanation;

    @Column(length = 1000)
    private String recommendedAction;

    private LocalDateTime generatedAt;

    @PrePersist
    public void onPrePersist() {
        if (generatedAt == null) generatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getFollowUpId() { return followUpId; }
    public void setFollowUpId(String followUpId) { this.followUpId = followUpId; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public Integer getClinicalPriorityScore() { return clinicalPriorityScore; }
    public void setClinicalPriorityScore(Integer clinicalPriorityScore) { this.clinicalPriorityScore = clinicalPriorityScore; }

    public InterventionPriority getInterventionPriority() { return interventionPriority; }
    public void setInterventionPriority(InterventionPriority interventionPriority) { this.interventionPriority = interventionPriority; }

    public Integer getPreviousAppointmentScore() { return previousAppointmentScore; }
    public void setPreviousAppointmentScore(Integer previousAppointmentScore) { this.previousAppointmentScore = previousAppointmentScore; }

    public Integer getMissedAppointmentScore() { return missedAppointmentScore; }
    public void setMissedAppointmentScore(Integer missedAppointmentScore) { this.missedAppointmentScore = missedAppointmentScore; }

    public Integer getDistanceScore() { return distanceScore; }
    public void setDistanceScore(Integer distanceScore) { this.distanceScore = distanceScore; }

    public Integer getTreatmentDurationScore() { return treatmentDurationScore; }
    public void setTreatmentDurationScore(Integer treatmentDurationScore) { this.treatmentDurationScore = treatmentDurationScore; }

    public Integer getAppointmentFrequencyScore() { return appointmentFrequencyScore; }
    public void setAppointmentFrequencyScore(Integer appointmentFrequencyScore) { this.appointmentFrequencyScore = appointmentFrequencyScore; }

    public Integer getFollowUpCompletionScore() { return followUpCompletionScore; }
    public void setFollowUpCompletionScore(Integer followUpCompletionScore) { this.followUpCompletionScore = followUpCompletionScore; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
