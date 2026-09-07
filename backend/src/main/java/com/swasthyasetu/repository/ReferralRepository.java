package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Referral;
import com.swasthyasetu.entity.enums.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, String> {

    Optional<Referral> findByReferralCode(String referralCode);

    List<Referral> findByPatientId(String patientId);

    List<Referral> findByFromFacilityId(String fromFacilityId);

    List<Referral> findByToFacilityId(String toFacilityId);

    List<Referral> findByStatus(ReferralStatus status);

    @Query("SELECT r FROM Referral r WHERE r.fromFacilityId = :facilityId OR r.toFacilityId = :facilityId")
    List<Referral> findByFacilityInvolvement(@Param("facilityId") String facilityId);

    long countByFromFacilityIdAndStatus(String facilityId, ReferralStatus status);

    long countByStatus(ReferralStatus status);
}
