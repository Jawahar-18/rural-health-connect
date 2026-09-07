package com.swasthyasetu.service.engine;

import com.swasthyasetu.config.EngineWeightsConfig;
import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.enums.RiskLevel;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FollowupRiskEngine {

    private final EngineWeightsConfig weights;

    public FollowupRiskEngine(EngineWeightsConfig weights) {
        this.weights = weights;
    }

    public FollowupRiskOutputDto predictRisk(Patient patient) {
        int score = weights.getBaselineScore();
        List<String> explanations = new ArrayList<>();
        List<String> recommendedActions = new ArrayList<>();

        int missed = patient.getMissedAppointments() != null ? patient.getMissedAppointments() : 0;
        double distance = patient.getDistanceFromFacilityKm() != null ? patient.getDistanceFromFacilityKm() : 5.0;
        int age = patient.getAge() != null ? patient.getAge() : 35;

        // Missed Appointments
        if (missed >= weights.getSevereMissedThreshold()) {
            score += weights.getSevereMissedBonus();
            explanations.add("High missed appointment history (" + missed + " previous missed visits)");
            recommendedActions.add("Assign ASHA worker for home visit & direct reminder");
        } else if (missed > 0) {
            score += weights.getMissedAppointmentWeight() * missed;
            explanations.add(missed + " past missed appointment(s)");
            recommendedActions.add("Send automated SMS & voice call reminder in local language");
        }

        // Distance from Facility
        if (distance > weights.getFarDistanceThresholdKm()) {
            score += weights.getFarDistanceWeight();
            explanations.add("Significant distance from facility (" + (int) distance + " km)");
            recommendedActions.add("Offer mobile health clinic routing or travel support allowance");
        } else if (distance > weights.getModerateDistanceThresholdKm()) {
            score += weights.getModerateDistanceWeight();
            explanations.add("Moderate travel distance to hospital (" + (int) distance + " km)");
        }

        // Age Sensitivity
        if (age > weights.getElderlyAgeThreshold()) {
            score += weights.getElderlyWeight();
            explanations.add("Elderly patient (Age 65+) requiring mobility support");
        } else if (age < weights.getPediatricAgeThreshold()) {
            score += weights.getPediatricWeight();
            explanations.add("Pediatric follow-up sensitivity");
        }

        // Multiple Chronic Conditions
        if (patient.getChronicConditionDetails() != null) {
            String[] conds = patient.getChronicConditionDetails().split(",");
            if (conds.length >= weights.getMultipleChronicThreshold()) {
                score += weights.getMultipleChronicWeight();
                explanations.add("Multiple chronic conditions (" + patient.getChronicConditionDetails() + ")");
                recommendedActions.add("Coordinate multi-specialty consolidated appointment date");
            }
        }

        // Maternal Care Continuity
        if (patient.isPregnant()) {
            score += weights.getMaternalCareWeight();
            explanations.add("Antenatal care continuity tracking");
            recommendedActions.add("Verify ANM micro-plan scheduling");
        }

        int finalScore = Math.min(Math.max(score, weights.getMinScore()), weights.getMaxScore());

        RiskLevel riskLevel = RiskLevel.LOW;
        if (finalScore >= 70) {
            riskLevel = RiskLevel.HIGH;
        } else if (finalScore >= 40) {
            riskLevel = RiskLevel.MEDIUM;
        }

        if (recommendedActions.isEmpty()) {
            recommendedActions.add("Routine SMS reminder prior to appointment date");
        }

        FollowupRiskOutputDto output = new FollowupRiskOutputDto();
        output.setRiskScore(finalScore);
        output.setRiskLevel(riskLevel);
        output.setExplanations(explanations);
        output.setRecommendedActions(recommendedActions);
        return output;
    }
}
