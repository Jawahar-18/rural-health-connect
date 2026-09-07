package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.StockStatus;

public class MedicineDto {

    public static class MedicineStockDto {
        private String id;
        private String name;
        private String category;
        private int currentStock;
        private int minThreshold;
        private String unit;
        private StockStatus status;
        private String expiryDate;
        private String facilityId;
        private String facilityName;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public int getCurrentStock() { return currentStock; }
        public void setCurrentStock(int currentStock) { this.currentStock = currentStock; }

        public int getMinThreshold() { return minThreshold; }
        public void setMinThreshold(int minThreshold) { this.minThreshold = minThreshold; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }

        public StockStatus getStatus() { return status; }
        public void setStatus(StockStatus status) { this.status = status; }

        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

        public String getFacilityId() { return facilityId; }
        public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
    }

    public static class UpdateStockRequest {
        private int newStock;

        public int getNewStock() { return newStock; }
        public void setNewStock(int newStock) { this.newStock = newStock; }
    }
}
