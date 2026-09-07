package com.swasthyasetu.controller;

import com.swasthyasetu.dto.PatientDto;
import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-prediction")
@Tag(name = "AI Risk Engine", description = "Endpoints for AI follow-up default risk prediction and triage recommendations")
public class RiskPredictionController {

    private final PatientService patientService;

    public RiskPredictionController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/{patientId}")
    @Operation(summary = "Generate follow-up risk prediction for a patient")
    public ResponseEntity<FollowupRiskOutputDto> generateRisk(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(patientService.getPatientRisk(patientId));
    }

    @GetMapping("/{patientId}")
    @Operation(summary = "Get latest follow-up risk prediction")
    public ResponseEntity<FollowupRiskOutputDto> getLatestRisk(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(patientService.getPatientRisk(patientId));
    }

    @GetMapping("/high-risk")
    @Operation(summary = "List high-risk patients requiring proactive ASHA follow-up")
    public ResponseEntity<List<PatientDto>> getHighRiskPatients() {
        return ResponseEntity.ok(patientService.getHighRiskPatients());
    }
}
