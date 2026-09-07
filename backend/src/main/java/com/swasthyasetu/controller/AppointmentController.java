package com.swasthyasetu.controller;

import com.swasthyasetu.dto.AppointmentDto;
import com.swasthyasetu.entity.enums.AppointmentStatus;
import com.swasthyasetu.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointments", description = "Endpoints for scheduling, canceling, and tracking OPD visits")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    @Operation(summary = "Get all appointments")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by ID")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable("id") String id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping
    @Operation(summary = "Book appointment and auto-generate live queue token")
    public ResponseEntity<AppointmentDto> createAppointment(@Valid @RequestBody AppointmentDto.CreateRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update appointment status (CHECKED_IN, COMPLETED, CANCELLED)")
    public ResponseEntity<AppointmentDto> updateStatus(@PathVariable("id") String id,
                                                       @RequestParam("status") AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel appointment")
    public ResponseEntity<Void> cancelAppointment(@PathVariable("id") String id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/queue/{facilityId}")
    @Operation(summary = "Get active OPD queue tokens for a facility on given date")
    public ResponseEntity<List<AppointmentDto>> getActiveQueue(@PathVariable("facilityId") String facilityId,
                                                               @RequestParam(value = "date", required = false) String date) {
        LocalDate localDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        return ResponseEntity.ok(appointmentService.getActiveQueue(facilityId, localDate));
    }
}
