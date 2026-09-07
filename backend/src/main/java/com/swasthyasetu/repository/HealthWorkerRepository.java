package com.swasthyasetu.repository;

import com.swasthyasetu.entity.HealthWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthWorkerRepository extends JpaRepository<HealthWorker, String> {
    Optional<HealthWorker> findByUserId(String userId);
    List<HealthWorker> findByFacilityId(String facilityId);
}
