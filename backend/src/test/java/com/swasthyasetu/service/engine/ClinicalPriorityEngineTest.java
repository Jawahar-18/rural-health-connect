package com.swasthyasetu.service.engine;

import com.swasthyasetu.dto.ConsultationDto.VitalsDto;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ClinicalPriorityEngineTest {

    private ClinicalPriorityEngine engine;

    @BeforeEach
    void setUp() {
        engine = new ClinicalPriorityEngine();
    }

    @Test
    void testUrgentSymptoms() {
        ClinicalPriority priority = engine.evaluate(
                List.of("Severe chest pain", "Shortness of breath"),
                null,
                false,
                null
        );
        assertEquals(ClinicalPriority.URGENT, priority);
    }

    @Test
    void testUrgentVitalsLowSpO2() {
        VitalsDto vitals = new VitalsDto();
        vitals.setOxygenSatPercent(87);
        vitals.setBpSystolic(130);

        ClinicalPriority priority = engine.evaluate(
                List.of("Cough"),
                vitals,
                false,
                null
        );
        assertEquals(ClinicalPriority.URGENT, priority);
    }

    @Test
    void testPregnantPatientWithoutUrgentFlagsIsNotUrgent() {
        // Important domain rule: Do not automatically classify pregnant patient as urgent without clinical flags
        ClinicalPriority priority = engine.evaluate(
                List.of("Mild backache"),
                null,
                true,
                null
        );
        assertNotEquals(ClinicalPriority.URGENT, priority);
        assertEquals(ClinicalPriority.MODERATE, priority);
    }
}
