import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MultilingualProvider } from './context/MultilingualContext';
import { OfflineProvider } from './context/OfflineContext';
import { AppShell } from './components/common/AppShell';

import { LoginPage } from './pages/auth/LoginPage';

// Patient pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientAppointmentsView } from './pages/patient/PatientAppointmentsView';
import { PatientQueueView } from './pages/patient/PatientQueueView';
import { PatientRecordsView } from './pages/patient/PatientRecordsView';
import { PatientReferralsView } from './pages/patient/PatientReferralsView';
import { PatientPrescriptionsView } from './pages/patient/PatientPrescriptionsView';
import { PatientDiagnosticsView } from './pages/patient/PatientDiagnosticsView';
import { PatientMedicinesView } from './pages/patient/PatientMedicinesView';
import { PatientFollowupsView } from './pages/patient/PatientFollowupsView';
import { PatientNotificationsView } from './pages/patient/PatientNotificationsView';
import { PatientProfileView } from './pages/patient/PatientProfileView';

// Health Worker pages
import { WorkerDashboard } from './pages/health-worker/WorkerDashboard';
import { WorkerPatientDirectory } from './pages/health-worker/WorkerPatientDirectory';
import { WorkerRegisterPatient } from './pages/health-worker/WorkerRegisterPatient';
import { WorkerTriageHistory } from './pages/health-worker/WorkerTriageHistory';
import { WorkerAppointmentsSchedule } from './pages/health-worker/WorkerAppointmentsSchedule';
import { WorkerOfflineSync } from './pages/health-worker/WorkerOfflineSync';

// Doctor pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorConsultation } from './pages/doctor/DoctorConsultation';
import { DoctorPrescriptionsView } from './pages/doctor/DoctorPrescriptionsView';

// Facility Admin pages
import { FacilityDashboard } from './pages/facility/FacilityDashboard';
import { FacilityDiagnosticsView } from './pages/facility/FacilityDiagnosticsView';
import { FacilityReportsView } from './pages/facility/FacilityReportsView';

// District Admin pages
import { DistrictDashboard } from './pages/district/DistrictDashboard';
import { DistrictQualityView } from './pages/district/DistrictQualityView';
import { DistrictReportsView } from './pages/district/DistrictReportsView';

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

              {/* Patient Routes - Fully Isolated and Confidential */}
              <Route path="/patient/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="appointments" element={<PatientAppointmentsView />} />
                    <Route path="queue" element={<PatientQueueView />} />
                    <Route path="records" element={<PatientRecordsView />} />
                    <Route path="referrals" element={<PatientReferralsView />} />
                    <Route path="prescriptions" element={<PatientPrescriptionsView />} />
                    <Route path="diagnostics" element={<PatientDiagnosticsView />} />
                    <Route path="medicines" element={<PatientMedicinesView />} />
                    <Route path="followups" element={<PatientFollowupsView />} />
                    <Route path="feedback" element={<PatientDashboard />} />
                    <Route path="notifications" element={<PatientNotificationsView />} />
                    <Route path="profile" element={<PatientProfileView />} />
                    <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
                  </Routes>
                </AppShell>
              } />

              {/* Health Worker Routes - Distinct & Specialized Views */}
              <Route path="/worker/*" element={
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    <Route path="patients" element={<WorkerPatientDirectory />} />
                    <Route path="patients/register" element={<WorkerRegisterPatient />} />
                    <Route path="triage" element={<WorkerTriageHistory />} />
                    <Route path="appointments" element={<WorkerAppointmentsSchedule />} />
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
                    <Route path="prescriptions" element={<DoctorPrescriptionsView />} />
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
                    <Route path="diagnostics" element={<FacilityDiagnosticsView />} />
                    <Route path="referrals" element={<GenericModuleView title="Facility Referral Completion Rates" role="FACILITY_ADMIN" />} />
                    <Route path="feedback" element={<div className="space-y-4"><h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Patient Feedback & Retention Center</h1><AdminFeedbackCenter role="FACILITY_ADMIN" /></div>} />
                    <Route path="reports" element={<FacilityReportsView />} />
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
                    <Route path="quality" element={<DistrictQualityView />} />
                    <Route path="reports" element={<DistrictReportsView />} />
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
