import React, { useState } from 'react';
import { SihDemoHeader } from './SihDemoHeader';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { Menu, Bell, WifiOff, ChevronRight } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { isOnline, pendingSyncCount, syncDataNow } = useOffline();

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
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
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
              {/* Notification icon */}
              <button className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors shadow-2xs">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

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
