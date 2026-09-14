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
      {/* Welcome Banner - Rich Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <HeartPulse className="w-4 h-4 text-emerald-300" /> {t('patientPortalTag')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('namaste')}, {patient.name}!</h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl">
            {t('registeredVillage')}: <strong className="text-white">{patient.village}</strong> • {t('healthIdAbha')}: <span className="font-mono font-black text-emerald-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/20">MH-{patient.id.toUpperCase()}</span>
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Rate Treatment / Submit Call Feedback
            </button>
            <span className="text-xs text-emerald-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-emerald-300" />
              Follow-up Continuity: <strong>{patient.consecutiveFollowupsCompleted || 0}/5</strong> completed
            </span>
          </div>
        </div>
      </div>

      {/* Top Action Cards - Bold 2px Borders & Deep Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Token Badge / Live Queue Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('liveQueueToken')}</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {nextAppointment ? (
            <div className="my-4">
              <div className="text-4xl font-black text-gov-green-700 tracking-tight">{nextAppointment.tokenNumber}</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{nextAppointment.doctorName}</div>
              <div className="text-xs text-slate-500">{nextAppointment.department} • {t('timeSlot')}: <strong className="text-slate-700">{nextAppointment.timeSlot}</strong></div>
              <div className="mt-3 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border-2 border-amber-200 inline-block shadow-2xs">
                {t('estimatedWait')}: {nextAppointment.estimatedWaitMinutes || 15} mins ({t('position')} #{nextAppointment.queuePosition || 1})
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs font-semibold text-slate-500">{t('noActiveToken')}</div>
          )}

          <Link to="/patient/queue" className="text-xs font-bold text-gov-green-700 hover:text-gov-green-800 flex items-center gap-1.5 pt-2 border-t-2 border-slate-100">
            {t('viewRealTimeQueue')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-teal-500 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('nextScheduledVisit')}</span>
            <Calendar className="w-5 h-5 text-gov-teal-700" />
          </div>

          <div className="my-4 space-y-1">
            <div className="text-base font-black text-slate-900">{patient.nextAppointmentDate || '2026-09-10'}</div>
            <div className="text-xs text-slate-700 font-bold">PHC Junnar OPD Clinical Section</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Follow-up checkup for {patient.relevantConditions.join(', ')}</div>
          </div>

          <Link to="/patient/appointments" className="text-xs font-bold text-gov-teal-700 hover:text-gov-teal-800 flex items-center gap-1.5 pt-2 border-t-2 border-slate-100">
            {t('bookReschedule')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Referral Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-purple-500 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('activeReferral')}</span>
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
          </div>

          {activeReferral ? (
            <div className="my-4 space-y-1">
              <div className="text-sm font-black text-slate-900 truncate">{activeReferral.destinationFacility}</div>
              <div className="text-xs text-purple-700 font-bold">{activeReferral.department}</div>
              <div className="mt-2">
                <span className="bg-purple-100 text-purple-900 font-black text-xs px-2.5 py-1 rounded-full border-2 border-purple-300 shadow-2xs">
                  {t('status')}: {activeReferral.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs font-semibold text-slate-500">{t('noActiveReferral')}</div>
          )}

          <Link to="/patient/referrals" className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 border-t-2 border-slate-100">
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

              <div className="space-y-2">
                {activePrescription.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{t('dosage')}: {item.dosage} • {item.frequency} ({item.durationDays} days)</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t('inStock')}
                    </span>
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
              <div key={med.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{med.name}</div>
                  <div className="text-[11px] text-slate-500">{med.category}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  med.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  med.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {med.status.replace('_', ' ')}
                </span>
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

