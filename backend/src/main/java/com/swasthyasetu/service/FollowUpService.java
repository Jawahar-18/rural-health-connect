package com.swasthyasetu.service;

import com.swasthyasetu.dto.FollowUpDto;
import com.swasthyasetu.dto.FollowUpDto.CreateRequest;
import com.swasthyasetu.entity.FollowUp;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.enums.FollowUpStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.FollowUpRepository;
import com.swasthyasetu.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final PatientRepository patientRepository;
    private final EntityDtoMapper mapper;

    public FollowUpService(FollowUpRepository followUpRepository,
                           PatientRepository patientRepository,
                           EntityDtoMapper mapper) {
        this.followUpRepository = followUpRepository;
        this.patientRepository = patientRepository;
        this.mapper = mapper;
    }

    public List<FollowUpDto> getAllFollowUps() {
        return followUpRepository.findAll().stream()
                .map(mapper::toFollowUpDto)
                .collect(Collectors.toList());
    }

    public FollowUpDto getFollowUpById(String id) {
        FollowUp f = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found with ID: " + id));
        return mapper.toFollowUpDto(f);
    }

    @Transactional
    public FollowUpDto createFollowUp(CreateRequest req, String doctorUserId) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        FollowUp f = new FollowUp();
        f.setId("fup-" + UUID.randomUUID().toString().substring(0, 8));
        f.setPatientId(patient.getId());
        f.setPatientName(patient.getFullName());
        f.setDoctorId(doctorUserId);
        f.setFacilityId("fac-phc-junnar");
        f.setFollowUpDate(LocalDate.parse(req.getFollowUpDate()));
        f.setReason(req.getReason());
        f.setFrequency(req.getFrequency() != null ? req.getFrequency() : "Bi-weekly");
        f.setTreatmentDuration(req.getTreatmentDuration() != null ? req.getTreatmentDuration() : "30 days");
        f.setStatus(FollowUpStatus.PENDING);
        f.setNotes(req.getNotes());

        followUpRepository.save(f);

        // Update patient's next appointment date
        patient.setNextAppointmentDate(f.getFollowUpDate());
        patientRepository.save(patient);

        return mapper.toFollowUpDto(f);
    }

    @Transactional
    public FollowUpDto updateFollowUp(String id, FollowUpDto dto) {
        FollowUp f = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found with ID: " + id));

        if (dto.getStatus() != null) {
            f.setStatus(dto.getStatus());
            patientRepository.findById(f.getPatientId()).ifPresent(patient -> {
                if (dto.getStatus() == FollowUpStatus.COMPLETED) {
                    f.setCompletedDate(LocalDate.now());
                    int completed = patient.getConsecutiveFollowupsCompleted() + 1;
                    patient.setConsecutiveFollowupsCompleted(completed);
                    patient.setTotalFollowupsAttended(patient.getTotalFollowupsAttended() + 1);
                    patient.setConsecutiveFollowupsMissed(0);

                    // If patient attended follow-up continuously 5-6 times, auto-archive as treatment completed
                    if (completed >= 5) {
                        patient.setArchived(true);
                        patient.setArchivedReason("Completed continuous follow-up course (" + completed + " consecutive sessions attended)");
                        patient.setArchivedDate(LocalDate.now());
                    }
                } else if (dto.getStatus() == FollowUpStatus.MISSED || dto.getStatus() == FollowUpStatus.CANCELLED) {
                    int missed = patient.getConsecutiveFollowupsMissed() + 1;
                    patient.setConsecutiveFollowupsMissed(missed);
                    patient.setConsecutiveFollowupsCompleted(0);

                    // If patient missed 5-6 continuous follow-ups, auto-archive as chronic drop-out
                    if (missed >= 5) {
                        patient.setArchived(true);
                        patient.setArchivedReason("Continuous follow-up non-attendance (" + missed + " consecutive sessions missed)");
                        patient.setArchivedDate(LocalDate.now());
                    }
                }
                patientRepository.save(patient);
            });
        }
        if (dto.getNotes() != null) f.setNotes(dto.getNotes());
        if (dto.getFollowUpDate() != null && !dto.getFollowUpDate().isBlank()) {
            f.setFollowUpDate(LocalDate.parse(dto.getFollowUpDate()));
        }

        followUpRepository.save(f);
        return mapper.toFollowUpDto(f);
    }

    public List<FollowUpDto> getPendingFollowUps() {
        return followUpRepository.findByStatus(FollowUpStatus.PENDING).stream()
                .map(mapper::toFollowUpDto)
                .collect(Collectors.toList());
    }

    public List<FollowUpDto> getHighRiskFollowUps() {
        List<Patient> highRisk = patientRepository.findHighRiskPatients(70);
        List<String> patientIds = highRisk.stream().map(Patient::getId).collect(Collectors.toList());
        return followUpRepository.findAll().stream()
                .filter(f -> patientIds.contains(f.getPatientId()) && f.getStatus() == FollowUpStatus.PENDING)
                .map(mapper::toFollowUpDto)
                .collect(Collectors.toList());
    }
}
