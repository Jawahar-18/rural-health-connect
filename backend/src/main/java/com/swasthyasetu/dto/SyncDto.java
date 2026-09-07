package com.swasthyasetu.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SyncDto {

    public static class SyncItemRequest {
        private String id;
        private String type; // PATIENT_REGISTRATION, TRIAGE, etc.
        private Map<String, Object> payload;
        private String timestamp;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Map<String, Object> getPayload() { return payload; }
        public void setPayload(Map<String, Object> payload) { this.payload = payload; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    public static class SyncBatchRequest {
        private List<SyncItemRequest> items = new ArrayList<>();

        public List<SyncItemRequest> getItems() { return items; }
        public void setItems(List<SyncItemRequest> items) { this.items = items; }
    }

    public static class SyncBatchResponse {
        private int processedCount;
        private int successCount;
        private int conflictCount;
        private String message;
        private String syncTimestamp;

        public int getProcessedCount() { return processedCount; }
        public void setProcessedCount(int processedCount) { this.processedCount = processedCount; }

        public int getSuccessCount() { return successCount; }
        public void setSuccessCount(int successCount) { this.successCount = successCount; }

        public int getConflictCount() { return conflictCount; }
        public void setConflictCount(int conflictCount) { this.conflictCount = conflictCount; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getSyncTimestamp() { return syncTimestamp; }
        public void setSyncTimestamp(String syncTimestamp) { this.syncTimestamp = syncTimestamp; }
    }
}
