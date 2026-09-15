import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  QrCode
} from 'lucide-react';

export const PatientReferralsView: React.FC = () => {
  const { currentUser } = useAuth();
  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];
  const referrals = apiService.getReferrals().filter(r => r.patientId === patient.id);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-300" />
            CLOSED-LOOP REFERRAL NETWORK
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Referrals & Specialist Continuity Pass
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Inter-facility referral tracking for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Showing only specialist referrals created for <strong>{patient.name}</strong>.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
          {referrals.length} Referrals Found
        </span>
      </div>

      {referrals.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
          <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-700">No Active Specialist Referrals</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your primary healthcare needs are currently managed directly at PHC Junnar. If specialist secondary or tertiary consultation is required, your Medical Officer will issue a digital referral pass here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {referrals.map((ref) => (
            <div 
              key={ref.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-100">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                    REFERRAL PASS #{ref.id.toUpperCase()}
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-2">
                    {ref.destinationFacility}
                  </div>
                  <div className="text-xs font-semibold text-purple-700">{ref.department}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
                    Status: {ref.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-500">Route Details</div>
                  <div className="font-semibold text-slate-800">
                    Origin: <strong className="text-slate-900">{ref.originFacility}</strong>
                  </div>
                  <div className="font-semibold text-slate-800">
                    Destination: <strong className="text-purple-900">{ref.destinationFacility}</strong>
                  </div>
                  <div className="text-slate-500 pt-1">Created Date: {ref.createdDate}</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-2 text-xs">
                  <div className="font-bold text-purple-900">Clinical Reason for Specialist Referral</div>
                  <p className="text-slate-800 font-medium">{ref.reason}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-black text-slate-900">Hospital Counter Presentation Pass</div>
                  <div className="text-slate-500">Show this digital token at the destination hospital OPD reception for priority queue routing.</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <QrCode className="w-8 h-8 text-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
