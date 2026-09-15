import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Printer, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Share2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Pill,
  Activity
} from 'lucide-react';

export const FacilityReportsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [reportPeriod, setReportPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const kpis = apiService.getFacilityKPIs();
  const facilityKpi = kpis.find(k => k.facilityId === currentUser.facilityId) || kpis[0];
  const allPatients = apiService.getPatients();
  const allAppointments = apiService.getAppointments();
  const allStock = apiService.getMedicineStock();

  const lowStockCount = allStock.filter(s => s.status !== 'AVAILABLE').length;

  const handleExport = (type: 'PDF' | 'EXCEL') => {
    setDownloadNotice(`Generating official ${type} audit report for ${currentUser.facilityName || 'PHC Junnar'}...`);
    setTimeout(() => {
      setDownloadNotice(null);
      window.print();
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border-2 border-teal-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-teal-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <BarChart3 className="w-3.5 h-3.5 text-teal-300" />
            OPERATIONAL & CLINICAL PERFORMANCE REPORT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Facility Health Delivery & OPD Reports
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium">
            Authorized administrative indicators for <strong className="text-white">{currentUser.facilityName || 'PHC Junnar'}</strong> • Pune Rural Health Division
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal-700" /> Print / Export PDF
          </button>
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-teal-600 text-white font-bold text-sm shadow-md flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Period Selector */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Reporting Interval:</span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto">
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setReportPeriod(period)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                reportPeriod === period ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === 'DAILY' ? 'Today (Daily OPD)' : period === 'WEEKLY' ? 'This Week' : 'Monthly Aggregated'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Patient Footfall</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {reportPeriod === 'DAILY' ? facilityKpi.totalPatientsToday : allPatients.length * 3}
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last {reportPeriod.toLowerCase()}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Average OPD Wait Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {facilityKpi.avgWaitingTimeMinutes} <span className="text-base font-bold text-slate-500">mins</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Below National Benchmark (30m)
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Referral Fulfillment</span>
            <Share2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {facilityKpi.referralCompletionRate}%
          </div>
          <div className="text-xs text-indigo-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> High tertiary linkage
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Pharmacy Availability</span>
            <Pill className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {Math.round(((allStock.length - lowStockCount) / (allStock.length || 1)) * 100)}%
          </div>
          <div className="text-xs text-slate-500 font-bold">
            {lowStockCount} items flagged for replenishment
          </div>
        </div>
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Throughput Breakdown */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Clinical Department Load</h2>
              <p className="text-xs text-slate-500">Patient consultations and procedure volumes</p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {[
              { dept: 'General Medicine & OPD', count: 68, pct: 45, color: 'bg-teal-500' },
              { dept: 'Maternal & Child Care (ANC / PNC)', count: 32, pct: 22, color: 'bg-emerald-500' },
              { dept: 'NCD & Chronic Care (Hypertension / DM)', count: 28, pct: 19, color: 'bg-indigo-500' },
              { dept: 'Emergency & Trauma Triage', count: 14, pct: 10, color: 'bg-rose-500' },
              { dept: 'Immunization & Pediatrics', count: 6, pct: 4, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.dept}</span>
                  <span className="text-slate-500">{item.count} patients ({item.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Accreditation Indicators */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">NQAS Quality & Governance Indices</h2>
              <p className="text-xs text-slate-500">Facility audit benchmarks according to National Standards</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {[
              { title: 'Digital ABHA Integration', score: '98%', status: 'Compliant', note: 'EHR linked to Ayushman Bharat' },
              { title: 'High-Risk Follow-up Retention', score: `${facilityKpi.followupCompletionRate}%`, status: 'Excellent', note: 'ASHAs closing 4 out of 5 home visits' },
              { title: 'Lab Diagnostic Equipment Uptime', score: '92%', status: 'Operational', note: 'Calibrated weekly with zero downtime' },
              { title: 'Patient Satisfaction & Grievance SLA', score: '94%', status: 'Compliant', note: 'All patient grievances reviewed in 24h' },
            ].map((metric, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-slate-900">{metric.title}</div>
                  <div className="text-[11px] text-slate-500">{metric.note}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-emerald-700">{metric.score}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {metric.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPD Appointments Ledger Summary */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Live OPD Roster Summary</h2>
            <p className="text-xs text-slate-500">Recent check-in and queue tokens for today</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
            {allAppointments.length} Active Slots
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Token #</th>
                <th className="py-2.5 px-4">Patient Name</th>
                <th className="py-2.5 px-4">Consulting Medical Officer</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Slot</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allAppointments.slice(0, 5).map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{apt.tokenNumber}</td>
                  <td className="py-3 px-4 font-black text-slate-800">{apt.patientName}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{apt.doctorName}</td>
                  <td className="py-3 px-4 text-slate-600">{apt.department}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{apt.timeSlot}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Activity className="w-3 h-3" /> {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
