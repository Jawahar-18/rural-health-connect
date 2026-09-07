package com.swasthyasetu.repository;

import com.swasthyasetu.entity.QueueToken;
import com.swasthyasetu.entity.enums.QueueTokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, String> {

    List<QueueToken> findByFacilityIdAndQueueDate(String facilityId, LocalDate queueDate);

    List<QueueToken> findByFacilityIdAndQueueDateAndStatus(String facilityId, LocalDate queueDate, QueueTokenStatus status);

    Optional<QueueToken> findByAppointmentId(String appointmentId);

    long countByFacilityIdAndQueueDate(String facilityId, LocalDate queueDate);
}
