package com.swasthyasetu.repository;

import com.swasthyasetu.entity.DiagnosticOrder;
import com.swasthyasetu.entity.enums.DiagnosticOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticOrderRepository extends JpaRepository<DiagnosticOrder, String> {
    List<DiagnosticOrder> findByPatientId(String patientId);
    List<DiagnosticOrder> findByFacilityId(String facilityId);
    List<DiagnosticOrder> findByStatus(DiagnosticOrderStatus status);
}
