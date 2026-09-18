import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { 
  Clock, 
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const appointments = apiService.getAppointments();
  const patients = apiService.getPatients();
  const highRiskPatients = patients.filter(p => p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT' || p.followupRiskLevel === 'HIGH');
  const referrals = apiService.getReferrals();

  const checkedInQueue = appointments.filter(a => a.status === 'CHECKED_IN' || a.status === 'SCHEDULED');

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner - Unified Lush Mint & Teal Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-900/10 border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase border border-white/30 shadow-inner">
            {t('doctorPortalTag')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 drop-shadow-xs">{t('welcomeDoctor')}, {currentUser.name}</h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            {t('opdRoomTitle')} • {t('facility')}: <strong className="text-white">{currentUser.facilityName || 'PHC Junnar'}</strong>
          </p>
        </div>

        <Link
          to="/doctor/queue"
          className="relative z-10 px-5 py-3 bg-white text-teal-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md flex items-center gap-2 hover:bg-teal-50 hover:scale-102 active:scale-95 transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4 text-teal-700" /> {t('todaysOpdQueue')} ({checkedInQueue.length}) →
        </Link>
      </div>

      {/* KPI Cards - Smooth & Light Refined Shadows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('queueWaiting')}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{checkedInQueue.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">{t('patientsReadyOpd')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50/40 p-5 rounded-3xl border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-rose-700 uppercase tracking-wider">{t('urgentPatients')}</div>
          <div className="text-3xl font-black text-rose-600 mt-2">
            {checkedInQueue.filter(a => a.priority === 'URGENT').length}
          </div>
          <div className="text-xs text-rose-700 font-bold mt-1">{t('prioritizedQueueToken')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50/40 p-5 rounded-3xl border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-amber-700 uppercase tracking-wider">{t('highRiskFollowups')}</div>
          <div className="text-3xl font-black text-amber-600 mt-2">{highRiskPatients.length}</div>
          <div className="text-xs text-amber-700 font-bold mt-1">{t('riskScore')} &gt; 70</div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/40 p-5 rounded-3xl border border-emerald-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">{t('pendingReferrals')}</div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{referrals.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">{t('outboundContinuity')}</div>
        </div>
      </div>

      {/* Live OPD Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-emerald-700" />
            <h2 className="font-black text-slate-900 text-base sm:text-lg">{t('todaysActiveQueue')}</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full border border-emerald-200">
            {checkedInQueue.length} {t('inLine')}
          </span>
        </div>

        <div className="space-y-3">
          {checkedInQueue.map((apt) => (
            <div key={apt.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200/70 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 transition-all duration-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs hover:shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                  {apt.tokenNumber}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base flex items-center gap-2">
                    {apt.patientName}
                    <PriorityBadge priority={apt.priority} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {t('department')}: <strong className="text-slate-700">{apt.department}</strong> • {t('timeSlot')}: <strong className="text-slate-700">{apt.timeSlot}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/doctor/consultation/${apt.patientId}`}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" /> {t('startConsultation')} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

