import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { PatientContactModal } from '../../components/common/PatientContactModal';
import type { UserRole, Patient } from '../../types';
import { Search, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GenericModuleViewProps {
  title: string;
  role: UserRole;
}

export const GenericModuleView: React.FC<GenericModuleViewProps> = ({ title, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  const openContact = (patient: Patient, tab: 'call' | 'message') => {
    setSelectedPatient(patient);
    setContactTab(tab);
    setContactModalOpen(true);
  };

  const patients = apiService.getPatients();
  const referrals = apiService.getReferrals();
  const stock = apiService.getMedicineStock();

  const isHighRiskView = title.toLowerCase().includes('high-risk') || title.toLowerCase().includes('vulnerable') || title.toLowerCase().includes('follow-up');

  const displayedPatients = isHighRiskView
    ? patients.filter(p => p.followupRiskLevel === 'HIGH' || p.clinicalPriority === 'HIGH' || p.clinicalPriority === 'URGENT')
    : patients;

  const filteredPatients = displayedPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleGradient = () => {
    switch (role) {
      case 'HEALTH_WORKER': return 'from-emerald-900 via-teal-900 to-slate-900 border-emerald-700/50';
      case 'DOCTOR': return 'from-blue-950 via-indigo-900 to-slate-900 border-indigo-700/50';
      case 'FACILITY_ADMIN': return 'from-indigo-950 via-purple-900 to-slate-900 border-purple-700/50';
      case 'DISTRICT_ADMIN': return 'from-slate-950 via-teal-950 to-slate-900 border-teal-700/50';
      case 'PATIENT': return 'from-teal-900 via-emerald-900 to-slate-900 border-emerald-700/50';
      default: return 'from-slate-900 via-emerald-950 to-slate-900 border-emerald-800/50';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Colorful Gradient Module Header */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${getRoleGradient()} text-white shadow-xl border-2 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {role.replace('_', ' ')} MODULE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">{title}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl">
            SIH 2026 Integrated Public Healthcare Access Platform • Govt of Maharashtra
          </p>
        </div>

        <div className="relative z-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search records, villages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg border-2 border-white/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Conditional Content based on title or role */}
      {title.toLowerCase().includes('referral') ? (
        /* Referrals Directory */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-base">Referral Continuity Tracking & QR Passcodes</h2>
            <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-300">
              {referrals.length} Active Referrals
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {referrals.map((ref) => (
              <div key={ref.id} className="p-5 rounded-2xl border-2 border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-purple-400 shadow-sm hover:shadow-lg transition-all duration-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold text-slate-900 text-base">{ref.patientName} <span className="text-xs font-semibold text-slate-500">({ref.patientGender}, {ref.patientAge} yrs)</span></div>
                  <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full border-2 border-purple-300 shadow-xs">
                    Status: {ref.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  Origin: <strong className="text-slate-900">{ref.originFacility}</strong> → Destination: <strong className="text-purple-800 font-bold">{ref.destinationFacility}</strong> ({ref.department})
                </div>
                <div className="text-slate-600 bg-white p-3 rounded-xl border-2 border-slate-100 text-xs font-medium">
                  Reason for Referral: {ref.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : title.toLowerCase().includes('medicine') || title.toLowerCase().includes('stock') ? (
        /* Medicine Stock Table */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-base">Local PHC Essential Drug Inventory & Stock Monitor</h2>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
              {stock.length} Catalogued Drugs
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 border-b-2 border-slate-200 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5">Medicine Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Min Threshold</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium text-slate-800 bg-white">
                {stock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="p-3.5 text-slate-600 font-semibold">{item.category}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{item.currentStock} {item.unit}</td>
                    <td className="p-3.5 text-slate-500">{item.minThreshold} {item.unit}</td>
                    <td className="p-3.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border-2 shadow-xs inline-block ${
                        item.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        item.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standard or High Risk Patient Directory */
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              {isHighRiskView && <AlertTriangle className="w-5 h-5 text-rose-600" />}
              {isHighRiskView ? 'High-Risk & Priority Patient Registry' : 'Registered Rural Patients Directory'}
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-300">
              {filteredPatients.length} Patients
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPatients.map((pt) => (
              <div 
                key={pt.id} 
                className={`p-5 rounded-2xl border-2 transition-all duration-200 space-y-3.5 shadow-sm hover:shadow-xl ${
                  pt.followupRiskLevel === 'HIGH'
                    ? 'border-rose-300 bg-rose-50/20 hover:border-rose-500 hover:bg-white'
                    : 'border-slate-200/90 bg-slate-50/60 hover:border-emerald-500 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-black text-slate-900 text-base flex items-center gap-2">
                      {pt.name}
                      {pt.followupRiskLevel === 'HIGH' && (
                        <span className="bg-rose-100 text-rose-900 text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-rose-300 shadow-xs">
                          Risk: {pt.followupRiskScore}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      📍 Village: <strong className="text-slate-700">{pt.village}</strong> • Age {pt.age} ({pt.gender})
                    </div>
                  </div>
                  <PriorityBadge priority={pt.clinicalPriority} size="sm" />
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border-2 border-slate-100 space-y-1 font-medium shadow-2xs">
                  <div>Medical Conditions: <strong className="text-slate-900">{pt.chronicConditions.join(', ') || pt.relevantConditions.join(', ') || 'None'}</strong></div>
                  <div>Phone: <strong className="text-slate-900">{pt.phone}</strong></div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span>Distance from PHC: <strong>{pt.distanceKm} km</strong></span>
                    <span>Missed Visits: <strong className={pt.missedAppointments > 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}>{pt.missedAppointments}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openContact(pt, 'call')}
                      className="px-3 py-1.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                    <button
                      onClick={() => openContact(pt, 'message')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  </div>

                  <Link
                    to={`/doctor/consultation/${pt.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm hover:scale-102 transition-all"
                  >
                    Open Record →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Call & Messaging Modal */}
      <PatientContactModal
        patient={selectedPatient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};

