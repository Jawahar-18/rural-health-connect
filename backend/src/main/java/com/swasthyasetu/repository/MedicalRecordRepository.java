package com.swasthyasetu.repository;

import com.swasthyasetu.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, String> {
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(String patientId);
    List<MedicalRecord> findByDoctorId(String doctorId);
    List<MedicalRecord> findByFacilityId(String facilityId);
}
