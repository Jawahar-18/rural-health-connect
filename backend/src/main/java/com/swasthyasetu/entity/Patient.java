package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.InterventionPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients", indexes = {
        @Index(name = "idx_patient_code", columnList = "patientCode", unique = true),
        @Index(name = "idx_patient_phone", columnList = "phone"),
        @Index(name = "idx_patient_village", columnList = "village"),
        @Index(name = "idx_patient_district", columnList = "district"),
        @Index(name = "idx_patient_risk_level", columnList = "followupRiskLevel"),
        @Index(name = "idx_patient_priority", columnList = "clinicalPriority")
})
public class Patient {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String patientCode;

    @Column(length = 64)
    private String userId;

    @Column(nullable = false, length = 150)
    private String fullName;

    private LocalDate dateOfBirth;
    private Integer age;

    @Column(length = 16)
    private String gender; // Male, Female, Other

    @Column(nullable = false, length = 32)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String village;

    @Column(length = 100)
    private String district = "Pune";

    @Column(length = 100)
    private String state = "Maharashtra";

    private Double latitude;
    private Double longitude;

    private Double distanceFromFacilityKm = 5.0;

    @Column(length = 255)
    private String emergencyContact;

    private boolean isPregnant = false;
    private Integer pregnancyTrimester;

    @Column(length = 500)
    private String chronicConditionDetails; // comma-separated or JSON list of chronic conditions

    @Column(length = 500)
    private String relevantConditions; // comma-separated

    @Column(length = 16)
    private String preferredLanguage = "mr";

    private Integer followupRiskScore = 20;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private RiskLevel followupRiskLevel = RiskLevel.LOW;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private ClinicalPriority clinicalPriority = ClinicalPriority.ROUTINE;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private InterventionPriority interventionPriority = InterventionPriority.LOW;

    private Integer totalAppointments = 0;
    private Integer missedAppointments = 0;

    private LocalDate lastAppointmentDate;
    private LocalDate nextAppointmentDate;

    @Column(length = 64)
    private String activeReferralId;

    private LocalDate registeredDate;

    @Column(length = 64)
    private String registeredBy;

    private boolean syncedOffline = false;

    private boolean isArchived = false;
    @Column(length = 255)
    private String archivedReason;
    private LocalDate archivedDate;
    private Integer consecutiveFollowupsCompleted = 0;
    private Integer consecutiveFollowupsMissed = 0;
    private Integer totalFollowupsAttended = 0;
    @Column(length = 64)
    private String lastFeedbackStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (registeredDate == null) registeredDate = LocalDate.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

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

    public Double getDistanceFromFacilityKm() { return distanceFromFacilityKm; }
    public void setDistanceFromFacilityKm(Double distanceFromFacilityKm) { this.distanceFromFacilityKm = distanceFromFacilityKm; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public boolean isPregnant() { return isPregnant; }
    public void setPregnant(boolean pregnant) { isPregnant = pregnant; }

    public Integer getPregnancyTrimester() { return pregnancyTrimester; }
    public void setPregnancyTrimester(Integer pregnancyTrimester) { this.pregnancyTrimester = pregnancyTrimester; }

    public String getChronicConditionDetails() { return chronicConditionDetails; }
    public void setChronicConditionDetails(String chronicConditionDetails) { this.chronicConditionDetails = chronicConditionDetails; }

    public String getRelevantConditions() { return relevantConditions; }
    public void setRelevantConditions(String relevantConditions) { this.relevantConditions = relevantConditions; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public Integer getFollowupRiskScore() { return followupRiskScore; }
    public void setFollowupRiskScore(Integer followupRiskScore) { this.followupRiskScore = followupRiskScore; }

    public RiskLevel getFollowupRiskLevel() { return followupRiskLevel; }
    public void setFollowupRiskLevel(RiskLevel followupRiskLevel) { this.followupRiskLevel = followupRiskLevel; }

    public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
    public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

    public InterventionPriority getInterventionPriority() { return interventionPriority; }
    public void setInterventionPriority(InterventionPriority interventionPriority) { this.interventionPriority = interventionPriority; }

    public Integer getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(Integer totalAppointments) { this.totalAppointments = totalAppointments; }

    public Integer getMissedAppointments() { return missedAppointments; }
    public void setMissedAppointments(Integer missedAppointments) { this.missedAppointments = missedAppointments; }

    public LocalDate getLastAppointmentDate() { return lastAppointmentDate; }
    public void setLastAppointmentDate(LocalDate lastAppointmentDate) { this.lastAppointmentDate = lastAppointmentDate; }

    public LocalDate getNextAppointmentDate() { return nextAppointmentDate; }
    public void setNextAppointmentDate(LocalDate nextAppointmentDate) { this.nextAppointmentDate = nextAppointmentDate; }

    public String getActiveReferralId() { return activeReferralId; }
    public void setActiveReferralId(String activeReferralId) { this.activeReferralId = activeReferralId; }

    public LocalDate getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDate registeredDate) { this.registeredDate = registeredDate; }

    public String getRegisteredBy() { return registeredBy; }
    public void setRegisteredBy(String registeredBy) { this.registeredBy = registeredBy; }

    public boolean isSyncedOffline() { return syncedOffline; }
    public void setSyncedOffline(boolean syncedOffline) { this.syncedOffline = syncedOffline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isArchived() { return isArchived; }
    public void setArchived(boolean archived) { isArchived = archived; }

    public String getArchivedReason() { return archivedReason; }
    public void setArchivedReason(String archivedReason) { this.archivedReason = archivedReason; }

    public LocalDate getArchivedDate() { return archivedDate; }
    public void setArchivedDate(LocalDate archivedDate) { this.archivedDate = archivedDate; }

    public Integer getConsecutiveFollowupsCompleted() { return consecutiveFollowupsCompleted != null ? consecutiveFollowupsCompleted : 0; }
    public void setConsecutiveFollowupsCompleted(Integer consecutiveFollowupsCompleted) { this.consecutiveFollowupsCompleted = consecutiveFollowupsCompleted; }

    public Integer getConsecutiveFollowupsMissed() { return consecutiveFollowupsMissed != null ? consecutiveFollowupsMissed : 0; }
    public void setConsecutiveFollowupsMissed(Integer consecutiveFollowupsMissed) { this.consecutiveFollowupsMissed = consecutiveFollowupsMissed; }

    public Integer getTotalFollowupsAttended() { return totalFollowupsAttended != null ? totalFollowupsAttended : 0; }
    public void setTotalFollowupsAttended(Integer totalFollowupsAttended) { this.totalFollowupsAttended = totalFollowupsAttended; }

    public String getLastFeedbackStatus() { return lastFeedbackStatus; }
    public void setLastFeedbackStatus(String lastFeedbackStatus) { this.lastFeedbackStatus = lastFeedbackStatus; }
}
