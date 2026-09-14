package com.swasthyasetu.service;

import com.swasthyasetu.dto.FeedbackDto;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.PatientFeedback;
import com.swasthyasetu.entity.enums.FeedbackStatus;
import com.swasthyasetu.entity.enums.SatisfactionLevel;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.FeedbackRepository;
import com.swasthyasetu.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final PatientRepository patientRepository;
    private final EntityDtoMapper mapper;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           PatientRepository patientRepository,
                           EntityDtoMapper mapper) {
        this.feedbackRepository = feedbackRepository;
        this.patientRepository = patientRepository;
        this.mapper = mapper;
    }

    public List<FeedbackDto> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(mapper::toFeedbackDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getRefusalFeedbacks() {
        return feedbackRepository.findByRefusesFollowUpTrueOrderByCreatedAtDesc().stream()
                .map(mapper::toFeedbackDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getFeedbacksByPatientId(String patientId) {
        return feedbackRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(mapper::toFeedbackDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackDto submitFeedback(FeedbackDto.CreateRequest req, String userId, String userName, String userRole) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        PatientFeedback feedback = new PatientFeedback();
        feedback.setId("fb-" + UUID.randomUUID().toString().substring(0, 8));
        feedback.setPatientId(patient.getId());
        feedback.setPatientName(patient.getFullName());
        feedback.setPatientPhone(patient.getPhone());
        feedback.setCallId(req.getCallId());
        feedback.setCallAttended(req.isCallAttended());
        feedback.setSatisfactionLevel(req.getSatisfactionLevel());
        feedback.setRefusesFollowUp(req.isRefusesFollowUp());
        feedback.setRefusalReason(req.getRefusalReason());
        feedback.setFeedbackNotes(req.getFeedbackNotes());
        feedback.setRecordedByUserId(userId);
        feedback.setRecordedByName(req.getRecordedByName() != null ? req.getRecordedByName() : userName);
        feedback.setRecordedByRole(req.getRecordedByRole() != null ? req.getRecordedByRole() : userRole);
        feedback.setStatus(req.isRefusesFollowUp() || req.getSatisfactionLevel() == SatisfactionLevel.DISSATISFIED 
                ? FeedbackStatus.ACTION_REQUIRED 
                : FeedbackStatus.NEW);

        // Update Patient care metrics
        if (req.isRefusesFollowUp()) {
            patient.setLastFeedbackStatus("REFUSED_FOLLOW_UP");
            int missed = patient.getConsecutiveFollowupsMissed() + 1;
            patient.setConsecutiveFollowupsMissed(missed);
            patient.setConsecutiveFollowupsCompleted(0);

            // If continuous refusal / non-attendance reaches 5-6 times, auto-archive as chronic refusal
            if (missed >= 5) {
                patient.setArchived(true);
                patient.setArchivedReason("Continuous follow-up refusal / non-attendance (" + missed + " consecutive sessions)");
                patient.setArchivedDate(LocalDate.now());
            }
        } else if (req.getSatisfactionLevel() == SatisfactionLevel.DISSATISFIED) {
            patient.setLastFeedbackStatus("DISSATISFIED_WITH_TREATMENT");
        } else {
            patient.setLastFeedbackStatus("SATISFIED");
        }

        patientRepository.save(patient);
        feedbackRepository.save(feedback);

        return mapper.toFeedbackDto(feedback);
    }

    @Transactional
    public FeedbackDto reviewFeedback(String id, FeedbackDto.AdminReviewRequest req, String adminId) {
        PatientFeedback f = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found: " + id));

        f.setStatus(req.getStatus());
        f.setAdminReviewNotes(req.getAdminReviewNotes());
        f.setReviewedByAdminId(adminId);
        f.setReviewedAt(LocalDateTime.now());

        feedbackRepository.save(f);
        return mapper.toFeedbackDto(f);
    }

    @Transactional
    public void archivePatient(String patientId, String reason) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        p.setArchived(true);
        p.setArchivedReason(reason != null ? reason : "Archived by Admin");
        p.setArchivedDate(LocalDate.now());
        patientRepository.save(p);
    }

    @Transactional
    public void unarchivePatient(String patientId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        p.setArchived(false);
        p.setArchivedReason(null);
        p.setArchivedDate(null);
        p.setConsecutiveFollowupsMissed(0);
        patientRepository.save(p);
    }
}
