package com.swasthyasetu.repository;

import com.swasthyasetu.entity.PatientFeedback;
import com.swasthyasetu.entity.enums.FeedbackStatus;
import com.swasthyasetu.entity.enums.SatisfactionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<PatientFeedback, String> {
    List<PatientFeedback> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<PatientFeedback> findByRefusesFollowUpTrueOrderByCreatedAtDesc();
    List<PatientFeedback> findBySatisfactionLevelOrderByCreatedAtDesc(SatisfactionLevel level);
    List<PatientFeedback> findByStatusOrderByCreatedAtDesc(FeedbackStatus status);
    List<PatientFeedback> findAllByOrderByCreatedAtDesc();
    long countByRefusesFollowUpTrue();
    long countBySatisfactionLevel(SatisfactionLevel level);
}
