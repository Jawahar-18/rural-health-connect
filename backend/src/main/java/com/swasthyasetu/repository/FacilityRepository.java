package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, String> {
    Optional<Facility> findByFacilityCode(String facilityCode);
    List<Facility> findByDistrict(String district);
    List<Facility> findByActiveTrue();
}
