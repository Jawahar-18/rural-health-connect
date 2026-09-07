import React from 'react';
import { apiService } from '../../services/apiService';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const FacilityDashboard: React.FC = () => {
  const kpiData = apiService.getFacilityKPIs()[0];
  const stock = apiService.getMedicineStock();

  const volumeData = [
    { day: 'Mon', patients: 38 },
    { day: 'Tue', patients: 45 },
    { day: 'Wed', patients: 52 },
    { day: 'Thu', patients: 40 },
    { day: 'Fri', patients: 61 },
    { day: 'Sat', patients: 48 },
    { day: 'Today', patients: 48 },
  ];

  const stockPieData = [
    { name: 'Available', value: stock.filter(s => s.status === 'AVAILABLE').length, color: '#16A34A' },
    { name: 'Low Stock', value: stock.filter(s => s.status === 'LOW_STOCK').length, color: '#F59E0B' },
    { name: 'Out of Stock', value: stock.filter(s => s.status === 'OUT_OF_STOCK').length, color: '#DC2626' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header - Rich Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white shadow-xl border-2 border-purple-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-purple-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            PHC / CHC Facility Operations Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{kpiData.facilityName} Dashboard</h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            District: <strong className="text-white">{kpiData.district}</strong> • Medical Officer In-Charge Operations & Resource Allocation
          </p>
        </div>
      </div>

      {/* 8 Operational KPIs Grid - Bold Borders & Deep Shadows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-indigo-400 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Patients Today</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{kpiData.totalPatientsToday}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">↑ 12% vs last week</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/90 hover:border-indigo-400 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Avg Wait Time</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{kpiData.avgWaitingTimeMinutes} <span className="text-sm font-semibold text-slate-500">mins</span></div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Within 20 min Target</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-purple-300 hover:border-purple-500 bg-purple-50/20 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-purple-700 uppercase tracking-wider">Referral Completion</div>
          <div className="text-3xl font-black text-purple-600 mt-2">{kpiData.referralCompletionRate}%</div>
          <div className="text-xs text-purple-800 font-bold mt-1">Target: &gt;85% (Optimal)</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-rose-300 hover:border-rose-500 bg-rose-50/20 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="text-xs font-black text-rose-700 uppercase tracking-wider">Medicine Shortages</div>
          <div className="text-3xl font-black text-rose-600 mt-2">{kpiData.medicineShortageCount}</div>
          <div className="text-xs text-rose-800 font-bold mt-1">Reorder Required</div>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Patient Volume Trend Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Daily Patient OPD Volume Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="patients" fill="#15803D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medicine Inventory Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Medicine Stock Status Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Low Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-600"></span> Out of Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};
