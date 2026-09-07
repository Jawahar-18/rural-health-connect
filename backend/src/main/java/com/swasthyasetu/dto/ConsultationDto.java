package com.swasthyasetu.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class ConsultationDto {

    public static class VitalsDto {
        private Double temperatureCelsius;
        private Integer bpSystolic;
        private Integer bpDiastolic;
        private Integer heartRateBpm;
        private Integer respRatePerMin;
        private Integer oxygenSatPercent;
        private Double bloodSugarMgDl;
        private Double weightKg;
        private Double heightCm;
        private Double hemoglobinGdl;

        public Double getTemperatureCelsius() { return temperatureCelsius; }
        public void setTemperatureCelsius(Double temperatureCelsius) { this.temperatureCelsius = temperatureCelsius; }

        public Integer getBpSystolic() { return bpSystolic; }
        public void setBpSystolic(Integer bpSystolic) { this.bpSystolic = bpSystolic; }

        public Integer getBpDiastolic() { return bpDiastolic; }
        public void setBpDiastolic(Integer bpDiastolic) { this.diastolicBp = bpDiastolic; }

        public Integer getHeartRateBpm() { return heartRateBpm; }
        public void setHeartRateBpm(Integer heartRateBpm) { this.heartRateBpm = heartRateBpm; }

        public Integer getRespRatePerMin() { return respRatePerMin; }
        public void setRespRatePerMin(Integer respRatePerMin) { this.respRatePerMin = respRatePerMin; }

        public Integer getOxygenSatPercent() { return oxygenSatPercent; }
        public void setOxygenSatPercent(Integer oxygenSatPercent) { this.oxygenSatPercent = oxygenSatPercent; }

        public Double getBloodSugarMgDl() { return bloodSugarMgDl; }
        public void setBloodSugarMgDl(Double bloodSugarMgDl) { this.bloodSugarMgDl = bloodSugarMgDl; }

        public Double getWeightKg() { return weightKg; }
        public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

        public Double getHeightCm() { return heightCm; }
        public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }

        public Double getHemoglobinGdl() { return hemoglobinGdl; }
        public void setHemoglobinGdl(Double hemoglobinGdl) { this.hemoglobinGdl = hemoglobinGdl; }

        private Integer diastolicBp;
    }

    public static class PrescriptionItemDto {
        private String medicineName;
        private String dosage;
        private String frequency;
        private int durationDays = 5;
        private String instructions;
        private boolean inStock = true;

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }

        public int getDurationDays() { return durationDays; }
        public void setDurationDays(int durationDays) { this.durationDays = durationDays; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public boolean isInStock() { return inStock; }
        public void setInStock(boolean inStock) { this.inStock = inStock; }
    }

    public static class PrescriptionDto {
        private String id;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String doctorName;
        private String facilityName;
        private String date;
        private String diagnosis;
        private String clinicalNotes;
        private List<PrescriptionItemDto> items = new ArrayList<>();
        private String followUpDate;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

        public List<PrescriptionItemDto> getItems() { return items; }
        public void setItems(List<PrescriptionItemDto> items) { this.items = items; }

        public String getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
    }

    public static class ConsultationRequest {
        @NotBlank(message = "Patient ID is required")
        private String patientId;

        private String chiefComplaint;
        private String diagnosis;
        private String clinicalNotes;
        private String followUpDate;
        private List<PrescriptionItemDto> items = new ArrayList<>();

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getChiefComplaint() { return chiefComplaint; }
        public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

        public String getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }

        public List<PrescriptionItemDto> getItems() { return items; }
        public void setItems(List<PrescriptionItemDto> items) { this.items = items; }
    }
}
