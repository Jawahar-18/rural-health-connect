import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import { useOffline } from '../../context/OfflineContext';
import type { UserRole, LanguageCode } from '../../types';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  UserCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SihDemoHeader: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { isOnline, toggleSimulatedOffline, pendingSyncCount, syncDataNow } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);

  const roles: { role: UserRole; label: string; bg: string }[] = [
    { role: 'PATIENT', label: t('rolePatient'), bg: 'bg-emerald-600' },
    { role: 'HEALTH_WORKER', label: t('roleHealthWorker'), bg: 'bg-teal-600' },
    { role: 'DOCTOR', label: t('roleDoctor'), bg: 'bg-blue-600' },
    { role: 'FACILITY_ADMIN', label: t('roleFacilityAdmin'), bg: 'bg-purple-600' },
    { role: 'DISTRICT_ADMIN', label: t('roleDistrictAdmin'), bg: 'bg-amber-600' },
  ];

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await syncDataNow();
    setIsSyncing(false);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.1 }
    });
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-md">
      {/* Left: Branding & SIH Tag */}
      <div className="flex items-center gap-2">
        <span className="bg-gov-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> {t('sihBadge')}
        </span>
        <span className="hidden md:inline font-semibold text-slate-300">
          {t('appSubtitle')}
        </span>
      </div>

      {/* Center: SIH Judge Quick Demo Switcher */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-gov-green-400" /> {t('judgeRoleSwitch')}
        </span>
        {roles.map(r => (
          <button
            key={r.role}
            onClick={() => switchRole(r.role)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all text-[11px] whitespace-nowrap ${
              currentUser.role === r.role 
                ? `${r.bg} text-white shadow-sm ring-2 ring-white/30 font-semibold scale-105` 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>


      {/* Right: Language Selector & Network Simulator */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-md px-2 py-1 border border-slate-700">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Network status & sync trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSimulatedOffline}
            title="Click to simulate offline network condition"
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              isOnline 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900' 
                : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-1 rounded-md text-[11px] flex items-center gap-1 transition-transform active:scale-95 shadow"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({pendingSyncCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
