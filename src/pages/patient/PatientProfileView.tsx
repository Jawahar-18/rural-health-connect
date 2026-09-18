import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  QrCode, 
  CheckCircle2, 
  Download, 
  Lock,
  Save
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  const patients = apiService.getPatients();
  const patient = patients.find(p => p.phone === currentUser.phone) || patients[0];

  const [emergencyContact, setEmergencyContact] = useState(patient.emergencyContact || 'Suresh Patil (Husband) - 98220 11224');
  const [phone, setPhone] = useState(patient.phone || '+91 98220 11223');
  const [address, setAddress] = useState(patient.address || 'House 42, Near Gram Panchayat, Junnar');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    apiService.updatePatient(patient.id, {
      emergencyContact,
      phone,
      address,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-300" />
            ABDM DIGITAL HEALTH ID CARD
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Patient Profile & Ayushman Bharat Card
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Verified Citizen Health Record for <strong className="text-white">{patient.name}</strong>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="relative z-10 px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-gov-green-700" /> Print Health Card
        </button>
      </div>

      {/* ABDM Digital Health ID Card (Official Government Style) */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-teal-700 via-emerald-800 to-cyan-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Header */}
          <div className="flex items-center justify-between border-b-2 border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-emerald-300">
                MH
              </div>
              <div>
                <div className="text-[11px] font-black uppercase text-emerald-300 tracking-wider">
                  Government of Maharashtra • Public Health Dept
                </div>
                <div className="text-sm font-black tracking-tight text-white">
                  Ayushman Bharat Digital Health Card (ABHA)
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-md">
                NATIONAL HEALTH MISSION
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-28 rounded-2xl bg-emerald-800/40 border-2 border-emerald-400/30 flex flex-col items-center justify-center text-emerald-200 shadow-inner shrink-0">
                <User className="w-12 h-12 text-emerald-300/80" />
                <span className="text-[9px] font-black mt-1 text-emerald-300">PHOTO ID</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-xl font-black text-white">{patient.name}</div>
                <div className="text-emerald-200 font-mono font-black text-sm">
                  ABHA: 91-4589-2045-8812
                </div>
                <div className="text-slate-300">
                  ABHA Address: <strong className="text-white">{patient.name.toLowerCase().replace(/\s+/g, '')}@abdm</strong>
                </div>
                <div className="text-slate-300 pt-1">
                  Age: <strong className="text-white">{patient.age} yrs</strong> • Gender: <strong className="text-white">{patient.gender}</strong> • Blood Group: <strong className="text-white">B+</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-md shrink-0">
              <QrCode className="w-20 h-20 text-slate-900" />
              <div className="text-[9px] font-black text-center text-slate-700 mt-1">SCAN TO VERIFY</div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t-2 border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <div>
              Primary PHC: <strong className="text-white">PHC Junnar, Pune District</strong>
            </div>
            <div>
              Registered: <strong className="text-white">{patient.registeredDate}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Update Contact & Demographics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-5">
        <div className="border-b-2 border-slate-100 pb-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gov-green-700" />
            Personal & Emergency Contact Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Keep your registered mobile number and emergency contacts up to date</p>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Contact information updated and synchronized successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (as per Aadhaar)</label>
              <input
                type="text"
                value={patient.name}
                disabled
                className="w-full p-3 bg-slate-100 border-2 border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registered Village Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" /> Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
