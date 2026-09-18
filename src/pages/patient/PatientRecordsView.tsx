import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Heart, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Download
} from 'lucide-react';

export const PatientRecordsView: React.FC = () => {
  const { currentUser } = useAuth();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];
  const prescriptions = apiService.getPrescriptions().filter(p => p.patientId === patient.id);
  const triageRecords = apiService.getTriageRecords(patient.id);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-300" />
            ABDM DIGITAL HEALTH LOCKER • ENCRYPTED
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Longitudinal Medical Records & Clinical History
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Confidential EMR for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-gov-green-700" /> Export Summary
        </button>
      </div>

      {/* ABDM Health Locker Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gov-green-700 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
            ABDM
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              Ayushman Bharat Digital Health Account
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                VERIFIED
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              ABHA Address: <strong className="font-mono text-slate-900">{patient.name.toLowerCase().replace(/\s+/g, '')}@abdm</strong> • Consent Artifact: Active
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Primary Facility: <strong className="text-slate-800">PHC Junnar, Pune</strong>
        </div>
      </div>

      {/* Vitals Summary Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" /> Blood Pressure
          </div>
          <div className="text-2xl font-black text-slate-900">128/82 <span className="text-xs font-normal text-slate-500">mmHg</span></div>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Controlled / Normal
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-600" /> Heart Rate
          </div>
          <div className="text-2xl font-black text-slate-900">76 <span className="text-xs font-normal text-slate-500">bpm</span></div>
          <div className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block">
            Regular Rhythm
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Blood Sugar (F)
          </div>
          <div className="text-2xl font-black text-slate-900">104 <span className="text-xs font-normal text-slate-500">mg/dL</span></div>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Fasting Normal
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gov-green-700" /> SpO2 Level
          </div>
          <div className="text-2xl font-black text-slate-900">99%</div>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Optimal
          </div>
        </div>
      </div>

      {/* Conditions & Health Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gov-green-700" />
          Chronic Conditions & Clinical Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-bold text-slate-500">Primary Chronic Diagnosis</div>
            <div className="font-black text-slate-900 text-sm">{patient.chronicConditions.join(', ') || 'None Recorded'}</div>
            <div className="text-[11px] text-slate-500">Under regular management with Amlodipine 5mg</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-bold text-slate-500">Registered Village & Distance</div>
            <div className="font-black text-slate-900 text-sm">{patient.village} ({patient.distanceKm} km from PHC)</div>
            <div className="text-[11px] text-slate-500">Assigned ASHA: Savita Kamble</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-bold text-slate-500">Allergies & Contraindications</div>
            <div className="font-black text-emerald-700 text-sm">No Known Drug Allergies (NKDA)</div>
            <div className="text-[11px] text-slate-500">Verified during last clinical assessment</div>
          </div>
        </div>
      </div>

      {/* Longitudinal Consultation Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gov-green-700" />
          Consultations & Clinical Encounters Log
        </h2>

        <div className="space-y-4 border-l-2 border-slate-200 ml-3 pl-5">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="relative space-y-2">
              <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white border-2 border-emerald-700"></span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-black text-slate-900">
                  {rx.diagnosis}
                </div>
                <span className="text-xs font-bold text-slate-500">{rx.date}</span>
              </div>
              <div className="text-xs text-slate-600">
                Doctor: <strong>{rx.doctorName}</strong> ({rx.facilityName})
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-100 text-xs text-slate-700 font-medium">
                {rx.clinicalNotes}
              </div>
            </div>
          ))}

          {triageRecords.map((trg) => (
            <div key={trg.id} className="relative space-y-2 pt-2">
              <span className="absolute -left-[27px] top-3 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white border-2 border-teal-700"></span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-black text-slate-900">
                  Frontline Health Worker Triage Session
                </div>
                <span className="text-xs font-bold text-slate-500">{trg.date}</span>
              </div>
              <div className="text-xs text-slate-600">
                Vitals: BP {trg.vitals.bpSystolic && trg.vitals.bpDiastolic ? `${trg.vitals.bpSystolic}/${trg.vitals.bpDiastolic}` : '130/84'}, Pulse {trg.vitals.heartRateBpm || 78} bpm • Priority: <span className="font-bold text-emerald-800">{trg.clinicalPriority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
