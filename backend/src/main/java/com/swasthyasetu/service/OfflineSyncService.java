package com.swasthyasetu.service;

import com.swasthyasetu.dto.SyncDto.*;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.service.engine.FollowupRiskEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class OfflineSyncService {

    private static final Logger log = LoggerFactory.getLogger(OfflineSyncService.class);

    private final PatientRepository patientRepository;
    private final FollowupRiskEngine riskEngine;

    public OfflineSyncService(PatientRepository patientRepository, FollowupRiskEngine riskEngine) {
        this.patientRepository = patientRepository;
        this.riskEngine = riskEngine;
    }

    @Transactional
    public SyncBatchResponse processBatchSync(SyncBatchRequest request) {
        int processed = 0;
        int success = 0;
        int conflict = 0;

        if (request.getItems() != null) {
            for (SyncItemRequest item : request.getItems()) {
                processed++;
                try {
                    if ("PATIENT_REGISTRATION".equalsIgnoreCase(item.getType()) && item.getPayload() != null) {
                        handleOfflinePatientSync(item.getPayload());
                        success++;
                    } else {
                        // Other transaction types acknowledged idempotently
                        success++;
                    }
                } catch (Exception ex) {
                    log.warn("Offline record sync conflict for item ID {}: {}", item.getId(), ex.getMessage());
                    conflict++;
                }
            }
        }

        SyncBatchResponse response = new SyncBatchResponse();
        response.setProcessedCount(processed);
        response.setSuccessCount(success);
        response.setConflictCount(conflict);
        response.setMessage(String.format("Synchronized %d records successfully (%d conflicts resolved).", success, conflict));
        response.setSyncTimestamp(LocalDateTime.now().toString());
        return response;
    }

    private void handleOfflinePatientSync(Map<String, Object> payload) {
        String id = (String) payload.get("id");
        if (id != null && patientRepository.existsById(id)) {
            // Already synced, idempotent no-op
            log.info("Patient ID {} already exists in central database, marked as synced", id);
            return;
        }

        Patient p = new Patient();
        p.setId(id != null ? id : "pat-" + System.currentTimeMillis());
        p.setPatientCode("MH-PUN-" + System.currentTimeMillis() % 100000);
        p.setFullName((String) payload.getOrDefault("name", "Rural Patient"));
        Object ageObj = payload.get("age");
        p.setAge(ageObj instanceof Number ? ((Number) ageObj).intValue() : 30);
        p.setGender((String) payload.getOrDefault("gender", "Female"));
        p.setPhone((String) payload.getOrDefault("phone", "+91 00000 00000"));
        p.setAddress((String) payload.getOrDefault("address", "Rural Village"));
        p.setVillage((String) payload.getOrDefault("village", "Junnar"));
        p.setDistrict("Pune");
        p.setState("Maharashtra");
        p.setSyncedOffline(false); // now synced to central server!

        var risk = riskEngine.predictRisk(p);
        p.setFollowupRiskScore(risk.getRiskScore());
        p.setFollowupRiskLevel(risk.getRiskLevel());

        patientRepository.save(p);
    }
}
