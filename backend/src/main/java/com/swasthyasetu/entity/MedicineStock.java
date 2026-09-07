package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.StockStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_stock", indexes = {
        @Index(name = "idx_stock_facility", columnList = "facilityId"),
        @Index(name = "idx_stock_medicine", columnList = "medicineId"),
        @Index(name = "idx_stock_status", columnList = "status")
})
public class MedicineStock {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String facilityId;

    @Column(length = 150)
    private String facilityName;

    @Column(nullable = false, length = 64)
    private String medicineId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 50)
    private String category = "Essential Drugs";

    @Column(nullable = false)
    private Integer quantity = 0;

    private Integer minimumThreshold = 100;

    @Column(length = 32)
    private String unit = "strips";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private StockStatus status = StockStatus.AVAILABLE;

    private LocalDate expiryDate;

    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        lastUpdated = LocalDateTime.now();
        if (quantity == null || quantity == 0) {
            status = StockStatus.OUT_OF_STOCK;
        } else if (quantity <= minimumThreshold) {
            status = StockStatus.LOW_STOCK;
        } else {
            status = StockStatus.AVAILABLE;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getMedicineId() { return medicineId; }
    public void setMedicineId(String medicineId) { this.medicineId = medicineId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getMinimumThreshold() { return minimumThreshold; }
    public void setMinimumThreshold(Integer minimumThreshold) { this.minimumThreshold = minimumThreshold; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public StockStatus getStatus() { return status; }
    public void setStatus(StockStatus status) { this.status = status; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
