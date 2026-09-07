package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.InterventionPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import java.util.ArrayList;
import java.util.List;

public class RiskDto {

    public static class FollowupRiskOutputDto {
        private int riskScore;
        private RiskLevel riskLevel;
        private List<String> explanations = new ArrayList<>();
        private List<String> recommendedActions = new ArrayList<>();

        public int getRiskScore() { return riskScore; }
        public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

        public RiskLevel getRiskLevel() { return riskLevel; }
        public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

        public List<String> getExplanations() { return explanations; }
        public void setExplanations(List<String> explanations) { this.explanations = explanations; }

        public List<String> getRecommendedActions() { return recommendedActions; }
        public void setRecommendedActions(List<String> recommendedActions) { this.recommendedActions = recommendedActions; }
    }

    public static class InterventionPriorityOutputDto {
        private int followupRiskScore;
        private ClinicalPriority clinicalPriority;
        private InterventionPriority interventionPriority;
        private List<String> recommendedInterventions = new ArrayList<>();

        public int getFollowupRiskScore() { return followupRiskScore; }
        public void setFollowupRiskScore(int followupRiskScore) { this.followupRiskScore = followupRiskScore; }

        public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
        public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

        public InterventionPriority getInterventionPriority() { return interventionPriority; }
        public void setInterventionPriority(InterventionPriority interventionPriority) { this.interventionPriority = interventionPriority; }

        public List<String> getRecommendedInterventions() { return recommendedInterventions; }
        public void setRecommendedInterventions(List<String> recommendedInterventions) { this.recommendedInterventions = recommendedInterventions; }
    }
}
