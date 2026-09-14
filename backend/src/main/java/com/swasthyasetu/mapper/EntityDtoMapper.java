package com.swasthyasetu.mapper;

import com.swasthyasetu.dto.*;
import com.swasthyasetu.entity.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public PatientDto toPatientDto(Patient p) {
        if (p == null) return null;
        PatientDto dto = new PatientDto();
        dto.setId(p.getId());
        dto.setName(p.getFullName());
        dto.setAge(p.getAge() != null ? p.getAge() : 0);
        dto.setGender(p.getGender());
        dto.setPhone(p.getPhone());
        dto.setAddress(p.getAddress());
        dto.setVillage(p.getVillage());
        dto.setEmergencyContact(p.getEmergencyContact());
        dto.setPregnant(p.isPregnant());
        dto.setPregnancyTrimester(p.getPregnancyTrimester());
        dto.setPreferredLanguage(p.getPreferredLanguage());

        if (p.getChronicConditionDetails() != null && !p.getChronicConditionDetails().isBlank()) {
            dto.setChronicConditions(Arrays.stream(p.getChronicConditionDetails().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setChronicConditions(Collections.emptyList());
        }

        if (p.getRelevantConditions() != null && !p.getRelevantConditions().isBlank()) {
            dto.setRelevantConditions(Arrays.stream(p.getRelevantConditions().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setRelevantConditions(Collections.emptyList());
        }

        dto.setFollowupRiskScore(p.getFollowupRiskScore() != null ? p.getFollowupRiskScore() : 20);
        dto.setFollowupRiskLevel(p.getFollowupRiskLevel());
        dto.setClinicalPriority(p.getClinicalPriority());
        dto.setInterventionPriority(p.getInterventionPriority());
        dto.setDistanceKm(p.getDistanceFromFacilityKm() != null ? p.getDistanceFromFacilityKm() : 5.0);
        dto.setTotalAppointments(p.getTotalAppointments() != null ? p.getTotalAppointments() : 0);
        dto.setMissedAppointments(p.getMissedAppointments() != null ? p.getMissedAppointments() : 0);
        dto.setLastAppointmentDate(p.getLastAppointmentDate() != null ? p.getLastAppointmentDate().toString() : null);
        dto.setNextAppointmentDate(p.getNextAppointmentDate() != null ? p.getNextAppointmentDate().toString() : null);
        dto.setActiveReferralId(p.getActiveReferralId());
        dto.setRegisteredDate(p.getRegisteredDate() != null ? p.getRegisteredDate().toString() : null);
        dto.setRegisteredBy(p.getRegisteredBy());
        dto.setSyncedOffline(p.isSyncedOffline());
        dto.setArchived(p.isArchived());
        dto.setArchivedReason(p.getArchivedReason());
        dto.setArchivedDate(p.getArchivedDate() != null ? p.getArchivedDate().toString() : null);
        dto.setConsecutiveFollowupsCompleted(p.getConsecutiveFollowupsCompleted() != null ? p.getConsecutiveFollowupsCompleted() : 0);
        dto.setConsecutiveFollowupsMissed(p.getConsecutiveFollowupsMissed() != null ? p.getConsecutiveFollowupsMissed() : 0);
        dto.setTotalFollowupsAttended(p.getTotalFollowupsAttended() != null ? p.getTotalFollowupsAttended() : 0);
        dto.setLastFeedbackStatus(p.getLastFeedbackStatus());
        return dto;
    }

    public AppointmentDto toAppointmentDto(Appointment a) {
        if (a == null) return null;
        AppointmentDto dto = new AppointmentDto();
        dto.setId(a.getId());
        dto.setTokenNumber(a.getTokenNumber());
        dto.setPatientId(a.getPatientId());
        dto.setPatientName(a.getPatientName());
        dto.setDoctorId(a.getDoctorId());
        dto.setDoctorName(a.getDoctorName());
        dto.setFacilityId(a.getFacilityId());
        dto.setFacilityName(a.getFacilityName());
        dto.setDepartment(a.getDepartment());
        dto.setDate(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "");
        dto.setTimeSlot(a.getAppointmentTime());
        dto.setStatus(a.getStatus());
        dto.setPriority(a.getPriority());
        dto.setQueuePosition(a.getQueuePosition());
        dto.setEstimatedWaitMinutes(a.getEstimatedWaitMinutes());
        return dto;
    }

    public ReferralDto toReferralDto(Referral r) {
        if (r == null) return null;
        ReferralDto dto = new ReferralDto();
        dto.setId(r.getId());
        dto.setReferralCode(r.getReferralCode());
        dto.setPatientId(r.getPatientId());
        dto.setPatientName(r.getPatientName());
        dto.setPatientAge(r.getPatientAge() != null ? r.getPatientAge() : 0);
        dto.setPatientGender(r.getPatientGender());
        dto.setOriginFacility(r.getOriginFacility());
        dto.setDestinationFacility(r.getDestinationFacility());
        dto.setDepartment(r.getDepartment());
        dto.setReason(r.getReason());
        dto.setPriority(r.getPriority());
        dto.setStatus(r.getStatus());
        dto.setCreatedDate(r.getReferralDate() != null ? r.getReferralDate().toString() : "");
        dto.setAppointmentDate(r.getAppointmentDate() != null ? r.getAppointmentDate().toString() : null);
        dto.setCompletedDate(r.getCompletedDate() != null ? r.getCompletedDate().toString() : null);
        dto.setReferringDoctorId(r.getReferringDoctorId());
        dto.setReferringDoctorName(r.getReferringDoctorName());
        dto.setReceivingDoctorName(r.getReceivingDoctorName());
        dto.setNotes(r.getNotes());
        return dto;
    }

    public FollowUpDto toFollowUpDto(FollowUp f) {
        if (f == null) return null;
        FollowUpDto dto = new FollowUpDto();
        dto.setId(f.getId());
        dto.setPatientId(f.getPatientId());
        dto.setPatientName(f.getPatientName());
        dto.setDoctorId(f.getDoctorId());
        dto.setFacilityId(f.getFacilityId());
        dto.setRelatedMedicalRecordId(f.getRelatedMedicalRecordId());
        dto.setFollowUpDate(f.getFollowUpDate() != null ? f.getFollowUpDate().toString() : "");
        dto.setReason(f.getReason());
        dto.setFrequency(f.getFrequency());
        dto.setTreatmentDuration(f.getTreatmentDuration());
        dto.setStatus(f.getStatus());
        dto.setCompletedDate(f.getCompletedDate() != null ? f.getCompletedDate().toString() : null);
        dto.setNotes(f.getNotes());
        return dto;
    }

    public MedicineDto.MedicineStockDto toStockDto(MedicineStock s) {
        if (s == null) return null;
        MedicineDto.MedicineStockDto dto = new MedicineDto.MedicineStockDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setCategory(s.getCategory());
        dto.setCurrentStock(s.getQuantity() != null ? s.getQuantity() : 0);
        dto.setMinThreshold(s.getMinimumThreshold() != null ? s.getMinimumThreshold() : 0);
        dto.setUnit(s.getUnit());
        dto.setStatus(s.getStatus());
        dto.setExpiryDate(s.getExpiryDate() != null ? s.getExpiryDate().toString() : "");
        dto.setFacilityId(s.getFacilityId());
        dto.setFacilityName(s.getFacilityName());
        return dto;
    }

    public ConsultationDto.PrescriptionDto toPrescriptionDto(Prescription p) {
        if (p == null) return null;
        ConsultationDto.PrescriptionDto dto = new ConsultationDto.PrescriptionDto();
        dto.setId(p.getId());
        dto.setPatientId(p.getPatientId());
        dto.setPatientName(p.getPatientName());
        dto.setDoctorId(p.getDoctorId());
        dto.setDoctorName(p.getDoctorName());
        dto.setFacilityName(p.getFacilityName());
        dto.setDate(p.getPrescriptionDate() != null ? p.getPrescriptionDate().toString() : "");
        dto.setDiagnosis(p.getDiagnosis());
        dto.setClinicalNotes(p.getClinicalNotes());
        dto.setFollowUpDate(p.getFollowUpDate() != null ? p.getFollowUpDate().toString() : null);

        if (p.getItems() != null) {
            List<ConsultationDto.PrescriptionItemDto> itemDtos = p.getItems().stream().map(it -> {
                ConsultationDto.PrescriptionItemDto itemDto = new ConsultationDto.PrescriptionItemDto();
                itemDto.setMedicineName(it.getMedicineName());
                itemDto.setDosage(it.getDosage());
                itemDto.setFrequency(it.getFrequency());
                itemDto.setDurationDays(it.getDurationDays() != null ? it.getDurationDays() : 5);
                itemDto.setInstructions(it.getInstructions());
                itemDto.setInStock(it.isInStock());
                return itemDto;
            }).collect(Collectors.toList());
            dto.setItems(itemDtos);
        }
        return dto;
    }

    public TriageDto.TriageRecordDto toTriageRecordDto(TriageAssessment t, Vital v) {
        if (t == null) return null;
        TriageDto.TriageRecordDto dto = new TriageDto.TriageRecordDto();
        dto.setId(t.getId());
        dto.setPatientId(t.getPatientId());
        dto.setPatientName(t.getPatientName());
        dto.setDate(t.getCreatedAt() != null ? t.getCreatedAt().toString().replace('T', ' ').substring(0, 16) : "");
        if (t.getSymptoms() != null && !t.getSymptoms().isBlank()) {
            dto.setSymptoms(Arrays.stream(t.getSymptoms().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        }
        dto.setClinicalPriority(t.getClinicalPriority());
        dto.setTriageLevel(t.getClinicalPriority());
        dto.setRecommendedAction(t.getRecommendation());
        dto.setOverriddenByClinician(t.isClinicianOverride());
        dto.setOverrideReason(t.getOverrideReason());
        dto.setHealthWorkerId(t.getHealthWorkerId());
        dto.setHealthWorkerName(t.getHealthWorkerName());

        if (v != null) {
            ConsultationDto.VitalsDto vitalsDto = new ConsultationDto.VitalsDto();
            vitalsDto.setTemperatureCelsius(v.getTemperature());
            vitalsDto.setBpSystolic(v.getSystolicBp());
            vitalsDto.setBpDiastolic(v.getDiastolicBp());
            vitalsDto.setHeartRateBpm(v.getHeartRate());
            vitalsDto.setRespRatePerMin(v.getRespiratoryRate());
            vitalsDto.setOxygenSatPercent(v.getOxygenSaturation());
            vitalsDto.setBloodSugarMgDl(v.getBloodSugar());
            vitalsDto.setHemoglobinGdl(v.getHemoglobin());
            vitalsDto.setWeightKg(v.getWeight());
            vitalsDto.setHeightCm(v.getHeight());
            dto.setVitals(vitalsDto);
        }
        return dto;
    }

    public AuthDto.UserDto toUserDto(User u) {
        if (u == null) return null;
        AuthDto.UserDto dto = new AuthDto.UserDto();
        dto.setId(u.getId());
        dto.setName(u.getFullName());
        dto.setUsername(u.getUsername());
        dto.setRole(u.getRole());
        dto.setPhone(u.getPhone());
        dto.setEmail(u.getEmail());
        dto.setFacilityId(u.getFacilityId());
        dto.setFacilityName(u.getFacilityName());
        dto.setDistrict(u.getDistrict());
        dto.setPreferredLanguage(u.getPreferredLanguage());
        return dto;
    }

    public FeedbackDto toFeedbackDto(PatientFeedback f) {
        if (f == null) return null;
        FeedbackDto dto = new FeedbackDto();
        dto.setId(f.getId());
        dto.setPatientId(f.getPatientId());
        dto.setPatientName(f.getPatientName());
        dto.setPatientPhone(f.getPatientPhone());
        dto.setCallId(f.getCallId());
        dto.setCallAttended(f.isCallAttended());
        dto.setSatisfactionLevel(f.getSatisfactionLevel());
        dto.setRefusesFollowUp(f.isRefusesFollowUp());
        dto.setRefusalReason(f.getRefusalReason());
        dto.setFeedbackNotes(f.getFeedbackNotes());
        dto.setRecordedByUserId(f.getRecordedByUserId());
        dto.setRecordedByName(f.getRecordedByName());
        dto.setRecordedByRole(f.getRecordedByRole());
        dto.setStatus(f.getStatus());
        dto.setAdminReviewNotes(f.getAdminReviewNotes());
        dto.setReviewedByAdminId(f.getReviewedByAdminId());
        dto.setReviewedAt(f.getReviewedAt());
        dto.setCreatedAt(f.getCreatedAt());
        return dto;
    }
}
