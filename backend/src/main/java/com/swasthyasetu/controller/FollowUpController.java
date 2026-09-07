package com.swasthyasetu.controller;

import com.swasthyasetu.dto.FollowUpDto;
import com.swasthyasetu.dto.FollowUpDto.CreateRequest;
import com.swasthyasetu.service.FollowUpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
@Tag(name = "Follow-ups", description = "Endpoints for scheduling, reminding, and tracking patient follow-up compliance")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    @GetMapping
    @Operation(summary = "Get all follow-up tasks")
    public ResponseEntity<List<FollowUpDto>> getAllFollowUps() {
        return ResponseEntity.ok(followUpService.getAllFollowUps());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get follow-up by ID")
    public ResponseEntity<FollowUpDto> getFollowUpById(@PathVariable("id") String id) {
        return ResponseEntity.ok(followUpService.getFollowUpById(id));
    }

    @PostMapping
    @Operation(summary = "Create follow-up task")
    public ResponseEntity<FollowUpDto> createFollowUp(@Valid @RequestBody CreateRequest request,
                                                      Authentication authentication) {
        String doctorId = authentication != null ? authentication.getName() : "usr-doctor-1";
        return ResponseEntity.ok(followUpService.createFollowUp(request, doctorId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update follow-up status (REMINDER_SENT, COMPLETED, MISSED)")
    public ResponseEntity<FollowUpDto> updateFollowUp(@PathVariable("id") String id,
                                                      @RequestBody FollowUpDto updateDto) {
        return ResponseEntity.ok(followUpService.updateFollowUp(id, updateDto));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending follow-up visits")
    public ResponseEntity<List<FollowUpDto>> getPendingFollowUps() {
        return ResponseEntity.ok(followUpService.getPendingFollowUps());
    }

    @GetMapping("/high-risk")
    @Operation(summary = "Get high-risk follow-up visits requiring proactive outreach")
    public ResponseEntity<List<FollowUpDto>> getHighRiskFollowUps() {
        return ResponseEntity.ok(followUpService.getHighRiskFollowUps());
    }
}
