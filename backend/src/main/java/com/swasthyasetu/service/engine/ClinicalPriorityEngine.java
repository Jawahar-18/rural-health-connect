package com.swasthyasetu.service.engine;

import com.swasthyasetu.dto.ConsultationDto.VitalsDto;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClinicalPriorityEngine {

    public ClinicalPriority evaluate(List<String> symptoms, VitalsDto vitals, boolean isPregnant, List<String> chronicConditions) {
        int urgentFlags = 0;
        int highFlags = 0;
        int moderateFlags = 0;

        if (vitals != null) {
            if (vitals.getOxygenSatPercent() != null && vitals.getOxygenSatPercent() < 90) urgentFlags++;
            if (vitals.getBpSystolic() != null && vitals.getBpSystolic() >= 180) urgentFlags++;
            if (vitals.getBpSystolic() != null && vitals.getBpSystolic() >= 150) highFlags++;
            if (vitals.getTemperatureCelsius() != null && vitals.getTemperatureCelsius() > 39.5) urgentFlags++;
            if (vitals.getTemperatureCelsius() != null && vitals.getTemperatureCelsius() > 38.5) highFlags++;
            if (vitals.getHemoglobinGdl() != null && vitals.getHemoglobinGdl() < 7.0) highFlags++;
        }

        if (symptoms != null && !symptoms.isEmpty()) {
            String text = String.join(" ", symptoms).toLowerCase();
            if (text.contains("chest pain") ||
                text.contains("severe shortness of breath") ||
                text.contains("unconscious") ||
                text.contains("heavy bleeding") ||
                text.contains("convulsions") ||
                text.contains("fits")) {
                urgentFlags += 2;
            }

            if (text.contains("high fever") ||
                text.contains("persistent vomiting") ||
                text.contains("severe headache") ||
                text.contains("abdominal pain")) {
                highFlags++;
            }

            if (text.contains("cough") || text.contains("mild fever") || text.contains("fatigue")) {
                moderateFlags++;
            }
        }

        // Maternal care clinical evaluation
        if (isPregnant && highFlags > 0) {
            urgentFlags++;
        } else if (isPregnant) {
            moderateFlags++;
        }

        if (chronicConditions != null && !chronicConditions.isEmpty()) {
            moderateFlags++;
        }

        if (urgentFlags > 0) return ClinicalPriority.URGENT;
        if (highFlags > 0) return ClinicalPriority.HIGH;
        if (moderateFlags > 0) return ClinicalPriority.MODERATE;
        return ClinicalPriority.ROUTINE;
    }
}
