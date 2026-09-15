import React, { useState, useEffect, useRef } from 'react';
import { SihDemoHeader } from './SihDemoHeader';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { apiService } from '../../services/apiService';
import type { NotificationItem } from '../../types';
import { 
  Menu, 
  Bell, 
  WifiOff, 
  ChevronRight, 
  CheckCheck, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  ArrowRightLeft, 
  Package, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { currentUser } = useAuth();
  const { isOnline, pendingSyncCount, syncDataNow } = useOffline();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => apiService.getNotifications(currentUser.role));
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refreshNotifs = () => {
      setNotifications(apiService.getNotifications(currentUser.role));
    };
    refreshNotifs();

    window.addEventListener('rhc_notifications_updated', refreshNotifs);
    window.addEventListener('storage', refreshNotifs);
    return () => {
      window.removeEventListener('rhc_notifications_updated', refreshNotifs);
      window.removeEventListener('storage', refreshNotifs);
    };
  }, [currentUser.role]);

  // Click outside to close notification menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    apiService.markAllNotificationsRead(currentUser.role);
    setNotifications(apiService.getNotifications(currentUser.role));
  };

  const handleMarkSingleRead = (id: string) => {
    apiService.markNotificationRead(id);
    setNotifications(apiService.getNotifications(currentUser.role));
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'RISK_ALERT': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'QUEUE': return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'REFERRAL': return <ArrowRightLeft className="w-4 h-4 text-purple-600" />;
      case 'STOCK_ALERT': return <Package className="w-4 h-4 text-amber-600" />;
      default: return <Sparkles className="w-4 h-4 text-gov-green-700" />;
    }
  };

  const getNotificationsRoute = () => {
    switch (currentUser.role) {
      case 'PATIENT': return '/patient/notifications';
      case 'HEALTH_WORKER': return '/worker/followups';
      case 'DOCTOR': return '/doctor/followups';
      case 'FACILITY_ADMIN': return '/facility/reports';
      case 'DISTRICT_ADMIN': return '/district/quality';
      default: return '/patient/notifications';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-bg font-sans">
      {/* SIH Judge Demo Top Switcher Bar */}
      <SihDemoHeader />

      {/* Offline Alert Banner if offline or pending items */}
      {(!isOnline || pendingSyncCount > 0) && (
        <div className={`py-2 px-4 text-xs font-medium flex items-center justify-between shadow-inner ${
          !isOnline ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
        }`}>
          <div className="flex items-center gap-2 max-w-4xl">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              {!isOnline 
                ? 'Offline Mode Active: Patient registrations and triage data will be stored safely in local device storage.'
                : `Network Restored: ${pendingSyncCount} offline record(s) queued for synchronization.`}
            </span>
          </div>
          {pendingSyncCount > 0 && (
            <button
              onClick={() => syncDataNow()}
              className="bg-slate-950 hover:bg-slate-900 text-white px-3 py-1 rounded-md text-[11px] font-bold transition-all"
            >
              Sync Records ({pendingSyncCount})
            </button>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* Mobile Drawer Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for Mobile Menu & Notifications */}
          <header className="bg-white/95 backdrop-blur-md border-b-2 border-slate-200 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 uppercase tracking-wider hidden sm:inline-block shadow-2xs">
                  {currentUser.role.replace('_', ' ')} PORTAL
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                <span className="text-sm sm:text-base font-black text-slate-900">
                  {currentUser.facilityName || 'Public Healthcare Hub'}
                </span>
              </div>
            </div>

            {/* Right Top Header Actions */}
            <div className="flex items-center gap-3.5">
              {/* Notification Interactive Bell & Popover */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications & Alerts"
                  className={`relative p-2.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    notificationsOpen 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs'
                  }`}
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-400" />
                        <span className="font-extrabold text-sm tracking-tight">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto divide-y-2 divide-slate-100 p-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs font-semibold text-slate-400">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleMarkSingleRead(item.id)}
                            className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 my-1 ${
                              item.read 
                                ? 'bg-white hover:bg-slate-50 text-slate-600' 
                                : 'bg-emerald-50/60 hover:bg-emerald-50 text-slate-900 font-semibold border-l-4 border-emerald-500'
                            }`}
                          >
                            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                              {getNotifIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <div className="text-xs font-bold truncate text-slate-900">
                                  {item.title}
                                </div>
                                {!item.read && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                                {item.message}
                              </p>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {item.timestamp}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 border-t-2 border-slate-100 text-center">
                      <Link
                        to={getNotificationsRoute()}
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-black text-gov-green-700 hover:text-gov-green-800 inline-flex items-center gap-1.5 transition-colors"
                      >
                        Open Notification Center <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar indicator */}
              <div className="flex items-center gap-3 pl-3 border-l-2 border-slate-200">
                <div className="w-9 h-9 rounded-2xl bg-gov-green-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-black text-slate-900 leading-none">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-semibold leading-tight mt-1">{currentUser.district} District</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Route Content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
