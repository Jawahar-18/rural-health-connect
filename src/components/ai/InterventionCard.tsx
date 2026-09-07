import React, { useState } from 'react';
import type { Patient } from '../../types';
import { calculateInterventionPriority } from '../../utils/aiEngine';
import { PriorityBadge } from './PriorityBadge';
import { Phone, Calendar, HeartHandshake, MessageSquare } from 'lucide-react';
import { PatientContactModal } from '../common/PatientContactModal';

interface InterventionCardProps {
  patient: Patient;
  onContactClick?: () => void;
  onScheduleClick?: () => void;
}

export const InterventionCard: React.FC<InterventionCardProps> = ({ 
  patient, 
  onContactClick, 
  onScheduleClick 
}) => {
  const result = calculateInterventionPriority(patient);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactTab, setContactTab] = useState<'call' | 'message'>('call');

  const openContact = (tab: 'call' | 'message') => {
    setContactTab(tab);
    setContactModalOpen(true);
  };

  return (
    <div className="bg-white rounded-gov border border-slate-200 p-4 sm:p-5 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-gov-green-700" />
          <h3 className="font-bold text-slate-900 text-sm">Intervention Priority Matrix</h3>
        </div>
        <PriorityBadge priority={result.interventionPriority} size="md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Follow-up Risk Factor</span>
          <span className="font-bold text-slate-800 text-sm">{result.followupRiskScore} / 100</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Clinical Urgency</span>
          <span className="font-bold text-slate-800 text-sm">{result.clinicalPriority}</span>
        </div>
      </div>

      {/* Recommended interventions */}
      <div className="space-y-1.5 text-xs mb-4">
        <span className="font-semibold text-slate-700 text-[11px] block">Action Recommended:</span>
        {result.recommendedInterventions.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-800 bg-emerald-50/50 px-2.5 py-1.5 rounded-md border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-green-600 shrink-0" />
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onContactClick || (() => openContact('call'))}
          className="flex-1 bg-gov-green-700 hover:bg-gov-green-800 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <Phone className="w-3.5 h-3.5" /> Call Patient
        </button>
        <button
          onClick={() => openContact('message')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Message
        </button>
        <button
          onClick={onScheduleClick || (() => alert(`Opening scheduling for ${patient.name}...`))}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" /> Schedule
        </button>
      </div>

      {/* Contact & Communication Modal */}
      <PatientContactModal
        patient={patient}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTab={contactTab}
      />
    </div>
  );
};

