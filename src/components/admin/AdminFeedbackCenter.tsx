import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import type { PatientFeedback, Patient, FeedbackStatus } from '../../types';
import { 
  CheckCircle2, 
  Archive, 
  Search, 
  Filter, 
  HeartHandshake, 
  RotateCcw
} from 'lucide-react';

export const AdminFeedbackCenter: React.FC<{ role?: string }> = ({ role: _role = 'ADMIN' }) => {
  const [feedbacks, setFeedbacks] = useState<PatientFeedback[]>(() => apiService.getFeedbacks());
  const [patients, setPatients] = useState<Patient[]>(() => apiService.getPatients());
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'archived'>('feedbacks');
  const [filterType, setFilterType] = useState<'ALL' | 'REFUSALS' | 'DISSATISFIED' | 'ACTION_REQUIRED'>('REFUSALS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<PatientFeedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshData = () => {
    setFeedbacks(apiService.getFeedbacks());
    setPatients(apiService.getPatients());
  };

  const handleReviewFeedback = (id: string, newStatus: FeedbackStatus, notes: string) => {
    apiService.reviewFeedback(id, newStatus, notes);
    refreshData();
    setSelectedFeedback(null);
    setAdminNotes('');
    setActionSuccess(`Feedback marked as ${newStatus} with counselor assigned.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleUnarchive = (patientId: string) => {
    apiService.unarchivePatient(patientId);
    refreshData();
    setActionSuccess('Patient restored to active care roster!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleManualArchive = (patientId: string, reason: string) => {
    apiService.archivePatient(patientId, reason);
    refreshData();
    setActionSuccess('Patient archived successfully.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // KPI calculations
  const totalFeedbackCount = feedbacks.length;
  const refusalCount = feedbacks.filter(f => f.refusesFollowUp).length;
  const dissatisfiedCount = feedbacks.filter(f => f.satisfactionLevel === 'DISSATISFIED').length;
  const actionRequiredCount = feedbacks.filter(f => f.status === 'ACTION_REQUIRED').length;
  const archivedPatients = patients.filter(p => p.isArchived);

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = f.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.feedbackNotes && f.feedbackNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterType === 'REFUSALS') return f.refusesFollowUp;
    if (filterType === 'DISSATISFIED') return f.satisfactionLevel === 'DISSATISFIED';
    if (filterType === 'ACTION_REQUIRED') return f.status === 'ACTION_REQUIRED';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Alert if any action required */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedbacks */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md hover:border-slate-400 transition-all">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Feedbacks Logged</div>
          <div className="text-3xl font-black text-slate-900 mt-2 flex items-baseline justify-between">
            <span>{totalFeedbackCount}</span>
            <span className="text-xs font-bold text-slate-400">Total</span>
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Teleconsults & check-ins</div>
        </div>

        {/* Refusal to Attend / "I Will Not Come" Alert Card */}
        <div className="bg-white p-5 rounded-3xl border-2 border-rose-300 shadow-md hover:border-rose-500 bg-rose-50/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider">"Will Not Come" Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-3xl font-black text-rose-700 mt-2 flex items-baseline justify-between">
            <span>{refusalCount}</span>
            <span className="text-xs font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
              Refusals
            </span>
          </div>
          <div className="text-xs text-rose-800 font-bold mt-1">Requires ASHA Home Visit</div>
        </div>

        {/* Dissatisfied with Treatment */}
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-300 shadow-md hover:border-amber-500 bg-amber-50/20 transition-all">
          <div className="text-xs font-black text-amber-800 uppercase tracking-wider">Treatment Dissatisfaction</div>
          <div className="text-3xl font-black text-amber-700 mt-2 flex items-baseline justify-between">
            <span>{dissatisfiedCount}</span>
            <span className="text-xs font-bold text-amber-600">
              {totalFeedbackCount > 0 ? `${Math.round((dissatisfiedCount / totalFeedbackCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-xs text-amber-800 font-semibold mt-1">Clinical side-effects / grievances</div>
        </div>

        {/* Archived Registry (5-6x cycles) */}
        <div className="bg-white p-5 rounded-3xl border-2 border-indigo-300 shadow-md hover:border-indigo-500 bg-indigo-50/20 transition-all">
          <div className="text-xs font-black text-indigo-700 uppercase tracking-wider">Archived Patients (5–6x)</div>
          <div className="text-3xl font-black text-indigo-900 mt-2 flex items-baseline justify-between">
            <span>{archivedPatients.length}</span>
            <Archive className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-xs text-indigo-800 font-semibold mt-1">Continuous completed & chronic cases</div>
        </div>
      </div>

      {/* Center Management Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg overflow-hidden">
        {/* Navigation Tabs & Search */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'feedbacks'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feedback & Refusal Alerts ({feedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'archived'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-4 h-4" /> Archived Registry ({archivedPatients.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by patient or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-slate-500 shadow-xs"
            />
          </div>
        </div>

        {/* TAB 1: FEEDBACK & REFUSALS */}
        {activeTab === 'feedbacks' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setFilterType('REFUSALS')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                  filterType === 'REFUSALS'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                🚨 Refused to Come ("Will Not Come") ({refusalCount})
              </button>
              <button
                onClick={() => setFilterType('DISSATISFIED')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                  filterType === 'DISSATISFIED'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Dissatisfied with Treatment ({dissatisfiedCount})
              </button>
              <button
                onClick={() => setFilterType('ACTION_REQUIRED')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                  filterType === 'ACTION_REQUIRED'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                Action Required ({actionRequiredCount})
              </button>
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                  filterType === 'ALL'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Show All ({feedbacks.length})
              </button>
            </div>

            {/* Feedback List */}
            {filteredFeedbacks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-semibold">
                No feedback records found matching selected filter.
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredFeedbacks.map((f) => {
                  const patient = patients.find(p => p.id === f.patientId);
                  return (
                    <div
                      key={f.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-150 ${
                        f.refusesFollowUp 
                          ? 'border-rose-300 bg-rose-50/40 hover:border-rose-500 shadow-sm' 
                          : f.satisfactionLevel === 'DISSATISFIED'
                          ? 'border-amber-300 bg-amber-50/40 hover:border-amber-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">{f.patientName}</h4>
                            <span className="font-mono text-[11px] text-slate-500">📞 {f.patientPhone}</span>
                            {f.refusesFollowUp && (
                              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                Will Not Come
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              f.satisfactionLevel === 'SATISFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              f.satisfactionLevel === 'NEUTRAL' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {f.satisfactionLevel === 'SATISFIED' ? '😊 Satisfied' :
                               f.satisfactionLevel === 'NEUTRAL' ? '😐 Neutral' :
                               '😞 Dissatisfied with Treatment'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Recorded by: <strong className="text-slate-700">{f.recordedByName}</strong> ({f.recordedByRole}) • {new Date(f.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                            f.status === 'ACTION_REQUIRED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            f.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            f.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            'bg-slate-100 text-slate-700 border-slate-300'
                          }`}>
                            {f.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="py-3 space-y-2 text-xs">
                        {f.refusalReason && (
                          <div className="text-rose-900 font-bold bg-rose-100/70 px-3 py-1.5 rounded-xl border border-rose-200 inline-block">
                            Refusal Reason: {f.refusalReason}
                          </div>
                        )}
                        <p className="text-slate-800 font-medium bg-white/80 p-3 rounded-xl border border-slate-200">
                          "{f.feedbackNotes}"
                        </p>

                        {/* Existing Admin Review Notes if present */}
                        {f.adminReviewNotes && (
                          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950">
                            <span className="font-extrabold text-[11px] block">Admin Governance Action:</span>
                            <span>{f.adminReviewNotes}</span>
                          </div>
                        )}

                        {/* Continuity Stat Badge */}
                        {patient && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                            <span>Compliance history:</span>
                            <span className="font-bold text-slate-800">{patient.consecutiveFollowupsCompleted || 0} consecutive visits attended</span>
                            <span>•</span>
                            <span className="font-bold text-rose-700">{patient.consecutiveFollowupsMissed || 0} consecutive missed/refused</span>
                          </div>
                        )}
                      </div>

                      {/* Admin Resolution & Action Bar */}
                      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedFeedback(f)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <HeartHandshake className="w-3.5 h-3.5" /> Admin Action & Counselor
                          </button>

                          {patient && !patient.isArchived && (
                            <button
                              onClick={() => handleManualArchive(patient.id, `Archived by Admin following call refusal: ${f.refusalReason || 'Care refusal'}`)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5" /> Archive Patient
                            </button>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium">
                          ID: {f.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARCHIVED PATIENTS REGISTRY */}
        {activeTab === 'archived' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl space-y-1">
              <h3 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                <Archive className="w-4 h-4 text-indigo-700" /> Continuous Follow-Up Archiving Policy (5–6x Sessions)
              </h3>
              <p className="text-xs text-indigo-900 font-medium">
                Patients who continuously attend 5–6 follow-up appointments are automatically archived as <strong>"Treatment Completed / Discharged"</strong>. Conversely, patients who continuously refuse or miss 5–6 consecutive follow-up sessions are archived for administrative compliance oversight. Any archived patient can be reactivated with a single click.
              </p>
            </div>

            {archivedPatients.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-semibold">
                No patients currently in the archived registry.
              </div>
            ) : (
              <div className="space-y-3.5">
                {archivedPatients.map((p) => {
                  const isCompletionArchive = p.archivedReason?.toLowerCase().includes('completed') || (p.consecutiveFollowupsCompleted && p.consecutiveFollowupsCompleted >= 5);
                  return (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-400 shadow-sm transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-base">{p.name}</h4>
                            <span className="text-xs font-semibold text-slate-500">({p.gender}, {p.age} yrs)</span>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isCompletionArchive 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {isCompletionArchive ? 'Course Completed (5–6x)' : 'Chronic Refusal Archive'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            📍 {p.village} • 📞 {p.phone} • Registered: {p.registeredDate}
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnarchive(p.id)}
                          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Unarchive & Restore to Active Roster
                        </button>
                      </div>

                      <div className="py-3 text-xs space-y-2">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800">
                          <span className="font-bold text-slate-600 block text-[11px]">Archive Reason:</span>
                          <span className="font-bold text-slate-900">{p.archivedReason || 'Continuous care cycle achieved'}</span>
                          {p.archivedDate && <span className="text-slate-500 ml-2 font-normal">({p.archivedDate})</span>}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-slate-700 font-bold text-xs">
                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block uppercase">Consecutive Completed</span>
                            <span className="text-emerald-700 text-sm font-black">{p.consecutiveFollowupsCompleted || 0} visits</span>
                          </div>
                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block uppercase">Consecutive Refused</span>
                            <span className="text-rose-700 text-sm font-black">{p.consecutiveFollowupsMissed || 0} visits</span>
                          </div>
                          <div className="p-2 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block uppercase">Total Attended</span>
                            <span className="text-slate-900 text-sm font-black">{p.totalFollowupsAttended || 0} visits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Action / Grievance Resolution Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-gov-green-700" /> Admin Grievance & Counselor Action
              </h3>
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong className="text-slate-700">Patient:</strong> {selectedFeedback.patientName} (📞 {selectedFeedback.patientPhone})</div>
              <div><strong className="text-slate-700">Complaint:</strong> "{selectedFeedback.feedbackNotes}"</div>
              {selectedFeedback.refusalReason && (
                <div className="text-rose-800 font-bold">Refusal Reason: {selectedFeedback.refusalReason}</div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                Administrative Action Notes / Counselor Assignment:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Assigned ASHA worker Savita Kamble to conduct home visit; arranged alternative medication with Medical Officer..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleReviewFeedback(
                  selectedFeedback.id, 
                  'RESOLVED', 
                  adminNotes || 'Grievance addressed. ASHA home counseling scheduled.'
                )}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Mark Resolved & Assign Counselor
              </button>
              <button
                onClick={() => handleReviewFeedback(
                  selectedFeedback.id, 
                  'REVIEWED', 
                  adminNotes || 'Reviewed by District/Facility Administrator.'
                )}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Mark Reviewed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
