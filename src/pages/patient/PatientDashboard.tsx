import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import { 
  Calendar, 
  ArrowRightLeft, 
  Pill, 
  ChevronRight, 
  HeartPulse,
  Package,
  MessageSquare,
  Archive
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientFeedbackModal } from '../../components/feedback/PatientFeedbackModal';

export const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];
  const appointments = apiService.getAppointments().filter(a => a.patientId === patient.id);
  const nextAppointment = appointments.find(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN');
  const referrals = apiService.getReferrals().filter(r => r.patientId === patient.id);
  const activeReferral = referrals[0];
  const prescriptions = apiService.getPrescriptions().filter(p => p.patientId === patient.id);
  const activePrescription = prescriptions[0];
  const medicines = apiService.getMedicineStock();
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Unified Lush Mint & Teal Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-900/10 border border-teal-400/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-inner">
            <HeartPulse className="w-4 h-4 text-white" /> {t('patientPortalTag')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">{t('namaste')}, {patient.name}!</h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium max-w-xl">
            {t('registeredVillage')}: <strong className="text-white">{patient.village}</strong> • {t('healthIdAbha')}: <span className="font-mono font-black text-white bg-black/15 px-2.5 py-0.5 rounded-lg border border-white/25">MH-{patient.id.toUpperCase()}</span>
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="px-4 py-2 bg-white text-teal-950 hover:bg-teal-50 font-black text-xs rounded-xl shadow-sm hover:shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-102 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-700" /> Rate Treatment / Submit Call Feedback
            </button>
            <span className="text-xs text-white bg-black/15 px-3 py-1.5 rounded-xl border border-white/25 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-teal-200" />
              Follow-up Continuity: <strong>{patient.consecutiveFollowupsCompleted || 0}/5</strong> completed
            </span>
          </div>
        </div>
      </div>

      {/* Top Action Cards - Smooth, Light, Refined Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Token Badge / Live Queue Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('liveQueueToken')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {nextAppointment ? (
            <div className="my-4">
              <div className="text-4xl font-black text-emerald-700 tracking-tight">{nextAppointment.tokenNumber}</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{nextAppointment.doctorName}</div>
              <div className="text-xs text-slate-500">{nextAppointment.department} • {t('timeSlot')}: <strong className="text-slate-700">{nextAppointment.timeSlot}</strong></div>
              <div className="mt-3 text-xs font-bold text-amber-900 bg-amber-50/90 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block shadow-2xs">
                {t('estimatedWait')}: {nextAppointment.estimatedWaitMinutes || 15} mins ({t('position')} #{nextAppointment.queuePosition || 1})
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs font-semibold text-slate-500">{t('noActiveToken')}</div>
          )}

          <Link to="/patient/queue" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            {t('viewRealTimeQueue')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('nextScheduledVisit')}</span>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>

          <div className="my-4 space-y-1">
            <div className="text-base font-black text-slate-900">{patient.nextAppointmentDate || '2026-09-10'}</div>
            <div className="text-xs text-slate-700 font-bold">PHC Junnar OPD Clinical Section</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Follow-up checkup for {patient.relevantConditions.join(', ')}</div>
          </div>

          <Link to="/patient/appointments" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            {t('bookReschedule')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Referral Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('activeReferral')}</span>
            <ArrowRightLeft className="w-5 h-5 text-teal-600" />
          </div>

          {activeReferral ? (
            <div className="my-4 space-y-1">
              <div className="text-sm font-black text-slate-900 truncate">{activeReferral.destinationFacility}</div>
              <div className="text-xs text-teal-700 font-bold">{activeReferral.department}</div>
              <div className="mt-2">
                <span className="bg-teal-50 text-teal-800 font-bold text-xs px-2.5 py-1 rounded-full border border-teal-200">
                  {t('status')}: {activeReferral.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs font-semibold text-slate-500">{t('noActiveReferral')}</div>
          )}

          <Link to="/patient/referrals" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            {t('trackReferralPasscode')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Active Prescription & Medicine Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Prescription Summary */}
        <div className="bg-white rounded-gov p-5 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-gov-green-700" />
              <h3 className="font-bold text-slate-900 text-sm">{t('activePrescription')}</h3>
            </div>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-gov-green-700 hover:underline">
              {t('viewAll')}
            </Link>
          </div>

          {activePrescription ? (
            <div className="space-y-3">
              <div className="text-xs">
                <span className="font-semibold text-slate-500">{t('diagnosis')}: </span>
                <span className="font-bold text-slate-800">{activePrescription.diagnosis}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{t('prescribedBy')} {activePrescription.doctorName} on {activePrescription.date}</span>
              </div>

              <div className="space-y-2.5">
                {activePrescription.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {t('inStock')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{t('dosage')}: {item.dosage} • {item.frequency} ({item.durationDays} days)</div>
                    {item.purpose && (
                      <div className="text-[11px] text-emerald-900 font-medium bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                        <span><strong>Used for:</strong> {item.purpose}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-4 text-center">No active digital prescription found.</div>
          )}
        </div>

        {/* Local PHC Medicine Stock Tracker */}
        <div className="bg-white rounded-gov p-5 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gov-teal-700" />
              <h3 className="font-bold text-slate-900 text-sm">{t('medicineAvailabilityFinder')}</h3>
            </div>
            <Link to="/patient/medicines" className="text-xs font-semibold text-gov-teal-700 hover:underline">
              {t('searchAll')}
            </Link>
          </div>

          <div className="space-y-2">
            {medicines.slice(0, 4).map((med) => (
              <div key={med.id} className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">{med.name}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    med.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    med.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {med.status.replace('_', ' ')}
                  </span>
                </div>
                {med.purpose ? (
                  <div className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">Why used:</strong> {med.purpose}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500">{med.category}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Feedback Modal */}
      <PatientFeedbackModal
        patient={patient}
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </div>
  );
};

