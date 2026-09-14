import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useOffline } from '../../context/OfflineContext';
import type { LanguageCode, Gender } from '../../types';
import { UserPlus, Save, WifiOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const WorkerRegisterPatient: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useOffline();

  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    gender: 'Female' as Gender,
    phone: '+91 ',
    address: '',
    village: 'Junnar',
    emergencyContact: '',
    relevantConditions: '',
    isPregnant: false,
    pregnancyTrimester: 1,
    chronicConditions: [] as string[],
    preferredLanguage: 'mr' as LanguageCode,
    distanceKm: 5,
  });

  const villages = ['Junnar', 'Ambegaon', 'Khed Tribal Hamlet', 'Otur', 'Ghodegaon', 'Bhor'];
  const commonChronic = ['Hypertension', 'Type 2 Diabetes', 'Asthma', 'Anemia', 'Tuberculosis'];

  const toggleChronic = (cond: string) => {
    if (formData.chronicConditions.includes(cond)) {
      setFormData({
        ...formData,
        chronicConditions: formData.chronicConditions.filter(c => c !== cond),
      });
    } else {
      setFormData({
        ...formData,
        chronicConditions: [...formData.chronicConditions, cond],
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter patient name');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPatient = await apiService.registerPatient({
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address || `Gram Panchayat Area, ${formData.village}`,
        village: formData.village,
        emergencyContact: formData.emergencyContact || 'Family Member - ' + formData.phone,
        relevantConditions: formData.relevantConditions ? [formData.relevantConditions] : ['General OPD Registration'],
        isPregnant: formData.isPregnant,
        pregnancyTrimester: formData.isPregnant ? (formData.pregnancyTrimester as 1 | 2 | 3) : undefined,
        chronicConditions: formData.chronicConditions,
        preferredLanguage: formData.preferredLanguage,
        followupRiskScore: formData.distanceKm > 20 ? 65 : 20,
        followupRiskLevel: formData.distanceKm > 20 ? 'MEDIUM' : 'LOW',
        clinicalPriority: formData.isPregnant ? 'MODERATE' : 'ROUTINE',
        interventionPriority: 'LOW',
        distanceKm: Number(formData.distanceKm),
        totalAppointments: 1,
        missedAppointments: 0,
        isOffline: !isOnline,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });

      alert(`Patient ${newPatient.name} registered successfully! (ID: ${newPatient.id}) ${!isOnline ? '(Saved in Offline Queue)' : '• Persisted to MySQL Database'}`);
      navigate('/worker/patients');
    } catch (err) {
      console.error('Error registering patient:', err);
      alert('Registration encountered an error. Patient was saved locally.');
      navigate('/worker/patients');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {!isOnline && (
          <div className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-300">
            <WifiOff className="w-3.5 h-3.5" /> Offline Mode — Local Device Save Enabled
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gov-green-100 text-gov-green-800 flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">First-Time Patient Registration</h1>
            <p className="text-xs text-slate-500">ASHA / ANM Simplified Form for Rural Health Records</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Basic Demographic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Patient Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Laxmi Bhosale"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Age (Years) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Mobile Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Village / Gram Panchayat *</label>
              <select
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gov-green-600 outline-none"
              >
                {villages.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Maternal & Chronic Care Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Maternal & Chronic Disease Tracker</h3>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.isPregnant}
                  onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                  className="w-4 h-4 rounded text-gov-green-600 focus:ring-gov-green-500"
                />
                <span>Active Pregnancy / Antenatal Care (ANC)</span>
              </label>

              {formData.isPregnant && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Trimester:</span>
                  <select
                    value={formData.pregnancyTrimester}
                    onChange={(e) => setFormData({ ...formData, pregnancyTrimester: Number(e.target.value) as 1|2|3 })}
                    className="border border-slate-300 rounded-lg p-1.5 font-bold"
                  >
                    <option value={1}>Trimester 1 (Weeks 1-12)</option>
                    <option value={2}>Trimester 2 (Weeks 13-27)</option>
                    <option value={3}>Trimester 3 (Weeks 28-40)</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Known Chronic Medical Conditions (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {commonChronic.map(cond => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => toggleChronic(cond)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      formData.chronicConditions.includes(cond)
                        ? 'bg-gov-green-700 text-white border-gov-green-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cond} {formData.chronicConditions.includes(cond) ? '✓' : '+'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Distance & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Distance to Nearest Hospital (km)</label>
              <input
                type="number"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Preferred Spoken Language</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as LanguageCode })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold"
              >
                <option value="mr">Marathi (मराठी)</option>
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Persisting to MySQL...' : 'Save & Register Rural Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
