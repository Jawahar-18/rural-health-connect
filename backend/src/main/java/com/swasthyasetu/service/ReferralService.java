package com.swasthyasetu.service;

import com.swasthyasetu.dto.ReferralDto;
import com.swasthyasetu.dto.ReferralDto.CreateRequest;
import com.swasthyasetu.dto.ReferralDto.StatusUpdateRequest;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.Referral;
import com.swasthyasetu.entity.enums.ReferralPriority;
import com.swasthyasetu.entity.enums.ReferralStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.repository.ReferralRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReferralService {

    private final ReferralRepository referralRepository;
    private final PatientRepository patientRepository;
    private final EntityDtoMapper mapper;

    public ReferralService(ReferralRepository referralRepository,
                           PatientRepository patientRepository,
                           EntityDtoMapper mapper) {
        this.referralRepository = referralRepository;
        this.patientRepository = patientRepository;
        this.mapper = mapper;
    }

    public List<ReferralDto> getAllReferrals() {
        return referralRepository.findAll().stream()
                .map(mapper::toReferralDto)
                .collect(Collectors.toList());
    }

    public ReferralDto getReferralById(String id) {
        Referral r = referralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Referral not found with ID: " + id));
        return mapper.toReferralDto(r);
    }

    @Transactional
    public ReferralDto createReferral(CreateRequest req, String doctorUserId, String doctorName) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        Referral r = new Referral();
        r.setId("ref-" + UUID.randomUUID().toString().substring(0, 8));
        r.setReferralCode("REF-MH-" + System.currentTimeMillis() % 100000);
        r.setPatientId(patient.getId());
        r.setPatientName(patient.getFullName());
        r.setPatientAge(patient.getAge());
        r.setPatientGender(patient.getGender());
        r.setFromFacilityId("fac-phc-junnar");
        r.setOriginFacility(req.getOriginFacility() != null ? req.getOriginFacility() : "PHC Junnar, Pune");
        r.setToFacilityId("fac-sassoon-pune");
        r.setDestinationFacility(req.getDestinationFacility());
        r.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Specialist Care");
        r.setReason(req.getReason());
        r.setPriority(req.getPriority() != null ? req.getPriority() : ReferralPriority.URGENT);
        r.setStatus(ReferralStatus.CREATED);
        r.setReferralDate(LocalDate.now());
        r.setReferringDoctorId(doctorUserId);
        r.setReferringDoctorName(doctorName);
        referralRepository.save(r);

        // Update patient's activeReferralId
        patient.setActiveReferralId(r.getId());
        patientRepository.save(patient);

        return mapper.toReferralDto(r);
    }

    @Transactional
    public ReferralDto updateStatus(String id, StatusUpdateRequest req) {
        Referral r = referralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Referral not found with ID: " + id));

        if (req.getStatus() != null) {
            r.setStatus(req.getStatus());
            if (req.getStatus() == ReferralStatus.COMPLETED) {
                r.setCompletedDate(LocalDate.now());
            }
        }
        if (req.getNotes() != null) {
            r.setNotes(req.getNotes());
        }
        referralRepository.save(r);
        return mapper.toReferralDto(r);
    }

    public List<ReferralDto> getPendingReferrals() {
        return referralRepository.findByStatus(ReferralStatus.CREATED).stream()
                .map(mapper::toReferralDto)
                .collect(Collectors.toList());
    }

    public List<ReferralDto> getFacilityReferrals(String facilityId) {
        return referralRepository.findByFacilityInvolvement(facilityId).stream()
                .map(mapper::toReferralDto)
                .collect(Collectors.toList());
    }
}
