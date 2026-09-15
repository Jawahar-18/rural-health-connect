import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartPulse, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  MessageSquare, 
  User, 
  Award,
  Sparkles
} from 'lucide-react';
import { PatientContactModal } from '../../components/common/PatientContactModal';

export const PatientFollowupsView: React.FC = () => {
  const { currentUser } = useAuth();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  const ashaWorker = {
    name: 'Savita Kamble',
    role: 'Community Health Worker (ASHA / ANM)',
    phone: '+91 98500 44332',
    village: 'Junnar Rural Sector',
    facility: 'PHC Junnar, Pune',
  };

  const openContactAsha = (tab: 'call' | 'message') => {
    setContactTab(tab);
    setContactModalOpen(true);
  };

  const completed = patient.consecutiveFollowupsCompleted || 4;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
            CHRONIC CARE CONTINUITY & FOLLOW-UPS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Follow-up Management & ASHA Support
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Care plan for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-300" />
          <div>
            <div className="text-[10px] uppercase font-black text-emerald-300">Care Adherence Streak</div>
            <div className="text-sm font-black text-white">{completed}/5 Sessions Completed</div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Personalized follow-up adherence and frontline outreach plan for <strong>{patient.name}</strong>.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
          Compliance: 98%
        </span>
      </div>

      {/* Follow-up Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Next Visit Schedule */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gov-green-700" />
              Next Scheduled Follow-up
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
              Confirmed
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
              <div className="text-xs text-slate-500 font-bold uppercase">Scheduled Date</div>
              <div className="text-xl font-black text-slate-900">{patient.nextAppointmentDate || '2026-09-15'}</div>
              <div className="text-xs text-slate-600">Location: PHC Junnar NCD Clinical OPD (Room #3)</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-1">
              <div className="text-xs font-black text-emerald-900">Clinical Focus Area</div>
              <p className="text-xs text-emerald-800">
                Routine Blood Pressure re-evaluation, Amlodipine 5mg refill review, and dietary counseling with Dr. Rajesh Deshmukh.
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Frontline ASHA Worker Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gov-teal-700" />
              My Assigned ASHA Worker
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-teal-100 text-teal-900 rounded-full border border-teal-300">
              Active Outreach
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gov-green-700 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                {ashaWorker.name.charAt(0)}
              </div>
              <div>
                <div className="font-black text-slate-900 text-base">{ashaWorker.name}</div>
                <div className="text-xs text-slate-500 font-semibold">{ashaWorker.role}</div>
                <div className="text-xs text-slate-600 mt-0.5">Assigned Area: {ashaWorker.village}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 text-xs text-slate-600">
              Savita Kamble conducts weekly village rounds for vitals monitoring, nutrition guidance, and appointment assistance.
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => openContactAsha('call')}
                className="flex-1 py-2.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> Call ASHA Worker
              </button>
              <button
                onClick={() => openContactAsha('message')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Care & Lifestyle Tips */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Doctor's Care Advice for {patient.chronicConditions.join(', ') || 'General Wellness'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-black text-slate-900">1. Daily Sodium Restriction</div>
            <p className="text-slate-600">Keep salt intake under 5g per day. Avoid processed papads and pickles to maintain healthy BP readings.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-black text-slate-900">2. Medicine Timing</div>
            <p className="text-slate-600">Take Tab. Amlodipine 5mg strictly each morning after breakfast without skipping doses.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1">
            <div className="font-black text-slate-900">3. Physical Activity</div>
            <p className="text-slate-600">30 minutes of brisk morning or evening walking in the village. Stay hydrated during warm afternoons.</p>
          </div>
        </div>
      </div>

      {/* Patient Call & Messaging Modal */}
      <PatientContactModal
        patient={{
          ...patient,
          name: ashaWorker.name,
          phone: ashaWorker.phone,
          village: ashaWorker.village,
        }}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};
