package com.swasthyasetu.seed;

import com.swasthyasetu.entity.*;
import com.swasthyasetu.entity.enums.*;
import com.swasthyasetu.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final DoctorRepository doctorRepository;
    private final HealthWorkerRepository healthWorkerRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final ReferralRepository referralRepository;
    private final FollowUpRepository followUpRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineStockRepository stockRepository;
    private final DiagnosticTestRepository diagnosticTestRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          FacilityRepository facilityRepository,
                          DoctorRepository doctorRepository,
                          HealthWorkerRepository healthWorkerRepository,
                          PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          QueueTokenRepository queueTokenRepository,
                          ReferralRepository referralRepository,
                          FollowUpRepository followUpRepository,
                          MedicineRepository medicineRepository,
                          MedicineStockRepository stockRepository,
                          DiagnosticTestRepository diagnosticTestRepository,
                          PrescriptionRepository prescriptionRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
        this.doctorRepository = doctorRepository;
        this.healthWorkerRepository = healthWorkerRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueTokenRepository = queueTokenRepository;
        this.referralRepository = referralRepository;
        this.followUpRepository = followUpRepository;
        this.medicineRepository = medicineRepository;
        this.stockRepository = stockRepository;
        this.diagnosticTestRepository = diagnosticTestRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial synthetic dataset load.");
            return;
        }

        log.info("Seeding realistic synthetic demonstration data for SIH 2026 (Problem #26133)...");

        String defaultHash = passwordEncoder.encode("Password@123");

        // 1. Seed Demo Users
        List<User> users = List.of(
                createUser("usr-patient-1", "anandi.patil", defaultHash, "Anandi Patil", UserRole.PATIENT, "+91 98220 11223", "anandi.patil@example.com", "fac-phc-junnar", "PHC Junnar, Pune", "Pune", "mr"),
                createUser("usr-worker-1", "savita.kamble", defaultHash, "Savita Kamble (ASHA)", UserRole.HEALTH_WORKER, "+91 98500 44332", "savita.asha@maharashtra.gov.in", "fac-phc-junnar", "PHC Junnar, Pune", "Pune", "mr"),
                createUser("usr-doctor-1", "dr.deshmukh", defaultHash, "Dr. Rajesh Deshmukh (MBBS, MD)", UserRole.DOCTOR, "+91 94220 88776", "dr.deshmukh@maharashtra.gov.in", "fac-phc-junnar", "PHC Junnar, Pune", "Pune", "en"),
                createUser("usr-facadmin-1", "dr.kulkarni", defaultHash, "Dr. Meena Kulkarni (Medical Officer In-Charge)", UserRole.FACILITY_ADMIN, "+91 94210 55443", "mo.junnar@maharashtra.gov.in", "fac-phc-junnar", "PHC Junnar, Pune", "Pune", "en"),
                createUser("usr-distadmin-1", "dr.pawar", defaultHash, "Dr. Suresh Pawar (District Health Officer - DHO)", UserRole.DISTRICT_ADMIN, "+91 98230 99000", "dho.pune@maharashtra.gov.in", null, null, "Pune", "en")
        );
        userRepository.saveAll(users);

        // 2. Seed Facilities
        List<Facility> facilities = List.of(
                createFacility("fac-phc-junnar", "PHC-JUN-01", "PHC Junnar, Pune", FacilityType.PHC, "Junnar Main Road", "Junnar", "Pune", 19.2087, 73.8763),
                createFacility("fac-chc-ghodegaon", "CHC-GHO-02", "CHC Ghodegaon, Ambegaon", FacilityType.CHC, "Ghodegaon Highway", "Ghodegaon", "Pune", 19.0435, 73.8187),
                createFacility("fac-sc-otur", "SC-OTU-03", "Sub-Center Otur, Junnar", FacilityType.SUB_CENTER, "Gram Panchayat", "Otur", "Pune", 19.2612, 73.9854),
                createFacility("fac-sc-ambegaon", "SC-AMB-04", "Sub-Center Ambegaon", FacilityType.SUB_CENTER, "Wadi Ward", "Ambegaon", "Pune", 19.0125, 73.7845),
                createFacility("fac-dh-aundh", "DH-PUN-05", "District Hospital Aundh, Pune", FacilityType.DISTRICT_HOSPITAL, "Aundh Chest Hospital Campus", "Pune City", "Pune", 18.5583, 73.8077)
        );
        facilityRepository.saveAll(facilities);

        // 3. Seed Doctors & Health Workers
        Doctor doc = new Doctor();
        doc.setId("doc-101");
        doc.setUserId("usr-doctor-1");
        doc.setFacilityId("fac-phc-junnar");
        doc.setName("Dr. Rajesh Deshmukh (MBBS, MD)");
        doc.setSpecialization("General Medicine & Non-Communicable Diseases");
        doc.setPhone("+91 94220 88776");
        doctorRepository.save(doc);

        HealthWorker worker = new HealthWorker();
        worker.setId("hw-101");
        worker.setUserId("usr-worker-1");
        worker.setFacilityId("fac-phc-junnar");
        worker.setName("Savita Kamble (ASHA)");
        worker.setWorkerType(WorkerType.ASHA);
        worker.setPhone("+91 98500 44332");
        healthWorkerRepository.save(worker);

        // 4. Seed 50 Synthetic Patients (including all 7 special demo profiles)
        List<Patient> patientList = new ArrayList<>();

        // Profile 1: Anandi Patil (Standard OPD)
        patientList.add(createPatient("pat-101", "MH-PUN-101", "Anandi Patil", 34, "Female", "+91 98220 11223", "Junnar", "Hypertension", "Routine Hypertension checkup", false, null, 22, RiskLevel.LOW, ClinicalPriority.ROUTINE, InterventionPriority.LOW, 4.0, 6, 0, "2026-08-15", "2026-09-10", null));

        // Profile 2: Ramesh Shinde (Multiple missed appointments, high distance, high risk)
        patientList.add(createPatient("pat-102", "MH-PUN-102", "Ramesh Shinde", 58, "Male", "+91 97640 55667", "Ambegaon", "Type 2 Diabetes, Hypertension", "Type 2 Diabetes, Hypertension, Foot Ulcer risk", false, null, 82, RiskLevel.HIGH, ClinicalPriority.HIGH, InterventionPriority.CRITICAL, 28.0, 8, 3, "2026-06-20", "2026-09-08", "ref-301"));

        // Profile 3: Sunita Jadhav (Far tribal hamlet, respiratory issues)
        patientList.add(createPatient("pat-103", "MH-PUN-103", "Sunita Jadhav", 42, "Female", "+91 96370 88990", "Khed Tribal Hamlet", "Asthma", "Asthma Exacerbation, Severe Anemia", false, null, 74, RiskLevel.HIGH, ClinicalPriority.MODERATE, InterventionPriority.HIGH, 32.0, 4, 2, "2026-07-10", "2026-09-12", null));

        // Profile 4: Priya Gawde (Maternal Care ANC Second Trimester)
        patientList.add(createPatient("pat-104", "MH-PUN-104", "Priya Gawde", 24, "Female", "+91 99210 33445", "Otur", "Anemia", "Antenatal Care (ANC), Second Trimester (22 Weeks), Mild Anemia", true, 2, 35, RiskLevel.LOW, ClinicalPriority.MODERATE, InterventionPriority.MEDIUM, 6.0, 3, 0, "2026-08-28", "2026-09-14", null));

        // Profile 5: Dnyaneshwar More (Urgent chest symptoms)
        patientList.add(createPatient("pat-105", "MH-PUN-105", "Dnyaneshwar More", 66, "Male", "+91 95450 66778", "Ghodegaon", "Ischemic Heart Disease, Hypertension", "Exertional Angina, Severe Hypertension, Breathlessness", false, null, 78, RiskLevel.HIGH, ClinicalPriority.URGENT, InterventionPriority.CRITICAL, 18.0, 10, 1, "2026-08-01", "2026-09-07", "ref-302"));

        // Generate 45 additional realistic synthetic patients across villages
        String[] firstNamesM = {"Suresh", "Santosh", "Vijay", "Ganesh", "Ashok", "Prakash", "Sachin", "Nitin", "Mahesh", "Rahul"};
        String[] firstNamesF = {"Kavita", "Shobha", "Rekha", "Lata", "Usha", "Anita", "Sangeeta", "Vaishali", "Pooja", "Meena"};
        String[] lastNames = {"Kadam", "Bhosale", "Gaikwad", "Chavan", "Pawar", "Shinde", "Deshmukh", "Jadhav", "Tambe", "Gawade"};
        String[] villages = {"Junnar", "Ambegaon", "Khed Tribal Hamlet", "Otur", "Ghodegaon", "Bhor"};

        for (int i = 6; i <= 50; i++) {
            boolean isFemale = (i % 2 == 0);
            String fName = isFemale ? firstNamesF[(i % firstNamesF.length)] : firstNamesM[(i % firstNamesM.length)];
            String lName = lastNames[(i % lastNames.length)];
            String village = villages[(i % villages.length)];
            int age = 18 + (i * 3) % 65;
            double distance = 3.0 + (i * 1.7) % 35.0;
            int missed = (i % 7 == 0) ? 2 : (i % 11 == 0) ? 3 : 0;
            boolean preg = isFemale && age < 35 && (i % 4 == 0);
            int risk = Math.min(Math.max((int) (20 + (distance > 20 ? 25 : 5) + (missed * 20)), 15), 92);
            RiskLevel rl = risk >= 70 ? RiskLevel.HIGH : risk >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
            ClinicalPriority cp = (i % 13 == 0) ? ClinicalPriority.URGENT : (i % 5 == 0) ? ClinicalPriority.HIGH : (i % 3 == 0) ? ClinicalPriority.MODERATE : ClinicalPriority.ROUTINE;
            InterventionPriority ip = cp == ClinicalPriority.URGENT || (rl == RiskLevel.HIGH && cp == ClinicalPriority.HIGH) ? InterventionPriority.CRITICAL :
                    cp == ClinicalPriority.HIGH || rl == RiskLevel.HIGH ? InterventionPriority.HIGH :
                    cp == ClinicalPriority.MODERATE ? InterventionPriority.MEDIUM : InterventionPriority.ROUTINE;

            patientList.add(createPatient(
                    "pat-" + (100 + i),
                    "MH-PUN-" + (100 + i),
                    fName + " " + lName,
                    age,
                    isFemale ? "Female" : "Male",
                    "+91 98" + (20000000 + i * 1374),
                    village,
                    (i % 3 == 0) ? "Hypertension, Type 2 Diabetes" : (i % 4 == 0) ? "Asthma" : "None",
                    "Routine Health Checkup",
                    preg,
                    preg ? (i % 3 + 1) : null,
                    risk,
                    rl,
                    cp,
                    ip,
                    distance,
                    2 + (i % 5),
                    missed,
                    String.format("2026-08-%02d", 10 + (i % 18)),
                    String.format("2026-09-%02d", 8 + (i % 15)),
                    null
            ));
        }
        patientRepository.saveAll(patientList);

        // 5. Seed Appointments & Queue Tokens
        List<Appointment> appointments = new ArrayList<>();
        List<QueueToken> tokens = new ArrayList<>();

        for (int i = 0; i < Math.min(25, patientList.size()); i++) {
            Patient p = patientList.get(i);
            String tokenNumber = "A-" + (100 + i + 1);
            Appointment apt = new Appointment();
            apt.setId("apt-" + (200 + i));
            apt.setAppointmentCode("APT-2026-" + (1000 + i));
            apt.setPatientId(p.getId());
            apt.setPatientName(p.getFullName());
            apt.setDoctorId("usr-doctor-1");
            apt.setDoctorName("Dr. Rajesh Deshmukh (MBBS, MD)");
            apt.setFacilityId("fac-phc-junnar");
            apt.setFacilityName("PHC Junnar, Pune");
            apt.setDepartment(p.isPregnant() ? "Antenatal Care (ANC)" : (i % 2 == 0) ? "NCD & General OPD" : "General Medicine");
            apt.setAppointmentDate(LocalDate.now());
            apt.setAppointmentTime(String.format("%02d:00 AM", 9 + (i / 4)));
            apt.setTokenNumber(tokenNumber);
            apt.setPriority(p.getClinicalPriority() == ClinicalPriority.URGENT ? "URGENT" : "ROUTINE");
            apt.setStatus(i < 8 ? AppointmentStatus.CHECKED_IN : AppointmentStatus.SCHEDULED);
            apt.setQueuePosition(i + 1);
            apt.setEstimatedWaitMinutes((i + 1) * 12);
            appointments.add(apt);

            QueueToken tok = new QueueToken();
            tok.setId("tok-" + (200 + i));
            tok.setAppointmentId(apt.getId());
            tok.setFacilityId("fac-phc-junnar");
            tok.setTokenNumber(tokenNumber);
            tok.setQueueDate(LocalDate.now());
            tok.setStatus(i == 0 ? QueueTokenStatus.IN_CONSULTATION : QueueTokenStatus.WAITING);
            tok.setEstimatedWaitMinutes(apt.getEstimatedWaitMinutes());
            tokens.add(tok);
        }
        appointmentRepository.saveAll(appointments);
        queueTokenRepository.saveAll(tokens);

        // 6. Seed Referrals
        List<Referral> referrals = List.of(
                createReferral("ref-301", "REF-MH-7701", "pat-102", "Ramesh Shinde", 58, "Male", "PHC Junnar, Pune", "Sassoon General Hospital, Pune", "Endocrinology & Diabetic Foot Clinic", "Diabetic neuropathy with persistent plantar ulceration.", ReferralPriority.HIGH, ReferralStatus.ACCEPTED),
                createReferral("ref-302", "REF-MH-7702", "pat-105", "Dnyaneshwar More", 66, "Male", "PHC Junnar, Pune", "B.J. Medical College & Sassoon General Hospital, Pune", "Cardiology (2D Echo & Angiography)", "Angina on exertion with ST segment depression.", ReferralPriority.URGENT, ReferralStatus.CREATED),
                createReferral("ref-303", "REF-MH-7703", "pat-103", "Sunita Jadhav", 42, "Female", "PHC Junnar, Pune", "District Hospital Aundh, Pune", "Pulmonology & Spirometry Unit", "Refractory asthma with recurring nocturnal dyspnea.", ReferralPriority.ROUTINE, ReferralStatus.COMPLETED)
        );
        referralRepository.saveAll(referrals);

        // 7. Seed Follow-ups
        List<FollowUp> followUps = List.of(
                createFollowUp("fup-401", "pat-102", "Ramesh Shinde", "2026-09-08", "Diabetic Foot Ulcer dressing & HbA1c review", FollowUpStatus.PENDING),
                createFollowUp("fup-402", "pat-103", "Sunita Jadhav", "2026-09-12", "Inhaler compliance & peak flow check", FollowUpStatus.PENDING),
                createFollowUp("fup-403", "pat-104", "Priya Gawde", "2026-09-14", "ANC Routine Checkup (24 Weeks) & IFA tablets review", FollowUpStatus.PENDING),
                createFollowUp("fup-404", "pat-105", "Dnyaneshwar More", "2026-09-07", "Post-Angiography telemetry check", FollowUpStatus.REMINDER_SENT)
        );
        followUpRepository.saveAll(followUps);

        // 8. Seed Essential Drug Inventory (30 medicines & stock)
        List<MedicineStock> stocks = List.of(
                createStock("stk-01", "Tab. Amlodipine 5mg", "Cardiovascular", 850, 200, "tablets", StockStatus.AVAILABLE, "2027-05-30"),
                createStock("stk-02", "Tab. Metformin 500mg", "Anti-diabetic", 1200, 300, "tablets", StockStatus.AVAILABLE, "2027-08-15"),
                createStock("stk-03", "Tab. Paracetamol 500mg", "Analgesic & Antipyretic", 3400, 500, "tablets", StockStatus.AVAILABLE, "2027-12-31"),
                createStock("stk-04", "Tab. Iron & Folic Acid (IFA)", "Maternal Health", 1500, 400, "tablets", StockStatus.AVAILABLE, "2027-03-31"),
                createStock("stk-05", "Cap. Amoxicillin 500mg", "Antibiotics", 120, 250, "capsules", StockStatus.LOW_STOCK, "2026-11-30"),
                createStock("stk-06", "Salbutamol Inhaler 100mcg", "Respiratory", 15, 30, "inhalers", StockStatus.LOW_STOCK, "2026-10-31"),
                createStock("stk-07", "Inj. Oxytocin 10 IU", "Maternal Emergency", 0, 50, "ampoules", StockStatus.OUT_OF_STOCK, "2026-09-30"),
                createStock("stk-08", "Oral Rehydration Salts (ORS)", "Gastrointestinal", 650, 150, "sachets", StockStatus.AVAILABLE, "2028-01-31"),
                createStock("stk-09", "Tab. Atorvastatin 10mg", "Cardiovascular", 400, 150, "tablets", StockStatus.AVAILABLE, "2027-06-30"),
                createStock("stk-10", "Inj. Tetanus Toxoid (TT)", "Vaccine", 180, 50, "vials", StockStatus.AVAILABLE, "2027-04-30")
        );
        stockRepository.saveAll(stocks);

        // 9. Seed Diagnostic Tests
        List<DiagnosticTest> tests = List.of(
                createTest("diag-01", "Complete Blood Count (CBC & Hemoglobin)", "Automated cell counter evaluation"),
                createTest("diag-02", "Random & Fasting Blood Sugar (FBS/PPBS)", "Glucose monitor evaluation"),
                createTest("diag-03", "12-Lead Electrocardiogram (ECG)", "Digital cardiac telemetry"),
                createTest("diag-04", "Lipid Profile & Serum Creatinine", "Biochemistry panel"),
                createTest("diag-05", "Sputum AFB Smear (TB Screening)", "Ziehl-Neelsen staining")
        );
        diagnosticTestRepository.saveAll(tests);

        log.info("Synthetic database seeding complete. 50+ patients, 5 facilities, 10 stock items, and 25 live queue tokens loaded.");
    }

    private User createUser(String id, String username, String passHash, String name, UserRole role, String phone, String email, String facId, String facName, String district, String lang) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setPasswordHash(passHash);
        u.setFullName(name);
        u.setRole(role);
        u.setPhone(phone);
        u.setEmail(email);
        u.setFacilityId(facId);
        u.setFacilityName(facName);
        u.setDistrict(district);
        u.setPreferredLanguage(lang);
        u.setEnabled(true);
        return u;
    }

    private Facility createFacility(String id, String code, String name, FacilityType type, String addr, String village, String district, double lat, double lng) {
        Facility f = new Facility();
        f.setId(id);
        f.setFacilityCode(code);
        f.setName(name);
        f.setFacilityType(type);
        f.setAddress(addr);
        f.setVillage(village);
        f.setDistrict(district);
        f.setState("Maharashtra");
        f.setLatitude(lat);
        f.setLongitude(lng);
        f.setActive(true);
        return f;
    }

    private Patient createPatient(String id, String code, String name, int age, String gender, String phone, String village, String chronic, String relevant, boolean isPreg, Integer trimester, int riskScore, RiskLevel riskLevel, ClinicalPriority clinicalPriority, InterventionPriority interventionPriority, double dist, int totalApts, int missedApts, String lastDate, String nextDate, String refId) {
        Patient p = new Patient();
        p.setId(id);
        p.setPatientCode(code);
        p.setFullName(name);
        p.setAge(age);
        p.setGender(gender);
        p.setPhone(phone);
        p.setAddress("Gram Panchayat Area, " + village);
        p.setVillage(village);
        p.setDistrict("Pune");
        p.setState("Maharashtra");
        p.setChronicConditionDetails(chronic);
        p.setRelevantConditions(relevant);
        p.setPregnant(isPreg);
        p.setPregnancyTrimester(trimester);
        p.setPreferredLanguage("mr");
        p.setFollowupRiskScore(riskScore);
        p.setFollowupRiskLevel(riskLevel);
        p.setClinicalPriority(clinicalPriority);
        p.setInterventionPriority(interventionPriority);
        p.setDistanceFromFacilityKm(dist);
        p.setTotalAppointments(totalApts);
        p.setMissedAppointments(missedApts);
        p.setLastAppointmentDate(lastDate != null ? LocalDate.parse(lastDate) : null);
        p.setNextAppointmentDate(nextDate != null ? LocalDate.parse(nextDate) : null);
        p.setActiveReferralId(refId);
        p.setRegisteredDate(LocalDate.now().minusMonths(2));
        p.setRegisteredBy("Savita Kamble (ASHA)");
        p.setSyncedOffline(false);
        return p;
    }

    private Referral createReferral(String id, String code, String pId, String pName, int age, String gender, String orig, String dest, String dept, String reason, ReferralPriority priority, ReferralStatus status) {
        Referral r = new Referral();
        r.setId(id);
        r.setReferralCode(code);
        r.setPatientId(pId);
        r.setPatientName(pName);
        r.setPatientAge(age);
        r.setPatientGender(gender);
        r.setFromFacilityId("fac-phc-junnar");
        r.setOriginFacility(orig);
        r.setToFacilityId("fac-dh-aundh");
        r.setDestinationFacility(dest);
        r.setDepartment(dept);
        r.setReason(reason);
        r.setPriority(priority);
        r.setStatus(status);
        r.setReferralDate(LocalDate.now().minusDays(5));
        r.setReferringDoctorId("usr-doctor-1");
        r.setReferringDoctorName("Dr. Rajesh Deshmukh (MBBS, MD)");
        return r;
    }

    private FollowUp createFollowUp(String id, String pId, String pName, String date, String reason, FollowUpStatus status) {
        FollowUp f = new FollowUp();
        f.setId(id);
        f.setPatientId(pId);
        f.setPatientName(pName);
        f.setDoctorId("usr-doctor-1");
        f.setFacilityId("fac-phc-junnar");
        f.setFollowUpDate(LocalDate.parse(date));
        f.setReason(reason);
        f.setFrequency("Bi-weekly");
        f.setTreatmentDuration("30 days");
        f.setStatus(status);
        return f;
    }

    private MedicineStock createStock(String id, String name, String category, int qty, int threshold, String unit, StockStatus status, String expiry) {
        MedicineStock s = new MedicineStock();
        s.setId(id);
        s.setFacilityId("fac-phc-junnar");
        s.setFacilityName("PHC Junnar, Pune");
        s.setMedicineId(id.replace("stk", "med"));
        s.setName(name);
        s.setCategory(category);
        s.setQuantity(qty);
        s.setMinimumThreshold(threshold);
        s.setUnit(unit);
        s.setStatus(status);
        s.setExpiryDate(LocalDate.parse(expiry));
        s.setLastUpdated(LocalDateTime.now());
        return s;
    }

    private DiagnosticTest createTest(String id, String name, String desc) {
        DiagnosticTest t = new DiagnosticTest();
        t.setId(id);
        t.setName(name);
        t.setDescription(desc);
        t.setCategory("Pathology");
        t.setActive(true);
        return t;
    }
}
