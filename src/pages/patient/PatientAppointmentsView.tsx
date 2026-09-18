import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Appointment } from '../../types';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientAppointmentsView: React.FC = () => {
  const { currentUser } = useAuth();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    apiService.getAppointments().filter(a => a.patientId === patient.id)
  );

  const [bookingOpen, setBookingOpen] = useState(false);
  const [department, setDepartment] = useState('General Medicine & NCD Clinic');
  const [doctorName, setDoctorName] = useState('Dr. Rajesh Deshmukh');
  const [doctorId, setDoctorId] = useState('usr-doctor-1');
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const refreshAppointments = () => {
    const list = apiService.getAppointments().filter(a => a.patientId === patient.id);
    setAppointments(list);
  };

  useEffect(() => {
    refreshAppointments();
    window.addEventListener('storage', refreshAppointments);
    return () => window.removeEventListener('storage', refreshAppointments);
  }, [patient.id]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    apiService.bookAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId,
      doctorName,
      facilityId: 'fac-phc-junnar',
      facilityName: 'PHC Junnar, Pune',
      department,
      date: selectedDate,
      timeSlot,
      priority: 'ROUTINE',
    });

    refreshAppointments();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingOpen(false);
    }, 1500);
  };

  const upcomingApts = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN');
  const pastApts = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            MY HEALTH PORTAL • STRICTLY CONFIDENTIAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Appointments & OPD Slot Booking
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Patient: <strong className="text-white">{patient.name}</strong> • Health ID: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <button
          onClick={() => setBookingOpen(true)}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-all hover:scale-102 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {/* Notice bar confirming data privacy */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Showing only appointments scheduled for <strong>{patient.name}</strong> at <strong>PHC Junnar</strong>.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
          {appointments.length} Records Found
        </span>
      </div>

      {/* Upcoming Visits */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gov-green-700" />
          Upcoming Scheduled Visits ({upcomingApts.length})
        </h2>

        {upcomingApts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 text-center space-y-3 shadow-sm">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No upcoming appointments currently booked.</p>
            <p className="text-xs text-slate-500">Need a regular checkup or follow-up? Click below to book an OPD slot.</p>
            <button
              onClick={() => setBookingOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Book Doctor Slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingApts.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-200 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      TOKEN #{apt.tokenNumber}
                    </span>
                    <div className="text-base font-black text-slate-900 mt-2">{apt.doctorName}</div>
                    <div className="text-xs font-semibold text-slate-600">{apt.department}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-300">
                    {apt.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Date: <strong className="text-slate-900">{apt.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Time Slot: <strong className="text-slate-900">{apt.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location: <strong className="text-slate-900">{apt.facilityName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Queue Position: #{apt.queuePosition || 1} (~{apt.estimatedWaitMinutes || 15}m wait)
                  </div>
                  <Link 
                    to="/patient/queue" 
                    className="text-xs font-black text-gov-green-700 hover:text-gov-green-800 flex items-center gap-1"
                  >
                    Track Live Queue <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Completed Appointments */}
      {pastApts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-black text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
            Previous Consultations History ({pastApts.length})
          </h2>

          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y-2 divide-slate-100 text-xs sm:text-sm">
              {pastApts.map((apt) => (
                <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{apt.doctorName} • <span className="text-slate-600 font-normal">{apt.department}</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">{apt.facilityName} • Attended on {apt.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      Completed
                    </span>
                    <Link to="/patient/records" className="text-xs font-bold text-emerald-700 hover:underline">
                      View Medical Summary →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Book PHC Doctor Slot</h3>
                  <p className="text-xs text-slate-500">Patient: {patient.name} (ABHA: MH-{patient.id.toUpperCase()})</p>
                </div>
              </div>
              <button 
                onClick={() => setBookingOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="text-base font-black text-slate-900">Slot Confirmed!</div>
                <p className="text-xs text-slate-600">Your appointment token has been issued successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Clinical Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
                  >
                    <option value="General Medicine & NCD Clinic">General Medicine & NCD Clinic (Hypertension / Diabetes)</option>
                    <option value="Maternal & Child Health (ANC / Immunization)">Maternal & Child Health (ANC / Immunization)</option>
                    <option value="General OPD & Fever Clinic">General OPD & Fever Clinic</option>
                    <option value="Teleconsultation Specialist OPD">Teleconsultation Specialist OPD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Medical Officer</label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
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
                      <option value="03:30 PM">03:30 PM - Evening Slot</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  ⚡ <strong>Fast Track Priority</strong>: Verified rural residents receive priority token assignment upon arrival at PHC Junnar.
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingOpen(false)}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-md cursor-pointer"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
