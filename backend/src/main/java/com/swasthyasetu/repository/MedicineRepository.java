package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {
    List<Medicine> findByActiveTrue();
    List<Medicine> findByCategory(String category);
}
