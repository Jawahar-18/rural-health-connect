package com.swasthyasetu.controller;

import com.swasthyasetu.dto.AppointmentDto;
import com.swasthyasetu.entity.QueueToken;
import com.swasthyasetu.entity.enums.QueueTokenStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.repository.QueueTokenRepository;
import com.swasthyasetu.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/queue")
@Tag(name = "Live Queue", description = "Endpoints for real-time OPD token status and queue monitor")
public class QueueController {

    private final QueueTokenRepository queueTokenRepository;
    private final AppointmentService appointmentService;

    public QueueController(QueueTokenRepository queueTokenRepository, AppointmentService appointmentService) {
        this.queueTokenRepository = queueTokenRepository;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{facilityId}")
    @Operation(summary = "Get current active queue for facility")
    public ResponseEntity<List<AppointmentDto>> getFacilityQueue(@PathVariable("facilityId") String facilityId,
                                                                 @RequestParam(value = "date", required = false) String date) {
        LocalDate localDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        return ResponseEntity.ok(appointmentService.getActiveQueue(facilityId, localDate));
    }

    @GetMapping("/token/{tokenId}")
    @Operation(summary = "Get token status")
    public ResponseEntity<QueueToken> getTokenStatus(@PathVariable("tokenId") String tokenId) {
        QueueToken tok = queueTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue token not found: " + tokenId));
        return ResponseEntity.ok(tok);
    }

    @PutMapping("/token/{tokenId}/status")
    @Operation(summary = "Update queue token status")
    public ResponseEntity<QueueToken> updateTokenStatus(@PathVariable("tokenId") String tokenId,
                                                        @RequestParam("status") QueueTokenStatus status) {
        QueueToken tok = queueTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue token not found: " + tokenId));
        tok.setStatus(status);
        queueTokenRepository.save(tok);
        return ResponseEntity.ok(tok);
    }
}
