package com.swasthyasetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals", indexes = {
        @Index(name = "idx_vital_patient", columnList = "patientId"),
        @Index(name = "idx_vital_mr", columnList = "medicalRecordId")
})
public class Vital {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String patientId;

    @Column(length = 64)
    private String medicalRecordId;

    private Double temperature; // Celsius e.g. 37.0
    private Integer heartRate;  // bpm e.g. 75
    private Integer systolicBp; // mmHg e.g. 120
    private Integer diastolicBp; // mmHg e.g. 80
    private Integer respiratoryRate; // /min e.g. 18
    private Integer oxygenSaturation; // % e.g. 98
    private Double bloodSugar; // mg/dL e.g. 105
    private Double hemoglobin; // g/dL e.g. 12.0
    private Double weight; // kg e.g. 65.0
    private Double height; // cm e.g. 165.0

    @Column(length = 64)
    private String recordedBy;

    private LocalDateTime recordedAt;

    @PrePersist
    public void onPrePersist() {
        if (recordedAt == null) recordedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getMedicalRecordId() { return medicalRecordId; }
    public void setMedicalRecordId(String medicalRecordId) { this.medicalRecordId = medicalRecordId; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Integer getSystolicBp() { return systolicBp; }
    public void setSystolicBp(Integer systolicBp) { this.systolicBp = systolicBp; }

    public Integer getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; }

    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }

    public Integer getOxygenSaturation() { return oxygenSaturation; }
    public void setOxygenSaturation(Integer oxygenSaturation) { this.oxygenSaturation = oxygenSaturation; }

    public Double getBloodSugar() { return bloodSugar; }
    public void setBloodSugar(Double bloodSugar) { this.bloodSugar = bloodSugar; }

    public Double getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
