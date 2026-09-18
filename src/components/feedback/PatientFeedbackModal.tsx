import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import type { Patient, SatisfactionLevel } from '../../types';
import { 
  X, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';

interface PatientFeedbackModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PatientFeedbackModal: React.FC<PatientFeedbackModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [satisfactionLevel, setSatisfactionLevel] = useState<SatisfactionLevel>('SATISFIED');
  const [refusesFollowUp, setRefusesFollowUp] = useState<boolean>(false);
  const [refusalReason, setRefusalReason] = useState<string>('Dissatisfied with treatment / No symptom relief');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    apiService.submitFeedback({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      callAttended: true,
      satisfactionLevel,
      refusesFollowUp,
      refusalReason: refusesFollowUp ? refusalReason : undefined,
      feedbackNotes: feedbackNotes || (refusesFollowUp ? `Patient stated: "I will not come" - Reason: ${refusalReason}` : 'General consultation feedback'),
      recordedByName: patient.name,
      recordedByRole: 'PATIENT',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between border-b border-teal-400/30">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-extrabold text-base">Treatment & Doctor Feedback</h3>
              <p className="text-xs text-teal-50">Share your experience with PHC treatment</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-slate-900 text-base">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-600">
              {refusesFollowUp 
                ? 'Your feedback has been sent directly to the Health Center Administrator and an ASHA worker will reach out to address your concerns.'
                : 'Your response helps us improve healthcare access and treatment quality.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Satisfaction Rating */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block text-xs">
                How satisfied are you with your prescribed medicines and treatment?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSatisfactionLevel('SATISFIED');
                    setRefusesFollowUp(false);
                  }}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    satisfactionLevel === 'SATISFIED'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-lg">😊</span>
                  <span>Satisfied</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSatisfactionLevel('NEUTRAL')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    satisfactionLevel === 'NEUTRAL'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-lg">😐</span>
                  <span>Neutral</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSatisfactionLevel('DISSATISFIED');
                    setRefusesFollowUp(true);
                  }}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    satisfactionLevel === 'DISSATISFIED'
                      ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm ring-1 ring-rose-400'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-lg">😞</span>
                  <span>Not Satisfied</span>
                </button>
              </div>
            </div>

            {/* Will Not Come / Refusal checkbox */}
            <div className={`p-3.5 rounded-2xl border-2 space-y-2 transition-all ${
              refusesFollowUp 
                ? 'bg-rose-50 border-rose-400 shadow-xs' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`font-black text-xs block ${refusesFollowUp ? 'text-rose-900' : 'text-slate-800'}`}>
                    "I will not come for the next follow-up appointment"
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Check this if you plan not to visit the PHC again
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={refusesFollowUp}
                  onChange={(e) => setRefusesFollowUp(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded cursor-pointer mt-0.5"
                />
              </div>

              {refusesFollowUp && (
                <div className="space-y-1.5 pt-2 border-t border-rose-200">
                  <label className="font-bold text-rose-900 block text-[11px]">
                    Why will you not come?
                  </label>
                  <select
                    value={refusalReason}
                    onChange={(e) => setRefusalReason(e.target.value)}
                    className="w-full p-2 bg-white border border-rose-300 rounded-xl text-xs font-semibold text-rose-950 outline-none"
                  >
                    <option value="Dissatisfied with treatment / No symptom relief">Dissatisfied with treatment / No symptom relief</option>
                    <option value="Medication caused side-effects (nausea, headache, rash)">Medication caused side-effects (nausea, headache, rash)</option>
                    <option value="PHC is too far / No transportation available">PHC is too far / No transportation available</option>
                    <option value="Consulting private doctor or local healer">Consulting private doctor or local healer</option>
                    <option value="Cannot miss daily wage work">Cannot miss daily wage work</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                </div>
              )}
            </div>

            {/* Written Remarks */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block text-xs">
                Your comments or difficulties experienced:
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about how the medicine worked, any symptoms or feedback..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-gov-green-700 hover:bg-gov-green-800 text-white font-black rounded-xl text-xs shadow-md transition-transform hover:scale-101 cursor-pointer"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
