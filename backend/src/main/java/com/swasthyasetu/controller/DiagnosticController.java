package com.swasthyasetu.controller;

import com.swasthyasetu.dto.DiagnosticDto.*;
import com.swasthyasetu.entity.DiagnosticTest;
import com.swasthyasetu.repository.DiagnosticTestRepository;
import com.swasthyasetu.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagnostics")
@Tag(name = "Diagnostics", description = "Endpoints for lab tests, diagnostic orders, and equipment maintenance status")
public class DiagnosticController {

    private final DiagnosticTestRepository testRepository;
    private final InventoryService inventoryService;

    public DiagnosticController(DiagnosticTestRepository testRepository, InventoryService inventoryService) {
        this.testRepository = testRepository;
        this.inventoryService = inventoryService;
    }

    @GetMapping("/tests")
    @Operation(summary = "List available diagnostic tests")
    public ResponseEntity<List<DiagnosticTest>> getDiagnosticTests() {
        return ResponseEntity.ok(testRepository.findByActiveTrue());
    }

    @GetMapping("/equipment")
    @Operation(summary = "Get PHC diagnostic equipment functional & turnaround time status")
    public ResponseEntity<List<DiagnosticEquipmentDto>> getDiagnosticEquipment() {
        return ResponseEntity.ok(inventoryService.getDiagnosticEquipment());
    }
}
