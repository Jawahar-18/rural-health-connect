package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.WorkerType;
import jakarta.persistence.*;

@Entity
@Table(name = "health_workers", indexes = {
        @Index(name = "idx_hw_facility", columnList = "facilityId"),
        @Index(name = "idx_hw_user", columnList = "userId", unique = true)
})
public class HealthWorker {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String userId;

    @Column(nullable = false, length = 64)
    private String facilityId;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private WorkerType workerType = WorkerType.ASHA;

    @Column(length = 32)
    private String phone;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public WorkerType getWorkerType() { return workerType; }
    public void setWorkerType(WorkerType workerType) { this.workerType = workerType; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
