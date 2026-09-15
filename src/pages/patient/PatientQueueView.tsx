import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Stethoscope, 
  Pill, 
  Activity, 
  Ticket
} from 'lucide-react';

export const PatientQueueView: React.FC = () => {
  const { currentUser } = useAuth();
  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const [appointments, setAppointments] = useState(() => 
    apiService.getAppointments().filter(a => a.patientId === patient.id)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeAppointment = appointments.find(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN');

  const refreshQueue = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAppointments(apiService.getAppointments().filter(a => a.patientId === patient.id));
      setIsRefreshing(false);
    }, 600);
  };

  const handleGenerateToken = () => {
    apiService.bookAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: 'usr-doctor-1',
      doctorName: 'Dr. Rajesh Deshmukh',
      facilityId: 'fac-phc-junnar',
      facilityName: 'PHC Junnar, Pune',
      department: 'General OPD & NCD Clinic',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Immediate Walk-in',
      priority: 'ROUTINE',
    });
    setAppointments(apiService.getAppointments().filter(a => a.patientId === patient.id));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            LIVE OPD QUEUE TRACKER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Real-Time OPD Token & Wait Status
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Facility: <strong className="text-white">PHC Junnar, Pune</strong> • Consultation Room: <strong className="text-white">Room #3 (Dr. Rajesh Deshmukh)</strong>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={refreshQueue}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Main Active Token Card */}
      {activeAppointment ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
            <div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 uppercase tracking-wider">
                ACTIVE QUEUE PASS
              </span>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
                Token #{activeAppointment.tokenNumber}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                Issued to: <strong className="text-slate-900">{patient.name}</strong> (ABHA: MH-{patient.id.toUpperCase()})
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200 text-right sm:min-w-[180px]">
              <div className="text-xs font-bold text-emerald-800">Estimated Wait Time</div>
              <div className="text-3xl font-black text-gov-green-700 mt-0.5">
                ~{activeAppointment.estimatedWaitMinutes || 15} <span className="text-sm font-bold">mins</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-1">
                Position in Line: #{activeAppointment.queuePosition || 1}
              </div>
            </div>
          </div>

          {/* Stepper progress */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Clinical Flow Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-100/70 border-2 border-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-black text-emerald-950">1. Registration</div>
                  <div className="text-[11px] text-emerald-800 font-semibold">Token Generated</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border-2 border-teal-300 flex items-center gap-3">
                <Activity className="w-5 h-5 text-teal-700 shrink-0" />
                <div>
                  <div className="font-black text-teal-950">2. Vitals Triage</div>
                  <div className="text-[11px] text-teal-700 font-semibold">BP & Temp Logged</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-amber-700 shrink-0 animate-pulse" />
                <div>
                  <div className="font-black text-amber-950">3. Doctor Review</div>
                  <div className="text-[11px] text-amber-700 font-semibold">Next in line</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 opacity-60 flex items-center gap-3">
                <Pill className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <div className="font-black text-slate-700">4. Pharmacy</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Dispensing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor & Facility details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-1.5 text-xs">
              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-gov-green-700" />
                Consulting Medical Officer
              </div>
              <div className="text-slate-800 font-bold">{activeAppointment.doctorName}</div>
              <div className="text-slate-500">{activeAppointment.department} • Room #3, Ground Floor</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-1.5 text-xs">
              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gov-teal-700" />
                Clinic Location
              </div>
              <div className="text-slate-800 font-bold">PHC Junnar, Pune District</div>
              <div className="text-slate-500">Scheduled Time Slot: {activeAppointment.timeSlot}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-200 shadow-md text-center space-y-4">
          <Ticket className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">No Active OPD Token for Today</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            You do not have a live queue token active right now. If you are currently at PHC Junnar or planning to visit today, generate a digital queue token below.
          </p>
          <button
            onClick={handleGenerateToken}
            className="px-6 py-3 bg-gov-green-700 hover:bg-gov-green-800 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-transform hover:scale-102 cursor-pointer inline-flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Generate Walk-In OPD Token
          </button>
        </div>
      )}

      {/* Live OPD Hall Notice */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <div>
            <div className="text-xs font-black uppercase text-emerald-400 tracking-wider">PHC OPD Display Board</div>
            <div className="text-sm font-bold text-slate-200">Current Token Being Served in Room #3: <strong className="text-white text-base">A-101</strong></div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Audio announcement will chime when your token is called in Marathi & Hindi.
        </div>
      </div>
    </div>
  );
};
