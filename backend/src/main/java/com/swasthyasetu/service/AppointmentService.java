package com.swasthyasetu.service;

import com.swasthyasetu.dto.AppointmentDto;
import com.swasthyasetu.entity.Appointment;
import com.swasthyasetu.entity.Facility;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.QueueToken;
import com.swasthyasetu.entity.enums.AppointmentStatus;
import com.swasthyasetu.entity.enums.QueueTokenStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.AppointmentRepository;
import com.swasthyasetu.repository.FacilityRepository;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.repository.QueueTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final FacilityRepository facilityRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final EntityDtoMapper mapper;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              FacilityRepository facilityRepository,
                              QueueTokenRepository queueTokenRepository,
                              EntityDtoMapper mapper) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.facilityRepository = facilityRepository;
        this.queueTokenRepository = queueTokenRepository;
        this.mapper = mapper;
    }

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(mapper::toAppointmentDto)
                .collect(Collectors.toList());
    }

    public AppointmentDto getAppointmentById(String id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return mapper.toAppointmentDto(apt);
    }

    @Transactional
    public AppointmentDto createAppointment(AppointmentDto.CreateRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + req.getPatientId()));

        String facilityId = req.getFacilityId() != null ? req.getFacilityId() : "fac-phc-junnar";
        Facility facility = facilityRepository.findById(facilityId).orElse(null);
        String facilityName = facility != null ? facility.getName() : "PHC Junnar, Pune";

        LocalDate aptDate = LocalDate.parse(req.getDate());
        long existingCount = appointmentRepository.countByFacilityIdAndAppointmentDate(facilityId, aptDate);
        String tokenNumber = "A-" + (100 + existingCount + 1);

        Appointment apt = new Appointment();
        apt.setId("apt-" + UUID.randomUUID().toString().substring(0, 8));
        apt.setAppointmentCode("APT-" + System.currentTimeMillis() % 100000);
        apt.setPatientId(patient.getId());
        apt.setPatientName(patient.getFullName());
        apt.setDoctorId(req.getDoctorId() != null ? req.getDoctorId() : "usr-doctor-1");
        apt.setDoctorName("Dr. Rajesh Deshmukh (MBBS, MD)");
        apt.setFacilityId(facilityId);
        apt.setFacilityName(facilityName);
        apt.setDepartment(req.getDepartment() != null ? req.getDepartment() : "General OPD");
        apt.setAppointmentDate(aptDate);
        apt.setAppointmentTime(req.getTimeSlot() != null ? req.getTimeSlot() : "09:30 AM");
        apt.setTokenNumber(tokenNumber);
        apt.setReason(req.getReason());
        apt.setPriority(req.getPriority() != null ? req.getPriority() : "ROUTINE");
        apt.setStatus(AppointmentStatus.SCHEDULED);
        apt.setQueuePosition((int) existingCount + 1);
        apt.setEstimatedWaitMinutes((int) ((existingCount + 1) * 15));

        appointmentRepository.save(apt);

        // Generate matching QueueToken
        QueueToken token = new QueueToken();
        token.setId("tok-" + UUID.randomUUID().toString().substring(0, 8));
        token.setAppointmentId(apt.getId());
        token.setFacilityId(facilityId);
        token.setTokenNumber(tokenNumber);
        token.setQueueDate(aptDate);
        token.setStatus(QueueTokenStatus.WAITING);
        token.setEstimatedWaitMinutes(apt.getEstimatedWaitMinutes());
        queueTokenRepository.save(token);

        // Update patient's next appointment date
        patient.setNextAppointmentDate(aptDate);
        patient.setTotalAppointments(patient.getTotalAppointments() != null ? patient.getTotalAppointments() + 1 : 1);
        patientRepository.save(patient);

        return mapper.toAppointmentDto(apt);
    }

    @Transactional
    public AppointmentDto updateStatus(String id, AppointmentStatus status) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        apt.setStatus(status);

        queueTokenRepository.findByAppointmentId(id).ifPresent(tok -> {
            if (status == AppointmentStatus.COMPLETED) tok.setStatus(QueueTokenStatus.COMPLETED);
            else if (status == AppointmentStatus.CANCELLED) tok.setStatus(QueueTokenStatus.SKIPPED);
            else if (status == AppointmentStatus.CHECKED_IN) tok.setStatus(QueueTokenStatus.WAITING);
            queueTokenRepository.save(tok);
        });

        appointmentRepository.save(apt);
        return mapper.toAppointmentDto(apt);
    }

    public List<AppointmentDto> getActiveQueue(String facilityId, LocalDate date) {
        return appointmentRepository.findActiveQueue(
                facilityId,
                date,
                Arrays.asList(AppointmentStatus.SCHEDULED, AppointmentStatus.CHECKED_IN)
        ).stream().map(mapper::toAppointmentDto).collect(Collectors.toList());
    }

    @Transactional
    public void cancelAppointment(String id) {
        updateStatus(id, AppointmentStatus.CANCELLED);
    }
}
