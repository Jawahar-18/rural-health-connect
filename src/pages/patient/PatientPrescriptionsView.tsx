import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Prescription } from '../../types';
import { 
  Pill, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Building2, 
  Package
} from 'lucide-react';

export const PatientPrescriptionsView: React.FC = () => {
  const { currentUser } = useAuth();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const prescriptions: Prescription[] = apiService.getPrescriptions().filter(p => p.patientId === patient.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Pill className="w-3.5 h-3.5 text-emerald-300" />
            MY E-PRESCRIPTIONS & DOSAGE SCHEDULE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Digital Prescriptions & Dosage Instructions
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Authorized Digital Prescriptions for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-gov-green-700" /> Print Prescription
        </button>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Showing only medical officer prescriptions issued to <strong>{patient.name}</strong>.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
          {prescriptions.length} Active Prescription(s)
        </span>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-700">No Prescriptions Found</h2>
          <p className="text-xs text-slate-500">You currently do not have any active medical prescriptions recorded.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => (
            <div 
              key={rx.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6"
            >
              {/* Prescription Header / Doctor info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-100 text-gov-green-700 rounded-2xl">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900">{rx.doctorName || 'Dr. Rajesh Deshmukh'}</div>
                    <div className="text-xs font-semibold text-slate-600">Medical Officer (MBBS, MD) • Reg #MMC-2012-4589</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {rx.facilityName || 'PHC Junnar, Pune'}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[11px] font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300 inline-block uppercase">
                    E-Rx ID: {rx.id.toUpperCase()}
                  </span>
                  <div className="text-xs text-slate-500 font-medium">Issued Date: <strong className="text-slate-900">{rx.date}</strong></div>
                  {rx.followUpDate && (
                    <div className="text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md inline-block border border-teal-200">
                      Next Follow-up: {rx.followUpDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Diagnosis & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1 text-xs">
                  <div className="font-black text-slate-500 uppercase tracking-wider text-[10px]">Clinical Diagnosis</div>
                  <div className="text-sm font-black text-slate-900">{rx.diagnosis}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1 text-xs">
                  <div className="font-black text-slate-500 uppercase tracking-wider text-[10px]">Doctor Clinical Remarks</div>
                  <div className="text-xs font-semibold text-slate-800">{rx.clinicalNotes}</div>
                </div>
              </div>

              {/* Medicines Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-gov-green-700" />
                  Prescribed Medicines & Dosage Instructions ({rx.items.length})
                </h3>

                <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[11px] border-b-2 border-slate-200">
                      <tr>
                        <th className="p-3.5">Medicine Name</th>
                        <th className="p-3.5">Dosage</th>
                        <th className="p-3.5">Timing & Frequency</th>
                        <th className="p-3.5">Duration</th>
                        <th className="p-3.5">PHC Pharmacy Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-800 bg-white">
                      {rx.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 text-sm">
                            {item.medicineName}
                          </td>
                          <td className="p-3.5 text-slate-700 font-mono font-bold">
                            {item.dosage}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold inline-block">
                              {item.frequency}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-700 font-bold">
                            {item.durationDays} Days
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                              <Package className="w-3 h-3 text-emerald-700" /> In Stock at PHC
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pharmacy pickup & dietary instructions */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-xs space-y-1 text-amber-950">
                <div className="font-black flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Pharmacy Dispensing Instructions:
                </div>
                <p>
                  Please present your token or ABHA card at PHC Junnar Dispensary (Counter #2). All essential medicines listed above are provided free of cost under National Health Mission (NHM).
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
