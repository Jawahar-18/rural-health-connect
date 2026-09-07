import React from 'react';
import { apiService } from '../../services/apiService';
import { 
  Building2, 
  ArrowRightLeft, 
  FileSpreadsheet
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';

export const DistrictDashboard: React.FC = () => {
  const facilities = apiService.getFacilityKPIs();

  const totalPatients = facilities.reduce((acc, f) => acc + f.totalPatientsToday, 0);
  const avgReferralComp = Math.round(facilities.reduce((acc, f) => acc + f.referralCompletionRate, 0) / facilities.length);
  const totalHighRisk = facilities.reduce((acc, f) => acc + f.highRiskPatientsCount, 0);

  // Referral Funnel Data
  const referralFunnelData = [
    { value: 120, name: '1. Created (PHC)', fill: '#2563EB' },
    { value: 104, name: '2. Accepted (Specialist)', fill: '#0F766E' },
    { value: 92, name: '3. Appointment Booked', fill: '#16A34A' },
    { value: 88, name: '4. Patient Attended', fill: '#15803D' },
    { value: 84, name: '5. Completed / Care Returned', fill: '#166534' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header - Rich Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 text-white shadow-xl border-2 border-amber-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <span className="bg-white/15 backdrop-blur-md text-amber-200 text-xs font-black px-3 py-1 rounded-full uppercase border border-white/20 shadow-inner">
            District Governance & DHO Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">Pune District Health Headquarters</h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium">
            Government of Maharashtra Public Healthcare Performance & Closed-Loop Referral Analytics
          </p>
        </div>

        <button
          onClick={() => alert('Generating District Healthcare Governance PDF Report...')}
          className="relative z-10 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 hover:scale-102 active:scale-95 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export District Quality Report
        </button>
      </div>

      {/* 8 District Level KPIs - Bold 2px Borders & Deep Shadows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Total PHCs / CHCs</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{facilities.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Pune District Sector</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Patients Today</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalPatients}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Across 5 Facilities</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-purple-300 hover:border-purple-500 bg-purple-50/20 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-purple-700 uppercase tracking-wider">Avg Referral Rate</div>
          <div className="text-3xl font-black text-purple-600 mt-2">{avgReferralComp}%</div>
          <div className="text-xs text-purple-800 font-bold mt-1">District Benchmark &gt;80%</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-rose-300 hover:border-rose-500 bg-rose-50/20 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-rose-700 uppercase tracking-wider">Total High-Risk Cohort</div>
          <div className="text-3xl font-black text-rose-600 mt-2">{totalHighRisk}</div>
          <div className="text-xs text-rose-800 font-bold mt-1">Proactive ASHA Tracking</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Completion Funnel Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-purple-600" /> District Referral Completion Funnel
          </h3>
          <p className="text-xs text-slate-500">Tracking patients from PHC origin through tertiary care completion</p>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referralFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={160} />
                <Tooltip />
                <Bar dataKey="value" fill="#0F766E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Performance Ranking */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gov-green-700" /> Facility Level Performance Ranking
          </h3>
          <p className="text-xs text-slate-500">Referral completion rate vs average patient wait time</p>

          <div className="space-y-2.5 text-xs">
            {facilities.map((fac, idx) => (
              <div key={fac.facilityId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">#{idx + 1} {fac.facilityName}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Patients Today: {fac.totalPatientsToday} • Avg Wait: {fac.avgWaitingTimeMinutes} mins
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-700">{fac.referralCompletionRate}%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Referral Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
