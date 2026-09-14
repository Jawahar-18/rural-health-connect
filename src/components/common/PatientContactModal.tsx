import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { Patient, SatisfactionLevel } from '../../types';
import { 
  Phone, 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  Languages, 
  Smartphone,
  AlertTriangle,
  FileText,
  UserX,
  Archive
} from 'lucide-react';

interface PatientContactModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'call' | 'message';
}

export const PatientContactModal: React.FC<PatientContactModalProps> = ({
  patient,
  isOpen,
  onClose,
  defaultTab = 'call'
}) => {
  const [activeTab, setActiveTab] = useState<'call' | 'message'>(defaultTab);
  const [selectedLanguage, setSelectedLanguage] = useState<'mr' | 'hi' | 'en'>('mr');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('followup');
  const [customMessage, setCustomMessage] = useState<string>('');
  const { currentUser } = useAuth();
  const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [callDuration, setCallDuration] = useState<number>(0);
  const callOutcome = 'Patient confirmed upcoming PHC visit';
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Treatment Satisfaction & Refusal Feedback State
  const [callAttended, setCallAttended] = useState<boolean>(true);
  const [satisfactionLevel, setSatisfactionLevel] = useState<SatisfactionLevel>('SATISFIED');
  const [refusesFollowUp, setRefusesFollowUp] = useState<boolean>(false);
  const [refusalReason, setRefusalReason] = useState<string>('Dissatisfied with treatment / No symptom relief');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [feedbackSaved, setFeedbackSaved] = useState<boolean>(false);
  const [archiveNotice, setArchiveNotice] = useState<string | null>(null);

  const handleSaveFeedbackAndCall = () => {
    if (!patient) return;
    // 1. Submit structured feedback record
    apiService.submitFeedback({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      callAttended,
      satisfactionLevel,
      refusesFollowUp,
      refusalReason: refusesFollowUp ? refusalReason : undefined,
      feedbackNotes: feedbackNotes || (refusesFollowUp ? `Patient stated: "I will not come" - Reason: ${refusalReason}` : callOutcome),
      recordedByName: currentUser.name,
      recordedByRole: currentUser.role,
    });

    // 2. Track consecutive follow-ups
    if (callAttended) {
      if (refusesFollowUp || satisfactionLevel === 'DISSATISFIED') {
        // Increment refusal / missed follow-up counter
        const updated = apiService.recordFollowUpVisit(patient.id, false);
        if (updated?.isArchived) {
          setArchiveNotice(`⚠️ Patient has reached 5 consecutive missed/refused follow-up cycles. Auto-archived as: "${updated.archivedReason}". Admin notified.`);
        }
      } else {
        // Patient satisfied and attended
        const updated = apiService.recordFollowUpVisit(patient.id, true);
        if (updated?.isArchived) {
          setArchiveNotice(`🎉 Patient successfully attended 5-6 continuous follow-ups! Auto-archived as: "${updated.archivedReason}". Treatment course achieved!`);
        }
      }
    }

    setFeedbackSaved(true);
    setTimeout(() => {
      setFeedbackSaved(false);
      handleResetCall();
    }, 3500);
  };

  if (!isOpen || !patient) return null;

  // Templates in Marathi, Hindi, and English
  const templates: Record<'mr' | 'hi' | 'en', Record<string, string>> = {
    mr: {
      followup: `नमस्कार ${patient.name}, प्राथमिक आरोग्य केंद्र (PHC) कडून महत्त्वाची सूचना: आपली नियमित तपासणी व औषधोपचार बाकी आहे. कृपया जवळच्या आरोग्य केंद्रास भेट द्या. - आरोग्य सेवक`,
      high_risk: `तात्काळ सूचना: ${patient.name}, आपल्या प्रकृती स्वास्थ्यासाठी डॉक्टरांनी विशेष सल्ला दिला आहे. आशा कार्यकर्त्या लवकरच आपल्या घरी भेट देतील. - प्राथमिक आरोग्य केंद्र`,
      maternal: `नमस्कार ${patient.name}, आपले मातृत्व तपासणी (ANC) व पोषण समुपदेशन सत्र नियोजित आहे. कृपया आवश्यक गोळ्या वेळेवर घ्या. - PHC आरोग्य पथक`,
      camp: `सूचना: ${patient.village} येथे विशेष फिरते आरोग्य शिबीर आयोजित केले आहे. मोफत तपासणी व औषधांचा लाभ घ्या.`
    },
    hi: {
      followup: `नमस्ते ${patient.name}, प्राथमिक स्वास्थ्य केंद्र (PHC) से सूचना: आपकी नियमित स्वास्थ्य जांच एवं दवाइयों की तारीख निकट है। कृपया समय पर केंद्र आएं। - स्वास्थ्य कार्यकर्ता`,
      high_risk: `अति आवश्यक: ${patient.name}, आपकी जांच रिपोर्ट के अनुसार तुरंत डॉक्टर से परामर्श की आवश्यकता है। आशा कार्यकर्ता शीघ्र संपर्क करेंगी। - PHC`,
      maternal: `नमस्ते ${patient.name}, आपकी मातृ एवं शिशु स्वास्थ्य (ANC) जांच का समय हो चुका है। कृपया आयरन की गोलियां समय पर लें। - प्राथमिक स्वास्थ्य केंद्र`,
      camp: `सूचना: ${patient.village} में विशेष स्वास्थ्य जांच शिविर लगाया जा रहा है। कृपया निशुल्क परामर्श का लाभ लें।`
    },
    en: {
      followup: `Dear ${patient.name}, this is an automated follow-up alert from Primary Health Centre (PHC). Your scheduled clinical checkup is due. Please visit your nearest health sub-center. - Health Team`,
      high_risk: `URGENT CARE ALERT: Dear ${patient.name}, based on your clinical evaluation, please consult your Medical Officer promptly or contact your local ASHA worker. - PHC Junnar`,
      maternal: `Dear ${patient.name}, Antenatal Care (ANC) reminder: Please attend your scheduled check-up and continue prescribed nutritional supplements. - Rural Health Connect`,
      camp: `Notice: Special mobile health screening camp scheduled in ${patient.village}. Free diagnostics and essential medicines available.`
    }
  };

  const currentMessageText = customMessage || templates[selectedLanguage][selectedTemplate] || templates.en.followup;

  const handleStartCall = () => {
    setCallState('CALLING');
    setTimeout(() => {
      setCallState('CONNECTED');
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState('ENDED');
  };

  const handleResetCall = () => {
    setCallState('IDLE');
    setCallDuration(0);
  };

  const handleSendMessage = (channel: 'sms' | 'whatsapp') => {
    const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(currentMessageText);

    if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`, '_blank');
    } else {
      window.location.href = `sms:${cleanPhone}?body=${encodedText}`;
    }

    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gov-green-600 flex items-center justify-center font-bold text-white shadow-md">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{patient.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Risk: {patient.followupRiskScore}%
                </span>
              </div>
              <p className="text-xs text-slate-300">
                📞 {patient.phone} • 📍 {patient.village} ({patient.distanceKm} km)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'call'
                ? 'border-gov-green-600 text-gov-green-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" /> Voice Outreach & Call
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'message'
                ? 'border-gov-green-600 text-gov-green-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> SMS & WhatsApp Messaging
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: VOICE CALL */}
          {activeTab === 'call' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-amber-900">
                  <span className="font-bold">High Priority Alert:</span> Patient has missed <strong>{patient.missedAppointments}</strong> scheduled appointments and lives <strong>{patient.distanceKm} km</strong> from the PHC.
                </div>
              </div>

              {/* Direct Phone Dial Link */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Mobile Dialer</span>
                <a
                  href={`tel:${patient.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold rounded-xl shadow-md transition-transform hover:scale-102"
                >
                  <PhoneCall className="w-4 h-4" /> Dial {patient.phone}
                </a>
                <p className="text-[10px] text-slate-400">Opens default device phone dialer directly</p>
              </div>

              {/* Telephony Simulator & Log */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-gov-green-700" /> Integrated Telephony Simulation
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    callState === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' :
                    callState === 'CALLING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                    callState === 'ENDED' ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {callState}
                  </span>
                </div>

                {callState === 'IDLE' && (
                  <button
                    onClick={handleStartCall}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Start In-App VoIP Call
                  </button>
                )}

                {callState === 'CALLING' && (
                  <div className="p-4 bg-amber-50 rounded-xl text-center space-y-2">
                    <p className="font-bold text-amber-900">Ringing {patient.phone}...</p>
                    <button
                      onClick={handleEndCall}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                    >
                      <PhoneOff className="w-3.5 h-3.5 inline mr-1" /> Disconnect
                    </button>
                  </div>
                )}

                {callState === 'CONNECTED' && (
                  <div className="p-4 bg-emerald-50 rounded-xl text-center space-y-3 border border-emerald-200">
                    <div className="text-emerald-900 font-bold flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      Call in progress with {patient.name}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {callDuration > 0 ? `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')} mins` : '00:48 mins'}
                    </div>
                    <button
                      onClick={handleEndCall}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 mx-auto"
                    >
                      <PhoneOff className="w-4 h-4" /> End Call
                    </button>
                  </div>
                )}

                {callState === 'ENDED' && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-200">
                    {/* Success Notice if just saved */}
                    {feedbackSaved ? (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="font-extrabold text-emerald-900 text-sm">Feedback & Call Log Saved!</h4>
                        <p className="text-xs text-emerald-800 font-medium">
                          {refusesFollowUp 
                            ? '🚨 Refusal alert escalated to Admin & Medical Officer for review.' 
                            : 'Patient treatment compliance recorded.'}
                        </p>
                        {archiveNotice && (
                          <div className="p-2.5 bg-white rounded-xl border border-emerald-300 text-[11px] font-bold text-slate-800 mt-2 shadow-xs">
                            {archiveNotice}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                          <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gov-green-700" /> Treatment Satisfaction & Attendance Feedback
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Follow-ups: {patient.consecutiveFollowupsCompleted || 0}/5 Completed
                          </span>
                        </div>

                        {/* Call Attended Selector */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <label className="font-bold text-slate-700 text-[11px]">Did Patient Attend / Answer Call?</label>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCallAttended(true)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                callAttended ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              Yes (Attended)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCallAttended(false);
                                setSatisfactionLevel('NEUTRAL');
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                !callAttended ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              No (Unreachable)
                            </button>
                          </div>
                        </div>

                        {/* Treatment Satisfaction Level Selector */}
                        {callAttended && (
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block text-[11px]">
                              Patient Treatment Satisfaction:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSatisfactionLevel('SATISFIED');
                                  setRefusesFollowUp(false);
                                }}
                                className={`p-2.5 rounded-xl border-2 text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                  satisfactionLevel === 'SATISFIED'
                                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-base">😊</span>
                                <span>Satisfied</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSatisfactionLevel('NEUTRAL')}
                                className={`p-2.5 rounded-xl border-2 text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                  satisfactionLevel === 'NEUTRAL'
                                    ? 'border-amber-500 bg-amber-50/80 text-amber-900 shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-base">😐</span>
                                <span>Neutral</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSatisfactionLevel('DISSATISFIED');
                                  setRefusesFollowUp(true); // Automatically suggest refusal flag when dissatisfied
                                }}
                                className={`p-2.5 rounded-xl border-2 text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                  satisfactionLevel === 'DISSATISFIED'
                                    ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm ring-1 ring-rose-400'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-base">😞</span>
                                <span>Dissatisfied</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Patient Refusal Toggle: "Patient told: I will not come" */}
                        {callAttended && (
                          <div className={`p-3 rounded-xl border-2 transition-all space-y-2.5 ${
                            refusesFollowUp 
                              ? 'bg-rose-50 border-rose-400 shadow-xs' 
                              : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <UserX className={`w-4 h-4 ${refusesFollowUp ? 'text-rose-600' : 'text-slate-500'}`} />
                                <div>
                                  <span className={`font-black text-xs block ${refusesFollowUp ? 'text-rose-900' : 'text-slate-800'}`}>
                                    Patient Refusal: "I will not come"
                                  </span>
                                  <span className="text-[10px] text-slate-500 block">
                                    Patient explicitly refused upcoming follow-up checkup
                                  </span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={refusesFollowUp}
                                onChange={(e) => setRefusesFollowUp(e.target.checked)}
                                className="w-5 h-5 accent-rose-600 rounded cursor-pointer mt-0.5"
                              />
                            </div>

                            {/* Detailed Refusal Reason dropdown if refusal is checked */}
                            {refusesFollowUp && (
                              <div className="space-y-2 pt-1 border-t border-rose-200 animate-in fade-in duration-150">
                                <div>
                                  <label className="font-bold text-rose-900 block text-[11px] mb-1">
                                    Primary Reason for Refusal:
                                  </label>
                                  <select
                                    value={refusalReason}
                                    onChange={(e) => setRefusalReason(e.target.value)}
                                    className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs font-semibold text-rose-950 outline-none focus:ring-2 focus:ring-rose-400"
                                  >
                                    <option value="Dissatisfied with treatment / No symptom relief">Dissatisfied with treatment / No symptom relief</option>
                                    <option value="Medication side-effects (gastric/dizziness/allergy)">Medication side-effects (gastric/dizziness/allergy)</option>
                                    <option value="Distance & transportation barrier to PHC">Distance & transportation barrier to PHC</option>
                                    <option value="Consulting private doctor or traditional healer">Consulting private doctor or traditional healer</option>
                                    <option value="Work / daily wage loss concerns">Work / daily wage loss concerns</option>
                                    <option value="Lack of confidence in public healthcare">Lack of confidence in public healthcare</option>
                                    <option value="Other grievance">Other grievance</option>
                                  </select>
                                </div>

                                <div className="text-[10px] font-bold text-rose-800 bg-white/80 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                                  <span>This will log a high-priority grievance in the Admin Dashboard for ASHA home counseling.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Remarks / Verbatim Quotes */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block text-[11px]">
                            Patient Feedback Notes / Verbatim Remarks:
                          </label>
                          <textarea
                            rows={2}
                            placeholder={refusesFollowUp 
                              ? 'e.g. Patient stated: "I will not come anymore because medicine caused headache..."'
                              : 'Enter any additional feedback, symptoms or compliance notes...'
                            }
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-gov-green-600 focus:ring-2 focus:ring-gov-green-600/20 resize-none"
                          />
                        </div>

                        {/* Continuity Progress Indicator */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Archive className="w-3.5 h-3.5 text-slate-500" />
                            <span>Consecutive Follow-up Target:</span>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            {patient.consecutiveFollowupsCompleted || 0} / 5 visits
                            <span className="font-normal text-slate-500 ml-1">(Auto-archives upon 5–6x)</span>
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleSaveFeedbackAndCall}
                            className={`flex-1 py-2.5 font-bold rounded-xl text-white shadow-md transition-transform hover:scale-101 active:scale-99 flex items-center justify-center gap-1.5 ${
                              refusesFollowUp 
                                ? 'bg-rose-600 hover:bg-rose-700' 
                                : 'bg-gov-green-700 hover:bg-gov-green-800'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {refusesFollowUp ? 'Save Refusal & Alert Admin' : 'Save Feedback & Compliance'}
                          </button>
                          <button
                            onClick={handleResetCall}
                            className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SMS & WHATSAPP MESSAGING */}
          {activeTab === 'message' && (
            <div className="space-y-4 text-xs">
              
              {/* Language Selector */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Languages className="w-4 h-4 text-gov-green-700" />
                  <span>Language / भाषा:</span>
                </div>
                <div className="flex gap-1">
                  {(['mr', 'hi', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setCustomMessage('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedLanguage === lang
                          ? 'bg-gov-green-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gov-green-700" /> Pre-approved Health SMS Templates:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setSelectedTemplate('followup'); setCustomMessage(''); }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      selectedTemplate === 'followup' && !customMessage
                        ? 'border-gov-green-600 bg-gov-green-50 text-gov-green-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🩺 Follow-up Reminder
                  </button>
                  <button
                    onClick={() => { setSelectedTemplate('high_risk'); setCustomMessage(''); }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      selectedTemplate === 'high_risk' && !customMessage
                        ? 'border-gov-green-600 bg-gov-green-50 text-gov-green-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🚨 Urgent Clinical Alert
                  </button>
                  <button
                    onClick={() => { setSelectedTemplate('maternal'); setCustomMessage(''); }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      selectedTemplate === 'maternal' && !customMessage
                        ? 'border-gov-green-600 bg-gov-green-50 text-gov-green-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🤰 Maternal Care (ANC)
                  </button>
                  <button
                    onClick={() => { setSelectedTemplate('camp'); setCustomMessage(''); }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      selectedTemplate === 'camp' && !customMessage
                        ? 'border-gov-green-600 bg-gov-green-50 text-gov-green-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    📍 Mobile Camp Alert
                  </button>
                </div>
              </div>

              {/* Editable Message Box */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">Message Content:</label>
                  <span className="text-[10px] text-slate-400">{currentMessageText.length} characters</span>
                </div>
                <textarea
                  rows={4}
                  value={currentMessageText}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl font-sans text-xs focus:ring-2 focus:ring-gov-green-600 outline-none leading-relaxed"
                />
              </div>

              {sentSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Message dispatched successfully to {patient.phone}!
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleSendMessage('sms')}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102"
                >
                  <Send className="w-4 h-4 text-emerald-400" /> Send via SMS Gateway
                </button>
                <button
                  onClick={() => handleSendMessage('whatsapp')}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102"
                >
                  <MessageSquare className="w-4 h-4 text-white" /> Open in WhatsApp
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>🔒 ABHA Verified Patient Communication</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
