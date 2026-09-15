import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Patient } from '../../types';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { TriageWizardModal } from '../../components/triage/TriageWizardModal';
import { PatientContactModal } from '../../components/common/PatientContactModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  MessageSquare, 
  Stethoscope, 
  MapPin, 
  RefreshCw, 
  HeartPulse, 
  Baby, 
  ShieldAlert, 
  Table, 
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkerPatientDirectory: React.FC = () => {
  const { currentUser } = useAuth();

  const [patients, setPatients] = useState<Patient[]>(() => apiService.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [selectedTriagePatient, setSelectedTriagePatient] = useState<Patient | undefined>(undefined);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContactPatient, setSelectedContactPatient] = useState<Patient | null>(null);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const refreshData = () => {
    setPatients(apiService.getPatients());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('rhc_data_synced', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('rhc_data_synced', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const handleSyncDb = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing with MySQL...');
    try {
      const res = await apiService.syncWithBackend();
      if (res && res.success) {
        setPatients(apiService.getPatients());
        setSyncStatus(`Synced (${res.count} records)`);
      } else {
        setSyncStatus('Local offline cache');
      }
    } catch {
      setSyncStatus('Local offline cache');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  const openTriage = (patient: Patient) => {
    setSelectedTriagePatient(patient);
    setTriageModalOpen(true);
  };

  const openContact = (patient: Patient, tab: 'call' | 'message') => {
    setSelectedContactPatient(patient);
    setContactTab(tab);
    setContactModalOpen(true);
  };

  // Metrics
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.followupRiskLevel === 'HIGH' || p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT').length;
  const maternalCount = patients.filter(p => p.isPregnant || p.relevantConditions.some(c => c.toLowerCase().includes('antenatal') || c.toLowerCase().includes('pregnant'))).length;
  const ncdCount = patients.filter(p => p.chronicConditions.some(c => c.toLowerCase().includes('hyper') || c.toLowerCase().includes('diab'))).length;
  const elderlyCount = patients.filter(p => p.age >= 60).length;

  // Villages list
  const villages = ['ALL', 'Junnar', 'Ambegaon', 'Otur', 'Khed Tribal Hamlet', 'Narayangaon'];

  // Filtering
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVillage = selectedVillage === 'ALL' || p.village.toLowerCase() === selectedVillage.toLowerCase();

    let matchesCategory = true;
    if (selectedCategory === 'HIGH_RISK') {
      matchesCategory = p.followupRiskLevel === 'HIGH' || p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT';
    } else if (selectedCategory === 'MATERNAL') {
      matchesCategory = p.isPregnant || p.relevantConditions.some(c => c.toLowerCase().includes('antenatal') || c.toLowerCase().includes('pregnant'));
    } else if (selectedCategory === 'NCD') {
      matchesCategory = p.chronicConditions.length > 0;
    } else if (selectedCategory === 'ELDERLY') {
      matchesCategory = p.age >= 60;
    }

    return matchesSearch && matchesVillage && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            COMMUNITY POPULATION HEALTH REGISTRY
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rural Citizen Directory & Health Ledger
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Assigned Worker: <strong className="text-white">{currentUser.name}</strong> • Sector: <strong className="text-white">Junnar Sub-District (5 Villages)</strong>
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {syncStatus && (
            <span className="text-xs font-bold text-emerald-950 bg-emerald-300 px-3 py-1 rounded-xl shadow-xs">
              {syncStatus}
            </span>
          )}
          <button
            onClick={handleSyncDb}
            disabled={isSyncing}
            className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-300' : ''}`} />
            Sync DB
          </button>
          <Link
            to="/worker/patients/register"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Register New Citizen
          </Link>
        </div>
      </div>

      {/* Population Health Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gov-green-700" /> Total Registered
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPatients}</div>
          <div className="text-[10px] font-semibold text-slate-400">100% ABHA Linked</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> High-Risk Cohort
          </div>
          <div className="text-2xl font-black text-rose-600">{highRiskCount}</div>
          <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md inline-block">
            Priority Outreach
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-teal-700 flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-teal-600" /> Maternal & ANC
          </div>
          <div className="text-2xl font-black text-teal-700">{maternalCount}</div>
          <div className="text-[10px] font-semibold text-slate-400">Under Nutrition Watch</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-amber-600" /> Chronic NCDs
          </div>
          <div className="text-2xl font-black text-amber-700">{ncdCount}</div>
          <div className="text-[10px] font-semibold text-slate-400">BP / Diabetes Tracking</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" /> Elderly (60+)
          </div>
          <div className="text-2xl font-black text-indigo-700">{elderlyCount}</div>
          <div className="text-[10px] font-semibold text-slate-400">Home Care Visits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search citizen by name, village, ABHA ID or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* View Toggle (Cards vs Table) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Population Table
            </button>
          </div>
        </div>

        {/* Village Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] mr-1">Village:</span>
          {villages.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVillage(v)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedVillage === v
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {v === 'ALL' ? 'All Villages' : v}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] mr-1">Cohort:</span>
          {[
            { id: 'ALL', label: 'All Citizens' },
            { id: 'HIGH_RISK', label: '🚨 High Priority & Default Risk' },
            { id: 'MATERNAL', label: '🤰 Antenatal & Maternal' },
            { id: 'NCD', label: '❤️ Hypertension & Diabetes' },
            { id: 'ELDERLY', label: '👴 Senior Citizens (60+)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gov-green-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-bold text-slate-600">
          Showing <strong className="text-slate-900">{filteredPatients.length}</strong> citizen records in {selectedVillage === 'ALL' ? 'Junnar Sub-District' : selectedVillage}
        </div>
      </div>

      {/* View Mode 1: Grid Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map((pt) => (
            <div
              key={pt.id}
              className={`bg-white rounded-3xl p-5 border-2 shadow-sm hover:shadow-lg transition-all duration-200 space-y-3.5 ${
                pt.followupRiskLevel === 'HIGH' 
                  ? 'border-rose-300 bg-rose-50/15' 
                  : 'border-slate-200 hover:border-emerald-500'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base">{pt.name}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      MH-{pt.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{pt.village}</strong> • Age {pt.age} ({pt.gender}) • {pt.distanceKm} km from PHC
                  </div>
                </div>
                <PriorityBadge priority={pt.clinicalPriority} size="sm" />
              </div>

              {/* Conditions and Vitals info */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-1 text-xs">
                <div>
                  Conditions: <strong className="text-slate-900">{pt.chronicConditions.join(', ') || pt.relevantConditions.join(', ') || 'Routine Health Profile'}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-600">
                  <span>Phone: <strong className="text-slate-800">{pt.phone}</strong></span>
                  <span>Missed Visits: <strong className={pt.missedAppointments > 0 ? 'text-rose-600' : 'text-slate-800'}>{pt.missedAppointments}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => openContact(pt, 'call')}
                    className="px-3 py-1.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                  <button
                    onClick={() => openContact(pt, 'message')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> SMS
                  </button>
                </div>

                <button
                  onClick={() => openTriage(pt)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-102 cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> Triage Citizen
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode 2: Official Register Table */
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[11px] border-b-2 border-slate-200">
                <tr>
                  <th className="p-3.5">Citizen Name & ABHA</th>
                  <th className="p-3.5">Village & Phone</th>
                  <th className="p-3.5">Age/Gender</th>
                  <th className="p-3.5">Clinical Priority</th>
                  <th className="p-3.5">Conditions</th>
                  <th className="p-3.5">Distance</th>
                  <th className="p-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-800">
                {filteredPatients.map((pt) => (
                  <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-black text-slate-900 text-sm">{pt.name}</div>
                      <div className="text-[10px] font-mono font-bold text-emerald-700">MH-{pt.id.toUpperCase()}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{pt.village}</div>
                      <div className="text-slate-500">{pt.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-bold">
                      {pt.age} yrs ({pt.gender})
                    </td>
                    <td className="p-3.5">
                      <PriorityBadge priority={pt.clinicalPriority} size="sm" />
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs">
                      {pt.chronicConditions.join(', ') || pt.relevantConditions[0] || 'Routine'}
                    </td>
                    <td className="p-3.5 text-slate-600 font-bold">
                      {pt.distanceKm} km
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openContact(pt, 'call')}
                          title="Call citizen"
                          className="p-1.5 bg-gov-green-700 text-white rounded-lg hover:bg-gov-green-800 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openTriage(pt)}
                          className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                        >
                          Triage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Triage Wizard Modal */}
      <TriageWizardModal
        isOpen={triageModalOpen}
        onClose={() => setTriageModalOpen(false)}
        initialPatient={selectedTriagePatient}
        onSuccess={() => {
          setTriageModalOpen(false);
          refreshData();
        }}
      />

      {/* Contact Modal */}
      <PatientContactModal
        patient={selectedContactPatient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};
