import React from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  CheckCircle2, 
  FileText, 
  Download, 
  Building2
} from 'lucide-react';

export const PatientDiagnosticsView: React.FC = () => {
  const { currentUser } = useAuth();
  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];
  const equipment = apiService.getDiagnosticEquipment().filter(e => e.facilityId === 'fac-phc-junnar');

  const patientLabReports = [
    {
      id: 'lab-901',
      testName: 'Complete Blood Count (CBC) - Hemoglobin',
      category: 'Pathology & Hematology',
      date: '2026-08-15',
      resultValue: '12.8 g/dL',
      referenceRange: '12.0 - 15.5 g/dL',
      status: 'NORMAL',
      doctorRemarks: 'Adequate hemoglobin levels. No signs of anemia.',
    },
    {
      id: 'lab-902',
      testName: 'Fasting Blood Glucose (FBS)',
      category: 'Biochemistry / Diabetes Screening',
      date: '2026-08-15',
      resultValue: '104 mg/dL',
      referenceRange: '70 - 110 mg/dL',
      status: 'NORMAL',
      doctorRemarks: 'Euglycemic fasting level within expected rural adult guidelines.',
    },
    {
      id: 'lab-903',
      testName: 'Lipid Profile (Serum Cholesterol)',
      category: 'Cardiovascular Risk Assessment',
      date: '2026-06-20',
      resultValue: '182 mg/dL',
      referenceRange: '< 200 mg/dL',
      status: 'NORMAL',
      doctorRemarks: 'Desirable total cholesterol. Maintain low saturated fat dietary regimen.',
    },
    {
      id: 'lab-904',
      testName: 'Urine Routine & Albumin Check',
      category: 'Nephrology / Routine Screening',
      date: '2026-06-20',
      resultValue: 'Nil / Negative',
      referenceRange: 'Negative for Albumin/Glucose',
      status: 'NORMAL',
      doctorRemarks: 'Normal renal excretion with zero proteinuria.',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            MY DIAGNOSTIC & LAB TEST REPORTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diagnostics & Pathology Lab Status
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Lab History for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-gov-green-700" /> Download Reports
        </button>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Showing verified lab reports conducted for <strong>{patient.name}</strong> at PHC Junnar Diagnostic Wing.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
          {patientLabReports.length} Test Reports
        </span>
      </div>

      {/* Personal Lab Reports Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gov-green-700" />
          My Diagnostic Lab Test Results
        </h2>

        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[11px] border-b-2 border-slate-200">
              <tr>
                <th className="p-3.5">Investigation / Test</th>
                <th className="p-3.5">Test Date</th>
                <th className="p-3.5">Recorded Result</th>
                <th className="p-3.5">Biological Reference Range</th>
                <th className="p-3.5">Clinical Status</th>
                <th className="p-3.5">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-800 bg-white">
              {patientLabReports.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-black text-slate-900 text-sm">{lab.testName}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{lab.category}</div>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {lab.date}
                  </td>
                  <td className="p-3.5 font-black text-emerald-700 text-sm font-mono">
                    {lab.resultValue}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium font-mono text-[11px]">
                    {lab.referenceRange}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block">
                      NORMAL
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 text-xs font-medium max-w-xs">
                    {lab.doctorRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local PHC Equipment Availability & Turnaround Time */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gov-teal-700" />
              PHC Junnar On-Site Diagnostic Equipment & Turnaround Time
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Availability of diagnostic testing machines at your registered healthcare facility</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-100 text-teal-900 rounded-full border border-teal-300">
            {equipment.length} Machines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {equipment.map((eq) => (
            <div 
              key={eq.id}
              className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2 text-xs"
            >
              <div className="font-bold text-slate-900 text-sm">{eq.name}</div>
              <div className="text-slate-500 text-[11px]">{eq.category}</div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  eq.status === 'FUNCTIONAL' 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {eq.status}
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  Turnaround: ~{eq.turnaroundTimeHours}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
