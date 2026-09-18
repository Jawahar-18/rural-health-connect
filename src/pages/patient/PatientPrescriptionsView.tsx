import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/MultilingualContext';
import type { Prescription } from '../../types';
import { findMedicineKnowledge } from '../../data/medicineKnowledge';
import { generatePrescriptionPdf } from '../../utils/pdfGenerator';
import { 
  Pill, 
  Printer, 
  AlertCircle, 
  Stethoscope, 
  Building2, 
  Package,
  Download,
  Info,
  HelpCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar
} from 'lucide-react';

export const PatientPrescriptionsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const prescriptions: Prescription[] = apiService.getPrescriptions().filter(p => p.patientId === patient.id);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (rx: Prescription) => {
    generatePrescriptionPdf(rx);
  };

  const handleSpeakDrug = (key: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (activeSpeechIndex === key) {
      window.speechSynthesis.cancel();
      setActiveSpeechIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose appropriate voice/lang if available
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.onend = () => setActiveSpeechIndex(null);
    utterance.onerror = () => setActiveSpeechIndex(null);

    setActiveSpeechIndex(key);
    window.speechSynthesis.speak(utterance);
  };

  // Helper labels based on current language
  const labels = {
    guideTitle: language === 'mr' ? 'सामान्य माणसासाठी औषध मार्गदर्शक' : language === 'hi' ? 'आम आदमी के लिए दवा गाइड' : language === 'ta' ? 'மருந்து வழிகாட்டி' : 'Common Man Medicine Guide',
    whatIsIt: language === 'mr' ? 'हे औषध काय आहे?' : language === 'hi' ? 'यह दवा क्या है?' : language === 'ta' ? 'இந்த மருந்து என்ன?' : 'What is this drug?',
    whyUsed: language === 'mr' ? 'हे कशासाठी वापरले जाते?' : language === 'hi' ? 'यह किसलिए उपयोग की जाती है?' : language === 'ta' ? 'எதற்காகப் பயன்படுகிறது?' : 'Why is it used for?',
    howToTake: language === 'mr' ? 'कसे घ्यावे व काळजी:' : language === 'hi' ? 'लेने का तरीका व सलाह:' : language === 'ta' ? 'உட்கொள்ளும் முறை:' : 'Patient Advice & How to Take:',
    listenAudio: language === 'mr' ? 'आवाजात ऐका' : language === 'hi' ? 'आवाज़ में सुनें' : language === 'ta' ? 'கேளுங்கள்' : 'Listen Explanation',
    stopAudio: language === 'mr' ? 'थांबवा' : language === 'hi' ? 'रोकें' : language === 'ta' ? 'நிறுத்து' : 'Stop Audio',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Pill className="w-3.5 h-3.5 text-emerald-300" />
            MY E-PRESCRIPTIONS & DOSAGE SCHEDULE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Digital Prescriptions & Dosage Instructions
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Authorized Digital Prescriptions for <strong className="text-white">{patient.name}</strong> • Linked to ABHA: <span className="font-mono text-emerald-300">MH-{patient.id.toUpperCase()}</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer no-print"
          >
            <Printer className="w-4 h-4 text-gov-green-700" /> Print Slip
          </button>
        </div>
      </div>

      {/* Patient Education & Guarantee Alert */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-medium shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-emerald-950 block sm:inline">Simplified Drug Descriptions Active: </strong>
            <span>Every prescribed tablet now features a plain-language explanation of what the drug is and why it was prescribed.</span>
          </div>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl shrink-0 self-start sm:self-auto border border-emerald-300">
          {prescriptions.length} Active Prescription(s)
        </span>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 text-center space-y-3 shadow-sm">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-700">No Prescriptions Found</h2>
          <p className="text-xs text-slate-500">You currently do not have any active medical prescriptions recorded.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => (
            <div 
              key={rx.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6 print:p-2 print:border-none print:shadow-none"
            >
              {/* Prescription Header / Doctor info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-emerald-100 text-gov-green-700 rounded-2xl">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900">{rx.doctorName || 'Dr. Rajesh Deshmukh'}</div>
                    <div className="text-xs font-semibold text-slate-600">Medical Officer (MBBS, MD) • Reg #MMC-2012-4589</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {rx.facilityName || 'PHC Junnar, Pune'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300 uppercase">
                      E-Rx ID: {rx.id.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDownloadPdf(rx)}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 no-print cursor-pointer"
                      title="Download Official Government PDF Prescription"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Issued Date: <strong className="text-slate-900">{rx.date}</strong></div>
                  {rx.followUpDate && (
                    <div className="text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md inline-block border border-teal-200">
                      Next Follow-up: {rx.followUpDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Diagnosis & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1 text-xs">
                  <div className="font-black text-slate-500 uppercase tracking-wider text-[10px]">Clinical Diagnosis</div>
                  <div className="text-sm font-black text-slate-900">{rx.diagnosis}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-1 text-xs">
                  <div className="font-black text-slate-500 uppercase tracking-wider text-[10px]">Doctor Clinical Remarks</div>
                  <div className="text-xs font-semibold text-slate-800">{rx.clinicalNotes}</div>
                </div>
              </div>

              {/* Prescribed Medicines with Common Man Plain Language Drug Guide */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-gov-green-700" />
                    Prescribed Medicines & Dosage Instructions ({rx.items.length})
                  </h3>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" /> {labels.guideTitle}
                  </span>
                </div>

                <div className="space-y-4">
                  {rx.items.map((item, idx) => {
                    const speechKey = `${rx.id}-${idx}`;
                    const isSpeaking = activeSpeechIndex === speechKey;
                    const medInfo = findMedicineKnowledge(item.medicineName);

                    // Choose appropriate translation if available
                    const langData = medInfo.translations?.[language as 'mr' | 'hi' | 'ta'];
                    const descriptionText = langData?.simpleDescription || item.description || medInfo.simpleDescription;
                    const purposeText = langData?.usedFor || item.purpose || medInfo.usedFor;
                    const adviceText = langData?.commonAdvice || item.sideEffectsNote || medInfo.commonAdvice;

                    const spokenMessage = `${item.medicineName}. ${labels.whatIsIt}: ${descriptionText}. ${labels.whyUsed}: ${purposeText}. ${labels.howToTake}: ${adviceText}`;

                    return (
                      <div 
                        key={idx}
                        className="rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 transition-all p-4 sm:p-5 space-y-3.5 shadow-2xs"
                      >
                        {/* Drug Primary Bar: Name, Dosage, Frequency, Stock */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-gov-green-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200 shadow-2xs">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 text-base flex items-center gap-2 flex-wrap">
                                {item.medicineName}
                                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                  {item.dosage}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 font-semibold flex items-center gap-3 mt-0.5 flex-wrap">
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Timing: <strong className="text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded">{item.frequency}</strong>
                                </span>
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Calendar className="w-3.5 h-3.5 text-teal-600" /> Duration: <strong>{item.durationDays} Days</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                            <button
                              onClick={() => handleSpeakDrug(speechKey, spokenMessage)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all no-print cursor-pointer ${
                                isSpeaking 
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                              title="Listen to medicine description spoken aloud"
                            >
                              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              {isSpeaking ? labels.stopAudio : labels.listenAudio}
                            </button>

                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                              <Package className="w-3 h-3 text-emerald-700" /> In Stock at PHC
                            </span>
                          </div>
                        </div>

                        {/* Common Man Drug Explanation Card */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-200/80 space-y-2.5">
                          <div className="flex items-center gap-2 text-[11px] font-black text-emerald-900 uppercase tracking-wider border-b border-emerald-200/60 pb-1.5">
                            <Info className="w-3.5 h-3.5 text-emerald-700" />
                            {labels.guideTitle}
                            <span className="text-[10px] lowercase font-normal text-emerald-700">({medInfo.category})</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* What is this drug */}
                            <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 shadow-2xs space-y-1">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {labels.whatIsIt}
                              </div>
                              <p className="text-slate-700 font-medium text-[11px] leading-relaxed">
                                {descriptionText}
                              </p>
                            </div>

                            {/* Why is it used for */}
                            <div className="bg-white/80 p-3 rounded-lg border border-teal-100 shadow-2xs space-y-1">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                {labels.whyUsed}
                              </div>
                              <p className="text-slate-700 font-medium text-[11px] leading-relaxed">
                                {purposeText}
                              </p>
                            </div>
                          </div>

                          {/* Safe intake advice */}
                          {adviceText && (
                            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-700">
                              <ShieldCheck className="w-3.5 h-3.5 text-gov-green-700 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-slate-900">{labels.howToTake} </strong>
                                <span className="text-slate-700 font-medium">{adviceText}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pharmacy pickup & dietary instructions */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-xs space-y-1 text-amber-950">
                <div className="font-black flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Pharmacy Dispensing & Free Medicine Notice:
                </div>
                <p>
                  Please present your token or ABHA card at PHC Junnar Dispensary (Counter #2). All essential medicines listed above are provided <strong>free of cost</strong> under National Health Mission (NHM).
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
