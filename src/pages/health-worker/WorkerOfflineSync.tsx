import React, { useState } from 'react';
import { useOffline } from '../../context/OfflineContext';
import { apiService } from '../../services/apiService';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerOfflineSync: React.FC = () => {
  const { isOnline, pendingSyncCount, syncDataNow, lastSyncedTimestamp, toggleSimulatedOffline } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);
  const queueItems = apiService.getOfflineQueue();

  const handleManualSync = async () => {
    setIsSyncing(true);
    const count = await syncDataNow();
    setIsSyncing(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
    alert(`Successfully synchronized ${count} offline records with central PHC database!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              PWA IndexedDB Offline Sync Center
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Offline Record Synchronization</h1>
          <p className="text-xs text-slate-500">Local Service Worker & Persistent Cache Status</p>
        </div>

        <button
          onClick={toggleSimulatedOffline}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            isOnline 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}
        >
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-rose-600" />}
          <span>{isOnline ? 'Network Connected' : 'Network Disconnected (Simulated)'}</span>
        </button>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-gov border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <Database className="w-4 h-4 text-gov-green-700" /> Offline Queue
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{pendingSyncCount}</div>
          <div className="text-xs text-slate-500 mt-1">Records waiting for server push</div>
        </div>

        <div className="bg-white p-5 rounded-gov border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <ClockIcon className="w-4 h-4 text-gov-teal-700" /> Last Sync Time
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{lastSyncedTimestamp || 'Not synced today'}</div>
          <div className="text-xs text-slate-500 mt-1">Auto-sync on reconnect</div>
        </div>

        <div className="bg-white p-5 rounded-gov border border-slate-200 shadow-soft flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sync Integrity
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-1">Zero Data Loss Engine</div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing || pendingSyncCount === 0}
            className="w-full mt-2 py-2 px-3 bg-gov-green-700 hover:bg-gov-green-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Trigger Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Queued Records Detail Table */}
      <div className="bg-white rounded-gov p-5 border border-slate-200 shadow-soft space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Queued Offline Transactions</h3>
        {queueItems.length > 0 ? (
          <div className="space-y-2 text-xs">
            {queueItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.type}</span>
                  <span className="text-slate-500 ml-2">— {item.payload?.name || item.payload?.patientName || 'Record'}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Created offline at: {item.timestamp}</div>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  PENDING SYNC
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="font-bold text-slate-800">All local device records are fully synchronized!</div>
            <p className="text-[11px] text-slate-400 mt-0.5">New offline patient registrations and triage records will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function ClockIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
