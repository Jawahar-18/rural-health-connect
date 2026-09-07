package com.swasthyasetu.repository;

import com.swasthyasetu.entity.FollowUp;
import com.swasthyasetu.entity.enums.FollowUpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, String> {

    List<FollowUp> findByPatientId(String patientId);

    List<FollowUp> findByFacilityId(String facilityId);

    List<FollowUp> findByDoctorId(String doctorId);

    List<FollowUp> findByStatus(FollowUpStatus status);

    List<FollowUp> findByFollowUpDate(LocalDate date);

    @Query("SELECT f FROM FollowUp f WHERE f.status = :status AND f.followUpDate <= :date")
    List<FollowUp> findDueFollowUps(@Param("status") FollowUpStatus status, @Param("date") LocalDate date);

    long countByFacilityIdAndStatus(String facilityId, FollowUpStatus status);

    long countByStatus(FollowUpStatus status);
}
