package com.swasthyasetu.dto;

import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.InterventionPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class PatientDto {

    private String id;
    private String name;
    private int age;
    private String gender; // Male, Female, Other
    private String phone;
    private String address;
    private String village;
    private String emergencyContact;
    private List<String> relevantConditions = new ArrayList<>();
    private boolean isPregnant = false;
    private Integer pregnancyTrimester;
    private List<String> chronicConditions = new ArrayList<>();
    private String preferredLanguage = "mr";

    // Risk & Priority indicators
    private int followupRiskScore = 20;
    private RiskLevel followupRiskLevel = RiskLevel.LOW;
    private ClinicalPriority clinicalPriority = ClinicalPriority.ROUTINE;
    private InterventionPriority interventionPriority = InterventionPriority.LOW;

    // Facility & location metrics
    private double distanceKm = 5.0;
    private int totalAppointments = 0;
    private int missedAppointments = 0;
    private String lastAppointmentDate;
    private String nextAppointmentDate;
    private String activeReferralId;

    // Registration metadata
    private String registeredBy;
    private String registeredDate;
    private boolean syncedOffline = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public List<String> getRelevantConditions() { return relevantConditions; }
    public void setRelevantConditions(List<String> relevantConditions) { this.relevantConditions = relevantConditions; }

    public boolean isPregnant() { return isPregnant; }
    public void setPregnant(boolean pregnant) { isPregnant = pregnant; }

    public Integer getPregnancyTrimester() { return pregnancyTrimester; }
    public void setPregnancyTrimester(Integer pregnancyTrimester) { this.pregnancyTrimester = pregnancyTrimester; }

    public List<String> getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(List<String> chronicConditions) { this.chronicConditions = chronicConditions; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public int getFollowupRiskScore() { return followupRiskScore; }
    public void setFollowupRiskScore(int followupRiskScore) { this.followupRiskScore = followupRiskScore; }

    public RiskLevel getFollowupRiskLevel() { return followupRiskLevel; }
    public void setFollowupRiskLevel(RiskLevel followupRiskLevel) { this.followupRiskLevel = followupRiskLevel; }

    public ClinicalPriority getClinicalPriority() { return clinicalPriority; }
    public void setClinicalPriority(ClinicalPriority clinicalPriority) { this.clinicalPriority = clinicalPriority; }

    public InterventionPriority getInterventionPriority() { return interventionPriority; }
    public void setInterventionPriority(InterventionPriority interventionPriority) { this.interventionPriority = interventionPriority; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public int getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }

    public int getMissedAppointments() { return missedAppointments; }
    public void setMissedAppointments(int missedAppointments) { this.missedAppointments = missedAppointments; }

    public String getLastAppointmentDate() { return lastAppointmentDate; }
    public void setLastAppointmentDate(String lastAppointmentDate) { this.lastAppointmentDate = lastAppointmentDate; }

    public String getNextAppointmentDate() { return nextAppointmentDate; }
    public void setNextAppointmentDate(String nextAppointmentDate) { this.nextAppointmentDate = nextAppointmentDate; }

    public String getActiveReferralId() { return activeReferralId; }
    public void setActiveReferralId(String activeReferralId) { this.activeReferralId = activeReferralId; }

    public String getRegisteredBy() { return registeredBy; }
    public void setRegisteredBy(String registeredBy) { this.registeredBy = registeredBy; }

    public String getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(String registeredDate) { this.registeredDate = registeredDate; }

    public boolean isSyncedOffline() { return syncedOffline; }
    public void setSyncedOffline(boolean syncedOffline) { this.syncedOffline = syncedOffline; }

    public static class CreateRequest {
        @NotBlank(message = "Patient name is required")
        private String name;

        @NotNull(message = "Age is required")
        private Integer age;

        @NotBlank(message = "Gender is required")
        private String gender;

        @NotBlank(message = "Phone number is required")
        private String phone;

        private String address;

        @NotBlank(message = "Village is required")
        private String village;

        private String emergencyContact;
        private List<String> relevantConditions = new ArrayList<>();
        private boolean isPregnant = false;
        private Integer pregnancyTrimester;
        private List<String> chronicConditions = new ArrayList<>();
        private String preferredLanguage = "mr";
        private Double distanceKm = 5.0;
        private boolean isOffline = false;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

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

        public String getEmergencyContact() { return emergencyContact; }
        public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

        public List<String> getRelevantConditions() { return relevantConditions; }
        public void setRelevantConditions(List<String> relevantConditions) { this.relevantConditions = relevantConditions; }

        public boolean isPregnant() { return isPregnant; }
        public void setPregnant(boolean pregnant) { isPregnant = pregnant; }

        public Integer getPregnancyTrimester() { return pregnancyTrimester; }
        public void setPregnancyTrimester(Integer pregnancyTrimester) { this.pregnancyTrimester = pregnancyTrimester; }

        public List<String> getChronicConditions() { return chronicConditions; }
        public void setChronicConditions(List<String> chronicConditions) { this.chronicConditions = chronicConditions; }

        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

        public Double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

        public boolean isOffline() { return isOffline; }
        public void setOffline(boolean offline) { isOffline = offline; }
    }
}
