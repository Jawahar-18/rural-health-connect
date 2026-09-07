package com.swasthyasetu.controller;

import com.swasthyasetu.dto.TriageDto.*;
import com.swasthyasetu.service.TriageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/triage")
@Tag(name = "Digital Triage", description = "Endpoints for community digital triage assessments and clinician override")
public class TriageController {

    private final TriageService triageService;

    public TriageController(TriageService triageService) {
        this.triageService = triageService;
    }

    @PostMapping
    @Operation(summary = "Perform and save community digital triage assessment")
    public ResponseEntity<TriageRecordDto> createTriage(@Valid @RequestBody SaveRequest request,
                                                        Authentication authentication) {
        String workerId = authentication != null ? authentication.getName() : "usr-worker-1";
        String workerName = "Savita Kamble (ASHA)";
        return ResponseEntity.ok(triageService.createTriage(request, workerId, workerName));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get historical triage assessments for patient")
    public ResponseEntity<List<TriageRecordDto>> getTriageByPatient(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(triageService.getTriageByPatient(patientId));
    }

    @PostMapping("/{id}/override")
    @Operation(summary = "Clinician override of AI recommendation with clinical justification")
    public ResponseEntity<TriageRecordDto> overrideTriage(@PathVariable("id") String id,
                                                          @Valid @RequestBody TriageOverrideRequest request) {
        return ResponseEntity.ok(triageService.overrideTriage(id, request));
    }
}
