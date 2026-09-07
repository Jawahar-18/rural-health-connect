package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(String patientId);
    List<Prescription> findByDoctorId(String doctorId);
}
