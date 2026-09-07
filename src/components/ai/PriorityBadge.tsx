import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'ROUTINE' | 'MODERATE' | 'HIGH' | 'URGENT' | 'CRITICAL' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  size = 'md', 
  showIcon = true 
}) => {
  const p = (priority || 'ROUTINE').toUpperCase();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-[10px] px-2 py-0.5 gap-1';
      case 'lg': return 'text-xs px-3.5 py-1.5 gap-1.5 font-bold';
      default: return 'text-[11px] px-2.5 py-1 gap-1 font-semibold';
    }
  };

  const getStyle = () => {
    switch (p) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 ring-rose-500/20',
          icon: Flame,
          label: 'CRITICAL INTERVENTION',
        };
      case 'URGENT':
        return {
          bg: 'bg-red-100 text-red-700 border-red-300 ring-red-500/20',
          icon: AlertCircle,
          label: 'URGENT ATTENTION',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500/20',
          icon: AlertTriangle,
          label: 'HIGH PRIORITY',
        };
      case 'MODERATE':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-500/20',
          icon: Info,
          label: 'MODERATE',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500/20',
          icon: CheckCircle,
          label: 'ROUTINE',
        };
    }
  };

  const config = getStyle();
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs font-medium tracking-tight ${config.bg} ${getSizeClasses()}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
