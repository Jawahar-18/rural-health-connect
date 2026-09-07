package com.swasthyasetu.service;

import com.swasthyasetu.dto.AppointmentDto;
import com.swasthyasetu.dto.FollowUpDto;
import com.swasthyasetu.dto.PatientDto;
import com.swasthyasetu.dto.ReferralDto;
import com.swasthyasetu.dto.RiskDto.FollowupRiskOutputDto;
import com.swasthyasetu.dto.RiskDto.InterventionPriorityOutputDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.AppointmentRepository;
import com.swasthyasetu.repository.FollowUpRepository;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.repository.ReferralRepository;
import com.swasthyasetu.service.engine.ClinicalPriorityEngine;
import com.swasthyasetu.service.engine.FollowupRiskEngine;
import com.swasthyasetu.service.engine.InterventionPriorityEngine;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReferralRepository referralRepository;
    private final FollowUpRepository followUpRepository;
    private final FollowupRiskEngine riskEngine;
    private final ClinicalPriorityEngine priorityEngine;
    private final InterventionPriorityEngine interventionEngine;
    private final EntityDtoMapper mapper;

    public PatientService(PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          ReferralRepository referralRepository,
                          FollowUpRepository followUpRepository,
                          FollowupRiskEngine riskEngine,
                          ClinicalPriorityEngine priorityEngine,
                          InterventionPriorityEngine interventionEngine,
                          EntityDtoMapper mapper) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.referralRepository = referralRepository;
        this.followUpRepository = followUpRepository;
        this.riskEngine = riskEngine;
        this.priorityEngine = priorityEngine;
        this.interventionEngine = interventionEngine;
        this.mapper = mapper;
    }

    public List<PatientDto> getAllPatients(String query) {
        List<Patient> patients;
        if (query != null && !query.trim().isEmpty()) {
            patients = patientRepository.searchPatients(query.trim());
        } else {
            patients = patientRepository.findAll();
        }
        return patients.stream().map(mapper::toPatientDto).collect(Collectors.toList());
    }

    public PatientDto getPatientById(String id) {
        Patient p = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
        return mapper.toPatientDto(p);
    }

    @Transactional
    public PatientDto createPatient(PatientDto.CreateRequest req, String registeredByUsername) {
        Patient p = new Patient();
        p.setId("pat-" + UUID.randomUUID().toString().substring(0, 8));
        p.setPatientCode("MH-PUN-" + System.currentTimeMillis() % 100000);
        p.setFullName(req.getName());
        p.setAge(req.getAge());
        p.setGender(req.getGender());
        p.setPhone(req.getPhone());
        p.setAddress(req.getAddress() != null ? req.getAddress() : "Gram Panchayat Area, " + req.getVillage());
        p.setVillage(req.getVillage());
        p.setDistrict("Pune");
        p.setState("Maharashtra");
        p.setEmergencyContact(req.getEmergencyContact());
        p.setPregnant(req.isPregnant());
        p.setPregnancyTrimester(req.getPregnancyTrimester());
        p.setPreferredLanguage(req.getPreferredLanguage());
        p.setDistanceFromFacilityKm(req.getDistanceKm() != null ? req.getDistanceKm() : 5.0);
        p.setRegisteredBy(registeredByUsername);
        p.setRegisteredDate(LocalDate.now());
        p.setSyncedOffline(req.isOffline());
        p.setTotalAppointments(1);
        p.setMissedAppointments(0);

        if (req.getChronicConditions() != null && !req.getChronicConditions().isEmpty()) {
            p.setChronicConditionDetails(String.join(", ", req.getChronicConditions()));
        }

        if (req.getRelevantConditions() != null && !req.getRelevantConditions().isEmpty()) {
            p.setRelevantConditions(String.join(", ", req.getRelevantConditions()));
        } else {
            p.setRelevantConditions("General OPD Registration");
        }

        // Calculate initial risk and clinical priority via Rule Engines
        FollowupRiskOutputDto riskOutput = riskEngine.predictRisk(p);
        p.setFollowupRiskScore(riskOutput.getRiskScore());
        p.setFollowupRiskLevel(riskOutput.getRiskLevel());

        p.setClinicalPriority(priorityEngine.evaluate(
                req.getRelevantConditions(),
                null,
                req.isPregnant(),
                req.getChronicConditions()
        ));

        InterventionPriorityOutputDto intervention = interventionEngine.calculate(p);
        p.setInterventionPriority(intervention.getInterventionPriority());

        patientRepository.save(p);
        return mapper.toPatientDto(p);
    }

    @Transactional
    public PatientDto updatePatient(String id, PatientDto updateDto) {
        Patient p = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        if (updateDto.getName() != null) p.setFullName(updateDto.getName());
        if (updateDto.getAge() > 0) p.setAge(updateDto.getAge());
        if (updateDto.getPhone() != null) p.setPhone(updateDto.getPhone());
        if (updateDto.getAddress() != null) p.setAddress(updateDto.getAddress());
        if (updateDto.getVillage() != null) p.setVillage(updateDto.getVillage());
        if (updateDto.getEmergencyContact() != null) p.setEmergencyContact(updateDto.getEmergencyContact());
        if (updateDto.getNextAppointmentDate() != null && !updateDto.getNextAppointmentDate().isBlank()) {
            p.setNextAppointmentDate(LocalDate.parse(updateDto.getNextAppointmentDate()));
        }
        if (updateDto.getActiveReferralId() != null) p.setActiveReferralId(updateDto.getActiveReferralId());
        if (updateDto.getClinicalPriority() != null) p.setClinicalPriority(updateDto.getClinicalPriority());

        // Recompute risk
        FollowupRiskOutputDto riskOutput = riskEngine.predictRisk(p);
        p.setFollowupRiskScore(riskOutput.getRiskScore());
        p.setFollowupRiskLevel(riskOutput.getRiskLevel());

        InterventionPriorityOutputDto intervention = interventionEngine.calculate(p);
        p.setInterventionPriority(intervention.getInterventionPriority());

        patientRepository.save(p);
        return mapper.toPatientDto(p);
    }

    public List<AppointmentDto> getPatientAppointments(String patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(mapper::toAppointmentDto)
                .collect(Collectors.toList());
    }

    public List<ReferralDto> getPatientReferrals(String patientId) {
        return referralRepository.findByPatientId(patientId).stream()
                .map(mapper::toReferralDto)
                .collect(Collectors.toList());
    }

    public List<FollowUpDto> getPatientFollowups(String patientId) {
        return followUpRepository.findByPatientId(patientId).stream()
                .map(mapper::toFollowUpDto)
                .collect(Collectors.toList());
    }

    public FollowupRiskOutputDto getPatientRisk(String patientId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));
        return riskEngine.predictRisk(p);
    }

    public List<PatientDto> getHighRiskPatients() {
        return patientRepository.findHighRiskPatients(70).stream()
                .map(mapper::toPatientDto)
                .collect(Collectors.toList());
    }
}
