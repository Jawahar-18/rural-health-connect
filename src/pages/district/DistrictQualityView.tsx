import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Building2, 
  TrendingUp, 
  Printer, 
  FileText, 
  Bell, 
  Check,
  Zap
} from 'lucide-react';

interface FacilityQualityCard {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'SDH' | 'DH';
  block: string;
  nqasScore: number;
  clinicalAdherence: number;
  referralLoopClosure: number;
  patientGrievanceResolutionDays: number;
  infectionControlGrade: 'A+' | 'A' | 'B' | 'C';
  accreditationStatus: 'CERTIFIED' | 'IN_PROCESS' | 'ACTION_REQUIRED';
}

const DISTRICT_FACILITIES_QUALITY: FacilityQualityCard[] = [
  {
    id: 'fac-1',
    name: 'Primary Health Centre Junnar',
    type: 'PHC',
    block: 'Junnar Block',
    nqasScore: 92.4,
    clinicalAdherence: 94.1,
    referralLoopClosure: 88.5,
    patientGrievanceResolutionDays: 1.2,
    infectionControlGrade: 'A+',
    accreditationStatus: 'CERTIFIED'
  },
  {
    id: 'fac-2',
    name: 'Primary Health Centre Narayangaon',
    type: 'PHC',
    block: 'Junnar Block',
    nqasScore: 88.6,
    clinicalAdherence: 91.0,
    referralLoopClosure: 84.0,
    patientGrievanceResolutionDays: 1.8,
    infectionControlGrade: 'A',
    accreditationStatus: 'CERTIFIED'
  },
  {
    id: 'fac-3',
    name: 'Primary Health Centre Otur',
    type: 'PHC',
    block: 'Junnar Block',
    nqasScore: 78.2,
    clinicalAdherence: 82.5,
    referralLoopClosure: 72.0,
    patientGrievanceResolutionDays: 3.5,
    infectionControlGrade: 'B',
    accreditationStatus: 'ACTION_REQUIRED'
  },
  {
    id: 'fac-4',
    name: 'Community Health Centre Manchar',
    type: 'CHC',
    block: 'Ambegaon Block',
    nqasScore: 89.1,
    clinicalAdherence: 90.2,
    referralLoopClosure: 86.4,
    patientGrievanceResolutionDays: 2.1,
    infectionControlGrade: 'A',
    accreditationStatus: 'CERTIFIED'
  },
  {
    id: 'fac-5',
    name: 'Sub-District Hospital Khed',
    type: 'SDH',
    block: 'Khed Block',
    nqasScore: 84.5,
    clinicalAdherence: 87.0,
    referralLoopClosure: 79.5,
    patientGrievanceResolutionDays: 2.8,
    infectionControlGrade: 'A',
    accreditationStatus: 'IN_PROCESS'
  },
  {
    id: 'fac-6',
    name: 'Pune District Civil Hospital Aundh',
    type: 'DH',
    block: 'Haveli Block',
    nqasScore: 95.2,
    clinicalAdherence: 96.8,
    referralLoopClosure: 92.1,
    patientGrievanceResolutionDays: 1.0,
    infectionControlGrade: 'A+',
    accreditationStatus: 'CERTIFIED'
  },
];

export const DistrictQualityView: React.FC = () => {
  const [facilities] = useState<FacilityQualityCard[]>(DISTRICT_FACILITIES_QUALITY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const districtAvgScore = (facilities.reduce((sum, f) => sum + f.nqasScore, 0) / facilities.length).toFixed(1);
  const certifiedCount = facilities.filter(f => f.accreditationStatus === 'CERTIFIED').length;
  const actionRequiredCount = facilities.filter(f => f.accreditationStatus === 'ACTION_REQUIRED').length;

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.block.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedStatus !== 'ALL' && f.accreditationStatus !== selectedStatus) return false;
    return true;
  });

  const handleIssueNotice = (name: string) => {
    setActionNotice(`Formal quality improvement notice transmitted to Chief Medical Officer of ${name}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleScheduleAudit = (name: string) => {
    setActionNotice(`Surprise clinical audit team dispatched to ${name} for next Thursday.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            DISTRICT CLINICAL GOVERNANCE & NQAS OVERSIGHT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Healthcare Quality & Governance Center
          </h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            National Quality Assurance Standards (NQAS), infection control grades & clinical compliance for Pune District
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-purple-700" /> Download Scorecard
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md flex items-center gap-3">
          <Check className="w-5 h-5 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>District Mean NQAS Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {districtAvgScore}%
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +3.4% higher than State average
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>NQAS Certified Facilities</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {certifiedCount} <span className="text-base font-bold text-slate-500">/ {facilities.length}</span>
          </div>
          <div className="text-xs text-slate-500 font-bold">
            {Math.round((certifiedCount / facilities.length) * 100)}% coverage achieved
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Critical Action Required</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {actionRequiredCount}
          </div>
          <div className="text-xs text-amber-700 font-bold">
            Pending infrastructure rectifications
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Avg Grievance Redressal</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            1.8 <span className="text-base font-bold text-slate-500">days</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold">
            Strict 48h Citizen Charter Met
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search facility name or block..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto">
          {['ALL', 'CERTIFIED', 'IN_PROCESS', 'ACTION_REQUIRED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedStatus === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Tiers' : status === 'ACTION_REQUIRED' ? 'Action Required' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Quality Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((fac) => {
          const isCertified = fac.accreditationStatus === 'CERTIFIED';
          const isAction = fac.accreditationStatus === 'ACTION_REQUIRED';

          return (
            <div 
              key={fac.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-md flex flex-col justify-between ${
                isAction 
                  ? 'border-rose-300 bg-rose-50/10' 
                  : isCertified 
                    ? 'border-slate-200 hover:border-purple-300' 
                    : 'border-amber-300 bg-amber-50/10'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {fac.type} • {fac.block}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isCertified
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAction
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isCertified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> NQAS Certified
                      </>
                    ) : isAction ? (
                      <>
                        <AlertCircle className="w-3 h-3 text-rose-600" /> Rectification
                      </>
                    ) : (
                      <>
                        <Award className="w-3 h-3 text-amber-600" /> Audit In Process
                      </>
                    )}
                  </span>
                </div>

                {/* Facility Name */}
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">{fac.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Infection Control Rating: <strong className="text-slate-700">{fac.infectionControlGrade}</strong></span>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      NQAS Audit Score
                    </span>
                    <span className="text-xl font-black text-purple-950 mt-0.5 block">
                      {fac.nqasScore}%
                    </span>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Clinical Protocol
                    </span>
                    <span className="text-xl font-black text-indigo-950 mt-0.5 block">
                      {fac.clinicalAdherence}%
                    </span>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 font-bold mb-1">
                      <span>Referral Follow-through</span>
                      <span className="text-slate-800">{fac.referralLoopClosure}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${fac.referralLoopClosure >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${fac.referralLoopClosure}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-slate-600 font-medium">
                    <span>Grievance Resolution:</span>
                    <span className="font-bold text-slate-900">{fac.patientGrievanceResolutionDays} days avg</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleScheduleAudit(fac.name)}
                  className="flex-1 py-2 px-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer border border-indigo-200"
                >
                  <FileText className="w-3.5 h-3.5" /> Surprise Audit
                </button>

                <button
                  onClick={() => handleIssueNotice(fac.name)}
                  className="flex-1 py-2 px-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer border border-rose-200"
                >
                  <Bell className="w-3.5 h-3.5" /> Issue Notice
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
