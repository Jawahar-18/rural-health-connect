import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Prescription } from '../../types';
import { 
  FileText, 
  Search, 
  Pill, 
  Printer, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight, 
  Filter, 
  Sparkles
} from 'lucide-react';
import { generatePrescriptionPdf } from '../../utils/pdfGenerator';

export const DoctorPrescriptionsView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'WITH_FOLLOWUP' | 'TODAY'>('ALL');

  const allPrescriptions: Prescription[] = apiService.getPrescriptions();

  const filteredPrescriptions = allPrescriptions.filter(rx => {
    const matchesSearch = 
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.items.some(item => item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'WITH_FOLLOWUP') {
      return Boolean(rx.followUpDate);
    }
    if (filterType === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      return rx.date === today;
    }
    return true;
  });

  const totalMedicinesDispensed = allPrescriptions.reduce((acc, rx) => acc + rx.items.length, 0);
  const prescriptionsWithFollowup = allPrescriptions.filter(rx => rx.followUpDate).length;

  const handlePrint = (rx: Prescription) => {
    generatePrescriptionPdf(rx);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-inner">
            <Pill className="w-3.5 h-3.5 text-emerald-200" />
            CLINICAL OPD E-PRESCRIPTION LOG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Issued Electronic Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            Authorized digital prescription ledger & medication dispensing history for <strong className="text-white">{currentUser.name}</strong> • {currentUser.facilityName || 'PHC Junnar'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor/consultation')}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> New Prescription
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{allPrescriptions.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Prescriptions</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalMedicinesDispensed}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medication Lines</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{prescriptionsWithFollowup}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Follow-ups Scheduled</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">ABHA Digital Compliance</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient, drug, diagnosis, or Rx ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({allPrescriptions.length})
            </button>
            <button
              onClick={() => setFilterType('WITH_FOLLOWUP')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterType === 'WITH_FOLLOWUP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              With Follow-up
            </button>
            <button
              onClick={() => setFilterType('TODAY')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterType === 'TODAY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Prescriptions Feed */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-slate-200 text-center space-y-3 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-700">No Prescriptions Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No e-prescriptions matched your search criteria. You can issue a new digital prescription from the OPD consultation page.
          </p>
          <button
            onClick={() => navigate('/doctor/consultation')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Start Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map((rx) => (
            <div 
              key={rx.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md hover:border-emerald-300 transition-all space-y-5"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 border border-emerald-200">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900">{rx.patientName}</h2>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {rx.id.toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Signed
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Prescriber: <strong>{rx.doctorName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {rx.facilityName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: <strong>{rx.date}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePrint(rx)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    title="Download and print official prescription slip with common-man guide"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Slip (PDF)
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/consultation/${rx.patientId}`)}
                    className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                  >
                    Review / Edit <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">Clinical Diagnosis</span>
                  <span className="font-black text-slate-800 text-sm">{rx.diagnosis}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">Doctor Advice & Dietary Notes</span>
                  <span className="text-slate-700 font-medium">{rx.clinicalNotes || 'Regular diet, adequate hydration and avoid cold exposure.'}</span>
                </div>
              </div>

              {/* Medication Table with Patient Common-Man Guide */}
              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Medication & Common Man Guide</th>
                      <th className="py-2.5 px-4">Dosage</th>
                      <th className="py-2.5 px-4">Frequency</th>
                      <th className="py-2.5 px-4">Duration</th>
                      <th className="py-2.5 px-4">Pharmacy Stock Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rx.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-black text-slate-800 max-w-xs">
                          <div className="text-sm font-black text-slate-900">{item.medicineName}</div>
                          {item.description && (
                            <div className="text-[11px] font-medium text-slate-600 mt-1">
                              <strong className="text-slate-800 font-semibold">What it is:</strong> {item.description}
                            </div>
                          )}
                          {item.purpose && (
                            <div className="text-[11px] font-medium text-emerald-800 mt-0.5">
                              <strong className="text-emerald-950 font-semibold">Why used:</strong> {item.purpose}
                            </div>
                          )}
                          {item.instructions && (
                            <span className="block text-[11px] font-normal text-slate-500 italic mt-0.5">
                              Note: {item.instructions}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-bold">{item.dosage}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[11px]">
                            {item.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-bold">{item.durationDays} days</td>
                        <td className="py-3 px-4">
                          {item.inStock !== false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> In PHC Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <AlertCircle className="w-3 h-3" /> External Dispense
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Follow-up date notification if present */}
              {rx.followUpDate && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Scheduled Review / Follow-up Visit:</span>
                    <span className="font-black underline decoration-emerald-400">{rx.followUpDate}</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    ASHAs & ANMs Notified
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
