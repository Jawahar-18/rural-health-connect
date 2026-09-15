import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { NotificationItem } from '../../types';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Pill, 
  HeartPulse, 
  CheckCircle2
} from 'lucide-react';

export const PatientNotificationsView: React.FC = () => {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    apiService.getNotifications(currentUser.role)
  );
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const refreshNotifs = () => {
    setNotifications(apiService.getNotifications(currentUser.role));
  };

  useEffect(() => {
    refreshNotifs();
    window.addEventListener('rhc_notifications_updated', refreshNotifs);
    window.addEventListener('storage', refreshNotifs);
    return () => {
      window.removeEventListener('rhc_notifications_updated', refreshNotifs);
      window.removeEventListener('storage', refreshNotifs);
    };
  }, [currentUser.role]);

  const handleMarkRead = (id: string) => {
    apiService.markNotificationRead(id);
    refreshNotifs();
  };

  const handleMarkAllRead = () => {
    apiService.markAllNotificationsRead(currentUser.role);
    refreshNotifs();
  };

  const filteredNotifs = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'FOLLOWUP': return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'QUEUE': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'STOCK_ALERT': return <Pill className="w-5 h-5 text-amber-600" />;
      default: return <Bell className="w-5 h-5 text-gov-green-700" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-700/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Bell className="w-3.5 h-3.5 text-emerald-300" />
            PATIENT ALERTS & NOTIFICATION CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Healthcare Alerts & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Real-time appointment, medication, and clinical visit updates for <strong className="text-white">{currentUser.name}</strong>
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="relative z-10 px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-gov-green-700" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs & Controls */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-gov-green-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unread ({unreadCount})
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredNotifs.length} notification(s)
        </span>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-700">You're All Caught Up!</h2>
          <p className="text-xs text-slate-500">No unread notifications or healthcare reminders at this moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.read 
                  ? 'bg-white border-slate-200/90 text-slate-700 hover:border-emerald-400' 
                  : 'bg-emerald-50/70 border-emerald-400 text-slate-900 font-semibold shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getNotifIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                    {!item.read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl font-normal">
                    {item.message}
                  </p>
                  <div className="text-[11px] text-slate-400 font-medium pt-0.5">
                    {item.timestamp}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {!item.read ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(item.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Read
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
