package com.swasthyasetu.repository;

import com.swasthyasetu.entity.DiagnosticReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReport, String> {
    List<DiagnosticReport> findByPatientId(String patientId);
    Optional<DiagnosticReport> findByDiagnosticOrderId(String diagnosticOrderId);
}
