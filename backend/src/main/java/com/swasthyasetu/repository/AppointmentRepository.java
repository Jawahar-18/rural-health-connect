package com.swasthyasetu.repository;

import com.swasthyasetu.entity.Appointment;
import com.swasthyasetu.entity.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    Optional<Appointment> findByAppointmentCode(String appointmentCode);

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByFacilityId(String facilityId);

    List<Appointment> findByFacilityIdAndAppointmentDate(String facilityId, LocalDate appointmentDate);

    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);

    List<Appointment> findByPatientIdAndStatus(String patientId, AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.facilityId = :facilityId AND a.appointmentDate = :date AND a.status IN :statuses ORDER BY a.queuePosition ASC")
    List<Appointment> findActiveQueue(@Param("facilityId") String facilityId, @Param("date") LocalDate date, @Param("statuses") List<AppointmentStatus> statuses);

    long countByFacilityIdAndAppointmentDate(String facilityId, LocalDate date);

    long countByFacilityIdAndAppointmentDateAndStatus(String facilityId, LocalDate date, AppointmentStatus status);
}
