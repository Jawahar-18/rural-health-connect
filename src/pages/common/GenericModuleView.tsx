import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTranslation } from '../../context/MultilingualContext';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { PatientContactModal } from '../../components/common/PatientContactModal';
import type { UserRole, Patient, Referral, MedicineStock } from '../../types';
import { Search, Phone, MessageSquare, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GenericModuleViewProps {
  title: string;
  role: UserRole;
}

export const GenericModuleView: React.FC<GenericModuleViewProps> = ({ title, role }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  const [patients, setPatients] = useState<Patient[]>(() => apiService.getPatients());
  const [referrals, setReferrals] = useState<Referral[]>(() => apiService.getReferrals());
  const [stock, setStock] = useState<MedicineStock[]>(() => apiService.getMedicineStock());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatusText('Syncing with MySQL...');
    try {
      const res = await apiService.syncWithBackend();
      if (res.success) {
        setPatients(apiService.getPatients());
        setReferrals(apiService.getReferrals());
        setStock(apiService.getMedicineStock());
        setSyncStatusText(`Synced ${res.count} records with MySQL`);
      } else {
        setSyncStatusText('Offline cache active');
      }
    } catch {
      setSyncStatusText('Offline cache active');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusText(null), 4000);
    }
  };

  useEffect(() => {
    handleSync();

    const onDataSynced = () => {
      setPatients(apiService.getPatients());
      setReferrals(apiService.getReferrals());
      setStock(apiService.getMedicineStock());
    };

    window.addEventListener('rhc_data_synced', onDataSynced);
    window.addEventListener('storage', onDataSynced);
    return () => {
      window.removeEventListener('rhc_data_synced', onDataSynced);
      window.removeEventListener('storage', onDataSynced);
    };
  }, []);

  const openContact = (patient: Patient, tab: 'call' | 'message') => {
    setSelectedPatient(patient);
    setContactTab(tab);
    setContactModalOpen(true);
  };

  const isHighRiskView = title.toLowerCase().includes('high-risk') || title.toLowerCase().includes('vulnerable') || title.toLowerCase().includes('follow-up');

  const displayedPatients = isHighRiskView
    ? patients.filter(p => p.followupRiskLevel === 'HIGH' || p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT')
    : patients;

  const filteredPatients = displayedPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReferrals = referrals.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destinationFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.originFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStock = stock.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleGradient = () => {
    return 'from-teal-600 via-emerald-600 to-teal-700 border-teal-400/40';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Colorful Gradient Module Header */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${getRoleGradient()} text-white shadow-lg border relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {role.replace('_', ' ')} MODULE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">{title}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl">
            {t('appSubtitle')}
          </p>
        </div>

        <div className="relative z-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg border-2 border-white/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Conditional Content based on title or role */}
      {title.toLowerCase().includes('referral') ? (
        /* Referrals Directory */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-base">{t('referralContinuityTracking')}</h2>
            <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-300">
              {filteredReferrals.length} {t('activeReferrals')}
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {filteredReferrals.length === 0 ? (
              <div className="text-center py-8 text-xs font-semibold text-slate-400">
                No referrals matching "{searchTerm}"
              </div>
            ) : (
              filteredReferrals.map((ref) => (
                <div key={ref.id} className="p-5 rounded-2xl border-2 border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-purple-400 shadow-sm hover:shadow-lg transition-all duration-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-extrabold text-slate-900 text-base">{ref.patientName} <span className="text-xs font-semibold text-slate-500">({ref.patientGender}, {ref.patientAge} yrs)</span></div>
                    <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full border-2 border-purple-300 shadow-xs">
                      {t('status')}: {ref.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-slate-700 font-medium">
                    {t('origin')}: <strong className="text-slate-900">{ref.originFacility}</strong> → {t('destination')}: <strong className="text-purple-800 font-bold">{ref.destinationFacility}</strong> ({ref.department})
                  </div>
                  <div className="text-slate-600 bg-white p-3 rounded-xl border-2 border-slate-100 text-xs font-medium">
                    {t('reasonForReferral')}: {ref.reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : title.toLowerCase().includes('medicine') || title.toLowerCase().includes('stock') ? (
        /* Medicine Stock Table */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-base">{t('essentialDrugInventory')}</h2>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
              {filteredStock.length} {t('cataloguedDrugs')}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 border-b-2 border-slate-200 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5">{t('medicineName')}</th>
                  <th className="p-3.5">{t('category')}</th>
                  <th className="p-3.5">{t('currentStock')}</th>
                  <th className="p-3.5">{t('minThreshold')}</th>
                  <th className="p-3.5">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium text-slate-800 bg-white">
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="p-3.5 text-slate-600 font-semibold">{item.category}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{item.currentStock} {item.unit}</td>
                    <td className="p-3.5 text-slate-500">{item.minThreshold} {item.unit}</td>
                    <td className="p-3.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border-2 shadow-xs inline-block ${
                        item.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        item.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {item.status === 'AVAILABLE' ? t('available') : item.status === 'LOW_STOCK' ? t('lowStock') : t('outOfStock')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standard or High Risk Patient Directory */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-100 pb-3 gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                {isHighRiskView && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                {isHighRiskView ? t('highRiskVulnerableRegistry') : t('registeredRuralDirectory')}
              </h2>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                {filteredPatients.length} {t('patientsCount')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {syncStatusText && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 animate-fade-in">
                  {syncStatusText}
                </span>
              )}
              <button
                onClick={handleSync}
                disabled={isSyncing}
                title="Synchronize records directly with MySQL Database"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all hover:scale-102 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Database'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPatients.map((pt) => (
              <div 
                key={pt.id} 
                className={`p-5 rounded-2xl border-2 transition-all duration-200 space-y-3.5 shadow-sm hover:shadow-xl ${
                  pt.followupRiskLevel === 'HIGH'
                    ? 'border-rose-300 bg-rose-50/20 hover:border-rose-500 hover:bg-white'
                    : 'border-slate-200/90 bg-slate-50/60 hover:border-emerald-500 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-black text-slate-900 text-base flex items-center gap-2">
                      {pt.name}
                      {pt.followupRiskLevel === 'HIGH' && (
                        <span className="bg-rose-100 text-rose-900 text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-rose-300 shadow-xs">
                          {t('riskScore')}: {pt.followupRiskScore}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      📍 {t('registeredVillage')}: <strong className="text-slate-700">{pt.village}</strong> • Age {pt.age} ({pt.gender})
                    </div>
                  </div>
                  <PriorityBadge priority={pt.clinicalPriority} size="sm" />
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border-2 border-slate-100 space-y-1 font-medium shadow-2xs">
                  <div>{t('medicalConditions')}: <strong className="text-slate-900">{pt.chronicConditions.join(', ') || pt.relevantConditions.join(', ') || 'None'}</strong></div>
                  <div>{t('phone')}: <strong className="text-slate-900">{pt.phone}</strong></div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span>{t('distanceFromPhc')}: <strong>{pt.distanceKm} km</strong></span>
                    <span>{t('missedVisits')}: <strong className={pt.missedAppointments > 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}>{pt.missedAppointments}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openContact(pt, 'call')}
                      className="px-3 py-1.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" /> {t('call')}
                    </button>
                    <button
                      onClick={() => openContact(pt, 'message')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> {t('message')}
                    </button>
                  </div>

                  <Link
                    to={`/doctor/consultation/${pt.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm hover:scale-102 transition-all"
                  >
                    {t('openRecord')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Call & Messaging Modal */}
      <PatientContactModal
        patient={selectedPatient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};


