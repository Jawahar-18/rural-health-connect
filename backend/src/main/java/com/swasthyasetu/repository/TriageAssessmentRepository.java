package com.swasthyasetu.repository;

import com.swasthyasetu.entity.TriageAssessment;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TriageAssessmentRepository extends JpaRepository<TriageAssessment, String> {
    List<TriageAssessment> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<TriageAssessment> findByHealthWorkerId(String healthWorkerId);
    List<TriageAssessment> findByClinicalPriority(ClinicalPriority clinicalPriority);
}
