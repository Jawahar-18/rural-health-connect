import React, { useState } from 'react';
import type { Patient } from '../../types';
import { predictFollowupRisk } from '../../utils/aiEngine';
import { useTranslation } from '../../context/MultilingualContext';
import { ChevronDown, ChevronUp, BrainCircuit, Sparkles, CheckCircle2 } from 'lucide-react';

interface RiskScoreCardProps {
  patient: Patient;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ patient }) => {
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const riskResult = predictFollowupRisk(patient);

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-rose-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getBadgeStyle = (level: string) => {
    if (level === 'HIGH') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (level === 'MEDIUM') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  const getTranslatedFactor = (exp: string) => {
    if (exp.toLowerCase().includes('far from phc') || exp.toLowerCase().includes('>15 km') || exp.toLowerCase().includes('>20 km')) {
      return t('riskFactorDistance');
    }
    if (exp.toLowerCase().includes('missed appointment')) {
      return t('riskFactorMissed');
    }
    if (exp.toLowerCase().includes('maternal') || exp.toLowerCase().includes('pregnant')) {
      return t('riskFactorMaternal');
    }
    if (exp.toLowerCase().includes('chronic')) {
      return t('riskFactorChronic');
    }
    return exp;
  };

  const getTranslatedAction = (act: string) => {
    if (act.toLowerCase().includes('asha') || act.toLowerCase().includes('home visit')) {
      return t('actionAshaHomeVisit');
    }
    if (act.toLowerCase().includes('sms') || act.toLowerCase().includes('reminder')) {
      return t('actionSmsReminder');
    }
    if (act.toLowerCase().includes('tele') || act.toLowerCase().includes('mo')) {
      return t('actionTeleConsult');
    }
    return act;
  };

  return (
    <div className="bg-white rounded-gov border border-slate-200 p-4 sm:p-5 shadow-soft transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('aiRiskPrediction')}</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t('predictiveSupport')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{t('triageNotice')}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Score Bar */}
      <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-center shrink-0">
            <div className="text-2xl font-black text-slate-900 leading-none">{riskResult.riskScore}<span className="text-xs font-semibold text-slate-400">/100</span></div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{t('riskScore')}</div>
          </div>
          <div className="flex-1 sm:w-48">
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span className="text-slate-600">{t('likelihoodMissed')}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getBadgeStyle(riskResult.riskLevel)} font-bold`}>
                {riskResult.riskLevel}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(riskResult.riskScore)}`}
                style={{ width: `${riskResult.riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Factors & Recommendations */}
      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 text-xs">
          {/* Key Risk Factors */}
          <div>
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1.5">
              {t('contributingFactors')}
            </span>
            <ul className="space-y-1">
              {riskResult.explanations.map((exp, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{getTranslatedFactor(exp)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
            <span className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('recommendedProtocol')}
            </span>
            <ul className="space-y-1">
              {riskResult.recommendedActions.map((act, idx) => (
                <li key={idx} className="text-emerald-950 font-medium flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{getTranslatedAction(act)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

