package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "triage_assessments", indexes = {
        @Index(name = "idx_triage_patient", columnList = "patientId"),
        @Index(name = "idx_triage_worker", columnList = "healthWorkerId")
})
public class TriageAssessment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 150)
    private String patientName;

    @Column(length = 64)
    private String healthWorkerId;

    @Column(length = 150)
    private String healthWorkerName;

    @Column(length = 1000)
    private String symptoms; // comma-separated or JSON list

    @Column(length = 500)
    private String vitalSummary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ClinicalPriority clinicalPriority = ClinicalPriority.ROUTINE;

    @Column(length = 500)
    private String recommendation;

    private boolean clinicianOverride = false;

    @Column(length = 500)
    private String overrideReason;

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

    public String getHealthWorkerId() { return healthWorkerId; }
    public void setHealthWorkerId(String healthWorkerId) { this.healthWorkerId = healthWorkerId; }

    public String getHealthWorkerName() { return healthWorkerName; }
    public void setHealthWorkerName(String healthWorkerName) { this.healthWorkerName = healthWorkerName; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getVitalSummary() { return vitalSummary; }
    public void setVitalSummary(String vitalSummary) { this.vitalSummary = vitalSummary; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
    public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public boolean isClinicianOverride() { return clinicianOverride; }
    public void setClinicianOverride(boolean clinicianOverride) { this.clinicianOverride = clinicianOverride; }

    public String getOverrideReason() { return overrideReason; }
    public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
