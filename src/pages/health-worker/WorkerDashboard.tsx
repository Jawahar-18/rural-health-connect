import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import { useOffline } from '../../context/OfflineContext';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { RiskScoreCard } from '../../components/ai/RiskScoreCard';
import { TriageWizardModal } from '../../components/triage/TriageWizardModal';
import { 
  UserPlus, 
  Stethoscope, 
  AlertTriangle, 
  WifiOff, 
  Phone,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientContactModal } from '../../components/common/PatientContactModal';
import type { Patient } from '../../types';

export const WorkerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { pendingSyncCount, isOnline } = useOffline();
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContactPatient, setSelectedContactPatient] = useState<Patient | null>(null);
  const [contactDefaultTab, setContactDefaultTab] = useState<'call' | 'message'>('call');

  const [patients, setPatients] = useState<Patient[]>(() => apiService.getPatients());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncDb = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing...');
    try {
      const res = await apiService.syncWithBackend();
      if (res && res.success) {
        setPatients(apiService.getPatients());
        setSyncStatus(`MySQL Synced (${res.count})`);
      } else {
        setSyncStatus('Local cache');
      }
    } catch {
      setSyncStatus('Local cache');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  useEffect(() => {
    handleSyncDb();

    const onDataSynced = () => {
      setPatients(apiService.getPatients());
    };

    window.addEventListener('rhc_data_synced', onDataSynced);
    window.addEventListener('storage', onDataSynced);
    return () => {
      window.removeEventListener('rhc_data_synced', onDataSynced);
      window.removeEventListener('storage', onDataSynced);
    };
  }, []);

  const openContact = (patient: Patient, tab: 'call' | 'message') => {
    setSelectedContactPatient(patient);
    setContactDefaultTab(tab);
    setContactModalOpen(true);
  };

  const highRiskPatients = patients.filter(p => p.followupRiskLevel === 'HIGH' || p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT');
  const pendingReferrals = apiService.getReferrals().filter(r => r.status === 'CREATED' || r.status === 'ACCEPTED');

  return (
    <div className="space-y-6 font-sans">
      {/* Top Welcome & Quick Actions - Luminous Mint & Teal Gradient Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-900/10 border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-wider shadow-inner">
              {t('workerPortalTag')}
            </span>
            {!isOnline && (
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                <WifiOff className="w-3.5 h-3.5" /> {t('offlineMode')}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">{t('namaste')}, {currentUser.name}!</h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            {t('facility')}: <strong className="text-white">{currentUser.facilityName || 'PHC Junnar'}</strong> • {t('region')}: <strong className="text-white">{t('puneRuralSubDistrict')}</strong>
          </p>
        </div>

        {/* Quick Launch Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {syncStatus && (
            <span className="text-xs font-bold text-white bg-black/15 backdrop-blur-md px-3 py-2 rounded-xl border border-white/25">
              {syncStatus}
            </span>
          )}
          <button
            onClick={handleSyncDb}
            disabled={isSyncing}
            title="Refresh and sync patients with database"
            className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 text-xs sm:text-sm font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:scale-102 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-100 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync DB'}
          </button>
          <button
            onClick={() => setTriageModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white hover:bg-teal-50 text-teal-950 text-xs sm:text-sm font-black py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-teal-700" /> {t('startTriage')}
          </button>
          <Link
            to="/worker/patients/register"
            className="flex-1 sm:flex-initial bg-teal-800/80 hover:bg-teal-800 text-white border border-white/30 text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4 text-emerald-200" /> {t('registerPatient')}
          </Link>
        </div>
      </div>

      {/* Priority KPI Cards Grid - Smooth & Light Refined Shadows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('totalPatients')}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{patients.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">{t('villageCohort')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50/40 p-5 rounded-3xl border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-rose-700 uppercase tracking-wider">{t('highRiskPatients')}</div>
          <div className="text-3xl font-black text-rose-600 mt-2">{highRiskPatients.length}</div>
          <div className="text-xs text-rose-700 font-bold mt-1">{t('immediateOutreach')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/40 p-5 rounded-3xl border border-emerald-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">{t('pendingReferrals')}</div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{pendingReferrals.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">{t('continuityTracking')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50/40 p-5 rounded-3xl border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-amber-700 uppercase tracking-wider">{t('missedVisits')}</div>
          <div className="text-3xl font-black text-amber-600 mt-2">
            {patients.reduce((acc, p) => acc + (p.missedAppointments > 0 ? 1 : 0), 0)}
          </div>
          <div className="text-xs text-amber-700 font-bold mt-1">{t('followupDue')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-teal-50/40 p-5 rounded-3xl border border-teal-200/80 hover:border-teal-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 col-span-2 sm:col-span-1">
          <div className="text-xs font-black text-teal-800 uppercase tracking-wider">{t('offlineRecords')}</div>
          <div className="text-3xl font-black text-teal-700 mt-2">{pendingSyncCount}</div>
          <Link to="/worker/offline-sync" className="text-xs text-teal-800 font-black hover:underline mt-1 block">
            {t('viewSyncStatus')} →
          </Link>
        </div>
      </div>

      {/* High Priority Patients & AI Decision Support Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="font-black text-slate-900 text-base sm:text-lg">{t('highPriorityAlertList')}</h2>
          </div>
          <Link to="/worker/high-risk" className="text-xs sm:text-sm font-black text-gov-green-700 hover:underline">
            {t('viewFullList')} ({highRiskPatients.length}) →
          </Link>
        </div>

        <div className="space-y-4">
          {highRiskPatients.slice(0, 3).map((pt) => (
            <div key={pt.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm">
                    {pt.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {pt.name} ({pt.gender}, {pt.age} yrs)
                      {pt.isPregnant && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {t('pregnant')} (T{pt.pregnancyTrimester || 2})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>📍 {pt.village} ({pt.distanceKm} km)</span>
                      <span>• {t('missedVisits')}: <strong className="text-rose-600">{pt.missedAppointments}</strong></span>
                    </div>
                  </div>
                </div>
                <PriorityBadge priority={pt.clinicalPriority} size="md" />
              </div>

              {/* AI Risk Component embedded */}
              <RiskScoreCard patient={pt} />

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => openContact(pt, 'call')}
                  className="px-3 py-1.5 bg-gov-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gov-green-800 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> {t('call')} ({pt.phone})
                </button>
                <button
                  onClick={() => openContact(pt, 'message')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> {t('message')}
                </button>
                <button
                  onClick={() => setTriageModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> {t('conductTriage')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Triage Modal Component */}
      <TriageWizardModal
        isOpen={triageModalOpen}
        onClose={() => setTriageModalOpen(false)}
        onSuccess={() => alert('Digital triage record saved successfully!')}
      />

      {/* Patient Call & Messaging Modal */}
      <PatientContactModal
        patient={selectedContactPatient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactDefaultTab}
      />
    </div>
  );
};
