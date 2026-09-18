import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useTranslation } from '../../context/MultilingualContext';
import { generateDistrictQualityReport } from '../../utils/pdfGenerator';
import { AdminFeedbackCenter } from '../../components/admin/AdminFeedbackCenter';
import { 
  Building2, 
  ArrowRightLeft, 
  FileSpreadsheet,
  CheckCircle2,
  Loader2
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
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const facilities = apiService.getFacilityKPIs();

  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      generateDistrictQualityReport({
        districtName: 'Pune District Health Headquarters',
        facilities,
        referrals: apiService.getReferrals(),
        patients: apiService.getPatients(),
        medicines: apiService.getMedicineStock()
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const totalPatients = facilities.reduce((acc, f) => acc + f.totalPatientsToday, 0);
  const avgReferralComp = Math.round(facilities.reduce((acc, f) => acc + f.referralCompletionRate, 0) / facilities.length);
  const totalHighRisk = facilities.reduce((acc, f) => acc + f.highRiskPatientsCount, 0);

  // Referral Funnel Data
  const referralFunnelData = [
    { value: 120, name: `1. ${t('statusCreated')}`, fill: '#2563EB' },
    { value: 104, name: `2. ${t('statusAccepted')}`, fill: '#0F766E' },
    { value: 92, name: `3. ${t('statusBooked')}`, fill: '#16A34A' },
    { value: 88, name: `4. ${t('statusAttended')}`, fill: '#15803D' },
    { value: 84, name: `5. ${t('statusCompleted')}`, fill: '#166534' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header - Unified Lush Mint & Teal Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg shadow-teal-900/10 border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase border border-white/30 shadow-inner">
            {t('districtPortalTag')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 drop-shadow-xs">{t('districtHqTitle')}</h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            {t('appSubtitle')}
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="relative z-10 px-5 py-3 bg-white hover:bg-teal-50 disabled:bg-slate-100 text-teal-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md flex items-center gap-2 hover:scale-102 active:scale-95 transition-all cursor-pointer"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
              <span>Generating PDF...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Downloaded PDF!</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-amber-700" />
              <span>{t('exportQualityReport')}</span>
            </>
          )}
        </button>
      </div>

      {/* 8 District Level KPIs - Smooth & Light Refined Shadows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('totalFacilities')}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{facilities.length}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Pune District Sector</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('totalPatientsToday')}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalPatients}</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Across 5 Facilities</div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50/40 p-5 rounded-3xl border border-purple-200/80 hover:border-purple-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-purple-700 uppercase tracking-wider">{t('avgReferralRate')}</div>
          <div className="text-3xl font-black text-purple-600 mt-2">{avgReferralComp}%</div>
          <div className="text-xs text-purple-700 font-bold mt-1">{t('districtBenchmark')}</div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50/40 p-5 rounded-3xl border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="text-xs font-black text-rose-700 uppercase tracking-wider">{t('totalHighRiskCohort')}</div>
          <div className="text-3xl font-black text-rose-600 mt-2">{totalHighRisk}</div>
          <div className="text-xs text-rose-700 font-bold mt-1">{t('proactiveTracking')}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Completion Funnel Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-purple-600" /> {t('referralCompletionFunnel')}
          </h3>
          <p className="text-xs text-slate-500">{t('continuityTracking')}</p>

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
            <Building2 className="w-4 h-4 text-gov-green-700" /> {t('facilityRanking')}
          </h3>
          <p className="text-xs text-slate-500">{t('referralCompletionRate')} vs {t('avgWaitTime')}</p>

          <div className="space-y-2.5 text-xs">
            {facilities.map((fac, idx) => (
              <div key={fac.facilityId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">#{idx + 1} {fac.facilityName}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {t('totalPatientsToday')}: {fac.totalPatientsToday} • {t('avgWaitTime')}: {fac.avgWaitingTimeMinutes} mins
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-700">{fac.referralCompletionRate}%</div>
                  <div className="text-[10px] text-slate-400 font-medium">{t('referralCompletionRate')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Patient Care Grievances & Retention Center */}
      <div className="pt-2">
        <div className="mb-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">District Patient Grievance & Care Refusal Oversight</h2>
          <p className="text-xs text-slate-500">District-level teleconsultation feedback oversight, refusal alert intervention ("I will not come"), and automated 5–6x continuous follow-up archiving governance.</p>
        </div>
        <AdminFeedbackCenter role="DISTRICT_ADMIN" />
      </div>
    </div>
  );
};

