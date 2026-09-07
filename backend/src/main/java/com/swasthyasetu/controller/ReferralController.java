package com.swasthyasetu.controller;

import com.swasthyasetu.dto.ReferralDto;
import com.swasthyasetu.dto.ReferralDto.CreateRequest;
import com.swasthyasetu.dto.ReferralDto.StatusUpdateRequest;
import com.swasthyasetu.service.ReferralService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@Tag(name = "Referrals", description = "Endpoints for inter-facility specialist referral continuity and tracking")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @GetMapping
    @Operation(summary = "Get all referrals")
    public ResponseEntity<List<ReferralDto>> getAllReferrals() {
        return ResponseEntity.ok(referralService.getAllReferrals());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get referral by ID")
    public ResponseEntity<ReferralDto> getReferralById(@PathVariable("id") String id) {
        return ResponseEntity.ok(referralService.getReferralById(id));
    }

    @PostMapping
    @Operation(summary = "Create an outbound referral to specialist facility")
    public ResponseEntity<ReferralDto> createReferral(@Valid @RequestBody CreateRequest request,
                                                      Authentication authentication) {
        String doctorId = authentication != null ? authentication.getName() : "usr-doctor-1";
        String doctorName = "Dr. Rajesh Deshmukh (MBBS, MD)";
        return ResponseEntity.ok(referralService.createReferral(request, doctorId, doctorName));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update referral progression status (ACCEPTED, APPOINTMENT_BOOKED, COMPLETED)")
    public ResponseEntity<ReferralDto> updateStatus(@PathVariable("id") String id,
                                                    @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(referralService.updateStatus(id, request));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending unaccepted referrals")
    public ResponseEntity<List<ReferralDto>> getPendingReferrals() {
        return ResponseEntity.ok(referralService.getPendingReferrals());
    }

    @GetMapping("/facility/{facilityId}")
    @Operation(summary = "Get all inbound and outbound referrals for a specific facility")
    public ResponseEntity<List<ReferralDto>> getFacilityReferrals(@PathVariable("facilityId") String facilityId) {
        return ResponseEntity.ok(referralService.getFacilityReferrals(facilityId));
    }
}
