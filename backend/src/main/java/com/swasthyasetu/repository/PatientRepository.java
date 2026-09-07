package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.enums.ClinicalPriority;
import com.swasthyasetu.entity.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {

    Optional<Patient> findByPatientCode(String patientCode);

    Optional<Patient> findByPhone(String phone);

    Optional<Patient> findByUserId(String userId);

    List<Patient> findByVillage(String village);

    List<Patient> findByFollowupRiskLevel(RiskLevel riskLevel);

    List<Patient> findByClinicalPriority(ClinicalPriority clinicalPriority);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.village) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "p.phone LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(p.patientCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Patient> searchPatients(@Param("query") String query);

    @Query("SELECT p FROM Patient p WHERE p.followupRiskScore >= :minScore ORDER BY p.followupRiskScore DESC")
    List<Patient> findHighRiskPatients(@Param("minScore") int minScore);

    long countByFollowupRiskLevel(RiskLevel riskLevel);

    long countByVillage(String village);
}
