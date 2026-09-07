package com.swasthyasetu.controller;

import com.swasthyasetu.dto.MedicineDto.MedicineStockDto;
import com.swasthyasetu.dto.MedicineDto.UpdateStockRequest;
import com.swasthyasetu.entity.Medicine;
import com.swasthyasetu.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@Tag(name = "Medicines & Inventory", description = "Endpoints for essential drug list and PHC stock management")
public class MedicineController {

    private final InventoryService inventoryService;

    public MedicineController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "List essential medicines catalogue")
    public ResponseEntity<List<Medicine>> getMedicines() {
        return ResponseEntity.ok(inventoryService.getAllMedicines());
    }

    @GetMapping("/availability")
    @Operation(summary = "Check PHC essential drug availability & stock statuses")
    public ResponseEntity<List<MedicineStockDto>> getMedicineAvailability() {
        return ResponseEntity.ok(inventoryService.getAllStock());
    }

    @GetMapping("/facility/{facilityId}")
    @Operation(summary = "Get medicine stock inventory for a facility")
    public ResponseEntity<List<MedicineStockDto>> getFacilityStock(@PathVariable("facilityId") String facilityId) {
        return ResponseEntity.ok(inventoryService.getFacilityStock(facilityId));
    }

    @PutMapping("/stock/{stockId}")
    @Operation(summary = "Update medicine stock quantity")
    public ResponseEntity<MedicineStockDto> updateStock(@PathVariable("stockId") String stockId,
                                                        @RequestBody UpdateStockRequest request) {
        return ResponseEntity.ok(inventoryService.updateStock(stockId, request.getNewStock()));
    }
}
