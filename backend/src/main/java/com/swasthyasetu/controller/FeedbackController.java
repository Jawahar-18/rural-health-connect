package com.swasthyasetu.controller;

import com.swasthyasetu.dto.FeedbackDto;
import com.swasthyasetu.dto.FeedbackDto.AdminReviewRequest;
import com.swasthyasetu.dto.FeedbackDto.CreateRequest;
import com.swasthyasetu.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Patient Feedback & Governance", description = "Endpoints for logging patient treatment feedback, 'will not come' refusals, and administrative oversight")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    @Operation(summary = "Get all patient feedbacks")
    public ResponseEntity<List<FeedbackDto>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/refusals")
    @Operation(summary = "Get all patient follow-up refusals ('will not come' alerts)")
    public ResponseEntity<List<FeedbackDto>> getRefusalFeedbacks() {
        return ResponseEntity.ok(feedbackService.getRefusalFeedbacks());
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get feedback history for a specific patient")
    public ResponseEntity<List<FeedbackDto>> getFeedbacksByPatientId(@PathVariable("patientId") String patientId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByPatientId(patientId));
    }

    @PostMapping
    @Operation(summary = "Submit patient treatment feedback / refusal report")
    public ResponseEntity<FeedbackDto> submitFeedback(@Valid @RequestBody CreateRequest request,
                                                      Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "usr-worker-1";
        String userName = "Staff Clinician";
        String userRole = "HEALTH_WORKER";
        return ResponseEntity.ok(feedbackService.submitFeedback(request, userId, userName, userRole));
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "Admin review and action response for feedback/refusal")
    public ResponseEntity<FeedbackDto> reviewFeedback(@PathVariable("id") String id,
                                                      @Valid @RequestBody AdminReviewRequest request,
                                                      Authentication authentication) {
        String adminId = authentication != null ? authentication.getName() : "usr-admin-facility";
        return ResponseEntity.ok(feedbackService.reviewFeedback(id, request, adminId));
    }

    @PutMapping("/patients/{patientId}/archive")
    @Operation(summary = "Admin manual archive of patient")
    public ResponseEntity<?> archivePatient(@PathVariable("patientId") String patientId,
                                            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Archived by Admin";
        feedbackService.archivePatient(patientId, reason);
        return ResponseEntity.ok(Map.of("message", "Patient archived successfully", "patientId", patientId));
    }

    @PutMapping("/patients/{patientId}/unarchive")
    @Operation(summary = "Admin restore/unarchive patient")
    public ResponseEntity<?> unarchivePatient(@PathVariable("patientId") String patientId) {
        feedbackService.unarchivePatient(patientId);
        return ResponseEntity.ok(Map.of("message", "Patient restored to active roster", "patientId", patientId));
    }
}
