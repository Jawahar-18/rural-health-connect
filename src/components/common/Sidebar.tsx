import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  FileText, 
  ArrowRightLeft, 
  Pill, 
  Activity, 
  Package, 
  Bell, 
  User, 
  Users, 
  UserPlus, 
  Stethoscope, 
  AlertTriangle, 
  WifiOff, 
  Building2, 
  BarChart3, 
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onMobileClose }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const role = currentUser.role;

  const getMenuItems = () => {
    switch (role) {
      case 'PATIENT':
        return [
          { to: '/patient/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { to: '/patient/appointments', label: t('navAppointments'), icon: Calendar },
          { to: '/patient/queue', label: t('navQueue'), icon: Clock },
          { to: '/patient/records', label: t('navMedicalRecords'), icon: FileText },
          { to: '/patient/referrals', label: t('navReferrals'), icon: ArrowRightLeft },
          { to: '/patient/prescriptions', label: t('navPrescriptions'), icon: Pill },
          { to: '/patient/diagnostics', label: t('navDiagnostics'), icon: Activity },
          { to: '/patient/medicines', label: t('navMedicines'), icon: Package },
          { to: '/patient/followups', label: t('navFollowups'), icon: HeartPulse },
          { to: '/patient/notifications', label: t('navNotifications'), icon: Bell },
          { to: '/patient/profile', label: t('navProfile'), icon: User },
        ];

      case 'HEALTH_WORKER':
        return [
          { to: '/worker/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { to: '/worker/patients', label: t('navPatients'), icon: Users },
          { to: '/worker/patients/register', label: t('navRegisterPatient'), icon: UserPlus },
          { to: '/worker/triage', label: t('navTriage'), icon: Stethoscope },
          { to: '/worker/appointments', label: t('navAppointments'), icon: Calendar },
          { to: '/worker/referrals', label: t('navReferrals'), icon: ArrowRightLeft },
          { to: '/worker/followups', label: t('navFollowups'), icon: HeartPulse },
          { to: '/worker/high-risk', label: t('navHighRisk'), icon: AlertTriangle },
          { to: '/worker/offline-sync', label: t('navOfflineSync'), icon: WifiOff },
        ];

      case 'DOCTOR':
        return [
          { to: '/doctor/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { to: '/doctor/queue', label: t('navTodayQueue'), icon: Clock },
          { to: '/doctor/patients', label: t('navPatients'), icon: Users },
          { to: '/doctor/referrals', label: t('navReferrals'), icon: ArrowRightLeft },
          { to: '/doctor/prescriptions', label: t('navPrescriptions'), icon: Pill },
          { to: '/doctor/followups', label: t('navFollowups'), icon: HeartPulse },
        ];

      case 'FACILITY_ADMIN':
        return [
          { to: '/facility/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { to: '/facility/queue', label: t('navQueue'), icon: Clock },
          { to: '/facility/appointments', label: t('navAppointments'), icon: Calendar },
          { to: '/facility/medicines', label: t('navMedicines'), icon: Package },
          { to: '/facility/diagnostics', label: t('navDiagnostics'), icon: Activity },
          { to: '/facility/referrals', label: t('navReferrals'), icon: ArrowRightLeft },
          { to: '/facility/reports', label: t('navReports'), icon: BarChart3 },
        ];

      case 'DISTRICT_ADMIN':
        return [
          { to: '/district/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { to: '/district/facilities', label: t('navFacilities'), icon: Building2 },
          { to: '/district/referrals', label: t('navReferrals'), icon: ArrowRightLeft },
          { to: '/district/medicines', label: t('navMedicines'), icon: Package },
          { to: '/district/quality', label: t('navQuality'), icon: ShieldCheck },
          { to: '/district/reports', label: t('navReports'), icon: BarChart3 },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm select-none transition-all duration-200">
      {/* Branding Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gov-green-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            <HeartPulse className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">Rural Health Connect</h1>
            <p className="text-xs text-gov-green-700 font-semibold">Govt of Maharashtra</p>
          </div>
        </div>

        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* User Info Badge */}
      <div className="mx-4 my-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</div>
        <div className="text-xs text-gov-green-800 font-bold truncate flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
          <span className="bg-emerald-100/80 text-emerald-900 px-2 py-0.5 rounded-full text-[11px]">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        {currentUser.facilityName && (
          <div className="text-xs text-slate-600 truncate mt-1.5 flex items-center gap-1 font-medium">
            <span>📍</span>
            <span className="truncate">{currentUser.facilityName}</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gov-green-700 text-white shadow-md shadow-gov-green-900/10 font-bold translate-x-0.5'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500 text-center">
        <div className="font-bold text-slate-700">HealthTech Platform v2.4</div>
        <div className="text-[11px] text-slate-400 font-medium">SIH 2026 Problem ID: 26133</div>
      </div>
    </aside>
  );
};
