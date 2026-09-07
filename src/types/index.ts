export type UserRole = 
  | 'PATIENT'
  | 'HEALTH_WORKER'
  | 'DOCTOR'
  | 'FACILITY_ADMIN'
  | 'DISTRICT_ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  facilityId?: string;
  facilityName?: string;
  district?: string;
  avatarUrl?: string;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type LanguageCode = 'en' | 'mr' | 'hi' | 'ta';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  address: string;
  village: string;
  emergencyContact: string;
  relevantConditions: string[];
  isPregnant: boolean;
  pregnancyTrimester?: 1 | 2 | 3;
  chronicConditions: string[];
  preferredLanguage: LanguageCode;
  
  // Risk & Priority indicators
  followupRiskScore: number; // 0 - 100
  followupRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  clinicalPriority: 'ROUTINE' | 'MODERATE' | 'HIGH' | 'URGENT';
  interventionPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  
  // Facility & location metrics
  distanceKm: number;
  totalAppointments: number;
  missedAppointments: number;
  lastAppointmentDate?: string;
  nextAppointmentDate?: string;
  activeReferralId?: string;
  
  // Registration metadata
  registeredBy?: string;
  registeredDate: string;
  syncedOffline?: boolean;
}

export interface Vitals {
  temperatureCelsius?: number; // e.g. 37.2
  bpSystolic?: number; // e.g. 120
  bpDiastolic?: number; // e.g. 80
  heartRateBpm?: number; // e.g. 72
  respRatePerMin?: number; // e.g. 18
  oxygenSatPercent?: number; // e.g. 98
  bloodSugarMgDl?: number; // e.g. 110
  weightKg?: number;
  heightCm?: number;
  hemoglobinGdl?: number; // maternal anemia tracker
}

export type TriageResultLevel = 'ROUTINE' | 'MODERATE' | 'HIGH' | 'URGENT';

export interface TriageRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  symptoms: string[];
  vitals: Vitals;
  clinicalPriority: TriageResultLevel;
  triageLevel: TriageResultLevel;
  reasons: string[];
  recommendedAction: string;
  overriddenByClinician?: boolean;
  overrideReason?: string;
  healthWorkerId: string;
  healthWorkerName: string;
}

export interface FollowupRiskOutput {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  explanations: string[];
  recommendedActions: string[];
}

export interface InterventionPriorityOutput {
  followupRiskScore: number;
  clinicalPriority: 'ROUTINE' | 'MODERATE' | 'HIGH' | 'URGENT';
  interventionPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedInterventions: string[];
}

export type ReferralStatus = 
  | 'CREATED'
  | 'ACCEPTED'
  | 'APPOINTMENT_BOOKED'
  | 'PATIENT_ATTENDED'
  | 'COMPLETED'
  | 'FOLLOW_UP_REQUIRED';

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  originFacility: string;
  destinationFacility: string;
  department: string;
  reason: string;
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  status: ReferralStatus;
  createdDate: string;
  appointmentDate?: string;
  completedDate?: string;
  referringDoctorId: string;
  referringDoctorName: string;
  receivingDoctorName?: string;
  notes?: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  department: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  priority: 'ROUTINE' | 'URGENT';
  queuePosition?: number;
  estimatedWaitMinutes?: number;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
  inStock?: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityName: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  items: PrescriptionItem[];
  followUpDate?: string;
}

export interface MedicineStock {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  expiryDate: string;
  facilityId: string;
  facilityName: string;
}

export interface DiagnosticEquipment {
  id: string;
  name: string;
  category: string;
  status: 'FUNCTIONAL' | 'MAINTENANCE' | 'UNAVAILABLE';
  turnaroundTimeHours: number;
  pendingReportsCount: number;
  facilityId: string;
  facilityName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'QUEUE' | 'REFERRAL' | 'FOLLOWUP' | 'RISK_ALERT' | 'STOCK_ALERT' | 'SYNC';
  timestamp: string;
  read: boolean;
  targetRoles: UserRole[];
}

export interface FacilityKPI {
  facilityId: string;
  facilityName: string;
  district: string;
  totalPatientsToday: number;
  avgWaitingTimeMinutes: number;
  appointmentsCompleted: number;
  pendingReferrals: number;
  referralCompletionRate: number;
  followupCompletionRate: number;
  medicineShortageCount: number;
  diagnosticShortageCount: number;
  highRiskPatientsCount: number;
}
