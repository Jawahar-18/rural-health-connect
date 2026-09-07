package com.swasthyasetu.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.engine.weights")
public class EngineWeightsConfig {

    private int missedAppointmentWeight = 20;
    private int severeMissedThreshold = 3;
    private int severeMissedBonus = 40;
    private int farDistanceThresholdKm = 25;
    private int farDistanceWeight = 25;
    private int moderateDistanceThresholdKm = 10;
    private int moderateDistanceWeight = 15;
    private int elderlyAgeThreshold = 65;
    private int elderlyWeight = 10;
    private int pediatricAgeThreshold = 5;
    private int pediatricWeight = 10;
    private int multipleChronicThreshold = 2;
    private int multipleChronicWeight = 15;
    private int maternalCareWeight = 10;
    private int baselineScore = 20;
    private int maxScore = 98;
    private int minScore = 5;

    public int getMissedAppointmentWeight() { return missedAppointmentWeight; }
    public void setMissedAppointmentWeight(int missedAppointmentWeight) { this.missedAppointmentWeight = missedAppointmentWeight; }

    public int getSevereMissedThreshold() { return severeMissedThreshold; }
    public void setSevereMissedThreshold(int severeMissedThreshold) { this.severeMissedThreshold = severeMissedThreshold; }

    public int getSevereMissedBonus() { return severeMissedBonus; }
    public void setSevereMissedBonus(int severeMissedBonus) { this.severeMissedBonus = severeMissedBonus; }

    public int getFarDistanceThresholdKm() { return farDistanceThresholdKm; }
    public void setFarDistanceThresholdKm(int farDistanceThresholdKm) { this.farDistanceThresholdKm = farDistanceThresholdKm; }

    public int getFarDistanceWeight() { return farDistanceWeight; }
    public void setFarDistanceWeight(int farDistanceWeight) { this.farDistanceWeight = farDistanceWeight; }

    public int getModerateDistanceThresholdKm() { return moderateDistanceThresholdKm; }
    public void setModerateDistanceThresholdKm(int moderateDistanceThresholdKm) { this.moderateDistanceThresholdKm = moderateDistanceThresholdKm; }

    public int getModerateDistanceWeight() { return moderateDistanceWeight; }
    public void setModerateDistanceWeight(int moderateDistanceWeight) { this.moderateDistanceWeight = moderateDistanceWeight; }

    public int getElderlyAgeThreshold() { return elderlyAgeThreshold; }
    public void setElderlyAgeThreshold(int elderlyAgeThreshold) { this.elderlyAgeThreshold = elderlyAgeThreshold; }

    public int getElderlyWeight() { return elderlyWeight; }
    public void setElderlyWeight(int elderlyWeight) { this.elderlyWeight = elderlyWeight; }

    public int getPediatricAgeThreshold() { return pediatricAgeThreshold; }
    public void setPediatricAgeThreshold(int pediatricAgeThreshold) { this.pediatricAgeThreshold = pediatricAgeThreshold; }

    public int getPediatricWeight() { return pediatricWeight; }
    public void setPediatricWeight(int pediatricWeight) { this.pediatricWeight = pediatricWeight; }

    public int getMultipleChronicThreshold() { return multipleChronicThreshold; }
    public void setMultipleChronicThreshold(int multipleChronicThreshold) { this.multipleChronicThreshold = multipleChronicThreshold; }

    public int getMultipleChronicWeight() { return multipleChronicWeight; }
    public void setMultipleChronicWeight(int multipleChronicWeight) { this.multipleChronicWeight = multipleChronicWeight; }

    public int getMaternalCareWeight() { return maternalCareWeight; }
    public void setMaternalCareWeight(int maternalCareWeight) { this.maternalCareWeight = maternalCareWeight; }

    public int getBaselineScore() { return baselineScore; }
    public void setBaselineScore(int baselineScore) { this.baselineScore = baselineScore; }

    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }

    public int getMinScore() { return minScore; }
    public void setMinScore(int minScore) { this.minScore = minScore; }
}
