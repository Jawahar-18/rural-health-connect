import type { 
  Patient, 
  Referral, 
  Appointment, 
  Prescription, 
  MedicineStock, 
  DiagnosticEquipment, 
  FacilityKPI,
  TriageRecord,
  ReferralStatus,
  AppointmentStatus,
  PatientFeedback,
  FeedbackStatus,
  NotificationItem,
  UserRole
} from '../types';

import { 
  INITIAL_PATIENTS, 
  INITIAL_REFERRALS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_MEDICINE_STOCK, 
  INITIAL_DIAGNOSTICS, 
  DISTRICT_FACILITY_KPIS,
  INITIAL_FEEDBACKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRIAGE_RECORDS
} from '../data/mockData';

// API Base URL for Java Spring Boot Backend
const API_BASE_URL = 'http://localhost:8080/api';

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: 'rhc_patients_v1',
  REFERRALS: 'rhc_referrals_v1',
  APPOINTMENTS: 'rhc_appointments_v1',
  PRESCRIPTIONS: 'rhc_prescriptions_v1',
  STOCK: 'rhc_stock_v1',
  DIAGNOSTICS: 'rhc_diagnostics_v1',
  TRIAGE: 'rhc_triage_v1',
  FEEDBACK: 'rhc_feedback_v1',
  NOTIFICATIONS: 'rhc_notifications_v1',
  OFFLINE_QUEUE: 'rhc_offline_queue_v1',
  AUTH_TOKEN: 'rhc_jwt_token_v1',
};

// Helper for localstorage load with fallback
function loadData<T>(key: string, initialData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed reading localStorage key ${key}:`, err);
    return initialData;
  }
}

function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed writing to localStorage key ${key}:`, err);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to normalize patient records from backend DTO or local format
function normalizePatient(raw: any): Patient {
  const relevantConditions = Array.isArray(raw.relevantConditions)
    ? raw.relevantConditions
    : (raw.relevantConditions ? [String(raw.relevantConditions)] : []);

  const chronicConditions = Array.isArray(raw.chronicConditions)
    ? raw.chronicConditions
    : (raw.chronicConditions ? [String(raw.chronicConditions)] : []);

  return {
    id: String(raw.id || `pat-${Date.now()}`),
    name: String(raw.name || 'Unnamed Patient'),
    age: Number(raw.age) || 30,
    gender: raw.gender === 'Male' || raw.gender === 'Female' ? raw.gender : 'Other',
    phone: String(raw.phone || ''),
    address: String(raw.address || `Gram Panchayat Area, ${raw.village || 'Junnar'}`),
    village: String(raw.village || 'Junnar'),
    emergencyContact: String(raw.emergencyContact || 'Family Member'),
    relevantConditions,
    isPregnant: Boolean(raw.isPregnant ?? raw.pregnant ?? false),
    pregnancyTrimester: raw.pregnancyTrimester ? (Number(raw.pregnancyTrimester) as 1 | 2 | 3) : undefined,
    chronicConditions,
    preferredLanguage: (raw.preferredLanguage as any) || 'mr',
    followupRiskScore: Number(raw.followupRiskScore) || 20,
    followupRiskLevel: raw.followupRiskLevel || 'LOW',
    clinicalPriority: raw.clinicalPriority || 'ROUTINE',
    interventionPriority: raw.interventionPriority || 'LOW',
    distanceKm: Number(raw.distanceKm) || 5,
    totalAppointments: Number(raw.totalAppointments) || 1,
    missedAppointments: Number(raw.missedAppointments) || 0,
    lastAppointmentDate: raw.lastAppointmentDate || undefined,
    nextAppointmentDate: raw.nextAppointmentDate || undefined,
    activeReferralId: raw.activeReferralId || undefined,
    registeredDate: raw.registeredDate || new Date().toISOString().split('T')[0],
    syncedOffline: Boolean(raw.syncedOffline),
    isArchived: Boolean(raw.isArchived ?? raw.archived ?? false),
    archivedReason: raw.archivedReason || undefined,
    archivedDate: raw.archivedDate || undefined,
    consecutiveFollowupsCompleted: Number(raw.consecutiveFollowupsCompleted) || 0,
    consecutiveFollowupsMissed: Number(raw.consecutiveFollowupsMissed) || 0,
    totalFollowupsAttended: Number(raw.totalFollowupsAttended) || 0,
    lastFeedbackStatus: raw.lastFeedbackStatus || undefined,
  };
}

