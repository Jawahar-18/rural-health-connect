package com.swasthyasetu.controller;

import com.swasthyasetu.dto.ConsultationDto.*;
import com.swasthyasetu.service.ConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Clinical Consultation", description = "Endpoints for doctor consultations, electronic prescriptions, and vital capture")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping("/medical-records")
    @Operation(summary = "Complete clinical consultation, store medical notes, and issue digital prescription")
    public ResponseEntity<PrescriptionDto> createConsultation(@Valid @RequestBody ConsultationRequest request,
                                                              Authentication authentication) {
        String doctorId = authentication != null ? authentication.getName() : "usr-doctor-1";
        String doctorName = "Dr. Rajesh Deshmukh (MBBS, MD)";
        String facilityName = "PHC Junnar, Pune";
        return ResponseEntity.ok(consultationService.completeConsultation(request, doctorId, doctorName, facilityName));
    }

    @PostMapping("/prescriptions")
    @Operation(summary = "Create digital prescription")
    public ResponseEntity<PrescriptionDto> createPrescription(@Valid @RequestBody ConsultationRequest request,
                                                              Authentication authentication) {
        String doctorId = authentication != null ? authentication.getName() : "usr-doctor-1";
        String doctorName = "Dr. Rajesh Deshmukh (MBBS, MD)";
        String facilityName = "PHC Junnar, Pune";
        return ResponseEntity.ok(consultationService.completeConsultation(request, doctorId, doctorName, facilityName));
    }

    @GetMapping("/prescriptions/patient/{patientId}")
    @Operation(summary = "Get all prescriptions issued to a patient")
    public ResponseEntity<List<PrescriptionDto>> getPrescriptionsByPatient(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(consultationService.getPrescriptionsByPatient(patientId));
    }

    @GetMapping("/prescriptions/{id}")
    @Operation(summary = "Get single prescription by ID")
    public ResponseEntity<PrescriptionDto> getPrescriptionById(@PathVariable("id") String id) {
        return ResponseEntity.ok(consultationService.getPrescriptionById(id));
    }

    @PostMapping("/vitals")
    @Operation(summary = "Record patient physiological vitals")
    public ResponseEntity<VitalsDto> recordVitals(@RequestParam("patientId") String patientId,
                                                  @RequestBody VitalsDto vitalsDto,
                                                  Authentication authentication) {
        String recordedBy = authentication != null ? authentication.getName() : "ASHA Worker";
        return ResponseEntity.ok(consultationService.recordVitals(patientId, vitalsDto, recordedBy));
    }
}
