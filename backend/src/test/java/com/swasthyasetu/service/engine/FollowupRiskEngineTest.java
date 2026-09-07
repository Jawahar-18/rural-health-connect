package com.swasthyasetu.service.engine;

import com.swasthyasetu.config.EngineWeightsConfig;
import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.enums.RiskLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FollowupRiskEngineTest {

    private FollowupRiskEngine riskEngine;

    @BeforeEach
    void setUp() {
        EngineWeightsConfig config = new EngineWeightsConfig();
        riskEngine = new FollowupRiskEngine(config);
    }

    @Test
    void testLowRiskPatient() {
        Patient p = new Patient();
        p.setAge(30);
        p.setDistanceFromFacilityKm(4.0);
        p.setMissedAppointments(0);

        FollowupRiskOutputDto result = riskEngine.predictRisk(p);

        assertNotNull(result);
        assertEquals(RiskLevel.LOW, result.getRiskLevel());
        assertTrue(result.getRiskScore() < 40);
    }

    @Test
    void testHighRiskDueToMissedAppointmentsAndDistance() {
        Patient p = new Patient();
        p.setAge(58);
        p.setDistanceFromFacilityKm(28.0);
        p.setMissedAppointments(3);
        p.setChronicConditionDetails("Type 2 Diabetes, Hypertension");

        FollowupRiskOutputDto result = riskEngine.predictRisk(p);

        assertNotNull(result);
        assertEquals(RiskLevel.HIGH, result.getRiskLevel());
        assertTrue(result.getRiskScore() >= 70);
        assertFalse(result.getExplanations().isEmpty());
    }
}
