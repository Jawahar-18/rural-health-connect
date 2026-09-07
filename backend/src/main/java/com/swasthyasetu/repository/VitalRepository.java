package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Vital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VitalRepository extends JpaRepository<Vital, String> {
    List<Vital> findByPatientIdOrderByRecordedAtDesc(String patientId);
    Optional<Vital> findFirstByPatientIdOrderByRecordedAtDesc(String patientId);
    List<Vital> findByMedicalRecordId(String medicalRecordId);
}
