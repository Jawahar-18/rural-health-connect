import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { TriageRecord, Patient } from '../../types';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { TriageWizardModal } from '../../components/triage/TriageWizardModal';
import { 
  Stethoscope, 
  AlertTriangle, 
  Activity, 
  Search, 
  Clock, 
  Heart, 
  Thermometer, 
  CheckCircle2, 
  PlusCircle, 
  ShieldAlert
} from 'lucide-react';

export const WorkerTriageHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>(() => apiService.getTriageRecords());
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [selectedPatientForTriage, setSelectedPatientForTriage] = useState<Patient | undefined>(undefined);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const refreshTriage = () => {
    setTriageRecords(apiService.getTriageRecords());
  };

  useEffect(() => {
    refreshTriage();
    window.addEventListener('rhc_data_synced', refreshTriage);
    window.addEventListener('storage', refreshTriage);
    return () => {
      window.removeEventListener('rhc_data_synced', refreshTriage);
      window.removeEventListener('storage', refreshTriage);
    };
  }, []);

  const openNewTriage = (pt?: Patient) => {
    setSelectedPatientForTriage(pt);
    setTriageModalOpen(true);
  };

  // Filtered records
  const filteredRecords = triageRecords.filter(rec => {
    const matchesFilter = filterLevel === 'ALL' || rec.clinicalPriority === filterLevel || rec.triageLevel === filterLevel;
    const matchesSearch = 
      rec.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rec.recommendedAction.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const urgentCount = triageRecords.filter(r => r.clinicalPriority === 'URGENT').length;
  const highCount = triageRecords.filter(r => r.clinicalPriority === 'HIGH').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Clinical Operations Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            AI-ASSISTED CLINICAL TRIAGE OPERATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Digital Triage & Red-Flag Decision Support
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Frontline clinical urgency scoring for <strong className="text-white">{currentUser.name}</strong> • Community triage protocols compliant with NHM
          </p>
        </div>

        <button
          onClick={() => openNewTriage()}
          className="relative z-10 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-transform hover:scale-102 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Launch Digital Triage Wizard
        </button>
      </div>

      {/* Red Flag Urgency Reference Protocols */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-3xl border-2 border-rose-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Red Flag (URGENT)
            </span>
            <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full">
              EMERGENCY
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Chest pain radiating to left arm, acute respiratory distress (SpO2 &lt;90%), active seizures, severe postpartum hemorrhage.
          </p>
          <div className="text-[11px] font-bold text-rose-800 bg-rose-100/80 p-2 rounded-xl">
            Protocol: Immediate 108 EMS ambulance dispatch & stabilization.
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border-2 border-amber-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Yellow Flag (HIGH)
            </span>
            <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
              PRIORITY OPD
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Stage 2 BP (&gt;160/100), Blood Glucose &gt;220 mg/dL, high fever with stiff neck, severe abdominal tenderness, high default risk.
          </p>
          <div className="text-[11px] font-bold text-amber-800 bg-amber-100/80 p-2 rounded-xl">
            Protocol: Priority OPD token routed directly to Medical Officer.
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Green Flag (ROUTINE)
            </span>
            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              ROUTINE CARE
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Stable vitals, mild seasonal URI / cough, scheduled hypertension/diabetes medicine refill, routine antenatal checkup.
          </p>
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 p-2 rounded-xl">
            Protocol: Standard queue token, dispensary counseling & follow-up.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search triage history by citizen name or recorded symptom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: `All Sessions (${triageRecords.length})` },
              { id: 'URGENT', label: `🚨 Urgent (${urgentCount})` },
              { id: 'HIGH', label: `⚠️ High Priority (${highCount})` },
              { id: 'MODERATE', label: 'Moderate' },
              { id: 'ROUTINE', label: 'Routine' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterLevel(btn.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterLevel === btn.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Triage Decision History Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gov-green-700" />
            Recent Community Triage Assessments ({filteredRecords.length})
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            Chronological field evaluation log
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Triage Records Found</h3>
            <p className="text-xs text-slate-500">Conduct a digital triage session to log clinical vitals and urgency recommendations.</p>
            <button
              onClick={() => openNewTriage()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Start Triage Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((rec) => (
              <div 
                key={rec.id}
                className={`bg-white rounded-3xl p-6 border-2 shadow-sm hover:shadow-lg transition-all duration-200 space-y-4 ${
                  rec.clinicalPriority === 'URGENT' 
                    ? 'border-rose-400 bg-rose-50/10' 
                    : rec.clinicalPriority === 'HIGH'
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-slate-200 hover:border-emerald-500'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-slate-900 text-base">{rec.patientName}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {rec.id.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Assessed on: <strong>{rec.date}</strong> by {rec.healthWorkerName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={rec.clinicalPriority} size="md" />
                    {rec.overriddenByClinician && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300">
                        Doctor Overridden
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptoms Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Presenting Symptoms:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.symptoms.map((sym, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recorded Vitals Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" /> BP
                    </div>
                    <div className="font-black text-slate-900 mt-0.5">
                      {rec.vitals.bpSystolic && rec.vitals.bpDiastolic ? `${rec.vitals.bpSystolic}/${rec.vitals.bpDiastolic}` : 'N/A'} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-teal-600" /> Pulse
                    </div>
                    <div className="font-black text-slate-900 mt-0.5">
                      {rec.vitals.heartRateBpm || 75} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-500" /> Temp
                    </div>
                    <div className="font-black text-slate-900 mt-0.5">
                      {rec.vitals.temperatureCelsius || 37.0}°C
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400">SpO2</div>
                    <div className="font-black text-slate-900 mt-0.5">
                      {rec.vitals.oxygenSatPercent || 98}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400">Blood Sugar</div>
                    <div className="font-black text-slate-900 mt-0.5">
                      {rec.vitals.bloodSugarMgDl ? `${rec.vitals.bloodSugarMgDl} mg/dL` : 'Routine'}
                    </div>
                  </div>
                </div>

                {/* AI Decision Recommendations */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 text-xs space-y-1">
                  <div className="font-black text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Triage Recommendation & Care Directive:
                  </div>
                  <p className="text-emerald-900 font-medium">
                    {rec.recommendedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Triage Wizard Modal */}
      <TriageWizardModal
        isOpen={triageModalOpen}
        onClose={() => setTriageModalOpen(false)}
        initialPatient={selectedPatientForTriage}
        onSuccess={() => {
          setTriageModalOpen(false);
          refreshTriage();
        }}
      />
    </div>
  );
};