export const apiService = {
  // Check if Spring Boot MySQL backend is reachable
  isBackendOnline: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth Token & Backend Login
  login: async (username: string, pass: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          apiService.setToken(data.token);
          console.log(`[RHC] Authenticated with MySQL Spring Boot backend as: ${username}`);
          return data.token;
        }
      }
    } catch (err) {
      console.debug('[RHC] Backend currently offline, operating with local fallback cache:', err);
    }
    return null;
  },

  setToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  clearToken: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Patients
  getPatients: (): Patient[] => {
    const rawList = loadData<any[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    return rawList.map(normalizePatient);
  },

  getPatientById: (id: string): Patient | undefined => {
    const patients = apiService.getPatients();
    return patients.find(p => p.id === id);
  },

  registerPatient: async (patientData: Omit<Patient, 'id' | 'registeredDate'> & { isOffline?: boolean }): Promise<Patient> => {
    const patients = apiService.getPatients();
    const tempId = `pat-${Date.now().toString().slice(-4)}`;
    
    // Create optimistic local representation
    let newPatient: Patient = normalizePatient({
      ...patientData,
      id: tempId,
      registeredDate: new Date().toISOString().split('T')[0],
      syncedOffline: patientData.isOffline || false,
    });

    // Save immediately to local cache for instant UI feedback
    patients.unshift(newPatient);
    saveData(STORAGE_KEYS.PATIENTS, patients);
    window.dispatchEvent(new CustomEvent('rhc_data_synced', { detail: { count: patients.length, patient: newPatient } }));

    if (patientData.isOffline) {
      apiService.enqueueOfflineRecord({ type: 'PATIENT_REGISTRATION', payload: newPatient });
      return newPatient;
    }

    try {
      // Send to Spring Boot backend for MySQL persistence
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newPatient.name,
          age: newPatient.age,
          gender: newPatient.gender,
          phone: newPatient.phone,
          address: newPatient.address,
          village: newPatient.village,
          emergencyContact: newPatient.emergencyContact,
          relevantConditions: newPatient.relevantConditions,
          isPregnant: newPatient.isPregnant,
          pregnancyTrimester: newPatient.pregnancyTrimester,
          chronicConditions: newPatient.chronicConditions,
          preferredLanguage: newPatient.preferredLanguage,
          distanceKm: newPatient.distanceKm,
        }),
      });

      if (res.ok) {
        const savedDto = await res.json();
        const savedPatient = normalizePatient(savedDto);
        console.log('[RHC] Patient successfully persisted to MySQL database with ID:', savedPatient.id);

        // Replace optimistic record with canonical backend record (proper MySQL ID + AI risk score)
        const currentList = apiService.getPatients();
        const updatedList = currentList.map(p => p.id === tempId ? savedPatient : p);
        saveData(STORAGE_KEYS.PATIENTS, updatedList);
        window.dispatchEvent(new CustomEvent('rhc_data_synced', { detail: { count: updatedList.length, patient: savedPatient } }));
        return savedPatient;
      } else {
        console.warn('[RHC] Backend returned non-200 for patient save:', res.status);
      }
    } catch (err) {
      console.debug('[RHC] Backend currently unreachable, patient retained in local queue:', err);
      apiService.enqueueOfflineRecord({ type: 'PATIENT_REGISTRATION', payload: newPatient });
    }

    return newPatient;
  },

  updatePatient: (id: string, updates: Partial<Patient>): Patient | undefined => {
    const patients = apiService.getPatients();
    const idx = patients.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    patients[idx] = { ...patients[idx], ...updates };
    saveData(STORAGE_KEYS.PATIENTS, patients);

    fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    }).catch(err => console.debug('Backend offline, patient updated locally:', err));

    return patients[idx];
  },

  // Referrals
  getReferrals: (): Referral[] => {
    return loadData<Referral[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  },

  createReferral: (referralData: Omit<Referral, 'id' | 'createdDate' | 'status'>): Referral => {
    const referrals = apiService.getReferrals();
    const newReferral: Referral = {
      ...referralData,
      id: `ref-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'CREATED',
    };
    referrals.unshift(newReferral);
    saveData(STORAGE_KEYS.REFERRALS, referrals);

    // Update patient activeReferralId
    apiService.updatePatient(referralData.patientId, { activeReferralId: newReferral.id });

    fetch(`${API_BASE_URL}/referrals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: referralData.patientId,
        patientName: referralData.patientName,
        patientAge: referralData.patientAge,
        patientGender: referralData.patientGender,
        originFacility: referralData.originFacility,
        destinationFacility: referralData.destinationFacility,
        department: referralData.department,
        reason: referralData.reason,
        priority: referralData.priority,
      }),
    }).catch(err => console.debug('Backend offline, referral saved locally:', err));

    return newReferral;
  },

  updateReferralStatus: (id: string, status: ReferralStatus, notes?: string): Referral | undefined => {
    const referrals = apiService.getReferrals();
    const idx = referrals.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    referrals[idx].status = status;
    if (notes) referrals[idx].notes = notes;
    if (status === 'COMPLETED') referrals[idx].completedDate = new Date().toISOString().split('T')[0];
    saveData(STORAGE_KEYS.REFERRALS, referrals);

    fetch(`${API_BASE_URL}/referrals/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    }).catch(err => console.debug('Backend offline, referral status updated locally:', err));

    return referrals[idx];
  },

  // Appointments & Live Queue
  getAppointments: (): Appointment[] => {
    return loadData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  bookAppointment: (aptData: Omit<Appointment, 'id' | 'tokenNumber' | 'status'>): Appointment => {
    const appointments = apiService.getAppointments();
    const tokenNumber = `A-${100 + appointments.length + 1}`;
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now().toString().slice(-4)}`,
      tokenNumber,
      status: 'SCHEDULED',
      queuePosition: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN').length + 1,
      estimatedWaitMinutes: (appointments.length + 1) * 15,
    };
    appointments.push(newApt);
    saveData(STORAGE_KEYS.APPOINTMENTS, appointments);

    fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: aptData.patientId,
        doctorId: aptData.doctorId,
        facilityId: aptData.facilityId,
        department: aptData.department,
        date: aptData.date,
        timeSlot: aptData.timeSlot,
        priority: aptData.priority,
      }),
    }).catch(err => console.debug('Backend offline, appointment booked locally:', err));

    return newApt;
  },

  updateAppointmentStatus: (id: string, status: AppointmentStatus): Appointment | undefined => {
    const appointments = apiService.getAppointments();
    const idx = appointments.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    appointments[idx].status = status;
    saveData(STORAGE_KEYS.APPOINTMENTS, appointments);

    fetch(`${API_BASE_URL}/appointments/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).catch(err => console.debug('Backend offline, appointment status updated locally:', err));

    return appointments[idx];
  },

  // Prescriptions
  getPrescriptions: (): Prescription[] => {
    return loadData<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },

  createPrescription: (rxData: Omit<Prescription, 'id' | 'date'>): Prescription => {
    const prescriptions = apiService.getPrescriptions();
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };
    prescriptions.unshift(newRx);
    saveData(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);

    if (rxData.followUpDate) {
      apiService.updatePatient(rxData.patientId, { nextAppointmentDate: rxData.followUpDate });
    }

    fetch(`${API_BASE_URL}/medical-records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: rxData.patientId,
        diagnosis: rxData.diagnosis,
        clinicalNotes: rxData.clinicalNotes,
        followUpDate: rxData.followUpDate,
        items: rxData.items,
      }),
    }).catch(err => console.debug('Backend offline, prescription created locally:', err));

    return newRx;
  },

  // Medicine Inventory
  getMedicineStock: (): MedicineStock[] => {
    return loadData<MedicineStock[]>(STORAGE_KEYS.STOCK, INITIAL_MEDICINE_STOCK);
  },

  updateMedicineStock: (id: string, newStock: number): MedicineStock | undefined => {
    const stock = apiService.getMedicineStock();
    const idx = stock.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    stock[idx].currentStock = newStock;
    if (newStock === 0) {
      stock[idx].status = 'OUT_OF_STOCK';
    } else if (newStock <= stock[idx].minThreshold) {
      stock[idx].status = 'LOW_STOCK';
    } else {
      stock[idx].status = 'AVAILABLE';
    }
    saveData(STORAGE_KEYS.STOCK, stock);

    fetch(`${API_BASE_URL}/medicines/stock/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newStock }),
    }).catch(err => console.debug('Backend offline, stock updated locally:', err));

    return stock[idx];
  },

  // Diagnostics
  getDiagnosticEquipment: (): DiagnosticEquipment[] => {
    return loadData<DiagnosticEquipment[]>(STORAGE_KEYS.DIAGNOSTICS, INITIAL_DIAGNOSTICS);
  },

  // Triage Records
  saveTriageRecord: (record: Omit<TriageRecord, 'id' | 'date'>): TriageRecord => {
    const records = loadData<TriageRecord[]>(STORAGE_KEYS.TRIAGE, INITIAL_TRIAGE_RECORDS);
    const newRecord: TriageRecord = {
      ...record,
      id: `trg-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    records.unshift(newRecord);
    saveData(STORAGE_KEYS.TRIAGE, records);

    apiService.updatePatient(record.patientId, { clinicalPriority: record.clinicalPriority });

    fetch(`${API_BASE_URL}/triage`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: record.patientId,
        patientName: record.patientName,
        symptoms: record.symptoms,
        vitals: record.vitals,
        clinicalPriority: record.clinicalPriority,
        triageLevel: record.triageLevel,
        reasons: record.reasons,
        recommendedAction: record.recommendedAction,
        overriddenByClinician: record.overriddenByClinician,
        overrideReason: record.overrideReason,
      }),
    }).catch(err => console.debug('Backend offline, triage saved locally:', err));

    return newRecord;
  },

  getTriageRecords: (patientId?: string): TriageRecord[] => {
    const records = loadData<TriageRecord[]>(STORAGE_KEYS.TRIAGE, INITIAL_TRIAGE_RECORDS);
    if (patientId) {
      return records.filter(r => r.patientId === patientId);
    }
    return records;
  },

  // Facility KPIs & District Analytics
  getFacilityKPIs: (): FacilityKPI[] => {
    return DISTRICT_FACILITY_KPIS;
  },

  // Offline Queue
  getOfflineQueue: (): any[] => {
    return loadData<any[]>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },

  enqueueOfflineRecord: (item: { type: string; payload: any }) => {
    const queue = apiService.getOfflineQueue();
    queue.push({ id: `off-${Date.now()}`, ...item, timestamp: new Date().toISOString() });
    saveData(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  clearOfflineQueue: async (): Promise<number> => {
    const queue = apiService.getOfflineQueue();
    const count = queue.length;

    if (count > 0) {
      try {
        await fetch(`${API_BASE_URL}/sync/batch`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ items: queue }),
        });
      } catch (err) {
        console.debug('Backend sync attempt complete:', err);
      }
    }

    saveData(STORAGE_KEYS.OFFLINE_QUEUE, []);
    const patients = apiService.getPatients();
    const updated = patients.map(p => ({ ...p, syncedOffline: false }));
    saveData(STORAGE_KEYS.PATIENTS, updated);

    return count;
  },

  // Async synchronizer to refresh local storage from Spring Boot MySQL backend if accessible
  syncWithBackend: async (): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const headers = getAuthHeaders();
      const [patRes, refRes, stockRes, fbRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/patients`, { headers }),
        fetch(`${API_BASE_URL}/referrals`, { headers }),
        fetch(`${API_BASE_URL}/medicines/availability`, { headers }),
        fetch(`${API_BASE_URL}/feedback`, { headers }),
      ]);

      let syncedCount = 0;

      if (patRes.status === 'fulfilled' && patRes.value.ok) {
        const remotePatientsRaw = await patRes.value.json();
        if (Array.isArray(remotePatientsRaw)) {
          let remotePatients = remotePatientsRaw.map(normalizePatient);
          const localPatients = apiService.getPatients();

          // Identify any local patient not yet in MySQL (check ID or Phone)
          const unsyncedLocals = localPatients.filter(localPt => {
            const hasRemoteMatch = remotePatients.some(remPt => 
              remPt.id === localPt.id || 
              (localPt.phone && remPt.phone && localPt.phone.replace(/\s+/g, '') === remPt.phone.replace(/\s+/g, ''))
            );
            return !hasRemoteMatch;
          });

          // Upload any unsaved local patients to MySQL
          for (const unsavedPt of unsyncedLocals) {
            try {
              const postRes = await fetch(`${API_BASE_URL}/patients`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  name: unsavedPt.name,
                  age: unsavedPt.age,
                  gender: unsavedPt.gender,
                  phone: unsavedPt.phone,
                  address: unsavedPt.address,
                  village: unsavedPt.village,
                  emergencyContact: unsavedPt.emergencyContact,
                  relevantConditions: unsavedPt.relevantConditions,
                  isPregnant: unsavedPt.isPregnant,
                  pregnancyTrimester: unsavedPt.pregnancyTrimester,
                  chronicConditions: unsavedPt.chronicConditions,
                  preferredLanguage: unsavedPt.preferredLanguage,
                  distanceKm: unsavedPt.distanceKm,
                }),
              });
              if (postRes.ok) {
                const createdRemoteDto = await postRes.json();
                const createdRemote = normalizePatient(createdRemoteDto);
                remotePatients.unshift(createdRemote);
                console.log(`[RHC] Auto-synced local patient "${unsavedPt.name}" into MySQL database.`);
              }
            } catch (postErr) {
              console.warn(`[RHC] Could not auto-sync patient ${unsavedPt.name} to MySQL:`, postErr);
            }
          }

          saveData(STORAGE_KEYS.PATIENTS, remotePatients);
          syncedCount = remotePatients.length;
          console.log(`[RHC] Successfully synchronized ${syncedCount} patients with MySQL database.`);
          window.dispatchEvent(new CustomEvent('rhc_data_synced', { detail: { count: syncedCount, timestamp: Date.now() } }));
        }
      }

      if (refRes.status === 'fulfilled' && refRes.value.ok) {
        const refs = await refRes.value.json();
        if (Array.isArray(refs) && refs.length > 0) {
          saveData(STORAGE_KEYS.REFERRALS, refs);
        }
      }

      if (stockRes.status === 'fulfilled' && stockRes.value.ok) {
        const stock = await stockRes.value.json();
        if (Array.isArray(stock) && stock.length > 0) {
          saveData(STORAGE_KEYS.STOCK, stock);
        }
      }

      if (fbRes.status === 'fulfilled' && fbRes.value.ok) {
        const feedbacks = await fbRes.value.json();
        if (Array.isArray(feedbacks) && feedbacks.length > 0) {
          saveData(STORAGE_KEYS.FEEDBACK, feedbacks);
        }
      }

      return { success: true, count: syncedCount };
    } catch (err) {
      console.debug('[RHC] Background sync skipped (offline or server unreachable):', err);
      return { success: false, count: 0, error: String(err) };
    }
  },

  // Patient Feedback & Retention Center
  getFeedbacks: (): PatientFeedback[] => {
    return loadData<PatientFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACKS);
  },

  submitFeedback: (feedbackData: Omit<PatientFeedback, 'id' | 'createdAt' | 'status'> & { status?: FeedbackStatus }): PatientFeedback => {
    const feedbacks = apiService.getFeedbacks();
    const newFeedback: PatientFeedback = {
      ...feedbackData,
      id: `fb-${Date.now().toString().slice(-4)}`,
      status: feedbackData.status || (feedbackData.refusesFollowUp || feedbackData.satisfactionLevel === 'DISSATISFIED' ? 'ACTION_REQUIRED' : 'NEW'),
      createdAt: new Date().toISOString(),
    };

    feedbacks.unshift(newFeedback);
    saveData(STORAGE_KEYS.FEEDBACK, feedbacks);

    // Update patient retention metrics
    const patient = apiService.getPatientById(feedbackData.patientId);
    if (patient) {
      const updates: Partial<Patient> = {};
      if (feedbackData.refusesFollowUp) {
        updates.lastFeedbackStatus = 'REFUSED_FOLLOW_UP';
        const missed = (patient.consecutiveFollowupsMissed || 0) + 1;
        updates.consecutiveFollowupsMissed = missed;
        updates.consecutiveFollowupsCompleted = 0;

        // Auto-archive if 5+ consecutive refusals / missed follow-ups
        if (missed >= 5) {
          updates.isArchived = true;
          updates.archivedReason = `Continuous follow-up refusal / non-attendance (${missed} consecutive sessions missed)`;
          updates.archivedDate = new Date().toISOString().split('T')[0];
        }
      } else if (feedbackData.satisfactionLevel === 'DISSATISFIED') {
        updates.lastFeedbackStatus = 'DISSATISFIED_WITH_TREATMENT';
      } else {
        updates.lastFeedbackStatus = 'SATISFIED';
      }

      apiService.updatePatient(patient.id, updates);
    }

    // Sync to backend
    fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: feedbackData.patientId,
        patientName: feedbackData.patientName,
        patientPhone: feedbackData.patientPhone,
        callId: feedbackData.callId,
        callAttended: feedbackData.callAttended,
        satisfactionLevel: feedbackData.satisfactionLevel,
        refusesFollowUp: feedbackData.refusesFollowUp,
        refusalReason: feedbackData.refusalReason,
        feedbackNotes: feedbackData.feedbackNotes,
        recordedByName: feedbackData.recordedByName,
        recordedByRole: feedbackData.recordedByRole,
      }),
    }).catch(err => console.debug('Backend offline, feedback stored in local cache:', err));

    return newFeedback;
  },

  reviewFeedback: (id: string, status: FeedbackStatus, adminReviewNotes: string): PatientFeedback | undefined => {
    const feedbacks = apiService.getFeedbacks();
    const idx = feedbacks.findIndex(f => f.id === id);
    if (idx === -1) return undefined;

    feedbacks[idx].status = status;
    feedbacks[idx].adminReviewNotes = adminReviewNotes;
    feedbacks[idx].reviewedAt = new Date().toISOString();
    saveData(STORAGE_KEYS.FEEDBACK, feedbacks);

    fetch(`${API_BASE_URL}/feedback/${id}/review`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminReviewNotes }),
    }).catch(err => console.debug('Backend offline, feedback review stored locally:', err));

    return feedbacks[idx];
  },

  archivePatient: (patientId: string, reason: string): Patient | undefined => {
    const updates: Partial<Patient> = {
      isArchived: true,
      archivedReason: reason,
      archivedDate: new Date().toISOString().split('T')[0],
    };
    return apiService.updatePatient(patientId, updates);
  },

  unarchivePatient: (patientId: string): Patient | undefined => {
    const updates: Partial<Patient> = {
      isArchived: false,
      archivedReason: undefined,
      archivedDate: undefined,
      consecutiveFollowupsMissed: 0,
    };
    return apiService.updatePatient(patientId, updates);
  },

  recordFollowUpVisit: (patientId: string, attended: boolean): Patient | undefined => {
    const patient = apiService.getPatientById(patientId);
    if (!patient) return undefined;

    const updates: Partial<Patient> = {};
    if (attended) {
      const completed = (patient.consecutiveFollowupsCompleted || 0) + 1;
      updates.consecutiveFollowupsCompleted = completed;
      updates.totalFollowupsAttended = (patient.totalFollowupsAttended || 0) + 1;
      updates.consecutiveFollowupsMissed = 0;

      // Auto-archive patient if 5-6 continuous follow-ups completed
      if (completed >= 5) {
        updates.isArchived = true;
        updates.archivedReason = `Completed continuous follow-up course (${completed} consecutive sessions attended)`;
        updates.archivedDate = new Date().toISOString().split('T')[0];
      }
    } else {
      const missed = (patient.consecutiveFollowupsMissed || 0) + 1;
      updates.consecutiveFollowupsMissed = missed;
      updates.consecutiveFollowupsCompleted = 0;

      // Auto-archive if 5+ consecutive missed
      if (missed >= 5) {
        updates.isArchived = true;
        updates.archivedReason = `Continuous follow-up non-attendance (${missed} consecutive sessions missed)`;
        updates.archivedDate = new Date().toISOString().split('T')[0];
      }
    }

    return apiService.updatePatient(patientId, updates);
  },

  // Notifications
  getNotifications: (role?: UserRole): NotificationItem[] => {
    const list = loadData<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!role) return list;
    return list.filter(n => !n.targetRoles || n.targetRoles.length === 0 || n.targetRoles.includes(role));
  },

  markNotificationRead: (id: string): void => {
    const list = loadData<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
    window.dispatchEvent(new CustomEvent('rhc_notifications_updated', { detail: { id } }));

    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).catch(err => console.debug('Backend offline, notification read marked locally:', err));
  },

  markAllNotificationsRead: (role?: UserRole): void => {
    const list = loadData<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => {
      if (!role || !n.targetRoles || n.targetRoles.includes(role)) {
        return { ...n, read: true };
      }
      return n;
    });
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
    window.dispatchEvent(new CustomEvent('rhc_notifications_updated', { detail: { all: true } }));
  }
};
