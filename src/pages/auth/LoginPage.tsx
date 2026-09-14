import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import type { UserRole } from '../../types';
import { HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { switchRole, availableDemoUsers } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    switch (role) {
      case 'PATIENT': navigate('/patient/dashboard'); break;
      case 'HEALTH_WORKER': navigate('/worker/dashboard'); break;
      case 'DOCTOR': navigate('/doctor/dashboard'); break;
      case 'FACILITY_ADMIN': navigate('/facility/dashboard'); break;
      case 'DISTRICT_ADMIN': navigate('/district/dashboard'); break;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'PATIENT': return t('rolePatient');
      case 'HEALTH_WORKER': return t('roleHealthWorker');
      case 'DOCTOR': return t('roleDoctor');
      case 'FACILITY_ADMIN': return t('roleFacilityAdmin');
      case 'DISTRICT_ADMIN': return t('roleDistrictAdmin');
      default: return String(role).replace('_', ' ');
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gov-green-600 text-white shadow-xl mb-4">
          <HeartPulse className="w-10 h-10 text-emerald-200" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{t('appTitle')}</h2>
        <p className="text-xs text-gov-green-400 font-semibold mt-1">{t('appSubtitle')}</p>
        <div className="inline-block mt-3 bg-slate-800 text-slate-300 text-[11px] px-3 py-1 rounded-full border border-slate-700 font-medium">
          <Sparkles className="w-3 h-3 inline text-gov-green-400 mr-1" /> {t('sihBadge')}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">{t('demoModeNotice')}</h3>

          <div className="space-y-2.5">
            {availableDemoUsers.map((u) => (
              <button
                key={u.role}
                onClick={() => handleDemoLogin(u.role)}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-gov-green-600 hover:bg-gov-green-50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-gov-green-900">{u.name}</div>
                  <div className="text-[11px] text-gov-green-700 font-semibold">{getRoleLabel(u.role)}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-gov-green-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            🔒 Secure OAuth 2.0 / Aadhaar Health ID (ABHA) Integration Ready
          </div>
        </div>
      </div>
    </div>
  );
};

