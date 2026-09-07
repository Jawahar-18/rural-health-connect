package com.swasthyasetu.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardDto {

    public static class FacilityKPIDto {
        private String facilityId;
        private String facilityName;
        private String district;
        private int totalPatientsToday;
        private int avgWaitingTimeMinutes;
        private int appointmentsCompleted;
        private int pendingReferrals;
        private int referralCompletionRate;
        private int followupCompletionRate;
        private int medicineShortageCount;
        private int diagnosticShortageCount;
        private int highRiskPatientsCount;

        public String getFacilityId() { return facilityId; }
        public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public int getTotalPatientsToday() { return totalPatientsToday; }
        public void setTotalPatientsToday(int totalPatientsToday) { this.totalPatientsToday = totalPatientsToday; }

        public int getAvgWaitingTimeMinutes() { return avgWaitingTimeMinutes; }
        public void setAvgWaitingTimeMinutes(int avgWaitingTimeMinutes) { this.avgWaitingTimeMinutes = avgWaitingTimeMinutes; }

        public int getAppointmentsCompleted() { return appointmentsCompleted; }
        public void setAppointmentsCompleted(int appointmentsCompleted) { this.appointmentsCompleted = appointmentsCompleted; }

        public int getPendingReferrals() { return pendingReferrals; }
        public void setPendingReferrals(int pendingReferrals) { this.pendingReferrals = pendingReferrals; }

        public int getReferralCompletionRate() { return referralCompletionRate; }
        public void setReferralCompletionRate(int referralCompletionRate) { this.referralCompletionRate = referralCompletionRate; }

        public int getFollowupCompletionRate() { return followupCompletionRate; }
        public void setFollowupCompletionRate(int followupCompletionRate) { this.followupCompletionRate = followupCompletionRate; }

        public int getMedicineShortageCount() { return medicineShortageCount; }
        public void setMedicineShortageCount(int medicineShortageCount) { this.medicineShortageCount = medicineShortageCount; }

        public int getDiagnosticShortageCount() { return diagnosticShortageCount; }
        public void setDiagnosticShortageCount(int diagnosticShortageCount) { this.diagnosticShortageCount = diagnosticShortageCount; }

        public int getHighRiskPatientsCount() { return highRiskPatientsCount; }
        public void setHighRiskPatientsCount(int highRiskPatientsCount) { this.highRiskPatientsCount = highRiskPatientsCount; }
    }

    public static class DistrictDashboardDto {
        private String district;
        private int totalFacilities;
        private int totalPatientsToday;
        private int avgReferralCompletionRate;
        private int totalHighRiskPatients;
        private List<FacilityKPIDto> facilities = new ArrayList<>();

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public int getTotalFacilities() { return totalFacilities; }
        public void setTotalFacilities(int totalFacilities) { this.totalFacilities = totalFacilities; }

        public int getTotalPatientsToday() { return totalPatientsToday; }
        public void setTotalPatientsToday(int totalPatientsToday) { this.totalPatientsToday = totalPatientsToday; }

        public int getAvgReferralCompletionRate() { return avgReferralCompletionRate; }
        public void setAvgReferralCompletionRate(int avgReferralCompletionRate) { this.avgReferralCompletionRate = avgReferralCompletionRate; }

        public int getTotalHighRiskPatients() { return totalHighRiskPatients; }
        public void setTotalHighRiskPatients(int totalHighRiskPatients) { this.totalHighRiskPatients = totalHighRiskPatients; }

        public List<FacilityKPIDto> getFacilities() { return facilities; }
        public void setFacilities(List<FacilityKPIDto> facilities) { this.facilities = facilities; }
    }

    public static class DoctorDashboardDto {
        private int queueWaitingCount;
        private int urgentQueueCount;
        private int highRiskCount;
        private int pendingReferralCount;
        private List<AppointmentDto> activeQueue = new ArrayList<>();

        public int getQueueWaitingCount() { return queueWaitingCount; }
        public void setQueueWaitingCount(int queueWaitingCount) { this.queueWaitingCount = queueWaitingCount; }

        public int getUrgentQueueCount() { return urgentQueueCount; }
        public void setUrgentQueueCount(int urgentQueueCount) { this.urgentQueueCount = urgentQueueCount; }

        public int getHighRiskCount() { return highRiskCount; }
        public void setHighRiskCount(int highRiskCount) { this.highRiskCount = highRiskCount; }

        public int getPendingReferralCount() { return pendingReferralCount; }
        public void setPendingReferralCount(int pendingReferralCount) { this.pendingReferralCount = pendingReferralCount; }

        public List<AppointmentDto> getActiveQueue() { return activeQueue; }
        public void setActiveQueue(List<AppointmentDto> activeQueue) { this.activeQueue = activeQueue; }
    }
}
