package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.FacilityType;
import jakarta.persistence.*;

@Entity
@Table(name = "facilities", indexes = {
        @Index(name = "idx_facility_district", columnList = "district"),
        @Index(name = "idx_facility_code", columnList = "facilityCode", unique = true)
})
public class Facility {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String facilityCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private FacilityType facilityType;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String village;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(length = 100)
    private String state = "Maharashtra";

    private Double latitude;
    private Double longitude;

    @Column(length = 32)
    private String phone;

    private boolean active = true;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFacilityCode() { return facilityCode; }
    public void setFacilityCode(String facilityCode) { this.facilityCode = facilityCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public FacilityType getFacilityType() { return facilityType; }
    public void setFacilityType(FacilityType facilityType) { this.facilityType = facilityType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
