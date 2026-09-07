package com.swasthyasetu.controller;

import com.swasthyasetu.dto.DashboardDto.*;
import com.swasthyasetu.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboards", description = "Endpoints providing aggregated operational metrics for all 5 user roles")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/facility/{facilityId}")
    @Operation(summary = "Get Facility Admin OPD load, wait time, and shortage KPIs")
    public ResponseEntity<FacilityKPIDto> getFacilityDashboard(@PathVariable("facilityId") String facilityId) {
        return ResponseEntity.ok(dashboardService.getFacilityDashboard(facilityId));
    }

    @GetMapping("/district/{district}")
    @Operation(summary = "Get District Health Officer aggregated analytics and referral completion funnel")
    public ResponseEntity<DistrictDashboardDto> getDistrictDashboard(@PathVariable("district") String district) {
        return ResponseEntity.ok(dashboardService.getDistrictDashboard(district));
    }

    @GetMapping("/doctor")
    @Operation(summary = "Get Doctor dashboard OPD queue waiting list and urgency breakdown")
    public ResponseEntity<DoctorDashboardDto> getDoctorDashboard(Authentication authentication) {
        String doctorId = authentication != null ? authentication.getName() : "usr-doctor-1";
        return ResponseEntity.ok(dashboardService.getDoctorDashboard(doctorId));
    }
}
