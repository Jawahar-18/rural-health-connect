package com.swasthyasetu.service.engine;

import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.dto.RiskDto.InterventionPriorityOutputDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.InterventionPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InterventionPriorityEngine {

    private final FollowupRiskEngine riskEngine;

    public InterventionPriorityEngine(FollowupRiskEngine riskEngine) {
        this.riskEngine = riskEngine;
    }

    public InterventionPriorityOutputDto calculate(Patient patient) {
        FollowupRiskOutputDto risk = riskEngine.predictRisk(patient);
        ClinicalPriority clinical = patient.getClinicalPriority() != null ? patient.getClinicalPriority() : ClinicalPriority.ROUTINE;

        InterventionPriority intervention;
        List<String> recommendations = new ArrayList<>(risk.getRecommendedActions());

        if (clinical == ClinicalPriority.URGENT || (risk.getRiskLevel() == RiskLevel.HIGH && clinical == ClinicalPriority.HIGH)) {
            intervention = InterventionPriority.CRITICAL;
            recommendations.add(0, "Immediate health worker home intervention & urgent doctor escalation");
        } else if (clinical == ClinicalPriority.HIGH || risk.getRiskLevel() == RiskLevel.HIGH) {
            intervention = InterventionPriority.HIGH;
            recommendations.add(0, "ASHA worker phone contact within 24 hours & transport assistance check");
        } else if (clinical == ClinicalPriority.MODERATE || risk.getRiskLevel() == RiskLevel.MEDIUM) {
            intervention = InterventionPriority.MEDIUM;
            recommendations.add(0, "Send localized voice reminder & verify medicine availability at local PHC");
        } else {
            intervention = InterventionPriority.ROUTINE;
            recommendations.add(0, "Standard automated reminder SMS");
        }

        InterventionPriorityOutputDto output = new InterventionPriorityOutputDto();
        output.setFollowupRiskScore(risk.getRiskScore());
        output.setClinicalPriority(clinical);
        output.setInterventionPriority(intervention);
        output.setRecommendedInterventions(recommendations);
        return output;
    }
}
