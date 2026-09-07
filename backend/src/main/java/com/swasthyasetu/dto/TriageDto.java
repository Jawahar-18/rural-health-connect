package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class TriageDto {

    public static class TriageRecordDto {
        private String id;
        private String patientId;
        private String patientName;
        private String date;
        private List<String> symptoms = new ArrayList<>();
        private ConsultationDto.VitalsDto vitals;
        private ClinicalPriority clinicalPriority;
        private ClinicalPriority triageLevel;
        private List<String> reasons = new ArrayList<>();
        private String recommendedAction;
        private boolean overriddenByClinician = false;
        private String overrideReason;
        private String healthWorkerId;
        private String healthWorkerName;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public List<String> getSymptoms() { return symptoms; }
        public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

        public ConsultationDto.VitalsDto getVitals() { return vitals; }
        public void setVitals(ConsultationDto.VitalsDto vitals) { this.vitals = vitals; }

        public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
        public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

        public ClinicalPriority getTriageLevel() { return triageLevel; }
        public void setTriageLevel(ClinicalPriority triageLevel) { this.triageLevel = triageLevel; }

        public List<String> getReasons() { return reasons; }
        public void setReasons(List<String> reasons) { this.reasons = reasons; }

        public String getRecommendedAction() { return recommendedAction; }
        public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

        public boolean isOverriddenByClinician() { return overriddenByClinician; }
        public void setOverriddenByClinician(boolean overriddenByClinician) { this.overriddenByClinician = overriddenByClinician; }

        public String getOverrideReason() { return overrideReason; }
        public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }

        public String getHealthWorkerId() { return healthWorkerId; }
        public void setHealthWorkerId(String healthWorkerId) { this.healthWorkerId = healthWorkerId; }

        public String getHealthWorkerName() { return healthWorkerName; }
        public void setHealthWorkerName(String healthWorkerName) { this.healthWorkerName = healthWorkerName; }
    }

    public static class SaveRequest {
        @NotBlank(message = "Patient ID is required")
        private String patientId;

        private String patientName;
        private List<String> symptoms = new ArrayList<>();
        private ConsultationDto.VitalsDto vitals;
        private ClinicalPriority clinicalPriority;
        private ClinicalPriority triageLevel;
        private List<String> reasons = new ArrayList<>();
        private String recommendedAction;
        private boolean overriddenByClinician = false;
        private String overrideReason;

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public List<String> getSymptoms() { return symptoms; }
        public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

        public ConsultationDto.VitalsDto getVitals() { return vitals; }
        public void setVitals(ConsultationDto.VitalsDto vitals) { this.vitals = vitals; }

        public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
        public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

        public ClinicalPriority getTriageLevel() { return triageLevel; }
        public void setTriageLevel(ClinicalPriority triageLevel) { this.triageLevel = triageLevel; }

        public List<String> getReasons() { return reasons; }
        public void setReasons(List<String> reasons) { this.reasons = reasons; }

        public String getRecommendedAction() { return recommendedAction; }
        public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

        public boolean isOverriddenByClinician() { return overriddenByClinician; }
        public void setOverriddenByClinician(boolean overriddenByClinician) { this.overriddenByClinician = overriddenByClinician; }

        public String getOverrideReason() { return overrideReason; }
        public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }
    }

    public static class TriageOverrideRequest {
        @NotBlank(message = "Override reason is required")
        private String overrideReason;

        private ClinicalPriority newPriority = ClinicalPriority.HIGH;

        public String getOverrideReason() { return overrideReason; }
        public void setOverrideReason(String overrideReason) { this.overrideReason = overrideReason; }

        public ClinicalPriority getNewPriority() { return newPriority; }
        public void setNewPriority(ClinicalPriority newPriority) { this.newPriority = newPriority; }
    }
}
