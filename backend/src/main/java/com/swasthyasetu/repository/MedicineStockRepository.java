package com.swasthyasetu.repository;

import com.swasthyasetu.entity.MedicineStock;
import com.swasthyasetu.entity.enums.StockStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineStockRepository extends JpaRepository<MedicineStock, String> {

    List<MedicineStock> findByFacilityId(String facilityId);

    List<MedicineStock> findByFacilityIdAndStatus(String facilityId, StockStatus status);

    Optional<MedicineStock> findByFacilityIdAndMedicineId(String facilityId, String medicineId);

    long countByFacilityIdAndStatus(String facilityId, StockStatus status);

    long countByStatus(StockStatus status);
}
