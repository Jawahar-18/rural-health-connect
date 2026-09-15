import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { 
  FileText, 
  Printer, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Users, 
  Share2, 
  FileSpreadsheet, 
  CheckCircle2, 
  Activity,
  Heart,
  Baby,
  Stethoscope
} from 'lucide-react';

export const DistrictReportsView: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const kpis = apiService.getFacilityKPIs();
  const allReferrals = apiService.getReferrals();

  const totalPatientsSeen = kpis.reduce((acc, k) => acc + k.totalPatientsToday * 28, 0);
  const districtAvgReferralRate = Math.round(
    kpis.reduce((acc, k) => acc + k.referralCompletionRate, 0) / (kpis.length || 1)
  );

  const handleExport = (format: 'PDF' | 'EXCEL') => {
    setExportNotice(`Compiling official Pune District Health Bulletin (${format}) for State Director of Health Services...`);
    setTimeout(() => {
      setExportNotice(null);
      window.print();
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border-2 border-indigo-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-indigo-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <FileText className="w-3.5 h-3.5 text-indigo-300" />
            GOVERNMENT OF MAHARASHTRA • DISTRICT HEALTH SOCIETY
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            District Healthcare & Epidemiological Reports
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium">
            Executive epidemiological surveillance, maternal-child indices & primary healthcare delivery reports for Pune District
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-700" /> Print Bulletin
          </button>
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Raw Dataset
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Interval Selector */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Statistical Horizon:</span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto">
          {(['MONTHLY', 'QUARTERLY', 'ANNUAL'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setReportPeriod(period)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                reportPeriod === period ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === 'MONTHLY' ? 'Monthly Health Review' : period === 'QUARTERLY' ? 'Quarterly Surveillance' : 'Annual Health Report'}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Aggregated District OPD</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalPatientsSeen.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +9.8% rural access penetration
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>District Referral Retention</span>
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {districtAvgReferralRate}%
          </div>
          <div className="text-xs text-slate-500 font-bold">
            {allReferrals.length} referrals tracked across blocks
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Maternal ANC Registration</span>
            <Baby className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            96.4%
          </div>
          <div className="text-xs text-emerald-600 font-bold">
            Early 1st-trimester detection index
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>EHR & ABHA Linkage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            99.1%
          </div>
          <div className="text-xs text-emerald-600 font-bold">
            Full compliance with National Digital Health Mission
          </div>
        </div>
      </div>

      {/* Disease Burden & Block Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Prevalence */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">District Epidemiological Profile</h2>
              <p className="text-xs text-slate-500">Disease distribution across screened population</p>
            </div>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-4">
            {[
              { condition: 'Hypertension & Cardiovascular Risk', cases: '14,240', pct: 36, color: 'bg-indigo-600', icon: Heart },
              { condition: 'Type 2 Diabetes Mellitus', cases: '9,810', pct: 25, color: 'bg-teal-600', icon: Activity },
              { condition: 'Maternal Anemia (Hb < 11g/dL)', cases: '6,450', pct: 16, color: 'bg-rose-500', icon: Baby },
              { condition: 'Acute Respiratory & Flu Illness', cases: '5,120', pct: 13, color: 'bg-amber-500', icon: Stethoscope },
              { condition: 'Vector-Borne & Seasonal Infections', cases: '3,890', pct: 10, color: 'bg-blue-500', icon: Activity },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-slate-500" /> {item.condition}
                    </span>
                    <span className="text-slate-500">{item.cases} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Block Level Operational Performance Table */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Taluka / Block Performance Matrix</h2>
              <p className="text-xs text-slate-500">OPD volumes, follow-up retention & medicine stock</p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {[
              { block: 'Junnar Taluka', facilities: 8, opd: '4,120/mo', followups: '86%', stockHealth: '94%' },
              { block: 'Ambegaon Taluka', facilities: 6, opd: '3,450/mo', followups: '82%', stockHealth: '91%' },
              { block: 'Khed Taluka', facilities: 7, opd: '3,890/mo', followups: '79%', stockHealth: '89%' },
              { block: 'Shirur Taluka', facilities: 5, opd: '2,980/mo', followups: '84%', stockHealth: '96%' },
              { block: 'Haveli & Urban Periphery', facilities: 12, opd: '7,650/mo', followups: '88%', stockHealth: '97%' },
            ].map((blk, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-slate-900">{blk.block}</div>
                  <div className="text-[11px] text-slate-500">{blk.facilities} Healthcare Centers • OPD: {blk.opd}</div>
                </div>
                <div className="flex items-center gap-3 text-right shrink-0 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Follow-ups</div>
                    <div className="font-black text-emerald-700">{blk.followups}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Pharmacy</div>
                    <div className="font-black text-indigo-700">{blk.stockHealth}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Overview Table */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">District Facility Operational Status</h2>
            <p className="text-xs text-slate-500">Live KPIs reported by facility administration portals</p>
          </div>
          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
            {kpis.length} Monitored Facilities
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Facility Name</th>
                <th className="py-2.5 px-4">District / Block</th>
                <th className="py-2.5 px-4">Daily OPD</th>
                <th className="py-2.5 px-4">Avg Wait Time</th>
                <th className="py-2.5 px-4">Referral Completion</th>
                <th className="py-2.5 px-4">Follow-up Retention</th>
                <th className="py-2.5 px-4">Medicine Shortages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kpis.map((k) => (
                <tr key={k.facilityId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-900">{k.facilityName}</td>
                  <td className="py-3 px-4 text-slate-600">{k.district}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{k.totalPatientsToday}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{k.avgWaitingTimeMinutes} mins</td>
                  <td className="py-3 px-4 font-black text-emerald-700">{k.referralCompletionRate}%</td>
                  <td className="py-3 px-4 font-black text-teal-700">{k.followupCompletionRate}%</td>
                  <td className="py-3 px-4">
                    {k.medicineShortageCount === 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Zero Shortage
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {k.medicineShortageCount} Low Stock
                      </span>
                    )}
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
