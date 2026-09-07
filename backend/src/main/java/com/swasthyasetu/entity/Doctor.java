package com.swasthyasetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors", indexes = {
        @Index(name = "idx_doctor_facility", columnList = "facilityId"),
        @Index(name = "idx_doctor_user", columnList = "userId", unique = true)
})
public class Doctor {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String userId;

    @Column(nullable = false, length = 64)
    private String facilityId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String specialization;

    @Column(length = 32)
    private String phone;

    private boolean available = true;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
