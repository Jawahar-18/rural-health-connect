import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Appointment, Patient } from '../../types';
import { PatientContactModal } from '../../components/common/PatientContactModal';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Phone, 
  MessageSquare, 
  MapPin, 
  CheckCircle2, 
  Car, 
  X,
  Stethoscope
} from 'lucide-react';

export const WorkerAppointmentsSchedule: React.FC = () => {
  const { currentUser } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>(() => apiService.getAppointments());
  const [patients, setPatients] = useState<Patient[]>(() => apiService.getPatients());
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'clinic_days' | 'completed'>('today');
  const [villageFilter, setVillageFilter] = useState<string>('ALL');

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContactPatient, setSelectedContactPatient] = useState<Patient | null>(null);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  // Book Appointment Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [doctorName, setDoctorName] = useState('Dr. Rajesh Deshmukh');
  const [doctorId, setDoctorId] = useState('usr-doctor-1');
  const [dept, setDept] = useState('General Medicine & NCD Clinic');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [bookSuccess, setBookSuccess] = useState(false);

  const refreshList = () => {
    setAppointments(apiService.getAppointments());
    setPatients(apiService.getPatients());
  };

  useEffect(() => {
    refreshList();
    window.addEventListener('rhc_data_synced', refreshList);
    window.addEventListener('storage', refreshList);
    return () => {
      window.removeEventListener('rhc_data_synced', refreshList);
      window.removeEventListener('storage', refreshList);
    };
  }, []);

  const openContact = (patient: Patient, tab: 'call' | 'message') => {
    setSelectedContactPatient(patient);
    setContactTab(tab);
    setContactModalOpen(true);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pt = patients.find(p => p.id === selectedPatientId);
    if (!pt) return;

    apiService.bookAppointment({
      patientId: pt.id,
      patientName: pt.name,
      doctorId,
      doctorName,
      facilityId: 'fac-phc-junnar',
      facilityName: 'PHC Junnar, Pune',
      department: dept,
      date,
      timeSlot,
      priority: pt.clinicalPriority === 'HIGH' || pt.clinicalPriority === 'URGENT' ? 'URGENT' : 'ROUTINE',
    });

    refreshList();
    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setBookModalOpen(false);
    }, 1500);
  };

  // Associate patient details with appointment
  const enrichedAppointments = appointments.map(apt => {
    const pt = patients.find(p => p.id === apt.patientId);
    return {
      ...apt,
      patient: pt,
      village: pt?.village || 'Junnar',
      distanceKm: pt?.distanceKm || 5,
      isHighRisk: pt?.followupRiskLevel === 'HIGH',
      needsTransportEscort: (pt?.distanceKm || 0) >= 15 || (pt?.age || 0) >= 65,
    };
  });

  const villages = ['ALL', 'Junnar', 'Ambegaon', 'Otur', 'Khed Tribal Hamlet'];

  // Tab and village filtering
  const filteredAppointments = enrichedAppointments.filter(apt => {
    const matchesVillage = villageFilter === 'ALL' || apt.village.toLowerCase() === villageFilter.toLowerCase();
    
    let matchesTab = true;
    if (activeTab === 'today') {
      matchesTab = apt.status === 'SCHEDULED' || apt.status === 'CHECKED_IN';
    } else if (activeTab === 'upcoming') {
      matchesTab = apt.status === 'SCHEDULED';
    } else if (activeTab === 'completed') {
      matchesTab = apt.status === 'COMPLETED' || apt.status === 'CANCELLED';
    }
    return matchesVillage && matchesTab;
  });

  // Mamta Diwas / Village Health & Nutrition Days (VHND)
  const fieldClinicDays = [
    {
      id: 'vhnd-1',
      event: 'Village Health & Nutrition Day (Mamta Diwas)',
      village: 'Khed Tribal Hamlet',
      location: 'Anganwadi Center #3, Khed',
      date: '2026-09-18 (Wednesday)',
      time: '09:30 AM – 02:00 PM',
      focus: 'Maternal IFA Distribution, Under-5 Immunization & BP screening',
      enrolledBeneficiaries: 24,
    },
    {
      id: 'vhnd-2',
      event: 'Mobile Medical Unit (MMU) Camp',
      village: 'Ambegaon Sector',
      location: 'Gram Panchayat Hall, Ambegaon',
      date: '2026-09-22 (Sunday)',
      time: '10:00 AM – 03:30 PM',
      focus: 'NCD Screening, Diabetic Foot Assessment, ECG testing',
      enrolledBeneficiaries: 42,
    },
    {
      id: 'vhnd-3',
      event: 'Elderly Home Care Outreach',
      village: 'Otur Village',
      location: 'Door-to-door Senior Citizen visits',
      date: '2026-09-25 (Wednesday)',
      time: '08:30 AM – 12:30 PM',
      focus: 'Hypertension medicine delivery & bedridden patient vitals',
      enrolledBeneficiaries: 15,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            COMMUNITY FIELD SCHEDULING & CLINIC DAYS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Village Appointments & Clinic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Assigned Health Worker: <strong className="text-white">{currentUser.name}</strong> • PHC Junnar OPD Routing
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPatientId(patients[0]?.id || '');
            setBookModalOpen(true);
          }}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-all hover:scale-102 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book Community Appointment
        </button>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Today's PHC OPD Visits
            </button>
            <button
              onClick={() => setActiveTab('clinic_days')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'clinic_days'
                  ? 'bg-gov-green-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎪 Field Clinic Days (VHND)
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed Visits
            </button>
          </div>

          {/* Village Filter */}
          {activeTab !== 'clinic_days' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Village:</span>
              <select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-emerald-500 outline-none"
              >
                {villages.map(v => (
                  <option key={v} value={v}>{v === 'ALL' ? 'All Villages' : v}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Rendering based on Tab */}
      {activeTab === 'clinic_days' ? (
        /* Field Clinic Days / VHND View */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gov-green-700" />
              Upcoming Village Field Health & Nutrition Days (Mamta Diwas)
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              3 Scheduled Camps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {fieldClinicDays.map((camp) => (
              <div 
                key={camp.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {camp.village}
                    </span>
                    <span className="text-xs font-black text-slate-500">
                      {camp.enrolledBeneficiaries} Enrolled
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {camp.event}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {camp.location}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {camp.date} • {camp.time}
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 leading-snug">
                    {camp.focus}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">
                    Lead ASHA: {currentUser.name}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedPatientId(patients[0]?.id || '');
                      setBookModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Enroll Citizen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* OPD Appointments List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gov-green-700" />
              Scheduled OPD Visits ({filteredAppointments.length})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              PHC Junnar Daily Queue Management
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No Appointments in this category</h3>
              <p className="text-xs text-slate-500">Need to book a visit for a villager? Click below.</p>
              <button
                onClick={() => {
                  setSelectedPatientId(patients[0]?.id || '');
                  setBookModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((apt) => (
                <div 
                  key={apt.id}
                  className={`bg-white rounded-3xl p-5 border-2 shadow-sm hover:shadow-lg transition-all duration-200 space-y-3.5 ${
                    apt.isHighRisk ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                          TOKEN #{apt.tokenNumber}
                        </span>
                        {apt.needsTransportEscort && (
                          <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                            <Car className="w-3 h-3 text-amber-700" /> Transport Escort Needed ({apt.distanceKm}km)
                          </span>
                        )}
                      </div>
                      <div className="text-base font-black text-slate-900 mt-1.5">{apt.patientName}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {apt.village} • Time: <strong className="text-slate-700">{apt.timeSlot}</strong> ({apt.date})
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-300">
                      {apt.status}
                    </span>
                  </div>

                  {/* Doctor and Clinic details */}
                  <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 text-xs space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-gov-green-700" />
                      {apt.doctorName}
                    </div>
                    <div className="text-slate-500">{apt.department} • {apt.facilityName}</div>
                  </div>

                  {/* Actions: Contact / Remind */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold">
                      Queue Position: #{apt.queuePosition || 1} (~{apt.estimatedWaitMinutes || 15}m wait)
                    </div>

                    {apt.patient && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openContact(apt.patient!, 'call')}
                          className="px-3 py-1.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </button>
                        <button
                          onClick={() => openContact(apt.patient!, 'message')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" /> Remind SMS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Schedule Community OPD Slot</h3>
                  <p className="text-xs text-slate-500">Book PHC Doctor Token on behalf of a rural villager</p>
                </div>
              </div>
              <button 
                onClick={() => setBookModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="text-base font-black text-slate-900">Appointment Scheduled!</div>
                <p className="text-xs text-slate-600">Digital OPD token issued and recorded in the PHC queue.</p>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Registered Citizen</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.village}, Age {p.age}) - ABHA: MH-{p.id.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Officer</label>
                  <select
                    value={doctorId}
                    onChange={(e) => {
                      setDoctorId(e.target.value);
                      setDoctorName(e.target.value === 'usr-doctor-1' ? 'Dr. Rajesh Deshmukh' : 'Dr. Meena Kulkarni');
                    }}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                  >
                    <option value="usr-doctor-1">Dr. Rajesh Deshmukh (MBBS, MD - PHC Medical Officer)</option>
                    <option value="usr-facadmin-1">Dr. Meena Kulkarni (Medical Officer In-Charge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                  >
                    <option value="General Medicine & NCD Clinic">General Medicine & NCD Clinic (BP / Diabetes)</option>
                    <option value="Maternal & Child Health (ANC / Immunization)">Maternal & Child Health (ANC / Immunization)</option>
                    <option value="General OPD & Fever Clinic">General OPD & Fever Clinic</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                    >
                      <option value="09:30 AM">09:30 AM - Morning Slot</option>
                      <option value="10:30 AM">10:30 AM - Regular Slot</option>
                      <option value="11:30 AM">11:30 AM - Late Morning</option>
                      <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-md cursor-pointer"
                  >
                    Confirm & Issue Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Patient Call & Messaging Modal */}
      <PatientContactModal
        patient={selectedContactPatient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};
