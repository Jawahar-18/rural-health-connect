import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MultilingualProvider } from './context/MultilingualContext';
import { OfflineProvider } from './context/OfflineContext';
import { AppShell } from './components/common/AppShell';

import { LoginPage } from './pages/auth/LoginPage';

// Patient pages
import { PatientDashboard } from './pages/patient/PatientDashboard';

// Health Worker pages
import { WorkerDashboard } from './pages/health-worker/WorkerDashboard';
import { WorkerRegisterPatient } from './pages/health-worker/WorkerRegisterPatient';
import { WorkerOfflineSync } from './pages/health-worker/WorkerOfflineSync';

// Doctor pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorConsultation } from './pages/doctor/DoctorConsultation';

// Facility Admin pages
import { FacilityDashboard } from './pages/facility/FacilityDashboard';

// District Admin pages
import { DistrictDashboard } from './pages/district/DistrictDashboard';

// Shared Generic View for secondary sub-pages
import { GenericModuleView } from './pages/common/GenericModuleView';
import { AdminFeedbackCenter } from './components/admin/AdminFeedbackCenter';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MultilingualProvider>
          <OfflineProvider>
            <Routes>
              {/* Public Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Patient Routes */}
              <Route path="/patient/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="appointments" element={<GenericModuleView title="Patient Appointments & Slot Booking" role="PATIENT" />} />
                    <Route path="queue" element={<GenericModuleView title="Live Queue Status & Token Generator" role="PATIENT" />} />
                    <Route path="records" element={<GenericModuleView title="Longitudinal Medical Records & Lab History" role="PATIENT" />} />
                    <Route path="referrals" element={<GenericModuleView title="Referral Lifecycle & Continuity Tracking" role="PATIENT" />} />
                    <Route path="prescriptions" element={<GenericModuleView title="Digital Prescriptions & Dosage Instructions" role="PATIENT" />} />
                    <Route path="diagnostics" element={<GenericModuleView title="Diagnostics & Lab Report Status" role="PATIENT" />} />
                    <Route path="medicines" element={<GenericModuleView title="Local PHC Medicine Availability Finder" role="PATIENT" />} />
                    <Route path="followups" element={<GenericModuleView title="Upcoming & Completed Follow-ups" role="PATIENT" />} />
                    <Route path="feedback" element={<PatientDashboard />} />
                    <Route path="notifications" element={<GenericModuleView title="Patient Alerts & Notification Center" role="PATIENT" />} />
                    <Route path="profile" element={<GenericModuleView title="Patient Health Card & ABHA Profile" role="PATIENT" />} />
                    <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* Health Worker Routes */}
              <Route path="/worker/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    <Route path="patients" element={<GenericModuleView title="Rural Patient Directory" role="HEALTH_WORKER" />} />
                    <Route path="patients/register" element={<WorkerRegisterPatient />} />
                    <Route path="triage" element={<GenericModuleView title="Digital Triage Decision Support History" role="HEALTH_WORKER" />} />
                    <Route path="appointments" element={<GenericModuleView title="Community Appointments Schedule" role="HEALTH_WORKER" />} />
                    <Route path="referrals" element={<GenericModuleView title="Pending Outbound & Inbound Referrals" role="HEALTH_WORKER" />} />
                    <Route path="followups" element={<GenericModuleView title="High-Risk Follow-up Task List" role="HEALTH_WORKER" />} />
                    <Route path="high-risk" element={<GenericModuleView title="High-Risk & Vulnerable Patients Registry" role="HEALTH_WORKER" />} />
                    <Route path="offline-sync" element={<WorkerOfflineSync />} />
                    <Route path="*" element={<Navigate to="/worker/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* Doctor Routes */}
              <Route path="/doctor/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="queue" element={<DoctorDashboard />} />
                    <Route path="patients" element={<GenericModuleView title="Doctor Patient Records Directory" role="DOCTOR" />} />
                    <Route path="consultation/:patientId" element={<DoctorConsultation />} />
                    <Route path="consultation" element={<DoctorConsultation />} />
                    <Route path="referrals" element={<GenericModuleView title="Specialist Outbound & Inbound Referrals" role="DOCTOR" />} />
                    <Route path="prescriptions" element={<GenericModuleView title="Issued E-Prescriptions Log" role="DOCTOR" />} />
                    <Route path="followups" element={<GenericModuleView title="High-Priority Follow-up Alerts" role="DOCTOR" />} />
                    <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* Facility Admin Routes */}
              <Route path="/facility/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<FacilityDashboard />} />
                    <Route path="queue" element={<GenericModuleView title="Facility Queue Load & Wait Time Monitor" role="FACILITY_ADMIN" />} />
                    <Route path="appointments" element={<GenericModuleView title="Facility OPD Appointments Overview" role="FACILITY_ADMIN" />} />
                    <Route path="medicines" element={<GenericModuleView title="PHC Medicine Stock & Shortage Alert Center" role="FACILITY_ADMIN" />} />
                    <Route path="diagnostics" element={<GenericModuleView title="Diagnostic Equipment Maintenance & Lab Status" role="FACILITY_ADMIN" />} />
                    <Route path="referrals" element={<GenericModuleView title="Facility Referral Completion Rates" role="FACILITY_ADMIN" />} />
                    <Route path="feedback" element={<div className="space-y-4"><h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Patient Feedback & Retention Center</h1><AdminFeedbackCenter role="FACILITY_ADMIN" /></div>} />
                    <Route path="reports" element={<GenericModuleView title="Operational & Performance Reports" role="FACILITY_ADMIN" />} />
                    <Route path="*" element={<Navigate to="/facility/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* District Admin Routes */}
              <Route path="/district/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<DistrictDashboard />} />
                    <Route path="facilities" element={<GenericModuleView title="District PHC & CHC Facilities Directory" role="DISTRICT_ADMIN" />} />
                    <Route path="patients" element={<GenericModuleView title="District Aggregated Patient Trends" role="DISTRICT_ADMIN" />} />
                    <Route path="referrals" element={<GenericModuleView title="District Referral Completion Analytics" role="DISTRICT_ADMIN" />} />
                    <Route path="followups" element={<GenericModuleView title="Follow-up Completion Analytics" role="DISTRICT_ADMIN" />} />
                    <Route path="medicines" element={<GenericModuleView title="District Medicine Shortage Heatmap" role="DISTRICT_ADMIN" />} />
                    <Route path="feedback" element={<div className="space-y-4"><h1 className="text-2xl font-black text-slate-900 tracking-tight">District Patient Grievance & Refusal Center</h1><AdminFeedbackCenter role="DISTRICT_ADMIN" /></div>} />
                    <Route path="diagnostics" element={<GenericModuleView title="Diagnostic Availability Monitor" role="DISTRICT_ADMIN" />} />
                    <Route path="quality" element={<GenericModuleView title="Healthcare Quality & Governance Metrics" role="DISTRICT_ADMIN" />} />
                    <Route path="reports" element={<GenericModuleView title="District Annual & Monthly Healthcare Reports" role="DISTRICT_ADMIN" />} />
                    <Route path="*" element={<Navigate to="/district/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </OfflineProvider>
        </MultilingualProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
