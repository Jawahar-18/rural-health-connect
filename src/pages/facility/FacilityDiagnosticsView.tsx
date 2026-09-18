import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { DiagnosticEquipment } from '../../types';
import { 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  Wrench, 
  Filter, 
  FileCheck, 
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';

export const FacilityDiagnosticsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [equipmentList, setEquipmentList] = useState<DiagnosticEquipment[]>(apiService.getDiagnosticEquipment());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [maintenanceSuccess, setMaintenanceSuccess] = useState<string | null>(null);

  const filteredList = equipmentList.filter(eq => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.facilityName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedStatus !== 'ALL') {
      return eq.status === selectedStatus;
    }
    return true;
  });

  const totalFunctional = equipmentList.filter(e => e.status === 'FUNCTIONAL').length;
  const totalMaintenance = equipmentList.filter(e => e.status === 'MAINTENANCE').length;
  const totalPendingReports = equipmentList.reduce((acc, e) => acc + e.pendingReportsCount, 0);
  const avgTurnaround = (equipmentList.reduce((acc, e) => acc + e.turnaroundTimeHours, 0) / (equipmentList.length || 1)).toFixed(1);

  const handleRequestCalibration = (eqId: string, name: string) => {
    setEquipmentList(prev => prev.map(e => e.id === eqId ? { ...e, status: 'MAINTENANCE' } : e));
    setMaintenanceSuccess(`Maintenance & calibration ticket raised for ${name}`);
    setTimeout(() => setMaintenanceSuccess(null), 4000);
  };

  const handleMarkOperational = (eqId: string, name: string) => {
    setEquipmentList(prev => prev.map(e => e.id === eqId ? { ...e, status: 'FUNCTIONAL' } : e));
    setMaintenanceSuccess(`${name} marked as 100% functional and ready for OPD.`);
    setTimeout(() => setMaintenanceSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-inner">
            <Activity className="w-3.5 h-3.5 text-emerald-200" />
            FACILITY DIAGNOSTICS & LAB STATUS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diagnostic Fleet & Pathology Lab Center
          </h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            Equipment uptime, specimen turnaround times & quality calibration for <strong className="text-white">{currentUser.facilityName || 'PHC Junnar'}</strong>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setEquipmentList(apiService.getDiagnosticEquipment())}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Status
          </button>
        </div>
      </div>

      {maintenanceSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span>{maintenanceSuccess}</span>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalFunctional} / {equipmentList.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Functional Units</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalMaintenance}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under Maintenance</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalPendingReports}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Specimen Reports</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{avgTurnaround}h</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Turnaround Time</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment, department, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {['ALL', 'FUNCTIONAL', 'MAINTENANCE', 'UNAVAILABLE'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((eq) => {
          const isFunctional = eq.status === 'FUNCTIONAL';
          const isMaintenance = eq.status === 'MAINTENANCE';

          return (
            <div
              key={eq.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-md flex flex-col justify-between ${
                isFunctional 
                  ? 'border-slate-200 hover:border-blue-300' 
                  : isMaintenance 
                    ? 'border-amber-300 bg-amber-50/20' 
                    : 'border-rose-300 bg-rose-50/20'
              }`}
            >
              <div className="space-y-4">
                {/* Status badge & ID */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                    {eq.id}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isFunctional
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMaintenance
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isFunctional ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operational
                      </>
                    ) : isMaintenance ? (
                      <>
                        <Wrench className="w-3.5 h-3.5 text-amber-600" /> Maintenance
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Offline
                      </>
                    )}
                  </span>
                </div>

                {/* Title and Category */}
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-snug">{eq.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {eq.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {eq.facilityName}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Turnaround Time
                    </span>
                    <span className="text-base font-black text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4 text-blue-600" /> {eq.turnaroundTimeHours} hrs
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pending Tests
                    </span>
                    <span className="text-base font-black text-slate-800 flex items-center gap-1 mt-0.5">
                      <Zap className="w-4 h-4 text-amber-500" /> {eq.pendingReportsCount} samples
                    </span>
                  </div>
                </div>

                {/* Lab Guidelines / Calibration note */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="font-bold text-slate-700">Daily Calibration:</span> Passed at 07:30 AM. Reagents & QC controls are verified for full OPD shift.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {isFunctional ? (
                  <button
                    onClick={() => handleRequestCalibration(eq.id, eq.name)}
                    className="w-full py-2 px-3 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Request Calibration
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkOperational(eq.id, eq.name)}
                    className="w-full py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Operational
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
