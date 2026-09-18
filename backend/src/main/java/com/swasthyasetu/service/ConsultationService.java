package com.swasthyasetu.service;

import com.swasthyasetu.dto.ConsultationDto;
import com.swasthyasetu.dto.ConsultationDto.ConsultationRequest;
import com.swasthyasetu.dto.ConsultationDto.PrescriptionDto;
import com.swasthyasetu.dto.ConsultationDto.VitalsDto;
import com.swasthyasetu.entity.*;
import com.swasthyasetu.entity.enums.AppointmentStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final VitalRepository vitalRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;
    private final EntityDtoMapper mapper;

    public ConsultationService(MedicalRecordRepository medicalRecordRepository,
                               PrescriptionRepository prescriptionRepository,
                               VitalRepository vitalRepository,
                               PatientRepository patientRepository,
                               AppointmentRepository appointmentRepository,
                               AppointmentService appointmentService,
                               EntityDtoMapper mapper) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.vitalRepository = vitalRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.appointmentService = appointmentService;
        this.mapper = mapper;
    }

    @Transactional
    public PrescriptionDto completeConsultation(ConsultationRequest req, String doctorUserId, String doctorName, String facilityName) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        // 1. Create Consultation / Medical Record
        MedicalRecord record = new MedicalRecord();
        record.setId("mr-" + UUID.randomUUID().toString().substring(0, 8));
        record.setPatientId(patient.getId());
        record.setDoctorId(doctorUserId);
        record.setFacilityId("fac-phc-junnar");
        record.setVisitDate(LocalDate.now());
        record.setChiefComplaint(req.getChiefComplaint() != null ? req.getChiefComplaint() : "OPD Clinical Consultation");
        record.setDiagnosis(req.getDiagnosis());
        record.setClinicalNotes(req.getClinicalNotes());
        medicalRecordRepository.save(record);

        // 2. Create Prescription
        Prescription rx = new Prescription();
        rx.setId("rx-" + UUID.randomUUID().toString().substring(0, 8));
        rx.setPatientId(patient.getId());
        rx.setPatientName(patient.getFullName());
        rx.setDoctorId(doctorUserId);
        rx.setDoctorName(doctorName);
        rx.setMedicalRecordId(record.getId());
        rx.setFacilityName(facilityName != null ? facilityName : "PHC Junnar, Pune");
        rx.setPrescriptionDate(LocalDate.now());
        rx.setDiagnosis(req.getDiagnosis());
        rx.setClinicalNotes(req.getClinicalNotes());

        if (req.getFollowUpDate() != null && !req.getFollowUpDate().isBlank()) {
            rx.setFollowUpDate(LocalDate.parse(req.getFollowUpDate()));
            patient.setNextAppointmentDate(rx.getFollowUpDate());
        }

        if (req.getItems() != null) {
            for (ConsultationDto.PrescriptionItemDto itemDto : req.getItems()) {
                PrescriptionItem item = new PrescriptionItem();
                item.setId("rxi-" + UUID.randomUUID().toString().substring(0, 8));
                item.setMedicineName(itemDto.getMedicineName());
                item.setDosage(itemDto.getDosage());
                item.setFrequency(itemDto.getFrequency());
                item.setDurationDays(itemDto.getDurationDays());
                item.setInstructions(itemDto.getInstructions());
                item.setInStock(itemDto.isInStock());
                item.setDescription(itemDto.getDescription());
                item.setPurpose(itemDto.getPurpose());
                rx.addItem(item);
            }
        }
        prescriptionRepository.save(rx);

        // 3. Mark any current checked-in/scheduled appointment for this patient as COMPLETED
        List<Appointment> pendingApts = appointmentRepository.findByPatientIdAndStatus(patient.getId(), AppointmentStatus.CHECKED_IN);
        if (pendingApts.isEmpty()) {
            pendingApts = appointmentRepository.findByPatientIdAndStatus(patient.getId(), AppointmentStatus.SCHEDULED);
        }
        for (Appointment a : pendingApts) {
            appointmentService.updateStatus(a.getId(), AppointmentStatus.COMPLETED);
        }

        patient.setLastAppointmentDate(LocalDate.now());
        patientRepository.save(patient);

        return mapper.toPrescriptionDto(rx);
    }

    public List<PrescriptionDto> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId).stream()
                .map(mapper::toPrescriptionDto)
                .collect(Collectors.toList());
    }

    public PrescriptionDto getPrescriptionById(String id) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with ID: " + id));
        return mapper.toPrescriptionDto(p);
    }

    @Transactional
    public VitalsDto recordVitals(String patientId, VitalsDto dto, String recordedBy) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        Vital v = new Vital();
        v.setId("vit-" + UUID.randomUUID().toString().substring(0, 8));
        v.setPatientId(patient.getId());
        v.setTemperature(dto.getTemperatureCelsius());
        v.setHeartRate(dto.getHeartRateBpm());
        v.setSystolicBp(dto.getBpSystolic());
        v.setDiastolicBp(dto.getBpDiastolic());
        v.setRespiratoryRate(dto.getRespRatePerMin());
        v.setOxygenSaturation(dto.getOxygenSatPercent());
        v.setBloodSugar(dto.getBloodSugarMgDl());
        v.setHemoglobin(dto.getHemoglobinGdl());
        v.setWeight(dto.getWeightKg());
        v.setHeight(dto.getHeightCm());
        v.setRecordedBy(recordedBy);

        vitalRepository.save(v);
        return dto;
    }
}
