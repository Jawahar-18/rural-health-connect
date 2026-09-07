import React, { useState } from 'react';
import type { Patient, Vitals, TriageResultLevel } from '../../types';
import { evaluateClinicalPriority } from '../../utils/aiEngine';
import { apiService } from '../../services/apiService';
import { PriorityBadge } from '../ai/PriorityBadge';
import { Stethoscope, X, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TriageWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPatient?: Patient;
}

export const TriageWizardModal: React.FC<TriageWizardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPatient,
}) => {
  const patients = apiService.getPatients();

  const [step, setStep] = useState<number>(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatient?.id || patients[0]?.id || '');
  const [vitals, setVitals] = useState<Vitals>({
    temperatureCelsius: 37.0,
    bpSystolic: 120,
    bpDiastolic: 80,
    heartRateBpm: 75,
    respRatePerMin: 18,
    oxygenSatPercent: 98,
    bloodSugarMgDl: 105,
    hemoglobinGdl: 12.0,
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overriddenLevel, setOverriddenLevel] = useState<TriageResultLevel>('HIGH');

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const commonSymptoms = [
    'Chest Pain',
    'Shortness of Breath',
    'High Fever (>38.5°C)',
    'Severe Headache',
    'Persistent Vomiting',
    'Abdominal Pain',
    'Cough & Cold',
    'Dizziness & Fatigue',
    'Severe Bleeding / Trauma',
    'Convulsions / Fits',
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const calculatedPriority: TriageResultLevel = evaluateClinicalPriority({
    symptoms: selectedSymptoms,
    vitals,
    isPregnant: currentPatient?.isPregnant,
    chronicConditions: currentPatient?.chronicConditions,
  });

  const finalPriority: TriageResultLevel = isOverridden ? overriddenLevel : calculatedPriority;

  const handleSaveTriage = () => {
    if (!currentPatient) return;

    apiService.saveTriageRecord({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      symptoms: selectedSymptoms,
      vitals,
      clinicalPriority: finalPriority,
      triageLevel: finalPriority,
      reasons: [
        `Vitals: BP ${vitals.bpSystolic}/${vitals.bpDiastolic}, SpO2 ${vitals.oxygenSatPercent}%, Temp ${vitals.temperatureCelsius}°C`,
        `Symptoms recorded: ${selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'None specified'}`,
        currentPatient.isPregnant ? 'Maternal care priority factor active' : '',
      ].filter(Boolean),
      recommendedAction: finalPriority === 'URGENT' 
        ? 'Immediate Doctor Examination & Emergency Transport Reservation'
        : finalPriority === 'HIGH'
        ? 'Priority Same-day OPD Consultation'
        : 'Routine OPD Consultation & Medication Review',
      overriddenByClinician: isOverridden,
      overrideReason: isOverridden ? overrideReason : undefined,
      healthWorkerId: 'usr-worker-1',
      healthWorkerName: 'Savita Kamble (ASHA)',
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gov-green-700 text-white p-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-emerald-300" />
            <div>
              <h2 className="font-bold text-base">Digital Clinical Triage Support</h2>
              <p className="text-xs text-emerald-100">Step {step} of 4 — SIH Decision Support Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gov-green-800 text-emerald-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: Select Patient */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 1: Select Rural Patient</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient from Directory</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-gov-green-600 outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.gender}, Age {p.age}) — Village: {p.village}
                    </option>
                  ))}
                </select>
              </div>

              {currentPatient && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 text-sm">{currentPatient.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>Village: <span className="font-semibold text-slate-800">{currentPatient.village}</span></div>
                    <div>Phone: <span className="font-semibold text-slate-800">{currentPatient.phone}</span></div>
                    <div>Maternal Status: <span className="font-semibold text-slate-800">{currentPatient.isPregnant ? `Pregnant (Trimester ${currentPatient.pregnancyTrimester || 2})` : 'N/A'}</span></div>
                    <div>Chronic Conditions: <span className="font-semibold text-slate-800">{currentPatient.chronicConditions.join(', ') || 'None'}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Vitals */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 2: Enter Patient Vitals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={vitals.bpSystolic || ''}
                    onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={vitals.bpDiastolic || ''}
                    onChange={(e) => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">SpO2 Oxygen Sat (%)</label>
                  <input
                    type="number"
                    value={vitals.oxygenSatPercent || ''}
                    onChange={(e) => setVitals({ ...vitals, oxygenSatPercent: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperatureCelsius || ''}
                    onChange={(e) => setVitals({ ...vitals, temperatureCelsius: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.heartRateBpm || ''}
                    onChange={(e) => setVitals({ ...vitals, heartRateBpm: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hemoglobin (g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.hemoglobinGdl || ''}
                    onChange={(e) => setVitals({ ...vitals, hemoglobinGdl: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Symptoms */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 3: Reported Symptoms & Clinical Observations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {commonSymptoms.map(sym => (
                  <label
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-medium transition-all ${
                      selectedSymptoms.includes(sym)
                        ? 'bg-gov-green-50 border-gov-green-600 text-gov-green-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(sym)}
                      onChange={() => {}}
                      className="rounded text-gov-green-600 focus:ring-gov-green-500 w-4 h-4"
                    />
                    <span>{sym}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: AI Priority Result & Clinician Override */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Mandatory AI Decision Support Notice */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Important Clinical Notice:</span> This system provides clinical decision support only and does NOT constitute an autonomous medical diagnosis. Clinician judgement overrides automated scoring.
                </div>
              </div>

              {/* Calculated Priority Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <span className="text-xs text-slate-500 font-semibold uppercase">Evaluated Clinical Priority Score</span>
                <div>
                  <PriorityBadge priority={finalPriority} size="lg" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {finalPriority === 'URGENT' ? 'Urgent escalation recommended due to vital sign indicators or severe symptoms.' : 'Standard clinical priority workflow.'}
                </p>
              </div>

              {/* Clinician Override Option */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOverridden}
                    onChange={(e) => setIsOverridden(e.target.checked)}
                    className="w-4 h-4 rounded text-gov-green-600"
                  />
                  <span>Clinician / Health Worker Priority Override</span>
                </label>

                {isOverridden && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Override Priority Level</label>
                      <select
                        value={overriddenLevel}
                        onChange={(e) => setOverriddenLevel(e.target.value as TriageResultLevel)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="ROUTINE">ROUTINE</option>
                        <option value="MODERATE">MODERATE</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Reason for Clinician Override</label>
                      <textarea
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="State clinical rationale for overriding decision support score..."
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-gov-green-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-gov-green-800 shadow-sm"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveTriage}
              className="px-6 py-2.5 bg-gov-green-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gov-green-800 shadow-md transition-transform active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> Finalize & Save Triage Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
