package com.swasthyasetu.repository;

import com.swasthyasetu.entity.RiskPrediction;
import com.swasthyasetu.entity.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, String> {
    Optional<RiskPrediction> findFirstByPatientIdOrderByGeneratedAtDesc(String patientId);
    List<RiskPrediction> findByPatientIdOrderByGeneratedAtDesc(String patientId);
    List<RiskPrediction> findByRiskLevel(RiskLevel riskLevel);
}
