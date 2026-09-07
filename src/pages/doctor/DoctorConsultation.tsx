import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { PriorityBadge } from '../../components/ai/PriorityBadge';
import { RiskScoreCard } from '../../components/ai/RiskScoreCard';
import type { PrescriptionItem } from '../../types';
import { 
  Stethoscope, 
  Pill, 
  ArrowRightLeft, 
  Printer, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Activity, 
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorConsultation: React.FC = () => {
  const { patientId = 'pat-105' } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const patient = apiService.getPatientById(patientId) || apiService.getPatients()[0];
  const triageRecords = apiService.getTriageRecords(patient.id);
  const latestTriage = triageRecords[0];

  const [clinicalNotes, setClinicalNotes] = useState('Patient presented with mild exertional chest pressure and fatigue. Vitals reviewed.');
  const [diagnosis, setDiagnosis] = useState('Ischemic Heart Disease Evaluation / Hypertension Follow-up');
  const [followUpDate, setFollowUpDate] = useState('2026-09-20');

  // Prescription items state
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([
    { medicineName: 'Tab. Amlodipine 5mg', dosage: '5 mg', frequency: '1-0-0 (Morning)', durationDays: 30, inStock: true },
    { medicineName: 'Tab. Aspirin 75mg', dosage: '75 mg', frequency: '0-0-1 (Night after dinner)', durationDays: 30, inStock: true },
  ]);

  // New Rx form input
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('500 mg');
  const [newFreq] = useState('1-0-1 (After meals)');
  const [newDays, setNewDays] = useState(10);

  // Outbound Referral form
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [refDestination, setRefDestination] = useState('B.J. Medical College & Sassoon General Hospital, Pune');
  const [refDepartment, setRefDepartment] = useState('Cardiology (2D Echo & Angiography)');
  const [refReason, setRefReason] = useState('Angina on exertion with ST segment flattening. Requires urgent coronary angiogram.');

  const handleAddRxItem = () => {
    if (!newMedName.trim()) return;
    setRxItems([
      ...rxItems,
      { medicineName: newMedName, dosage: newDosage, frequency: newFreq, durationDays: Number(newDays), inStock: true }
    ]);
    setNewMedName('');
  };

  const handleRemoveRxItem = (idx: number) => {
    setRxItems(rxItems.filter((_, i) => i !== idx));
  };

  const handleCompleteConsultation = () => {
    apiService.createPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      facilityName: currentUser.facilityName || 'PHC Junnar',
      diagnosis,
      clinicalNotes,
      items: rxItems,
      followUpDate,
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });

    alert(`Consultation completed for ${patient.name}. Digital prescription saved and token marked completed!`);
    navigate('/doctor/dashboard');
  };

  const handleCreateReferral = () => {
    apiService.createReferral({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      originFacility: currentUser.facilityName || 'PHC Junnar',
      destinationFacility: refDestination,
      department: refDepartment,
      reason: refReason,
      priority: 'URGENT',
      referringDoctorId: currentUser.id,
      referringDoctorName: currentUser.name,
    });

    alert(`Outbound Referral to ${refDestination} created successfully!`);
    setShowReferralModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Patient Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gov-green-700 text-white flex items-center justify-center font-bold text-lg">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{patient.name}</h1>
              <span className="text-xs text-slate-500 font-medium">({patient.gender}, Age {patient.age})</span>
              {patient.isPregnant && (
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Pregnant (T{patient.pregnancyTrimester || 2})
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Village: <strong className="text-slate-800">{patient.village}</strong> • Phone: {patient.phone} • Distance: {patient.distanceKm} km
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={patient.clinicalPriority} size="md" />
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 no-print"
          >
            <Printer className="w-4 h-4" /> Print Record
          </button>
        </div>
      </div>

      {/* Grid: Left Longitudinal Records & Vitals, Right Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vitals & Medical History */}
        <div className="space-y-6 lg:col-span-1">
          {/* AI Risk Score Component */}
          <RiskScoreCard patient={patient} />

          {/* Vitals Summary */}
          <div className="bg-white rounded-gov p-5 border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-gov-green-700" /> Recent Digital Triage Vitals
            </h3>

            {latestTriage ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">BP</span>
                  <span className="font-bold text-slate-900">{latestTriage.vitals.bpSystolic}/{latestTriage.vitals.bpDiastolic} mmHg</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                  <span className="font-bold text-slate-900">{latestTriage.vitals.oxygenSatPercent}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Pulse</span>
                  <span className="font-bold text-slate-900">{latestTriage.vitals.heartRateBpm} bpm</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Temp</span>
                  <span className="font-bold text-slate-900">{latestTriage.vitals.temperatureCelsius}°C</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-2">Baseline vitals recorded by ASHA worker.</div>
            )}
          </div>

          {/* Known Chronic Conditions */}
          <div className="bg-white rounded-gov p-5 border border-slate-200 shadow-soft space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Chronic Conditions History</h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.chronicConditions.length > 0 ? (
                patient.chronicConditions.map((c) => (
                  <span key={c} className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No chronic conditions listed.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Doctor's Clinical Assessment & Digital Prescription */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-gov-green-700" />
                <h2 className="font-bold text-slate-900 text-sm">Clinical Consultation & E-Prescription</h2>
              </div>
              <button
                onClick={() => setShowReferralModal(true)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Refer to District Hospital
              </button>
            </div>

            {/* Assessment & Diagnosis Inputs */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Clinical Notes & Findings</label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-gov-green-600 outline-none"
                />
              </div>
            </div>

            {/* Digital Prescription Builder */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-gov-green-700" /> E-Prescription Medication List
                </h3>
              </div>

              {/* Rx Items Table */}
              <div className="space-y-2 text-xs">
                {rxItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{item.medicineName}</span>
                      <span className="text-slate-500 ml-2">— Dosage: {item.dosage}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Frequency: <strong>{item.frequency}</strong> for {item.durationDays} days
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveRxItem(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Drug Row */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3 text-xs">
                <span className="font-bold text-emerald-900 block">Add Drug to Prescription:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Tab. Paracetamol 500mg)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="sm:col-span-2 border border-slate-300 rounded-lg p-2 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="border border-slate-300 rounded-lg p-2 font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Days"
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRxItem}
                  className="px-4 py-1.5 bg-gov-green-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-gov-green-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Drug
                </button>
              </div>
            </div>

            {/* Follow up date & Save button */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-800">Required Follow-up Date:</span>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-900"
                />
              </div>

              <button
                onClick={handleCompleteConsultation}
                className="px-6 py-3 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <CheckCircle className="w-4 h-4" /> Complete Consultation & Issue Prescription
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Outbound Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-purple-700" /> Outbound Higher-Center Referral Wizard
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Destination Tertiary Hospital</label>
                <input
                  type="text"
                  value={refDestination}
                  onChange={(e) => setRefDestination(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Specialty Department</label>
                <input
                  type="text"
                  value={refDepartment}
                  onChange={(e) => setRefDepartment(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Clinical Reason for Referral</label>
                <textarea
                  value={refReason}
                  onChange={(e) => setRefReason(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowReferralModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReferral}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-sm"
              >
                Submit Outbound Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
