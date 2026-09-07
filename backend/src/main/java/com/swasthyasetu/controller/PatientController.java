package com.swasthyasetu.controller;

import com.swasthyasetu.dto.AppointmentDto;
import com.swasthyasetu.dto.FollowUpDto;
import com.swasthyasetu.dto.PatientDto;
import com.swasthyasetu.dto.ReferralDto;
import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patients", description = "Endpoints for rural patient directory, registration, search, and longitudinal history")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    @Operation(summary = "List or search all registered patients")
    public ResponseEntity<List<PatientDto>> getAllPatients(@RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(patientService.getAllPatients(search));
    }

    @GetMapping("/search")
    @Operation(summary = "Search patients by name, village, or phone")
    public ResponseEntity<List<PatientDto>> searchPatients(@RequestParam("query") String query) {
        return ResponseEntity.ok(patientService.getAllPatients(query));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable("id") String id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    @Operation(summary = "Register new patient with automatic AI risk & clinical priority assessment")
    public ResponseEntity<PatientDto> createPatient(@Valid @RequestBody PatientDto.CreateRequest request,
                                                    Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "Savita Kamble (ASHA)";
        return ResponseEntity.ok(patientService.createPatient(request, username));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update patient record")
    public ResponseEntity<PatientDto> updatePatient(@PathVariable("id") String id,
                                                    @RequestBody PatientDto updateDto) {
        return ResponseEntity.ok(patientService.updatePatient(id, updateDto));
    }

    @GetMapping("/{id}/appointments")
    @Operation(summary = "Get patient appointments")
    public ResponseEntity<List<AppointmentDto>> getPatientAppointments(@PathVariable("id") String id) {
        return ResponseEntity.ok(patientService.getPatientAppointments(id));
    }

    @GetMapping("/{id}/referrals")
    @Operation(summary = "Get patient referrals")
    public ResponseEntity<List<ReferralDto>> getPatientReferrals(@PathVariable("id") String id) {
        return ResponseEntity.ok(patientService.getPatientReferrals(id));
    }

    @GetMapping("/{id}/followups")
    @Operation(summary = "Get patient follow-up task history")
    public ResponseEntity<List<FollowUpDto>> getPatientFollowups(@PathVariable("id") String id) {
        return ResponseEntity.ok(patientService.getPatientFollowups(id));
    }

    @GetMapping("/{id}/risk")
    @Operation(summary = "Get latest AI follow-up risk prediction and actionable recommendations")
    public ResponseEntity<FollowupRiskOutputDto> getPatientRisk(@PathVariable("id") String id) {
        return ResponseEntity.ok(patientService.getPatientRisk(id));
    }
}
