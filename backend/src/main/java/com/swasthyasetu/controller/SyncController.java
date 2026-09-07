package com.swasthyasetu.controller;

import com.swasthyasetu.dto.SyncDto.SyncBatchRequest;
import com.swasthyasetu.dto.SyncDto.SyncBatchResponse;
import com.swasthyasetu.service.OfflineSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sync")
@Tag(name = "Offline Sync", description = "Endpoints for idempotent synchronization of offline-queued community health records")
public class SyncController {

    private final OfflineSyncService syncService;

    public SyncController(OfflineSyncService syncService) {
        this.syncService = syncService;
    }

    @PostMapping("/batch")
    @Operation(summary = "Batch synchronize offline-captured patient registrations and triage transactions")
    public ResponseEntity<SyncBatchResponse> syncBatch(@RequestBody SyncBatchRequest request) {
        return ResponseEntity.ok(syncService.processBatchSync(request));
    }
}
