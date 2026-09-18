import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { 
  Package, 
  Search, 
  Building2, 
  Pill
} from 'lucide-react';

export const PatientMedicinesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const stock = apiService.getMedicineStock();

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg border border-teal-400/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-inner">
            <Package className="w-3.5 h-3.5 text-emerald-300" />
            FREE ESSENTIAL DRUG DISPENSARY
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Local PHC Medicine Availability Finder
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Live dispensary stock at <strong className="text-white">PHC Junnar Dispensary</strong> • Provided free under National Health Mission
          </p>
        </div>

        <div className="relative z-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search medicine or illness..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg border-2 border-white/80 focus:border-emerald-400 outline-none"
          />
        </div>
      </div>

      {/* Dispensary Notice */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Dispensary Counter #2 Timings: <strong>09:00 AM – 04:30 PM (Mon–Sat)</strong>. Valid OPD prescription or token required.</span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
          {stock.filter(s => s.status === 'AVAILABLE').length} of {stock.length} Medicines in Stock
        </span>
      </div>

      {/* Medicine Stock Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[11px] border-b-2 border-slate-200">
              <tr>
                <th className="p-3.5">Medicine Name</th>
                <th className="p-3.5">Therapeutic Category</th>
                <th className="p-3.5">Stock Availability Status</th>
                <th className="p-3.5">Expiry Batch</th>
                <th className="p-3.5">Cost to Patient</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-800 bg-white">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 max-w-sm">
                    <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Pill className="w-4 h-4 text-gov-green-700 shrink-0" />
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-slate-600 font-medium mt-1">
                        <strong className="text-slate-800 font-semibold">What it is:</strong> {item.description}
                      </div>
                    )}
                    {item.purpose && (
                      <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        <strong className="text-emerald-950 font-semibold">Why used:</strong> {item.purpose}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 font-semibold">
                    {item.category}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border inline-block ${
                      item.status === 'AVAILABLE' 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                        : item.status === 'LOW_STOCK'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {item.status === 'AVAILABLE' ? 'In Stock (Available)' : item.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    Valid through {item.expiryDate || '2027'}
                  </td>
                  <td className="p-3.5">
                    <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹0 (Free Govt Supply)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
