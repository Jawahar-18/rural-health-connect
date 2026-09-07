package com.swasthyasetu.repository;

import com.swasthyasetu.entity.DiagnosticTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticTestRepository extends JpaRepository<DiagnosticTest, String> {
    List<DiagnosticTest> findByActiveTrue();
    List<DiagnosticTest> findByCategory(String category);
}
