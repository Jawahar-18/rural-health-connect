package com.swasthyasetu.service;

import com.swasthyasetu.dto.TriageDto;
import com.swasthyasetu.dto.TriageDto.TriageOverrideRequest;
import com.swasthyasetu.dto.TriageDto.TriageRecordDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.TriageAssessment;
import com.swasthyasetu.entity.Vital;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.repository.TriageAssessmentRepository;
import com.swasthyasetu.repository.VitalRepository;
import com.swasthyasetu.service.engine.ClinicalPriorityEngine;
import com.swasthyasetu.service.engine.InterventionPriorityEngine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TriageService {

    private final TriageAssessmentRepository triageRepository;
    private final VitalRepository vitalRepository;
    private final PatientRepository patientRepository;
    private final ClinicalPriorityEngine clinicalPriorityEngine;
    private final InterventionPriorityEngine interventionPriorityEngine;
    private final EntityDtoMapper mapper;

    public TriageService(TriageAssessmentRepository triageRepository,
                         VitalRepository vitalRepository,
                         PatientRepository patientRepository,
                         ClinicalPriorityEngine clinicalPriorityEngine,
                         InterventionPriorityEngine interventionPriorityEngine,
                         EntityDtoMapper mapper) {
        this.triageRepository = triageRepository;
        this.vitalRepository = vitalRepository;
        this.patientRepository = patientRepository;
        this.clinicalPriorityEngine = clinicalPriorityEngine;
        this.interventionPriorityEngine = interventionPriorityEngine;
        this.mapper = mapper;
    }

    @Transactional
    public TriageRecordDto createTriage(TriageDto.SaveRequest req, String healthWorkerId, String healthWorkerName) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        // Save vitals if provided
        Vital vital = null;
        if (req.getVitals() != null) {
            vital = new Vital();
            vital.setId("vit-" + UUID.randomUUID().toString().substring(0, 8));
            vital.setPatientId(patient.getId());
            vital.setTemperature(req.getVitals().getTemperatureCelsius());
            vital.setHeartRate(req.getVitals().getHeartRateBpm());
            vital.setSystolicBp(req.getVitals().getBpSystolic());
            vital.setDiastolicBp(req.getVitals().getBpDiastolic());
            vital.setRespiratoryRate(req.getVitals().getRespRatePerMin());
            vital.setOxygenSaturation(req.getVitals().getOxygenSatPercent());
            vital.setBloodSugar(req.getVitals().getBloodSugarMgDl());
            vital.setHemoglobin(req.getVitals().getHemoglobinGdl());
            vital.setWeight(req.getVitals().getWeightKg());
            vital.setHeight(req.getVitals().getHeightCm());
            vital.setRecordedBy(healthWorkerId);
            vitalRepository.save(vital);
        }

        // Determine priority
        ClinicalPriority priority;
        if (req.isOverriddenByClinician() && req.getClinicalPriority() != null) {
            priority = req.getClinicalPriority();
        } else {
            List<String> chronicList = patient.getChronicConditionDetails() != null
                    ? Arrays.asList(patient.getChronicConditionDetails().split(","))
                    : null;
            priority = clinicalPriorityEngine.evaluate(req.getSymptoms(), req.getVitals(), patient.isPregnant(), chronicList);
        }

        TriageAssessment triage = new TriageAssessment();
        triage.setId("trg-" + UUID.randomUUID().toString().substring(0, 8));
        triage.setPatientId(patient.getId());
        triage.setPatientName(patient.getFullName());
        triage.setHealthWorkerId(healthWorkerId != null ? healthWorkerId : "usr-worker-1");
        triage.setHealthWorkerName(healthWorkerName != null ? healthWorkerName : "Savita Kamble (ASHA)");
        triage.setSymptoms(req.getSymptoms() != null ? String.join(", ", req.getSymptoms()) : "");
        triage.setClinicalPriority(priority);
        triage.setRiskLevel(priority == ClinicalPriority.URGENT ? RiskLevel.HIGH :
                priority == ClinicalPriority.HIGH ? RiskLevel.MEDIUM : RiskLevel.LOW);
        triage.setRecommendation(req.getRecommendedAction() != null ? req.getRecommendedAction() :
                priority == ClinicalPriority.URGENT ? "Immediate Doctor Examination & Emergency Transport Reservation" :
                priority == ClinicalPriority.HIGH ? "Priority Same-day OPD Consultation" :
                "Routine OPD Consultation & Medication Review");
        triage.setClinicianOverride(req.isOverriddenByClinician());
        triage.setOverrideReason(req.getOverrideReason());

        if (vital != null) {
            triage.setVitalSummary(String.format("BP: %d/%d, SpO2: %d%%, Temp: %.1fC",
                    vital.getSystolicBp() != null ? vital.getSystolicBp() : 120,
                    vital.getDiastolicBp() != null ? vital.getDiastolicBp() : 80,
                    vital.getOxygenSaturation() != null ? vital.getOxygenSaturation() : 98,
                    vital.getTemperature() != null ? vital.getTemperature() : 37.0));
        }

        triageRepository.save(triage);

        // Update patient's clinical priority and recalculate intervention priority
        patient.setClinicalPriority(priority);
        var intervention = interventionPriorityEngine.calculate(patient);
        patient.setInterventionPriority(intervention.getInterventionPriority());
        patientRepository.save(patient);

        return mapper.toTriageRecordDto(triage, vital);
    }

    public List<TriageRecordDto> getTriageByPatient(String patientId) {
        return triageRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(t -> {
                    Vital v = vitalRepository.findFirstByPatientIdOrderByRecordedAtDesc(patientId).orElse(null);
                    return mapper.toTriageRecordDto(t, v);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public TriageRecordDto overrideTriage(String triageId, TriageOverrideRequest req) {
        TriageAssessment t = triageRepository.findById(triageId)
                .orElseThrow(() -> new ResourceNotFoundException("Triage assessment not found with ID: " + triageId));

        t.setClinicianOverride(true);
        t.setOverrideReason(req.getOverrideReason());
        if (req.getNewPriority() != null) {
            t.setClinicalPriority(req.getNewPriority());
        }
        triageRepository.save(t);

        // Update patient
        patientRepository.findById(t.getPatientId()).ifPresent(p -> {
            p.setClinicalPriority(t.getClinicalPriority());
            var intervention = interventionPriorityEngine.calculate(p);
            p.setInterventionPriority(intervention.getInterventionPriority());
            patientRepository.save(p);
        });

        Vital v = vitalRepository.findFirstByPatientIdOrderByRecordedAtDesc(t.getPatientId()).orElse(null);
        return mapper.toTriageRecordDto(t, v);
    }
}
