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
  AppointmentStatus
} from '../types';

import { 
  INITIAL_PATIENTS, 
  INITIAL_REFERRALS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_MEDICINE_STOCK, 
  INITIAL_DIAGNOSTICS, 
  DISTRICT_FACILITY_KPIS
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

export const apiService = {
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
    return loadData<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },

  getPatientById: (id: string): Patient | undefined => {
    const patients = apiService.getPatients();
    return patients.find(p => p.id === id);
  },

  registerPatient: (patientData: Omit<Patient, 'id' | 'registeredDate'> & { isOffline?: boolean }): Patient => {
    const patients = apiService.getPatients();
    const newId = `pat-${Date.now().toString().slice(-4)}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredDate: new Date().toISOString().split('T')[0],
      syncedOffline: patientData.isOffline || false,
    };

    patients.unshift(newPatient);
    saveData(STORAGE_KEYS.PATIENTS, patients);

    if (patientData.isOffline) {
      apiService.enqueueOfflineRecord({ type: 'PATIENT_REGISTRATION', payload: newPatient });
    } else {
      // Send to Spring Boot backend for MySQL persistence
      fetch(`${API_BASE_URL}/patients`, {
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
      })
      .then(async (res) => {
        if (res.ok) {
          const savedPatient = await res.json();
          console.log('[RHC] Patient successfully saved to MySQL database:', savedPatient);
          // Refresh patient directory from backend
          apiService.syncWithBackend();
        } else {
          console.warn('[RHC] Backend rejected patient save:', res.status, res.statusText);
        }
      })
      .catch(err => console.debug('[RHC] Backend offline, patient saved locally:', err));
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
    const records = loadData<TriageRecord[]>(STORAGE_KEYS.TRIAGE, []);
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
    const records = loadData<TriageRecord[]>(STORAGE_KEYS.TRIAGE, []);
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
  syncWithBackend: async (): Promise<void> => {
    try {
      const headers = getAuthHeaders();
      const [patRes, refRes, stockRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/patients`, { headers }),
        fetch(`${API_BASE_URL}/referrals`, { headers }),
        fetch(`${API_BASE_URL}/medicines/availability`, { headers }),
      ]);

      if (patRes.status === 'fulfilled' && patRes.value.ok) {
        const patients = await patRes.value.json();
        if (Array.isArray(patients) && patients.length > 0) {
          saveData(STORAGE_KEYS.PATIENTS, patients);
          console.log(`[RHC] Synchronized ${patients.length} patients from MySQL database.`);
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
    } catch (err) {
      console.debug('[RHC] Background sync skipped (offline or initial boot):', err);
    }
  }
};
